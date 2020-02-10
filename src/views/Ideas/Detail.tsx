import { AxiosResponse } from "axios";
import { History } from "history";
import React, { useState } from "react";
import { withRouter, useParams } from "react-router";
import { toast } from "react-toastify";
import { Button, Card, CardBody, CardDeck, Col, Row } from "reactstrap";
import { Modal } from "../../components";
import ConfirmationWrapper from "../../components/common/ConfirmationWrapper";
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
	const [ { accessToken } ] = useAppContext();
	
	return (
		<Row>
			<Col sm="12">
				<CardDeck>
					{/* Idea Details */ }
					<IdeaInfo id={ id } />
					
					{/* Idea Goals */ }
					<IdeaGoals id={ id } />
					
					{/* Idea Outlines */ }
					<IdeaOutlines id={ id } />
				</CardDeck>
				
				{/* Actions */ }
				<Card>
					<CardBody className="d-flex">
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
									} finally {
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
