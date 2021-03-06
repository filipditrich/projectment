import classNames from "classnames";
import React from "react";
import { Badge } from "reactstrap";
import { ITarget } from "../../models/idea";

export const TargetBadge: React.FC<TargetBadgeProps> = ({ target, onClick }: TargetBadgeProps) => {
	
	return (
		<Badge onClick={ () => { if (onClick) onClick(target); } }
		       style={{ opacity: target.inactive ? 0.4 : 1 }}
		       className={ classNames({
			       "bg-warning": target.id === 1 || target.id === 2,
			       "bg-danger": target.id === 3,
			       "bg-info": target.id === 4,
			       "bg-success": target.id === 5,
			       [target.classes || ""]: true,
		       }) }>
			{ target.text }
		</Badge>
	);
};

export type TargetBadgesTarget = ITarget & { classes?: string; inactive?: boolean };
export interface TargetBadgeProps {
	target: TargetBadgesTarget;
	onClick?: (target: TargetBadgesTarget) => void;
}

export default TargetBadge;
