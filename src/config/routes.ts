import React, { LazyExoticComponent } from "react";
import { DefaultProps } from "../models/props";
import { IRoute } from "../models/route";

// views
const Home: LazyExoticComponent<React.FC> = React.lazy(() => import("../views/Home"));
const Ideas: LazyExoticComponent<React.FC<DefaultProps>> = React.lazy(() => import("../views/Ideas/Ideas"));
const IdeaDetail: LazyExoticComponent<React.ComponentClass> = React.lazy(() => import("../views/Ideas/Detail"));
const IdeaCreate: LazyExoticComponent<React.ComponentClass> = React.lazy(() => import("../views/Ideas/Create"));

/**
 * Protected Routes Configuration
 * @author filipditrich
 */
const routes: IRoute[] = [
	// TODO: role authentication? (API)
	
	// Home
	{
		path: "/home",
		exact: true,
		name: "Domů",
		component: Home,
		card: true,
		title: "Home Component"
	},
	// Ideas
	{
		path: "/ideas",
		exact: true,
		name: "Náměty",
		component: Ideas,
		card: false
	},
	{
		path: "/ideas/list",
		exact: true,
		name: "Seznam námětů",
		component: Ideas,
		card: false
	},
	{
		path: "/ideas/detail/:id",
		exact: true,
		name: "Detail námětu",
		component: IdeaDetail,
		card: false,
	},
	{
		path: "/ideas/create",
		exact: true,
		name: "Vytvořit námět",
		title: "Vytvořit námět",
		component: IdeaCreate,
		card: true
	}
	// Users
	// { path: "/users", exact: true, name: "Uživatelé", component: Users, card: false },
	// { path: "/users/list", exact: true, name: "Seznam uživatelů", component: Users, card: false },
];

export default routes;
