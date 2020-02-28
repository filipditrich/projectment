import { AxiosResponse } from "axios";
import { History } from "history";
import React, { useEffect, useState } from "react";
import { withRouter, useParams } from "react-router";
import { toast } from "react-toastify";
import { Button, Card, CardBody, CardDeck, Col, Row } from "reactstrap";
import ConfirmationWrapper from "../../components/common/ConfirmationWrapper";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { IIdea } from "../../models/idea";
import { DataJsonResponse } from "../../models/response";
import { useAppContext } from "../../providers";
import { Axios, isStatusOk } from "../../utils";
import { responseError, responseFail } from "../../utils/axios";
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
	const [ idea, setIdea ] = useState<IIdea>();
	const [ { accessToken, profile } ] = useAppContext();
	
	useEffect(() => {
		(async () => {
			try {
				const res: AxiosResponse<DataJsonResponse<IIdea>> = await Axios(accessToken)
					.get<DataJsonResponse<IIdea>>("/ideas/" + id);
				
				if (isStatusOk(res)) {
					setIdea({ ...res.data, id });
				} else throw responseFail(res);
			} catch (error) {
				toast.error(responseError(error).message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ accessToken, id ]);
	console.log(profile, idea);
	
	return (
		<Row>
			<Col sm="12">
				<CardDeck>
					{/* Idea Details */ }
					<LoadingOverlay active={ isLoading } tag="div">
						<IdeaInfo setIsLoading={ setIsLoading } idea={ idea } />
					</LoadingOverlay>
					
					{/* Idea Goals */ }
					<IdeaGoals id={ id } />
					
					{/* Idea Outlines */ }
					<IdeaOutlines id={ id } />
				</CardDeck>
				
				{/* Actions */ }
				<Card>
					<CardBody className="d-flex flex-wrap">
						{
							(profile.administrator || profile.sub === idea?.userId) ?
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
						<ConfirmationWrapper
							className="ml-3"
							onPositive={
								async (sdo) => {
									alert("NYI");
								}
							}
							positiveText="Vytvořit"
							dialogTitle="Vytvořit zadání"
							dialogContent="Opravdu si přejete vytvořit zadání z aktuálního námětu?"
							type="primary">
							<Button className="button button-primary">
								<span>Vytvořit zadání</span>
							</Button>
						</ConfirmationWrapper>
					</CardBody>
				</Card>
			</Col>
		</Row>
	);
};

export interface IdeaDetailProps {
	history: History;
}

export default withRouter(IdeaDetail);
