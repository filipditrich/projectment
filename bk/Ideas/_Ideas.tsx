import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import _IdeaList from "./IdeaList";

/**
 * Main Ideas View
 * @constructor
 */
export const _Ideas = (props: any): ReactElement => {
	
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
			<_IdeaList />
		</>
	);
};

export default _Ideas;
