import { LocationState } from "history";
import * as H from "history";
import React, { ReactElement, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import IdeaDisplay from "./IdeaDisplay";
// import DisplayTargets from "./DisplayTargets";
import IdeaEdit from "./IdeaEdit";
import IdeaDisplayTargets from "./IdeaTargetsDisplay";
import { Card, CardBody, CardDeck, CardHeader, Col, Row } from "reactstrap";
import IdeaUserDisplay from "./IdeaUserDisplay";
import { fakePromise, getRandomInt } from "../../utils";
import { Modal } from "../../components/common";
import { loading } from "../../misc";

/**
 * Idea IdeaDetail Component
 * @param props
 * @returns {*}
 * @constructor
 */
export const IdeaDetail = (props: any): ReactElement => {
	const { id } = useParams();
	const [ editing, setEditing ]: any = useState(false);
	const [ showDelete, setShowDelete ]: any = useState(false);
	const [ isDeleting, setIsDeleting ]: any = useState(false);
	const [ response, setResponse ]: any = useState(null);
	const history: H.History<LocationState> = useHistory();
	
	useEffect(() => {
		setIsDeleting(false);
		setShowDelete(false);
		return () => {
			setShowDelete(false);
			setIsDeleting(false);
		};
	}, []);
	
	if (editing) {
		return (
			<Row className="justify-content-center">
				<Col sm="12">
					<Card>
						<CardBody>
							<IdeaEdit id={ id } switchEditMode={ setEditing } />
						</CardBody>
					</Card>
				</Col>
			</Row>
		);
	} else {
		return (
			<>
				<Row className="justify-content-center">
					<Col sm="12">
						<CardDeck>
							{/* Details */ }
							<Card>
								<CardHeader>Obecná data</CardHeader>
								<CardBody>
									<IdeaDisplay id={ id } onResponse={ (res) => {
										setResponse(res);
									} } />
								</CardBody>
							</Card>
							
							{/* Author */ }
							<Card>
								<CardHeader>Autor</CardHeader>
								<CardBody>
									{
										response ? (
											<IdeaUserDisplay userData={ response.user } />
										) : loading()
									}
								</CardBody>
							</Card>
							
							{/* Targets */ }
							<Card>
								<CardHeader>Cílové skupiny</CardHeader>
								<CardBody>
									<IdeaDisplayTargets id={ id } />
								</CardBody>
							</Card>
						</CardDeck>
						
						{/* Actions */ }
						<Card className="mt-3">
							<CardBody>
								<button className="button button-primary button-reverse mr-3" onClick={ () => {
									setEditing(true);
								} }><span>Editace</span></button>
								<button className="button button-danger button-reverse" onClick={ () => {
									setShowDelete(true);
								} }><span>Smazání</span></button>
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
									async () => {
										setIsDeleting(true);
										
										await fakePromise(getRandomInt(100, 750));
										history.push("/ideas");
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
					<p className="text-muted">Opravdu si přejete odstranit námět?</p>
				</Modal>
			</>
		);
	}
};

export default IdeaDetail;
