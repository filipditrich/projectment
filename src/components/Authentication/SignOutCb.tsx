import React from 'react';
import { Redirect } from 'react-router';
import { useAppContext } from '../../providers';

const SignOutCb = (props: any) => {
    const { userManager } = useAppContext();
    (async() => await userManager.signoutRedirectCallback())();
    return <Redirect to="/" />;
};

export default SignOutCb;
