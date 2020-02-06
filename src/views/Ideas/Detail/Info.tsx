import React, { Dispatch, SetStateAction } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import { IIdea } from "../../../models/idea";

/**
 * Idea Detail Component
 * @constructor
 */
export const IdeaInfo: React.FC<IdeaInfoProps> = ({ idea, setEditing }: IdeaInfoProps) => {
	
	return (
		<Card style={ { minWidth: "300px" } }>
			<CardHeader>Detail námětu</CardHeader>
			<CardBody>
				<dl>
					<dt>Název</dt>
					<dd className="text-muted">{ idea.name }</dd>
					<dt>Popis</dt>
					<dd className="text-muted">{ idea.description }</dd>
					<dt>Id</dt>
					<dd className="text-muted">{ idea.id }</dd>
					<dt>Nabízené</dt>
					<dd className="text-muted">{ idea.offered ? "Ano" : "Ne" }</dd>
					<dt>Prostředky</dt>
					<dd className="text-muted">{ idea.resources }</dd>
					<dt>Předmět</dt>
					<dd className="text-muted">{ idea.subject }</dd>
					<dt>Počet řešitelů</dt>
					<dd className="text-muted">{ idea.participants }</dd>
				</dl>
			</CardBody>
			<CardFooter>
				<button className="button button-primary button-reverse"
				        onClick={ () => { setEditing(true); } }>
					<span>Editace</span>
				</button>
			</CardFooter>
		</Card>
	);
};

export interface IdeaInfoProps {
	idea: IIdea;
	setEditing: Dispatch<SetStateAction<boolean>>;
}

export default IdeaInfo;
