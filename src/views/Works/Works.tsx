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
	return (
		(
			<ErrorHandler>
				<header className="table-pre-header">
					<div className="d-flex align-items-center">
						<h1>{ title }</h1>
					</div>
				</header>
				<WorkList />
			</ErrorHandler>
		)
	);
};

export default Works;
