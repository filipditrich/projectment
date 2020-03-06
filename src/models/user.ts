import Gender from "./gender";

/**
 * User Interface
 */
export interface IUser {
	id: any;
	firstName: string;
	lastName: string;
	gender: Gender;
	email: string;
	canBeAuthor: boolean;
	canBeEvaluator: boolean;
	name?: string;
}
