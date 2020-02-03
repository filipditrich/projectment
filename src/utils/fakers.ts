/**
 * Returns a promise with provided <value> after given <delay>.
 * @param {number} delay
 * @param {*} value
 * @returns {Promise<any>}
 */
export function fakePromise(delay: number, value: any = null): Promise<any> {
	return new Promise(resolve => setTimeout(resolve, delay, value));
}
