import { IIdea } from "../models/idea";
import { IWork } from "../models/work";

type Transformee = IWork | IIdea;

/**
 * Transforms the input to the correct format for Backend
 * @param input
 */
export const transformForAPI = (input: Transformee | any): {[key in keyof Transformee]: any} => {
	return {
		...input,
		subject: input.subject.join(", "),
	};
};

/**
 * Transforms the input to the correct format for Frontend
 * @param input
 * @param id
 */
export function transformFromAPI<T>(input: {[key in keyof (T & Transformee)]: any}, id?: string | number): {[key in keyof (T & Transformee)]: (T & Transformee)[key]} {
	return {
		...input,
		id: Number(id),
		subject: input.subject.split(", "),
	};
}
