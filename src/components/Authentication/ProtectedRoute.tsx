import React, { ReactElement } from "react";
import { Redirect, Route } from "react-router";
import { useAppContext } from "../../providers";

/**
 * Protected Route
 * @param children
 * @param rest
 * @constructor
 */
export const ProtectedRoute = ({ children, ...rest }: { children?: ReactElement<any> | any, [key: string]: any }): ReactElement => {

	// TODO: de-fake
	const accessToken = "fake-token";
	// const { accessToken } = useAppContext();

	return accessToken !== null
		? <Route { ...rest }>{ children }</Route>
		: <Redirect to="/unauthorized" />;
};

export default ProtectedRoute;
