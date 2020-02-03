/**
 * Side Navigation Menu Items
 * @author filipditrich
 */
export default {
	// TODO: interface
	// EDIT: ? tf i meant by this?
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
