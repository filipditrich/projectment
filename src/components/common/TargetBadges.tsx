import React, { ReactElement } from "react";
import TargetBadge, { TargetBadgesTarget } from "./TargetBadge";

/**
 * Target Badges
 * @param targets
 * @constructor
 */
export const TargetBadges: React.FC<TargetBadgesProps> = ({ targets, onClick }: TargetBadgesProps) => {
	
	return (
		<div className="badge-container">
			{
				targets.map((target: TargetBadgesTarget, i: number): ReactElement => (
					<TargetBadge target={ target } key={ i } onClick={ onClick } />
				))
			}
		</div>
	);
};

export interface TargetBadgesProps {
	targets: Array<TargetBadgesTarget>
	onClick?: (target: TargetBadgesTarget) => void;
}

export default TargetBadges;
