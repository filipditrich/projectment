/**
 * Converts Enum to key: value like array of objects
 * @param enumeration
 */
export const enumToArray = (enumeration: any): Array<{ key: string | number, value: string | number }> => {
	return Object.keys(enumeration)
		.filter((key: any) => !isNaN(Number(key)))
		.map((key: any) => {
			return { key: Number(key), value: enumeration[key] };
		});
};
