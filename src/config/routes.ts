import React, { LazyExoticComponent } from "react";
import { DefaultProps } from "../models/props";
import { IRoute } from "../models/route";

// views
const Home: LazyExoticComponent<React.FC> = React.lazy(() => import("../views/Home"));
const Ideas: LazyExoticComponent<React.FC<DefaultProps>> = React.lazy(() => import("../views/Ideas/Ideas"));
const IdeaDetail: LazyExoticComponent<React.ComponentClass> = React.lazy(() => import("../views/Ideas/Detail"));
const IdeaCreate: LazyExoticComponent<React.ComponentClass> = React.lazy(() => import("../views/Ideas/Create"));
const Works: LazyExoticComponent<React.FC<DefaultProps>> = React.lazy(() => import("../views/Works/Works"));
const WorkDetail: LazyExoticComponent<React.ComponentClass> = React.lazy(() => import("../views/Works/Detail"));
const WorkInitCreate: LazyExoticComponent<React.ComponentClass> = React.lazy(() => import("../views/Works/InitWork"));

/**
 * Routes Configuration
 */
const routes: IRoute[] = [
	// Home
	{ path: "/home", exact: true, name: "Domů", component: Home, card: true, title: "Nástěnka" },
	
	// Ideas
	{ path: "/ideas", exact: true, name: "Náměty", component: Ideas, card: false },
	{ path: "/ideas/list", exact: true, name: "Seznam námětů", component: Ideas, card: false },
	{ path: "/ideas/detail/:id", exact: true, name: "Detail námětu", component: IdeaDetail, card: false },
	{ path: "/ideas/create", exact: true, name: "Vytvořit námět", title: "Vytvořit námět", component: IdeaCreate, card: true },
	
	// Works
	{ path: "/works", exact: true, name: "Zadání", component: Works, card: false },
	{ path: "/works/list", exact: true, name: "Seznam zadání", component: Works, card: false },
	{ path: "/works/detail/:id", exact: true, name: "Detail zadání", component: WorkDetail, card: false },
	{ path: "/works/create/:id", exact: true, name: "Vytvoření zadání", component: WorkInitCreate, card: false },
];

export default routes;
