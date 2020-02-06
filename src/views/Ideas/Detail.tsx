import { AxiosResponse } from "axios";
import { History } from "history";
import React, { useEffect, useState } from "react";
import { withRouter, Redirect, useParams } from "react-router";
import { toast } from "react-toastify";
import { Card, CardBody, CardDeck, CardFooter, CardHeader, Col, Row } from "reactstrap";
import { Modal } from "../../components";
import { loading, errorPartial } from "../../misc";
import { IIdea } from "../../models/idea";
import { DataJsonResponse } from "../../models/response";
import { useAppContext } from "../../providers";
import { Axios, isStatusOk } from "../../utils";
import { responseError, responseFail } from "../../utils/axios";
import IdeaGoals from "./Detail/Goals";
import IdeaInfo from "./Detail/Info";
import IdeaOutlines from "./Detail/Outlines";
import IdeaEditor from "./Edit";

/**
 * Idea Detail Component
 * @constructor
 */
export const IdeaDetail: React.FC<IdeaDetailProps> = ({ history }: IdeaDetailProps) => {
	let { id } = useParams();
	if (!id) throw new Error(); // shouldn't happen at all
	
	const [ editing, setEditing ] = useState<boolean>(false);
	const [ showDelete, setShowDelete ] = useState<boolean>(false);
	const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
	
	const [ isLoading, setIsLoading ] = useState<boolean>(true);
	const [ error, setError ] = useState<boolean | string>(false);
	const [ response, setResponse ] = useState<IIdea>();
	const [ { accessToken } ] = useAppContext();
	
	useEffect(() => {
		(async () => {
			try {
				const res: AxiosResponse<DataJsonResponse<IIdea>> = await Axios(accessToken)
					.get<DataJsonResponse<IIdea>>("/ideas/" + id);
				
				if (isStatusOk(res)) {
					setResponse(res.data);
				} else {
					throw new Error(res.statusText || res.status.toString());
				}
			} catch (error) {
				setError(error.message);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [ accessToken ]);
	
	if (isLoading) {
		return loading();
	} else if (error) {
		toast.error(error);
		return <Redirect to="/ideas/list" />;
	} else if (!response) {
		return errorPartial();
	} else {
		return (
			<>
				<Row>
					<Col sm="12">
						<CardDeck>
							{/* Idea Details */ }
							{
								!editing ? (
									<IdeaInfo idea={ response } setEditing={ setEditing } />
								) : (
									<IdeaEditor idea={ response } setEditing={ setEditing } />
								)
							}
							
							{/* Idea Goals */ }
							<IdeaGoals id={ id } />
							
							{/* Idea Outlines */ }
							<IdeaOutlines id={ id } />
						</CardDeck>
						
						{/* Actions */ }
						<Card className="mt-3">
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
	}
};

export interface IdeaDetailProps {
	history: History;
}

export default withRouter(IdeaDetail);
