import { History } from "history";
import React from "react";
import { withRouter } from "react-router";

/**
 * Work Detail Component
 * @constructor
 */
export const WorkDetail: React.FC<WorkDetailProps> = ({ history }: WorkDetailProps) => {
	return (<></>);
};

export interface WorkDetailProps {
	history: History;
}

export default withRouter(WorkDetail);
