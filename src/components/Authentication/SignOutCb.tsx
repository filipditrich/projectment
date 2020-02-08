import React, { ReactElement } from "react";
import { Redirect } from "react-router";
import { useAppContext } from "../../providers";

/**
 * Sign Out Callback
 * @constructor
 */
export const SignOutCb: React.FC = (): ReactElement => {
	const [{ userManager }] = useAppContext();
	(async() => await userManager.signoutRedirectCallback())();
	return <Redirect to="/entry" />;
};

export default SignOutCb;
