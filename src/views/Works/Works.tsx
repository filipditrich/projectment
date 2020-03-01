import React, { useState } from "react";
import { Badge } from "reactstrap";
import { ErrorHandler } from "../../components";
import { DefaultProps } from "../../models/props";
import WorkList from "./List";

/**
 * Main Works Component
 * @param title
 * @constructor
 */
export const Works: React.FC<DefaultProps> = ({ title }: DefaultProps) => {
	const [ total, setTotal ] = useState<number>(0);
	
	return (
		(
			<ErrorHandler>
				<header className="table-pre-header">
					<h1>{ title } <Badge color="secondary">{ total }</Badge></h1>
				</header>
				<WorkList />
			</ErrorHandler>
		)
	);
};

export default Works;
