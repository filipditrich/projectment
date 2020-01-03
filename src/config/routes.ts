import React from 'react';
import { IRoute } from '../models/route';

// views
const Home = React.lazy(() => import('../views/Home'));
const Ideas = React.lazy(() => import('../views/Ideas/Ideas'));
const CreateIdea = React.lazy(() => import('../views/Ideas/IdeaCreate'));
const IdeaDetail = React.lazy(() => import('../views/Ideas/IdeaDetail'));



/**
 * Protected Routes Configuration
 * @author filipditrich
 */
const routes: IRoute[] = [
    // Home
    { path: '/home', exact: true, name: 'Domů', component: Home, card: true, title: "Home Component" },

    // Ideas
    { path: '/ideas', exact: true, name: 'Náměty', component: Ideas, card: true },
    { path: '/ideas/list', exact: true, name: 'Seznam námětů', component: Ideas, card: true },
    { path: '/ideas/list/:id', name: 'Detail námětu', component: IdeaDetail },
    { path: '/ideas/create', exact: true, name: 'Vytvořit námět', component: CreateIdea, card: true },
];

export default routes;
