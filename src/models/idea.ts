/**
 * Initial Idea Interface
 */
export interface IIdeaInit {
	name: string;
	description: string;
	resources: string;
	subject: string[];
	participants: number;
	offered: boolean;
}

/**
 * Full Idea Interface
 */
export interface IIdea extends IIdeaInit {
	id: number;
	userId: string;
	userFirstName: string;
	userLastName: string;
	userEmail: string;
	targets: ITarget[];
	updated: Date | string;
}

/**
 * Idea Info Interface
 */
export interface IIdeaInfo
	extends IIdeaInit, Pick<IIdea, "targets"> {}

/**
 * Idea Target Interface
 */
export interface ITarget {
	id: number;
	text: string;
	color: {
		r: number;
		g: number;
		b: number;
		a: number;
		isKnownColor: boolean;
		isEmpty: boolean;
		isNamedColor: boolean;
		isSystemColor: boolean;
		name: string;
	};
}

/**
 * Idea Goal Interface
 */
export interface IIdeaGoal {
	id: number;
	ideaId: number;
	order: number;
	text: string;
}

/**
 * Idea Outline Interface
 */
export interface IIdeaOutline
	extends IIdeaGoal {}
