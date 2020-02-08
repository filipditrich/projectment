import { UserManager } from "oidc-client";
import React, { ReactElement } from "react";
import { loader } from "../../misc";
import { useAppContext } from "../../providers";

/**
 * SignIn Page
 * @constructor
 */
export const SignIn: React.FC = (): ReactElement => {
	const [{ userManager }]: [{ userManager: UserManager }] = useAppContext();
	
	userManager.signinRedirect();
	return loader("Přihlašování...");
};

export default SignIn;
