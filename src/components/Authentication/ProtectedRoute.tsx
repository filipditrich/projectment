import React, { ReactElement } from "react";
import { Redirect, Route } from "react-router";
import { useAppContext } from "../../providers";

/**
 * Protected Route
 * @param children
 * @param rest
 * @constructor
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, ...rest }: ProtectedRouteProps): ReactElement => {

	const [{ accessToken }] = useAppContext();
	console.log(useAppContext());

	return accessToken !== null
		? <Route { ...rest }>{ children }</Route>
		: <Redirect to="/unauthorized" />;
};

interface ProtectedRouteProps {
	children?: ReactElement;
	[key: string]: any;
}

export default ProtectedRoute;
