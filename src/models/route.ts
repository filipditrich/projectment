/**
 * Route Interface
 */
export interface IRoute {
    path: string;
    exact?: boolean;
    name?: string;
    title?: string;
    component: any;
    card?: boolean;
}
