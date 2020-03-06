/**
 * Initial Work Interface
 */
export interface IWorkInit {
	name: string;
	description: string;
	resources: string;
	subject: string | string[];
}

/**
 * Work Interface
 */
export interface IWork extends IWorkInit {
	authorId: string;
	managerId: string;
	setId: string;
	className: string;
}

/**
 * Full Work Interface
 */
export interface IWorkFull extends IWork {
	id: number;
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
	// TODO
	terms: any[];
	roles: any[];
	works: any[];
	requiredGoals?: number;
	requiredOutlines?: number;
}
