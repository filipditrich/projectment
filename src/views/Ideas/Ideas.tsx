import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import IdeaList from "./IdeaList";

/**
 * Main Ideas View
 * @constructor
 */
export const Ideas = (props: any): ReactElement => {
	
	return (
		<>
			<header className="table-pre-header">
				<h1>Seznam námětů</h1>
				<Link
					className="button button-secondary"
					to="/ideas/create">
					<span>Nový</span>
				</Link>
			</header>
			<IdeaList />
		</>
	);
};

export default Ideas;
