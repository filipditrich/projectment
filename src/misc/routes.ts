import React from 'react';

const Home = React.lazy(() => import('../views/Home'));

/**
 * Routes Configuration
 * @author filipditrich
 */
const routes: any[] = [
    { path: '/home', exact: true, name: 'Home', component: Home },
];

export default routes;
