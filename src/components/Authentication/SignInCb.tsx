import { Profile, User } from "oidc-client";
import React, { useState, useEffect, ReactElement } from "react";
import { Redirect, withRouter } from "react-router";
import { toast } from "react-toastify";
import { loader } from "../../misc";
import { useAppContext } from "../../providers";
import { History } from "history";
import { AxiosResponse } from "axios";
import { Axios, isStatusOk } from "../../utils";

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
				
				// get user
				setMessage("Ověřování existence uživatele...");
				try {
					const userRes: AxiosResponse = await Axios(accessToken).get("/users/" + uid);
					if (isStatusOk(userRes)) {
						// update user
						setMessage("Aktualizace uživatelského záznamu...");
						const updateUserRes = await Axios(accessToken).put("/users/" + uid, {
							Id: uid,
							FirstName: profile.given_name,
							LastName: profile.family_name,
							Gender: (profile.gender === "male") ? 0 : 1,
							Email: profile.email,
							CanBeAuthor: !!(profile.theses_author),
							CanBeEvaluator: !!(profile.theses_evaluator)
						});
						
						if (isStatusOk(updateUserRes)) {
							setOk(true);
						} else throw new Error("Došlo k chybě při aktualizaci uživatelského záznamu.");
					} else throw userRes;
				} catch (error) {
					// create user (first login)
					setMessage("Vytváření záznamu uživatele...");
					const createUserRes = await Axios(accessToken).post("/users", {
						Id: uid,
						FirstName: profile.given_name,
						LastName: profile.family_name,
						Gender: (profile.gender === "male") ? 0 : 1,
						Email: profile.email,
						CanBeAuthor: !!(profile.theses_author),
						CanBeEvaluator: !!(profile.theses_evaluator)
					});
					
					if (isStatusOk(createUserRes)) {
						setOk(true);
					} else throw new Error("Došlo k chybě při vytváření uživatele.");
				}
			} catch (error) {
				setOk(false);
				// sign in cancelled
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
