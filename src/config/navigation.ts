/**
 * Side Navigation Menu Items
 * @author filipditrich
 */
const navigation: INavigation = {
	items: [
		{
			name: "Domů",
			url: "/home",
			icon: "icon-speedometer",
		},
		{
			title: true,
			name: "Náměty",
		},
		{
			name: "Seznam námětů",
			url: "/ideas/list",
			icon: "icon-bulb",
		},
		{
			name: "Vytvořit námět",
			url: "/ideas/create",
			icon: "icon-note",
		},
		{
			title: true,
			name: "Zadání",
		},
		{
			name: "Seznam zadání",
			icon: "icon-briefcase",
			url: "/works/list",
		},
	]
};

export interface INavigation {
	items: INavigationItem[]
}

export interface INavigationItem {
	name: string;
	url?: string;
	icon?: string;
	title?: boolean;
	exact?: boolean;
	children?: INavigationItem[];
}


export default navigation;
