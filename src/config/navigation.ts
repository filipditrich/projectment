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
			name: "Náměty",
			icon: "icon-bulb",
			children: [
				{
					name: "Seznam námětů",
					url: "/ideas/list",
					icon: "icon-layers",
				},
				{
					name: "Vytvořit námět",
					url: "/ideas/create",
					icon: "icon-note",
				}
			],
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
		{
			title: true,
			name: "Uživatelé",
		},
		{
			name: "Uživatelé",
			icon: "icon-user",
			children: [
				{
					name: "Seznam uživatelů",
					url: "/users/list",
					icon: "icon-people",
				}
			],
		}
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
