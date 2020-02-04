import React from "react";
import { Link } from "react-router-dom";
import { ErrorHandler } from "../../components";
import { DefaultProps } from "../../models/props";
import IdeaList from "./List";

/**
 * Main Ideas Component
 * @param title
 * @constructor
 */
export const Ideas: React.FC<DefaultProps> = ({ title }: DefaultProps) => (
	<ErrorHandler>
		<header className="table-pre-header">
			<h1>{ title }</h1>
			<Link
				className="button button-secondary"
				to="/ideas/create">
				<span>Nový</span>
			</Link>
		</header>
		<IdeaList />
	</ErrorHandler>
);

export default Ideas;
