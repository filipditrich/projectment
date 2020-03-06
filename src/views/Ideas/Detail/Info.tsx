import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import { loading } from "../../../misc";
import { IIdea } from "../../../models/idea";
import { useAppContext } from "../../../providers";
import { isOwnerOrAdmin } from "../../../utils/roles";
import IdeaEditor from "../Edit";
import IdeaTargets from "./Targets";

/**
 * Idea Detail Component
 * @constructor
 */
export const IdeaInfo: React.FC<IdeaInfoProps> = ({ idea, setIsLoading }: IdeaInfoProps) => {
	const [ editing, setEditing ] = useState<boolean>(false);
	const [{ profile }] = useAppContext();
	
	return editing ? (
		idea ? <IdeaEditor idea={ idea } setEditing={ setEditing }/> : loading()
	) : (
		<Card style={{ minWidth: "300px" }}>
			<CardHeader>Detail námětu</CardHeader>
			<CardBody>
				<dl>
					<dt>Název</dt>
					<dd className="text-muted">{ idea?.name }</dd>
					<dt>Popis</dt>
					<dd className="text-muted">{ idea?.description }</dd>
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
							(idea) ? (
								<IdeaTargets setIsLoading={ setIsLoading } idea={ idea } />
							) : null
						}
					</dd>
				</dl>
			</CardBody>
			{
				isOwnerOrAdmin(profile, idea?.userId) ? (
					<CardFooter className="d-flex">
						<Button className="button button-primary ml-auto"
						        onClick={ () => { setEditing(true); } }>
							<span>Editovat</span>
						</Button>
					</CardFooter>
				) : null
			}
		</Card>
	);
};

export interface IdeaInfoProps {
	idea?: IIdea;
	setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default IdeaInfo;
