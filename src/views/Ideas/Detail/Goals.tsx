import React, { useCallback, useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Card, CardBody, CardFooter, CardHeader, ListGroup } from "reactstrap";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import { IIdeaGoal } from "../../../models/idea";
import { DataJsonResponse } from "../../../models/response";
import { useAppContext } from "../../../providers";
import { Axios, isStatusOk } from "../../../utils";
import { sortBy, isEqual } from "lodash";
import { responseError, responseFail } from "../../../utils/axios";
import IdeaListItem from "./ListItem";
import update from "immutability-helper";

/**
 * Idea Goals Component
 * @constructor
 */
export const IdeaGoals: React.FC<IdeaGoalsProps> = ({ id }: IdeaGoalsProps) => {
	const [ { accessToken } ] = useAppContext();
	const [ isLoading, setIsLoading ] = useState<boolean>(true);
	const [ showBadges, setShowBadges ] = useState<boolean>(false);
	const [ list, setList ] = useState<IIdeaGoalList[]>([]);
	const isChanged: boolean = !isEqual(list, sortBy([ ...list ], "order"));
	
	// fetch idea goals
	useEffect(() => {
		(async () => {
			try {
				setIsLoading(true);
				const res: AxiosResponse<DataJsonResponse<any>> = await Axios(accessToken)
					.get<DataJsonResponse<any>>(`/ideas/${ id }/goals`);
				
				if (isStatusOk(res)) {
					// TODO: de-fake
					// setList(res.data.data);
					setList([
						{ ideaId: 1, order: 1, text: "JS Library" },
						{ ideaId: 1, order: 2, text: "TypeScript Definitions" },
						{ ideaId: 1, order: 3, text: "README" },
						{ ideaId: 1, order: 4, text: "Documentation" },
					]);
				} else throw responseFail(res);
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ accessToken, id ]);
	
	// show badges with old index on reorder
	useEffect(() => {
		setShowBadges(isChanged);
	}, [ list, isChanged ]);
	
	// move goal hook
	const moveGoal = useCallback((dragIndex: number, hoverIndex: number, text: string) => {
		const dragItem = list[dragIndex];
		if (dragIndex === hoverIndex) dragItem.text = text;
		setList(update(list, {
			$splice: [
				[ dragIndex, 1 ],
				[ hoverIndex, 0, dragItem ],
			],
		}));
	}, [ list ]);
	
	// add goal hook
	const addGoal = useCallback(() => {
		// TODO: de-fake
		setList([ ...list, { ideaId: 1, order: list.length + 1, text: "Nový cíl", isEditing: true } ]);
		// (async () => {
		// 	try {
		//      setIsLoading(true);
		// 		const res: AxiosResponse<DataJsonResponse<any>> = await Axios(accessToken)
		// 			.post<DataJsonResponse<any>>(`/ideas/${ id }/goals`, {
		//				id, goalText: "Nový cíl"
		// 			});
		//
		// 		if (isStatusOk(res)) {
		// 			toast.success("Cíl byl úspěšně vytvořen.");
		// 		} else throw responseFail(res);
		// 	} catch (error) {
		// 		toast.error(responseError(error).message);
		// 	} finally {
		// 		setIsLoading(false);
		// 	}
		// })();
	}, [ list ]);
	
	// remove goal hook
	const removeGoal = useCallback((ideaId: string | number, goalId: string | number) => {
		// TODO: de-fake
		setList([ ...list ]
			.filter((item) => item.order !== goalId)
			.map((item, index) => {
				return { ...item, order: index + 1 };
			})
		);
		// (async () => {
		// 	try {
		//      setIsLoading(true);
		// 		const res: AxiosResponse<DataJsonResponse<any>> = await Axios(accessToken)
		// 			.delete<DataJsonResponse<any>>(`/ideas/${ ideaId }/goals/${ goalId }`);
		//
		// 		if (isStatusOk(res)) {
		// 			console.log(res);
		// 			toast.success("Cíl byl úspěšně odstraněn.");
		// 		} else throw responseFail(res);
		// 	} catch (error) {
		// 		toast.error(responseError(error).message);
		// 	} finally {
		// 		setIsLoading(false);
		// 	}
		// })();
	}, [ list ]);
	
	// submit reordering changes
	const submitReorderingChanges = () => {
		// TODO: de-fake
		setList(sortBy(
			[ ...list ].map((item, index) => {
				return { ...item, order: index + 1 };
			}), "order"));
		
		// TODO: implement this (not sure about the correct update method on API)
	};
	
	return (
		<LoadingOverlay active={ isLoading } tag={ Card } styles={{ minWidth: "40vw" }}>
			<CardHeader className="d-flex justify-content-between">
				<span>Cíle námětu</span>
				<button className="reset-button" onClick={ addGoal }>
					<i className="icon-plus font-lg" />
				</button>
			</CardHeader>
			<CardBody>
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
								removeItem={ removeGoal }
								updateItem={ moveGoal } />
						))
					}
				</ListGroup>
			</CardBody>
			{
				isChanged ? (
					<CardFooter>
						<button className="button button-primary button-reverse"
						        onClick={ submitReorderingChanges }>
							<span>Potvrdit změny</span>
						</button>
					</CardFooter>
				) : null
			}
		</LoadingOverlay>
	);
};

export interface IdeaGoalsProps {
	id: number | string;
}

export interface IIdeaGoalList extends IIdeaGoal {
	isEditing?: boolean;
}

export default IdeaGoals;
