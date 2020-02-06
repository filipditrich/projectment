/**
 * Initial Idea Interface
 */
export interface IIdeaInit {
	name: string;
	description: string;
	resources: string;
	subject: string;
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
	targets: IIdeaTarget[];
	updated: Date | string;
}

/**
 * Idea Target Interface
 */
export interface IIdeaTarget {
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
	ideaId: number;
	order: number;
	text: string;
}

/**
 * Idea Outline Interface
 */
export interface IIdeaOutline
	extends IIdeaGoal {}
