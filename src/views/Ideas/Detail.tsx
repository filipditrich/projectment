import { AxiosResponse } from "axios";
import { History } from "history";
import React, { useState } from "react";
import { withRouter, useParams } from "react-router";
import { toast } from "react-toastify";
import { Card, CardBody, CardDeck, Col, Row } from "reactstrap";
import { Modal } from "../../components";
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
	
	const [ showDelete, setShowDelete ] = useState<boolean>(false);
	const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
	const [{ accessToken }] = useAppContext();
	
	return (
		<>
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
							<button className="button button-danger button-reverse ml-auto" onClick={ () => { setShowDelete(true); } }>
								<span>Smazání</span>
							</button>
						</CardBody>
					</Card>
				</Col>
			</Row>
			
			{/* Delete Confirmation Modal */ }
			<Modal
				isOpen={ showDelete }
				onDismiss={ () => setShowDelete(false) }
				title="Odstranění námětu"
				className="modal-danger"
				actions={
					<>
						<button
							onClick={
								() => {
									(async () => {
										try {
											setIsDeleting(true);
											const res: AxiosResponse = await Axios(accessToken)
												.delete("/ideas/" + id);
											
											if (isStatusOk(res)) {
												toast.success("Námět byl úspěšně smazán.");
												history.push("/ideas/list");
											} else throw responseFail(res);
										} catch (error) {
											toast.error(responseError(error).message);
										} finally {
											setShowDelete(false);
											setIsDeleting(false);
										}
									})();
								}
							}
							className="button button-danger button-reverse"
							disabled={ isDeleting }>
							<span>{ !isDeleting ? "Odstranit" : "Pracuji..." }</span>
						</button>
						<button
							onClick={ () => {
								setShowDelete(false);
							} }
							className="button button-danger">
							<span>Zavřít</span>
						</button>
					</>
				}
			>
				<p className="text-muted">Opravdu si přejete námět odstranit?</p>
			</Modal>
		</>
	);
};

export interface IdeaDetailProps {
	history: History;
}

export default withRouter(IdeaDetail);
