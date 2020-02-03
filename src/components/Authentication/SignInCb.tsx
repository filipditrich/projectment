import { Profile, User } from "oidc-client";
import React, { useState, useEffect, ReactElement } from "react";
import { Redirect } from "react-router";
import { loader } from "../../misc";
import { RequestMethod } from "../../models";
import { useAppContext } from "../../providers";

/**
 * SignIn Callback
 * @param props
 * @constructor
 */
const SignInCb = (props: any): ReactElement => {
	const [ message, setMessage ] = useState("");
	const [ ok, setOk ] = useState(false);
	const [{ userManager }] = useAppContext();
	
	useEffect(() => {
		(async () => {
			setMessage("Waiting for user data...");
			
			const signResult: User = await userManager.signinRedirectCallback();
			const profile: Profile = signResult.profile;
			const uid: string = profile.sub;
			const accessToken: string = signResult.access_token;
			
			setMessage(`Verifying existence of "${ uid }" user...`);
			
			// TODO: de-comment after API fix
			setOk(true);
			
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
		})();
	}, [ userManager ]);
	
	return ok ? <Redirect to="/" /> : loader(<span>{ message }</span>);
};

export default SignInCb;
