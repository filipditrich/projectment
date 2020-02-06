import { AxiosResponse } from "axios";
import update from "immutability-helper";
import { isEqual, sortBy } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardBody, CardFooter, CardHeader, ListGroup } from "reactstrap";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import { IIdeaOutline } from "../../../models/idea";
import { DataJsonResponse } from "../../../models/response";
import { useAppContext } from "../../../providers";
import { Axios, isStatusOk } from "../../../utils";
import { responseError, responseFail } from "../../../utils/axios";
import IdeaListItem from "./ListItem";

/**
 * Idea Outlines Component
 * @constructor
 */
export const IdeaOutlines: React.FC<IdeaOutlinesProps> = ({ id }: IdeaOutlinesProps) => {
	const [ { accessToken } ] = useAppContext();
	const [ isLoading, setIsLoading ] = useState<boolean>(true);
	const [ showBadges, setShowBadges ] = useState<boolean>(false);
	const [ list, setList ] = useState<IIdeaOutlineList[]>([]);
	const isChanged: boolean = !isEqual(list, sortBy([ ...list ], "order"));
	
	// fetch idea outlines
	useEffect(() => {
		(async () => {
			try {
				setIsLoading(true);
				const res: AxiosResponse<DataJsonResponse<any>> = await Axios(accessToken)
					.get<DataJsonResponse<any>>(`/ideas/${ id }/outlines`);
				
				if (isStatusOk(res)) {
					// TODO: de-fake
					// setList(res.data.data);
					setList([
						{ ideaId: 1, order: 1, text: "Write a cool JS library" },
						{ ideaId: 1, order: 2, text: "Make it generic enough" },
						{ ideaId: 1, order: 3, text: "Write README" },
						{ ideaId: 1, order: 4, text: "Create some examples" },
						{
							ideaId: 1,
							order: 5,
							text: "Spam in Twitter and IRC to promote it (note that this element is taller than the others)"
						},
						{ ideaId: 1, order: 6, text: "???" },
						{ ideaId: 1, order: 7, text: "PROFIT" },
					]);
				} else throw responseFail(res);
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ accessToken ]);
	
	// show badges with old index on reorder
	useEffect(() => {
		setShowBadges(isChanged);
	}, [ list ]);
	
	// move outline hook
	const moveOutline = useCallback((dragIndex: number, hoverIndex: number, text: string) => {
		const dragItem = list[dragIndex];
		if (dragIndex === hoverIndex) dragItem.text = text;
		setList(update(list, {
			$splice: [
				[ dragIndex, 1 ],
				[ hoverIndex, 0, dragItem ],
			],
		}));
	}, [ list ]);
	
	// add outline hook
	const addOutline = useCallback(() => {
		// TODO: de-fake
		setList([ ...list, { ideaId: 1, order: list.length + 1, text: "Nový bod osnovy", isEditing: true } ]);
		// (async () => {
		// 	try {
		//      setIsLoading(true);
		// 		const res: AxiosResponse<DataJsonResponse<any>> = await Axios(accessToken)
		// 			.post<DataJsonResponse<any>>(`/ideas/${ id }/outlines`, {
		//				id, goalText: "Nový body osnovy"
		// 			});
		//
		// 		if (isStatusOk(res)) {
		// 			toast.success("Bod osnovy byl úspěšně vytvořen.");
		// 		} else throw responseFail(res);
		// 	} catch (error) {
		// 		toast.error(responseError(error).message);
		// 	} finally {
		// 		setIsLoading(false);
		// 	}
		// })();
	}, [ list ]);
	
	// remove outline hook
	const removeOutline = useCallback((ideaId: string | number, outlineId: string | number) => {
		// TODO: de-fake
		setList([ ...list ]
			.filter((item) => item.order !== outlineId)
			.map((item, index) => {
				return { ...item, order: index + 1 };
			})
		);
		// (async () => {
		// 	try {
		//      setIsLoading(true);
		// 		const res: AxiosResponse<DataJsonResponse<any>> = await Axios(accessToken)
		// 			.delete<DataJsonResponse<any>>(`/ideas/${ ideaId }/outlines/${ outlineId }`);
		//
		// 		if (isStatusOk(res)) {
		// 			console.log(res);
		// 			toast.success("Bod osnovy byl úspěšně odstraněn.");
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
				<span>Osnova námětu</span>
				<button className="reset-button" onClick={ addOutline }>
					<i className="icon-plus font-lg" />
				</button>
			</CardHeader>
			<CardBody>
				<p className="text-muted">Osnova shrnuje veškeré kroky, které student bude muset učinit, aby dosáhl cílů práce: co bude muset nastudovat, vyrobit, promyslet.</p>
				<ListGroup>
					{
						list.map((item: IIdeaOutlineList, index: number) => (
							<IdeaListItem
								listItem={ item }
								index={ index }
								accept="outline"
								showBadges={ showBadges }
								key={ index }
								removeItem={ removeOutline }
								updateItem={ moveOutline } />
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

export interface IdeaOutlinesProps {
	id: number | string;
}

export interface IIdeaOutlineList extends IIdeaOutline {
	isEditing?: boolean;
}

export default IdeaOutlines;
