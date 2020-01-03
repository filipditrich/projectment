/**
 * Side Navigation Menu Items
 * @author filipditrich
 */
export default {
    items: [
        {
            name: 'Domů',
            url: '/home',
            icon: 'icon-speedometer',
        },
        {
            title: true,
            name: 'Náměty',
        },
        {
            name: 'Náměty',
            icon: 'icon-bulb',
            children: [
                {
                    name: 'Seznam námětů',
                    url: '/ideas/list',
                    icon: 'icon-layers',
                },
                {
                    name: 'Vytvořit námět',
                    url: '/ideas/create',
                    icon: 'icon-note',
                }
            ],
        },
    ],
};
