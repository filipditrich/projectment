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

export function isTouchDevice(): boolean {
	try {
		let prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
		
		let mq = function(query: any) {
			return window.matchMedia(query).matches;
		};
		
		if (("ontouchstart" in window) || (typeof (window as any).DocumentTouch !== "undefined" && document instanceof (window as any).DocumentTouch)) {
			return true;
		}
		
		return mq([ "(", prefixes.join("touch-enabled),("), "heartz", ")" ].join(""));
	} catch (e) {
		console.error("(Touch detect failed)", e);
		return false;
	}
}
