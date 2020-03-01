import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "reactstrap";
import { ErrorHandler } from "../../components";
import { DefaultProps } from "../../models/props";
import IdeaList from "./List";

/**
 * Main Ideas Component
 * @param title
 * @constructor
 */
export const Ideas: React.FC<DefaultProps> = ({ title }: DefaultProps) => {
	const [ total, setTotal ] = useState<number>(0);
	
	return (
		<ErrorHandler>
			<header className="table-pre-header">
				<h1>{ title } <Badge color="secondary">{ total }</Badge></h1>
				<Link
					className="button button-secondary"
					to="/ideas/create">
					<span>Nový</span>
				</Link>
			</header>
			<IdeaList setTotal={ setTotal } />
		</ErrorHandler>
	);
};

export default Ideas;
