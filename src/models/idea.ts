import { Color } from "csstype";

/**
 * Idea Interface
 */
export interface IIdea {
	// TODO
	[key: string]: any;
}

/**
 * Idea Target Interface
 */
export interface IIdeaTarget {
	id: number;
	text: string;
	color: Color | string;
	// TODO
}
