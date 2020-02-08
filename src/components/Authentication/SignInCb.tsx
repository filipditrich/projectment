import { Profile, User } from "oidc-client";
import React, { useState, useEffect, ReactElement } from "react";
import { Redirect, withRouter } from "react-router";
import { toast } from "react-toastify";
import { loader } from "../../misc";
import { useAppContext } from "../../providers";
import { History } from "history";

/**
 * SignIn Callback
 * @param props
 * @constructor
 */
export const SignInCb: React.FC<any> = ({ history }: { history: History }): ReactElement => {
	const [ message, setMessage ] = useState("");
	const [ ok, setOk ] = useState(false);
	const [{ userManager }] = useAppContext();
	
	useEffect(() => {
		(async () => {
			setMessage("Získávání uživatelských dat...");
			
			try {
				const signResult: User = await userManager.signinRedirectCallback();
				const profile: Profile = signResult.profile;
				const uid: string = profile.sub;
				const accessToken: string = signResult.access_token;
				
				// TODO: de-comment after API fix
				setOk(true);
				
				// setMessage(`Verifying existence of "${ uid }" user...`);
				// const fetchResult = await fetch(process.env.REACT_APP_API_URL + "/users/" + uid, {
				// 	method: RequestMethod.GET,
				// 	headers: {
				// 		Authorization: "Bearer " + accessToken,
				// 		"Content-Type": "application/json",
				// 	},
				// 	mode: "no-cors",
				// });
				//
				// if (fetchResult.ok) {
				// 	setMessage(`Updating records for "${ uid }" user...`);
				//
				// 	const createResult = await fetch(process.env.REACT_APP_API_URL + "/users/" + uid, {
				// 		method: RequestMethod.PUT,
				// 		headers: {
				// 			Authorization: "Bearer " + accessToken,
				// 			"Content-Type": "application/json",
				// 		},
				// 		mode: "no-cors",
				// 		body: JSON.stringify({
				// 			Id: uid,
				// 			FirstName: profile.given_name,
				// 			LastName: profile.family_name,
				// 			Gender: (profile.gender === "male") ? 0 : 1,
				// 			Email: profile.email,
				// 			CanBeAuthor: !!profile.theses_author,
				// 			CanBeEvaluator: !!profile.theses_evaluator,
				// 		}),
				// 	});
				//
				// 	if (createResult.ok)
				// 		setOk(true);
				// 	else setMessage("Error while updating user record.");
				// }
			} catch (error) {
				setOk(false);
				if (error.message !== "access_denied") {
					setMessage(error.message || error);
					toast.error(error.message || JSON.stringify(error));
				}
				history.push("/");
			}
		})();
	}, [ userManager ]);
	
	return ok ? <Redirect to="/" /> : loader(<span>{ message }</span>);
};

export default withRouter(SignInCb);
