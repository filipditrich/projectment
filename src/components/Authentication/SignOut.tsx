import React, { ReactElement, useEffect, useState } from "react";
import { Redirect } from "react-router";
import { loader } from "../../misc";
import { useAppContext } from "../../providers";

/**
 * SignOut Page
 * @constructor
 */
export const SignOut: React.FC = (): ReactElement => {
	const [ message, setMessage ] = useState("");
	const [ ok, setOk ] = useState(false);
	const [{ userManager }] = useAppContext();

	useEffect(() => {
		(async () => {
			setMessage("Probíhá odhlašování uživatele...");
			try {
				await userManager.signoutRedirect();
				setOk(true);
			} catch (error) {
				setMessage("Nastala chyba při odhlašování uživatele: " + error);
			}
		})();
	}, [ userManager ]);

	return ok ? <Redirect to="/" /> : loader(<span>{ message }</span>);
};

export default SignOut;
