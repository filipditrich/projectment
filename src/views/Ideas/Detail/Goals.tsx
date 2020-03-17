import classNames from "classnames";
import update from "immutability-helper";
import { isEqual, sortBy } from "lodash";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardBody, CardFooter, CardHeader, ListGroup, UncontrolledTooltip, } from "reactstrap";
import DraggableListItem from "../../../components/common/DraggableListItem";
import { SubmitButton } from "../../../components/common/SubmitButton";
import { IIdea, IIdeaGoal } from "../../../models/idea";
import { DataJsonResponse, NoContentResponse } from "../../../models/response";
import { useAppContext } from "../../../providers";
import { Axios } from "../../../utils";
import { handleRes, responseError } from "../../../utils/axios";
import { isOwnerOrAdmin } from "../../../utils/roles";

/**
 * Idea Goals Component
 * @param idea
 * @param loading
 * @constructor
 */
export const IdeaGoals: React.FC<IdeaGoalsProps> = ({ idea, loading }: IdeaGoalsProps) => {
	const [ { accessToken, profile } ] = useAppContext();
	const [ isLoading, setIsLoading ] = loading;
	const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
	const [ goals, setGoals ] = useState<IIdeaGoalList[]>([]);
	const [ showBadges, setShowBadges ] = useState<boolean>(false);
	const [ isChanged, setIsChanged ] = useState<boolean>(false);
	
	// goal fetcher
	const fetchGoals = async (orderToEdit?: number) => {
		try {
			setIsLoading(true);
			const [ res ] = handleRes<DataJsonResponse<IIdeaGoal[]>>(await Axios(accessToken).get(`/ideas/${ idea?.id }/goals`));
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
		if (idea)
			(async () => fetchGoals())();
	}, [ accessToken, idea ]);
	
	// detect any changes
	useEffect(() => {
		setIsChanged(!isEqual(goals, sortBy([ ...goals ], "order")));
	}, [ goals ]);
	
	// show badges with old index on reorder
	useEffect(() => {
		setShowBadges(isChanged);
	}, [ goals, isChanged ]);
	
	// whether the user can edit it
	const canEdit: boolean = isOwnerOrAdmin(profile, idea?.userId);
	
	// add goal hook
	const addGoal = useCallback(() => {
		(async () => {
			try {
				setIsLoading(true);
				const [ res ] = handleRes<DataJsonResponse<IIdeaGoal>>(
					await Axios(accessToken).post(`/ideas/${ idea?.id }/goals`, {
						Text: `Cíl námětu ${ Math.max(...goals.map((goal) => goal.order), 0) }`,
					})
				);
				await fetchGoals(res.data.order);
				toast.success("Cíl námětu byl úspěšně vytvořen.");
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
						await Axios(accessToken).put(`/ideas/${ idea?.id }/goals/${ dragItem.order }`, {
							Text: text,
						})
					);
					await fetchGoals();
					toast.success("Cíl námětu byl úspěšně uložen.");
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
				handleRes<DataJsonResponse<IIdeaGoal>>(await Axios(accessToken).delete(`/ideas/${ idea?.id }/goals/${ id }`));
				await fetchGoals();
				toast.success("Cíl námětu byl úspěšně odstraněn.");
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ goals ]);
	
	// submit reordering changes
	const submitChanges = async () => {
		try {
			setIsSubmitting(true);
			const reordered = sortBy(
				[ ...goals ].map((item, index) => ({ ...item, order: index + 1 })), "order")
				.map((item) => ({ Text: item.text }));
			handleRes<DataJsonResponse<NoContentResponse>>(await Axios(accessToken).put(`/ideas/${ idea?.id }/goals`, reordered));
			setIsSubmitting(false);
			toast.success("Cíle námětu byly úspěšně uloženy.");
			await fetchGoals();
		} catch (error) {
			toast.error(responseError(error).message);
			setIsSubmitting(false);
		}
	};
	
	return (
		<Card>
			<CardHeader className="d-flex justify-content-between">
				<span>Cíle námětu</span>
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
											listItem={ { ...goal, refId: goal.ideaId } }
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
						<p className="text-muted text-center my-5">Nový cíl námětu přidáte kliknutím na tlačítko <i
							className="icon-plus" /> v pravém horním rohu této karty.</p>
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

interface IIdeaGoalList extends IIdeaGoal {
	isEditing?: boolean;
}

export interface IdeaGoalsProps {
	idea?: IIdea;
	loading: [ boolean, Dispatch<SetStateAction<boolean>> ];
}

export default IdeaGoals;
