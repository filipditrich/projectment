import React from 'react';
import { IRoute } from '../models/route';

// views
const Home = React.lazy(() => import('../views/Home'));
const Ideas = React.lazy(() => import('../views/Ideas/Ideas'));
// const IdeasList = React.lazy(() => import('../views/Ideas/List'));
const CreateIdea = React.lazy(() => import('../views/Ideas/Create'));
const IdeaDetail = React.lazy(() => import('../views/Ideas/Detail'));



/**
 * Protected Routes Configuration
 * @author filipditrich
 */
const routes: IRoute[] = [
    { path: '/home', exact: true, name: 'Domů', component: Home },
    { path: '/ideas', exact: true, name: 'Náměty', component: Ideas },
    // { path: '/ideas/list', exact: true, name: 'Seznam námětů', component: IdeasList },
    { path: '/ideas/create', exact: true, name: 'Vytvořit námět', component: CreateIdea },
    { path: '/ideas/:id', name: 'Detail námětu', component: IdeaDetail },
];

export default routes;
