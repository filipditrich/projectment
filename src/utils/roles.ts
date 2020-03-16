import { Profile } from "oidc-client";
import { UserClaim } from "../models/user";

/**
 * Role / ownership check
 * @param profile
 * @param ref
 */
export const isOwnerOrAdmin = (profile: Profile, ref?: string | number): boolean => {
	return (hasClaim(profile, UserClaim.THESES_ADMIN) || userOwnership(profile.sub, ref));
};

/**
 * Whether the logged in user has a specific UserClaim
 * @param profile
 * @param claim
 */
export const hasClaim = (profile: Profile, claim: UserClaim): boolean => {
	switch (claim) {
		case UserClaim.THESES_ADMIN: return profile.theses_admin === "1";
		case UserClaim.THESES_AUTHOR: return profile.theses_author === "1";
		case UserClaim.THESES_EVALUATOR: return profile.theses_evaluator === "1";
		case UserClaim.THESES_MANAGER: return profile.theses_manager === "1";
		case UserClaim.THESES_ROBOT: return profile.theses_robot === "1";
		default: return false;
	}
};

/**
 * User ownership check
 * @param userId
 * @param refId
 */
export const userOwnership = (userId: string | any, refId: string | any): boolean => {
	return userId?.toString() === refId?.toString();
};
