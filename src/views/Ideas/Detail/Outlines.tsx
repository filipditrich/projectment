import { AxiosResponse } from "axios";
import classNames from "classnames";
import update from "immutability-helper";
import { isEqual, sortBy } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Card, CardBody, CardFooter, CardHeader, ListGroup } from "reactstrap";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import { IIdeaGoal, IIdeaOutline } from "../../../models/idea";
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
	const [ isChanged, setIsChanged ] = useState<boolean>(false);
	
	// detect any changes
	useEffect(() => {
		setIsChanged(!isEqual(list, sortBy([ ...list ], "order")));
	}, [ list ]);
	
	// fetch idea outlines
	const fetchOutlines = async () => {
		try {
			setIsLoading(true);
			const res: AxiosResponse<DataJsonResponse<IIdeaOutline[]>> = await Axios(accessToken)
				.get<DataJsonResponse<IIdeaOutline[]>>(`/ideas/${ id }/outlines`);
			
			if (isStatusOk(res)) {
				setList(res.data);
			} else throw responseFail(res);
		} catch (error) {
			toast.error(responseError(error).message);
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		(async () => fetchOutlines())();
	}, [ accessToken, id ]);
	
	// show badges with old index on reorder
	useEffect(() => {
		setShowBadges(isChanged);
	}, [ list, isChanged ]);
	
	// move outline hook
	const moveOutline = useCallback((dragIndex: number, hoverIndex: number, text: string) => {
		const dragItem = list[dragIndex];
		
		// on text change
		if (dragIndex === hoverIndex && dragItem.text !== text) {
			dragItem.text = text;
			(async () => {
				try {
					setIsLoading(true);
					const res: AxiosResponse<DataJsonResponse<IIdeaGoal>> = await Axios(accessToken)
						.put<DataJsonResponse<IIdeaGoal>>(`/ideas/${ id }/outlines/${ dragItem.order }`, {
							Text: text
						});
					
					if (isStatusOk(res)) {
						await fetchOutlines();
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
	
	// add outline hook
	const addOutline = useCallback(() => {
		(async () => {
			try {
				setIsLoading(true);
				const res: AxiosResponse<DataJsonResponse<IIdeaOutline>> = await Axios(accessToken)
					.post<DataJsonResponse<IIdeaOutline>>(`/ideas/${ id }/outlines`, {
						Text: `Bod osnovy ${ Math.max(...list.map((ideaGoal) => ideaGoal.order), 0) }`,
					});

				if (isStatusOk(res)) {
					await fetchOutlines();
					toast.success("Bod osnovy byl úspěšně vytvořen.");
				} else throw responseFail(res);
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ list ]);
	
	// remove outline hook
	const removeOutline = useCallback((ideaId: string | number, outlineId: string | number) => {
		(async () => {
			try {
		     setIsLoading(true);
				const res: AxiosResponse<DataJsonResponse<IIdeaOutline>> = await Axios(accessToken)
					.delete<DataJsonResponse<IIdeaOutline>>(`/ideas/${ ideaId }/outlines/${ outlineId }`);

				if (isStatusOk(res)) {
					await fetchOutlines();
					toast.success("Bod osnovy byl úspěšně odstraněn.");
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
					<i className="icon-plus font-xl" />
				</button>
			</CardHeader>
			<CardBody className={ classNames({ "d-flex flex-column": true, "justify-content-center": !list.length }) }>
				{
					list.length ? (
						<>
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
						</>
					) : (
						<p className="text-muted text-center my-5">Nový bod námětu přidáte kliknutím na tlačítko <i className="icon-plus" /> v pravém horním rohu této karty.</p>
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

export interface IdeaOutlinesProps {
	id: number | string;
}

export interface IIdeaOutlineList extends IIdeaOutline {
	isEditing?: boolean;
}

export default IdeaOutlines;
