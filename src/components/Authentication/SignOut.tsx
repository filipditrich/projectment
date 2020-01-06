import React, { ReactElement, useEffect, useState } from "react";
import { Redirect } from "react-router";
import { loader } from "../../misc";
import { useAppContext } from "../../providers";
import { fakePromise, getRandomInt } from "../../utils";

/**
 * SignOut Page
 * @constructor
 */
export default function SignOut(): ReactElement {
	const [ message, setMessage ] = useState("");
	const [ ok, setOk ] = useState(false);
	const { userManager } = useAppContext();

	useEffect(() => {
		(async () => {
			setMessage("Probíhá odhlašování uživatele...");

			// TODO: de-fake
			const signOutResult = await fakePromise(getRandomInt(500, 1500), true);
			// const signOutResult = await userManager.signoutRedirect();

			if (signOutResult)
				setOk(true);
			else setMessage("Nastala chyba při odhlašování uživatele.");
		})();
	}, [ userManager ]);

	return ok ? <Redirect to="/" /> : loader(<span>{ message }</span>);
}
