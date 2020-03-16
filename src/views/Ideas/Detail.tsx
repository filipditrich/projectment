import { AxiosResponse } from "axios";
import { History } from "history";
import React, { useEffect, useState } from "react";
import { withRouter, useParams } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Card, CardBody, CardDeck, Col, Row } from "reactstrap";
import ConfirmationWrapper from "../../components/common/ConfirmationWrapper";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { IIdea, IIdeaGoal } from "../../models/idea";
import { DataJsonResponse } from "../../models/response";
import { IWork } from "../../models/work";
import { useAppContext } from "../../providers";
import { Axios, isStatusOk } from "../../utils";
import { responseError, responseFail } from "../../utils/axios";
import { isOwnerOrAdmin } from "../../utils/roles";
import IdeaGoals from "./Detail/Goals";
import IdeaInfo from "./Detail/Info";
import IdeaOutlines from "./Detail/Outlines";

/**
 * Idea Detail Component
 * @constructor
 */
export const IdeaDetail: React.FC<IdeaDetailProps> = ({ history }: IdeaDetailProps) => {
	const { id } = useParams();
	if (!id) throw new Error("no Id present"); // shouldn't happen at all
	const [ isLoading, setIsLoading ] = useState<boolean>(true);
	const [ workWindow, setWorkWindow ] = useState<boolean>(false);
	const [ idea, setIdea ] = useState<IIdea>();
	const [ { accessToken, profile, userId } ] = useAppContext();
	
	useEffect(() => {
		(async () => {
			try {
				setIsLoading(true);
				const res: AxiosResponse<DataJsonResponse<IIdea>> = await Axios(accessToken)
					.get<DataJsonResponse<IIdea>>("/ideas/" + id);
				
				if (isStatusOk(res)) {
					setIdea({ ...res.data, id: Number(id) });
				} else throw responseFail(res);
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ accessToken, id ]);
	
	return (
		<Row>
			<Col sm="12">
				<CardDeck>
					{/* Idea Details */ }
					<IdeaInfo setIsLoading={ setIsLoading } idea={ idea } />
					
					{/* Idea Goals */ }
					<IdeaGoals idea={ idea } />
					
					{/* Idea Outlines */ }
					<IdeaOutlines idea={ idea } />
				</CardDeck>
				
				{/* Actions */ }
				{
					(isOwnerOrAdmin(profile, idea?.userId) || profile.theses_author) ? (
						<Card>
							<CardBody className="d-flex flex-wrap justify-content-end">
								{
									isOwnerOrAdmin(profile, idea?.userId) ?
										(
											<ConfirmationWrapper
												className="ml-auto"
												orderSwap={ true }
												onPositive={
													async (sdo) => {
														try {
															const res: AxiosResponse = await Axios(accessToken)
																.delete("/ideas/" + id);
															
															if (isStatusOk(res)) {
																toast.success("Námět byl úspěšně smazán.");
																history.push("/ideas/list");
															} else throw responseFail(res);
														} catch (error) {
															toast.error(responseError(error).message);
															sdo(false);
														}
													}
												}
												positiveText="Odstranit"
												dialogTitle="Odstranění námětu"
												dialogContent="Opravdu si přejete námět odstranit?"
												type="danger">
												<Button className="button button-danger">
													<span>Smazat námět</span>
												</Button>
											</ConfirmationWrapper>
										) : null
								}
								{
									// TODO: profile does not contain any claims
									profile.theses_author ? (
										<Link className="button button-primary ml-3" to={ "/works/create/" + idea?.id }>
											<span>Vytvořit zadání</span>
										</Link>
									) : null
								}
							</CardBody>
						</Card>
					) : null
				}
			</Col>
		</Row>
	);
};

export interface IdeaDetailProps {
	history: History;
}

export default withRouter(IdeaDetail);
