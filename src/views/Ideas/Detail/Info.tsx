import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import { loading } from "../../../misc";
import { IIdea } from "../../../models/idea";
import IdeaEditor from "../Edit";
import IdeaTargets from "./Targets";

/**
 * Idea Detail Component
 * @constructor
 */
export const IdeaInfo: React.FC<IdeaInfoProps> = ({ idea, setIsLoading }: IdeaInfoProps) => {
	const [ editing, setEditing ] = useState<boolean>(false);
	
	return editing ? (
		idea ? <IdeaEditor idea={ idea } setEditing={ setEditing }/> : loading()
	) : (
		<Card>
			<CardHeader>Detail námětu</CardHeader>
			<CardBody>
				<dl>
					<dt>Název</dt>
					<dd className="text-muted">{ idea?.name }</dd>
					<dt>Popis</dt>
					<dd className="text-muted">{ idea?.description }</dd>
					<dt>Id</dt>
					<dd className="text-muted">{ idea?.id }</dd>
					<dt>Nabízené</dt>
					<dd className="text-muted">{ idea?.offered ? "Ano" : "Ne" }</dd>
					<dt>Prostředky</dt>
					<dd className="text-muted">{ idea?.resources }</dd>
					<dt>Předmět</dt>
					<dd className="text-muted">{ idea?.subject }</dd>
					<dt>Počet řešitelů</dt>
					<dd className="text-muted">{ idea?.participants }</dd>
					<dt className="mb-1">Cílové skupiny</dt>
					<dd>
						{
							(idea?.id) ? (
								<IdeaTargets setIsLoading={ setIsLoading } id={ idea?.id.toString() } />
							) : null
						}
					</dd>
				</dl>
			</CardBody>
			<CardFooter className="d-flex">
				<Button className="button button-primary ml-auto"
				        onClick={ () => { setEditing(true); } }>
					<span>Editovat</span>
				</Button>
			</CardFooter>
		</Card>
	);
};

export interface IdeaInfoProps {
	idea?: IIdea;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default IdeaInfo;
