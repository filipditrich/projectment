import React, { ReactElement } from "react";
import { Redirect } from "react-router";
import { useAppContext } from "../../providers";

const SignOutCb = (props: any): ReactElement => {
	const [{ userManager }] = useAppContext();
	(async() => await userManager.signoutRedirectCallback())();
	return <Redirect to="/" />;
};

export default SignOutCb;
