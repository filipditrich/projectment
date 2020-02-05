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
				{ JSON.stringify(idea, null, "\t") }
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
