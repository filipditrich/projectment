import React from 'react';
import { Redirect, Route } from 'react-router';
import { useAppContext } from '../../providers';

export const ProtectedRoute = ({ children, ...rest }: any) => {

    // TODO: de-fake
    const accessToken = 'fake-token';
    // const { accessToken } = useAppContext();

    return accessToken !== null
        ? <Route { ...rest }>{ children }</Route>
        : <Redirect to="/unauthorized" />;
};

export default ProtectedRoute;
