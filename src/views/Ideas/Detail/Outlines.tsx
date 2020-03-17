import classNames from "classnames";
import update from "immutability-helper";
import { isEqual, sortBy } from "lodash";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardBody, CardFooter, CardHeader, ListGroup, UncontrolledTooltip, } from "reactstrap";
import DraggableListItem from "../../../components/common/DraggableListItem";
import { SubmitButton } from "../../../components/common/SubmitButton";
import { IIdea, IIdeaOutline } from "../../../models/idea";
import { DataJsonResponse, NoContentResponse } from "../../../models/response";
import { useAppContext } from "../../../providers";
import { Axios } from "../../../utils";
import { handleRes, responseError } from "../../../utils/axios";
import { isOwnerOrAdmin } from "../../../utils/roles";

/**
 * Goal Outlines Component
 * @param idea
 * @param loading
 * @constructor
 */
export const IdeaOutlines: React.FC<IIdeaOutlineProps> = ({ idea, loading }: IIdeaOutlineProps) => {
	const [ { accessToken, profile } ] = useAppContext();
	const [ isLoading, setIsLoading ] = loading;
	const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
	const [ outlines, setOutlines ] = useState<IIdeaOutlineList[]>([]);
	const [ showBadges, setShowBadges ] = useState<boolean>(false);
	const [ isChanged, setIsChanged ] = useState<boolean>(false);
	
	// outline fetcher
	const fetchOutlines = async (orderToEdit?: number) => {
		try {
			setIsLoading(true);
			const [ res ] = handleRes<DataJsonResponse<IIdeaOutline[]>>(await Axios(accessToken).get(`/ideas/${ idea?.id }/outlines`));
			setOutlines(orderToEdit
				? res.data.map((outline) => ({ ...outline, isEditing: outline.order === orderToEdit }))
				: res.data
			);
		} catch (error) {
			toast.error(responseError(error).message);
		} finally {
			setIsLoading(false);
		}
	};
	
	// fetch outlines
	useEffect(() => {
		if (idea)
			(async () => fetchOutlines())();
	}, [ accessToken, idea ]);
	
	// detect any changes
	useEffect(() => {
		setIsChanged(!isEqual(outlines, sortBy([ ...outlines ], "order")));
	}, [ outlines ]);
	
	// show badges with old index on reorder
	useEffect(() => {
		setShowBadges(isChanged);
	}, [ outlines, isChanged ]);
	
	// whether the user can edit it
	const canEdit: boolean = isOwnerOrAdmin(profile, idea?.userId);
	
	// add outline hook
	const addOutline = useCallback(() => {
		(async () => {
			try {
				setIsLoading(true);
				const [ res ] = handleRes<DataJsonResponse<IIdeaOutline>>(
					await Axios(accessToken).post(`/ideas/${ idea?.id }/outlines`, {
						Text: `Bod osnovy ${ Math.max(...outlines.map((outline) => outline.order), 0) }`,
					})
				);
				await fetchOutlines(res.data.order);
				toast.success("Bod osnovy byl úspěšně vytvořen.");
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ outlines ]);
	
	// move outline hook
	const moveOutline = useCallback((dragIndex: number, hoverIndex: number, text: string) => {
		const dragItem = outlines[dragIndex];
		
		// text change
		if (dragIndex === hoverIndex && dragItem.text !== text) {
			dragItem.text = text;
			(async () => {
				try {
					setIsLoading(true);
					handleRes<DataJsonResponse<NoContentResponse>>(
						await Axios(accessToken).put(`/ideas/${ idea?.id }/outlines/${ dragItem.order }`, {
							Text: text,
						})
					);
					await fetchOutlines();
					toast.success("Text bodu osnovy byl úspěšně uložen.");
				} catch (error) {
					toast.error(responseError(error).message);
				} finally {
					setIsLoading(false);
				}
			})();
		}
		
		// update local list
		setOutlines(update(outlines, {
			$splice: [
				[ dragIndex, 1 ],
				[ hoverIndex, 0, dragItem ],
			],
		}));
	}, [ outlines ]);
	
	// remove outline hook
	const removeOutline = useCallback((id: number) => {
		(async () => {
			try {
				setIsLoading(true);
				handleRes<DataJsonResponse<IIdeaOutline>>(await Axios(accessToken).delete(`/ideas/${ idea?.id }/outlines/${ id }`));
				await fetchOutlines();
				toast.success("Bod osnovy byl úspěšně odstraněn.");
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ outlines ]);
	
	// submit reordering changes
	const submitChanges = async () => {
		try {
			setIsSubmitting(true);
			const reordered = sortBy(
				[ ...outlines ].map((item, index) => ({ ...item, order: index + 1 })), "order")
				.map((item) => ({ Text: item.text }));
			handleRes<DataJsonResponse<NoContentResponse>>(await Axios(accessToken).put(`/ideas/${ idea?.id }/outlines`, reordered));
			setIsSubmitting(false);
			toast.success("Body osnovy námětu byly úspěšně uloženy.");
			await fetchOutlines();
		} catch (error) {
			toast.error(responseError(error).message);
			setIsSubmitting(false);
		}
	};
	
	return (
		<Card>
			<CardHeader className="d-flex justify-content-between">
				<span>Osnova námětu</span>
				{
					canEdit ? (
						<>
							<button id="add-outline" className="reset-button" onClick={ addOutline }>
								<i className="icon-plus font-xl" />
							</button>
							<UncontrolledTooltip placement="left" target="add-outline">Přidat nový bod osnovy</UncontrolledTooltip>
						</>
					) : null
				}
			</CardHeader>
			<CardBody className={ classNames({ "d-flex flex-column": true, "justify-content-center": !outlines.length }) }>
				{
					outlines.length ? (
						<>
							<p className="text-muted">Osnova shrnuje veškeré kroky, které student musíc učinit, aby dosáhl cílů námětu: co musí nastudovat, vyrobit, promyslet.</p>
							<ListGroup>
								{
									outlines.map((outline, index) => (
										<DraggableListItem
											listItem={ { ...outline, refId: outline.ideaId } }
											index={ index }
											accept="outline"
											showBadges={ showBadges }
											key={ index }
											canEdit={ canEdit && !isSubmitting }
											updateItem={ moveOutline }
											removeItem={ removeOutline }
										/>
									))
								}
							</ListGroup>
						</>
					) : (
						<p className="text-muted text-center my-5">Nový bod osnovy námětu přidáte kliknutím na tlačítko <i className="icon-plus" /> v pravém horním rohu této karty.</p>
					)
				}
			</CardBody>
			{
				isChanged ? (
					<CardFooter>
						<SubmitButton submitting={ isSubmitting } type="primary" onClick={ submitChanges } />
					</CardFooter>
				) : null
			}
		</Card>
	);
};

interface IIdeaOutlineList extends IIdeaOutline {
	isEditing?: boolean;
}

export interface IIdeaOutlineProps {
	idea?: IIdea;
	loading: [ boolean, Dispatch<SetStateAction<boolean>> ];
}

export default IdeaOutlines;
