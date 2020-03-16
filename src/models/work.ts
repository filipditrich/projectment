import { IUser } from "./user";

/**
 * Work Interface
 */
export interface IWork extends IWorkBase, IWorkCosts, IWorkStateIn, IWorkFiles, Pick<IWorkIds, "userId"> {
	id: number;
	created: string;
	updated: string;
}

/**
 * Base Work Interface
 */
export interface IWorkBase extends Omit<IWorkIds, "userId"> {
	name: string;
	description: string;
	resources: string;
	subject: string[];
	className: string;
}

/**
 * Work Info Interface
 */
export interface IWorkInfo
	extends Omit<IWorkBase, "managerId"> {}

/**
 * Work Costs Interface
 */
export interface IWorkCosts {
	materialCosts: number;
	materialCostsProvidedBySchool: number;
	servicesCosts: number;
	servicesCostsProvidedBySchool: number;
	detailExpenditures?: string;
}

/**
 * In Work State Interface
 */
export interface IWorkStateIn {
	state: number | string;
}

/**
 * Work Files Interface
 */
export interface IWorkFiles {
	repositoryURL: string;
}

/**
 * Work Fields with Id (non-full like)
 */
export interface IWorkIds {
	userId: string;
	authorId: string;
	managerId: string;
	setId: number;
}

/**
 * Full Extended Work Interface
 */
export interface IWorkFull extends Omit<IWork, keyof (IWorkIds & IWorkCosts)>{
	user: IUser;
	author: IUser;
	manager: IUser;
	set: IWorkSet;
	outlines: IWorkOutline[];
	goals: IWorkGoal[];
}

/**
 * Work Set Interface
 */
export interface IWorkSet {
	id: number;
	name: string;
	maxGrade: number;
	active: boolean;
	year: number;
	template: number;
	requiredGoals?: number;
	requiredOutlines?: number;
	// TODO
	terms: any[];
	roles: any[];
	works: any[];
}

/**
 * Work State Interface
 */
export interface IWorkState {
	code: number;
	description: string;
}

/**
 * Work Goal Interface
 */
export interface IWorkGoal {
	id: number;
	workId: number;
	order: number;
	text: string;
}

/**
 * Work Outline Interface
 */
export interface IWorkOutline
	extends IWorkGoal {}
