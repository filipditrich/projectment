import React, { useCallback, useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Button, Card, CardBody, CardFooter, CardHeader, ListGroup } from "reactstrap";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import { IIdea, IIdeaGoal } from "../../../models/idea";
import { DataJsonResponse } from "../../../models/response";
import { useAppContext } from "../../../providers";
import { Axios, isStatusOk } from "../../../utils";
import { sortBy, isEqual, differenceWith } from "lodash";
import { responseError, responseFail } from "../../../utils/axios";
import { isOwnerOrAdmin } from "../../../utils/roles";
import IdeaListItem from "./ListItem";
import update from "immutability-helper";
import classNames from "classnames";

/**
 * Idea Goals Component
 * @constructor
 */
export const IdeaGoals: React.FC<IdeaGoalsProps> = ({ idea }: IdeaGoalsProps) => {
	const [{ accessToken, profile }] = useAppContext();
	const [ isLoading, setIsLoading ] = useState<boolean>(true);
	const [ showBadges, setShowBadges ] = useState<boolean>(false);
	const [ list, setList ] = useState<IIdeaGoalList[]>([]);
	const [ isChanged, setIsChanged ] = useState<boolean>(false);
	
	// detect any changes
	useEffect(() => {
		setIsChanged(!isEqual(list, sortBy([ ...list ], "order")));
	}, [ list ]);
	
	// fetch idea goals
	const fetchGoals = async () => {
		try {
			setIsLoading(true);
			const res: AxiosResponse<DataJsonResponse<IIdeaGoal[]>> = await Axios(accessToken)
				.get<DataJsonResponse<IIdeaGoal[]>>(`/ideas/${ idea?.id }/goals`);
			
			if (isStatusOk(res)) {
				setList(sortBy(res.data, "order"));
			} else throw responseFail(res);
		} catch (error) {
			toast.error(responseError(error).message);
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		if (idea) (async () => fetchGoals())();
	}, [ accessToken, idea ]);
	
	// show badges with old index on reorder
	useEffect(() => {
		setShowBadges(isChanged);
	}, [ list, isChanged ]);
	
	// move goal hook
	const moveGoal = useCallback((dragIndex: number, hoverIndex: number, text: string) => {
		const dragItem = list[dragIndex];
		
		// on text change
		if (dragIndex === hoverIndex && dragItem.text !== text) {
			dragItem.text = text;
			(async () => {
				try {
					setIsLoading(true);
					const res: AxiosResponse<DataJsonResponse<IIdeaGoal>> = await Axios(accessToken)
						.put<DataJsonResponse<IIdeaGoal>>(`/ideas/${ idea?.id }/goals/${ dragItem.order }`, {
							Text: text
						});

					if (isStatusOk(res)) {
						await fetchGoals();
						toast.success("Text cíle námětu byl úspěšně uložen.");
					} else throw responseFail(res);
				} catch (error) {
					toast.error(responseError(error).message);
				} finally {
					setIsLoading(false);
				}
			})();
		}
		setList(update(list, {
			$splice: [
				[ dragIndex, 1 ],
				[ hoverIndex, 0, dragItem ],
			],
		}));
	}, [ list ]);
	
	// add goal hook
	const addGoal = useCallback(() => {
		(async () => {
			try {
				setIsLoading(true);
				const res: AxiosResponse<DataJsonResponse<IIdeaGoal>> = await Axios(accessToken)
					.post<DataJsonResponse<IIdeaGoal>>(`/ideas/${ idea?.id }/goals`, {
						Text: `Cíl námětu ${ Math.max(...list.map((ideaGoal) => ideaGoal.order), 0) }`,
					});
				
				if (isStatusOk(res)) {
					await fetchGoals();
					toast.success("Cíl námětu byl úspěšně vytvořen.");
				} else throw responseFail(res);
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ list ]);
	
	// remove goal hook
	const removeGoal = useCallback((ideaId: string | number, goalId: string | number) => {
		(async () => {
			try {
				setIsLoading(true);
				const res: AxiosResponse<DataJsonResponse<IIdeaGoal>> = await Axios(accessToken)
					.delete<DataJsonResponse<IIdeaGoal>>(`/ideas/${ ideaId }/goals/${ goalId }`);
				
				if (isStatusOk(res)) {
					await fetchGoals();
					toast.success("Cíl námětu byl úspěšně odstraněn.");
				} else throw responseFail(res);
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ list ]);
	
	// submit reordering changes
	const submitReorderingChanges = () => {
		(async () => {
			try {
				setIsLoading(true);
				const reordered = sortBy(
					[ ...list ].map((item, index) => {
						return { ...item, order: index + 1 };
					}), "order")
					.map((item) => { return { Text: item.text }; });
				
				const res: AxiosResponse<DataJsonResponse<IIdeaGoal>> = await Axios(accessToken)
					.put<DataJsonResponse<IIdeaGoal>>(`/ideas/${ idea?.id }/goals`, reordered);
				
				if (isStatusOk(res)) {
					await fetchGoals();
					toast.success("Cíle námětu byly úspěšně přezařeny.");
				} else throw responseFail(res);
			} catch (error) {
				setIsLoading(false);
				toast.error(responseError(error).message);
			}
		})();
	};
	
	return (
		<LoadingOverlay active={ isLoading } tag={ Card } styles={{ minWidth: "300px" }}>
			<CardHeader className="d-flex justify-content-between">
				<span>Cíle námětu</span>
				{
					isOwnerOrAdmin(profile, idea?.userId) ? (
						<button className="reset-button" onClick={ addGoal }>
							<i className="icon-plus font-xl" />
						</button>
					) : null
				}
			</CardHeader>
			<CardBody className={ classNames({ "d-flex flex-column": true, "justify-content-center": !list.length }) }>
				{
					list.length ? (
						<>
							<p className="text-muted">Cíle popisují vše, co v práci v době jejího odevzdání má být hotovo a odevzdáno.</p>
							<ListGroup>
								{
									list.map((item: IIdeaGoalList, index: number) => (
										<IdeaListItem
											listItem={ item }
											index={ index }
											accept="goal"
											showBadges={ showBadges }
											key={ index }
											canEdit={ isOwnerOrAdmin(profile, idea?.userId) }
											removeItem={ removeGoal }
											updateItem={ moveGoal } />
									))
								}
							</ListGroup>
						</>
					) : (
						<p className="text-muted text-center my-5">Nový cíl námětu přidáte kliknutím na tlačítko <i className="icon-plus" /> v pravém horním rohu této karty.</p>
					)
				}
			</CardBody>
			{
				isChanged ? (
					<CardFooter className="d-flex">
						<Button className="button button-primary ml-auto"
						        onClick={ submitReorderingChanges }>
							<span>Potvrdit změny</span>
						</Button>
					</CardFooter>
				) : null
			}
		</LoadingOverlay>
	);
};

export interface IdeaGoalsProps {
	idea?: IIdea;
}

export interface IIdeaGoalList extends IIdeaGoal {
	isEditing?: boolean;
}

export default IdeaGoals;
