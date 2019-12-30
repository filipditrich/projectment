/**
 * Pads a string or number
 * @param {number} num
 * @param {number} width
 * @param {string | undefined} z
 * @returns {string | number} Padded number as string
 */
export default function pad(num: number, width: number, z: string | undefined): string | number {
    z = z || '0';
    const numString: string = num + '';
    return numString.length >= width ? num : new Array(width - numString.length + 1).join(z) + num;
}
