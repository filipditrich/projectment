import React, { ReactElement } from "react";
import { Redirect } from "react-router";
import { useAppContext } from "../../providers";

/**
 * Silent Renew Callback
 * @constructor
 */
export const SilentRenewCb: React.FC = (): ReactElement => {
	const [{ userManager }] = useAppContext();
	(async() => await userManager.signinSilentCallback())();
	return <Redirect to="/" />;
};

export default SilentRenewCb;
