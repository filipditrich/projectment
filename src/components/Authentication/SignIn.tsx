import { UserManager } from "oidc-client";
import React, { ReactElement } from "react";
import { loading } from "../../misc";
import { useAppContext } from "../../providers";

/**
 * SignIn Page
 * @constructor
 */
const SignIn = (): ReactElement => {
	const [{ userManager }]: [{ userManager: UserManager }] = useAppContext();
	
	userManager.signinRedirect();
	return loading("Přihlašování...");
};

export default SignIn;
