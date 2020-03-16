import { XYCoord } from "dnd-core";
import React, { useRef, useState } from "react";
import { DragObjectWithType, DropTargetMonitor, useDrag, useDrop } from "react-dnd";
import { Badge, Button, Input, ListGroupItemText, UncontrolledPopover } from "reactstrap";
import ConfirmationWrapper from "./ConfirmationWrapper";

/**
 * Draggable List Item Component
 * @param listItem
 * @param index
 * @param accept
 * @param updateItem
 * @param removeItem
 * @param showBadges
 * @param canEdit
 * @constructor
 */
export const DraggableListItem: React.FC<DraggableListItemProps> = ({ listItem, index, accept, updateItem, removeItem, showBadges, canEdit }: DraggableListItemProps) => {
	const [ isEditing, setIsEditing ] = useState<boolean>(listItem.isEditing || false);
	const [ text, setText ] = useState<string>(listItem.text);
	
	const ref = useRef<HTMLLIElement>(null);
	const [ , drop ] = useDrop({
		accept,
		hover(item: DragItem, monitor: DropTargetMonitor) {
			if (!ref.current) return;
			const dragIndex = item.index;
			const hoverIndex = index;
			
			// Don't replace items with themselves
			if (dragIndex === hoverIndex) return;
			
			// Determine rectangle on screen
			const hoverBoundingRect = ref.current!.getBoundingClientRect();
			
			// Get vertical middle
			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
			
			// Determine mouse position
			const clientOffset = monitor.getClientOffset();
			
			// Get pixels to the top
			const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
			
			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%
			
			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
			
			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
			
			// Time to actually perform the action
			// moveCard(dragIndex, hoverIndex);
			updateItem(dragIndex, hoverIndex, text);
			
			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			item.index = hoverIndex;
		},
	});
	const [ { isDragging }, drag ] = useDrag({
		item: { type: accept, id: listItem.order, index },
		collect: (monitor: any) => ({
			isDragging: monitor.isDragging(),
		}),
	});
	
	const listGroupItemStyle = {
		opacity: isDragging ? 0.25 : 1,
		cursor: isDragging ? "grab" : "auto",
	};
	const badgeOpacity = (index + 1) === listItem.order ? 0 : 1;
	drag(drop(ref));
	
	return (
		<li className="list-group-item" style={ listGroupItemStyle } ref={ canEdit ? ref : null }>
			<div className="d-flex align-items-center">
				{
					canEdit ? (
						<>
							<div className="d-flex align-items-baseline flex-grow-1"
							     onDoubleClick={ () => { setIsEditing(true); } }
							     onBlur={
								     () => {
									     updateItem(index, index, text);
									     setIsEditing(false);
								     }
							     }>
								<Badge className="mr-3" color="primary">{ index + 1 }</Badge>
								{
									showBadges ? (
										<Badge style={{ opacity: badgeOpacity }} color="warning" className="mr-3">{ listItem.order }</Badge>
									) : null
								}
								{
									isEditing ? (
										<Input type="text"
										       className="flex-grow-1"
										       defaultValue={ listItem.text }
										       autoFocus={ listItem.isEditing }
										       onFocus={ (e) => e.target.select() }
										       onKeyPress={
											       (event) => {
												       if (event.which === 13) {
													       updateItem(index, index, text);
													       setIsEditing(false);
												       }
											       }
										       }
										       onChange={
											       (e) => {
												       setText(e.target.value);
											       }
										       } />
									) : (
										<ListGroupItemText className="m-0 flex-grow-1">{ listItem.text }</ListGroupItemText>
									)
								}
							</div>
							<ConfirmationWrapper
								onPositive={
									async (setDialogOpen, setIsWorking) => {
										setIsWorking(true);
										await removeItem(listItem.order);
										setIsWorking(false);
										setDialogOpen(false);
									}
								}
								orderSwap={ true }
								positiveText="Odstranit"
								dialogTitle="Odstranění položky"
								dialogContent="Opravdu si přejete tuto položku odstranit?"
								type="danger">
								<Button className="button-icon circular ml-3"
								        color="danger">
									<i className="icon-trash" />
								</Button>
							</ConfirmationWrapper>
						</>
					) : (
						<div className="d-flex align-items-baseline flex-grow-1">
							<Badge className="mr-3" color="primary">{ index + 1 }</Badge>
							<ListGroupItemText className="m-0 flex-grow-1">{ listItem.text }</ListGroupItemText>
						</div>
					)
				}
			</div>
		</li>
	);
};

interface ListItem {
	id: number;
	text: string;
	order: number
	refId: number;
	isEditing?: boolean;
}

interface DragItem extends DragObjectWithType {
	index: number;
	id: string;
}

export interface DraggableListItemProps {
	listItem: ListItem;
	index: number;
	accept: string;
	updateItem: (dragIndex: number, hoverIndex: number, text: string) => void;
	removeItem: (id: number) => void;
	showBadges: boolean;
	canEdit?: boolean;
}

export default DraggableListItem;
