import React from "react";
import { CardBody, CardHeader } from "reactstrap";
import { IWork, IWorkState } from "../../../models/work";

/**
 * TODO
 * Work Roles Component
 * @param work
 * @param state
 * @param fetcher
 * @constructor
 */
export const WorkRoles: React.FC<WorkRolesProps> = ({ work, state, fetcher }: WorkRolesProps) => {
	return (
		<>
			<CardHeader>Role</CardHeader>
			<CardBody>
				<p className="text-muted">Pro zhodnocení práce je potřeba přidat role</p>
				...TODO
			</CardBody>
		</>
	);
};

export interface WorkRolesProps {
	work?: IWork;
	state?: IWorkState;
	fetcher: () => void;
}

export default WorkRoles;
