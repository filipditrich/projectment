import React, { ReactElement } from "react";
import { Redirect } from "react-router";
import { useAppContext } from "../../providers";

const SilentRenewCb = (props: any): ReactElement => {
	const { userManager } = useAppContext();
	(async() => await userManager.signinSilentCallback())();
	return <Redirect to="/" />;
};

export default SilentRenewCb;
