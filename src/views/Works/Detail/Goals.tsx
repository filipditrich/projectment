import classNames from "classnames";
import update from "immutability-helper";
import { isEqual, sortBy } from "lodash";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, CardBody, CardFooter, CardHeader, ListGroup, UncontrolledTooltip, } from "reactstrap";
import DraggableListItem from "../../../components/common/DraggableListItem";
import { DataJsonResponse, NoContentResponse } from "../../../models/response";
import { IWork, IWorkGoal, IWorkState } from "../../../models/work";
import { useAppContext } from "../../../providers";
import { Axios } from "../../../utils";
import { handleRes, responseError } from "../../../utils/axios";

/**
 * Work Goals Component
 * @param work
 * @param state
 * @param isLoading
 * @param fetcher
 * @constructor
 */
export const WorkGoals: React.FC<WorkGoalsProps> = ({ work, state, loading }: WorkGoalsProps) => {
	const [ { accessToken } ] = useAppContext();
	const [ isLoading, setIsLoading ] = loading;
	const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
	const [ goals, setGoals ] = useState<IWorkGoal[]>([]);
	const [ showBadges, setShowBadges ] = useState<boolean>(false);
	const [ isChanged, setIsChanged ] = useState<boolean>(false);
	
	// goal fetcher
	const fetchGoals = async (orderToEdit?: number) => {
		try {
			setIsLoading(true);
			const [ res ] = handleRes<DataJsonResponse<IWorkGoal[]>>(await Axios(accessToken).get(`/works/${ work?.id }/goals`));
			setGoals(orderToEdit
				? res.data.map((goal) => ({ ...goal, isEditing: goal.order === orderToEdit }))
				: res.data
			);
		} catch (error) {
			toast.error(responseError(error).message);
		} finally {
			setIsLoading(false);
		}
	};
	
	// fetch goals
	useEffect(() => {
		if (work)
			(async () => fetchGoals())();
	}, [ accessToken, work ]);
	
	// detect any changes
	useEffect(() => {
		setIsChanged(!isEqual(goals, sortBy([ ...goals ], "order")));
	}, [ goals ]);
	
	// show badges with old index on reorder
	useEffect(() => {
		setShowBadges(isChanged);
	}, [ goals, isChanged ]);
	
	// whether the user can edit it
	// TODO: admin everytime?
	const canEdit: boolean = state?.code === 0;
	
	// add goal hook
	const addGoal = useCallback(() => {
		(async () => {
			try {
				setIsLoading(true);
				const [ res ] = handleRes<DataJsonResponse<IWorkGoal>>(
					await Axios(accessToken).post(`/works/${ work?.id }/goals`, {
						Text: `Cíl práce ${ Math.max(...goals.map((goal) => goal.order), 0) }`,
					})
				);
				await fetchGoals(res.data.order);
				toast.success("Cíl práce byl úspěšně vytvořen.");
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ goals ]);
	
	// move goal hook
	const moveGoal = useCallback((dragIndex: number, hoverIndex: number, text: string) => {
		const dragItem = goals[dragIndex];
		
		// text change
		if (dragIndex === hoverIndex && dragItem.text !== text) {
			dragItem.text = text;
			(async () => {
				try {
					setIsLoading(true);
					handleRes<DataJsonResponse<NoContentResponse>>(
						await Axios(accessToken).put(`/works/${ work?.id }/goals/${ dragItem.order }`, {
							Text: text,
						})
					);
					await fetchGoals();
					toast.success("Cíl práce byl úspěšně uložen.");
				} catch (error) {
					toast.error(responseError(error).message);
				} finally {
					setIsLoading(false);
				}
			})();
		}
		
		// update local list
		setGoals(update(goals, {
			$splice: [
				[ dragIndex, 1 ],
				[ hoverIndex, 0, dragItem ],
			],
		}));
	}, [ goals ]);
	
	// remove goal hook
	const removeGoal = useCallback((id: number) => {
		(async () => {
			try {
				setIsLoading(true);
				handleRes<DataJsonResponse<IWorkGoal>>(await Axios(accessToken).delete(`/works/${ work?.id }/goals/${ id }`));
				await fetchGoals();
				toast.success("Cíl práce byl úspěšně odstraněn.");
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ goals ]);
	
	// submit reordering changes
	const submitChanges = () => {
		(async () => {
			try {
				setIsSubmitting(true);
				const reordered = sortBy(
					[ ...goals ].map((item, index) => ({ ...item, order: index + 1 })), "order")
					.map((item) => ({ Text: item.text }));
				handleRes<DataJsonResponse<NoContentResponse>>(await Axios(accessToken).put(`/works/${ work?.id }/goals`, reordered));
				await fetchGoals();
				toast.success("Cíle práce byly úspěšně uloženy.");
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsSubmitting(false);
			}
		})();
	};
	
	return (
		<>
			<CardHeader className="d-flex justify-content-between">
				<span>Cíle práce</span>
				{
					canEdit ? (
						<>
							<button id="add-goal" className="reset-button" onClick={ addGoal }>
								<i className="icon-plus font-xl" />
							</button>
							<UncontrolledTooltip placement="left" target="add-goal">Přidat nový cíl</UncontrolledTooltip>
						</>
					) : null
				}
			</CardHeader>
			<CardBody className={ classNames({ "d-flex flex-column": true, "justify-content-center": !goals.length }) }>
				{
					goals.length ? (
						<>
							<p className="text-muted">Cíle popisují vše, co v práci v době jejího odevzdání bude hotovo a odevzdáno.</p>
							<ListGroup>
								{
									goals.map((goal, index) => (
										<DraggableListItem
											listItem={ { ...goal, refId: goal.workId } }
											index={ index }
											accept="goal"
											showBadges={ showBadges }
											key={ index }
											canEdit={ canEdit && !isSubmitting }
											updateItem={ moveGoal }
											removeItem={ removeGoal }
										/>
									))
								}
							</ListGroup>
						</>
					) : (
						<p className="text-muted text-center my-5">Nový cíl práce přidáte kliknutím na tlačítko <i
							className="icon-plus" /> v pravém horním rohu této karty.</p>
					)
				}
			</CardBody>
			{
				isChanged ? (
					<CardFooter className="d-flex">
						<Button className="button button-primary ml-auto"
						        disabled={ isLoading }
						        onClick={ submitChanges }>
							<span>{ isSubmitting ? "Working..." : "Potvrdit změny" }</span>
						</Button>
					</CardFooter>
				) : null
			}
		</>
	);
};

export interface WorkGoalsProps {
	work?: IWork;
	state?: IWorkState;
	loading: [ boolean, Dispatch<SetStateAction<boolean>> ];
}

export default WorkGoals;
