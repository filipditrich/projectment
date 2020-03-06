import { Profile } from "oidc-client";

/**
 * Role / ownership check
 * @param profile
 * @param ref
 */
export const isOwnerOrAdmin = (profile: Profile, ref?: string): boolean => {
	return !(profile.administrator || profile.sub === ref);
};
