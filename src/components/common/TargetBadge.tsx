import classNames from "classnames";
import React from "react";
import { Badge } from "reactstrap";
import { IIdeaTarget } from "../../models/idea";

export const TargetBadge: React.FC<TargetBadgeProps> = ({ target, onClick }: TargetBadgeProps) => {
	
	return (
		<Badge onClick={ () => { if (onClick) onClick(target); } }
		       style={{ opacity: target.inactive ? 0.4 : 1 }}
		       className={ classNames({
			       [target.classes || ""]: true,
			       "mr-2": true,
			       "bg-warning": target.id === 1 || target.id === 2,
			       "bg-danger": target.id === 3,
			       "bg-info": target.id === 4,
			       "bg-success": target.id === 5,
		       }) }>
			{ target.text }
		</Badge>
	);
};

export type TargetBadgesTarget = IIdeaTarget & { classes?: string; inactive?: boolean };
export interface TargetBadgeProps {
	target: TargetBadgesTarget;
	onClick?: (target: TargetBadgesTarget) => void;
}

export default TargetBadge;
