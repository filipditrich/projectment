import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { loader } from '../../misc';
import { RequestMethod } from '../../models';
import { fakePromise, getRandomInt } from '../../utils';
import { useAppContext } from '../../providers';

/**
 * SignIn Callback
 * @param props
 * @constructor
 */
const SignInCb = (props: any): any => {
    const [ message, setMessage ] = useState("");
    const [ ok, setOk ] = useState(false);
    const { userManager } = useAppContext();

    useEffect(() => {
        (async () => {
            setMessage("Waiting for user data...");

            // TODO: de-fake
            const signResult = await fakePromise(getRandomInt(500, 1500), {
                profile: {
                    sub: 'fake-uid',
                },
                access_token: 'fake-access_token',
            });
            // const signResult = await userManager.signinRedirectCallback();

            let profile = signResult.profile;
            let uid = profile.sub;
            let accessToken = signResult.access_token;

            setMessage(`Verifying existence of "${uid}" user...`);

            // TODO: de-fake
            const fetchResult = await fakePromise(getRandomInt(500, 2000), {
                ok: true,
            });
            // const fetchResult = await fetch(process.env.REACT_APP_API_URL + "/users/" + uid, {
            //     method: "GET",
            //     headers: {
            //         Authorization: "Bearer " + accessToken,
            //         "Content-Type": "application/json"
            //     }
            // });

            if (fetchResult.ok) {
                setMessage(`Updating records for "${uid}" user...`);

                // TODO: de-fake
                const createResult = await fakePromise(getRandomInt(500, 2000), {
                    ok: true,
                });
                // const createResult = await fetch(process.env.REACT_APP_API_URL + "/users/" + uid, {
                //     method: RequestMethod.PUT,
                //     headers: {
                //         Authorization: "Bearer " + accessToken,
                //         "Content-Type": "application/json"
                //     },
                //     body: JSON.stringify({
                //         Id: uid,
                //         FirstName: profile.given_name,
                //         LastName: profile.family_name,
                //         Gender: (profile.gender === "male") ? 0 : 1,
                //         Email: profile.email,
                //         CanBeAuthor: !!profile.student,
                //         CanBeEvaluator: !!profile.evaluator
                //     })
                // });

                // random true/false
                if (createResult.ok)
                    setOk(true);
                else setMessage("Error while updating user record.");
            }
        })();
    }, [ userManager ]);

    return ok ? <Redirect to="/" /> : loader(<span>{ message }</span>);
};

export default SignInCb;
