/** Returns sin and cos of a number.*/
export function sinCos(value: number): [sin: number, cos: number] {
    return [Math.sin(value), Math.cos(value)];
}

/** Returns the reciprocal square root of a number `1/sqrt(x)`. */
export function rsqrt(value: number): number {
    return recip(Math.sqrt(value));
}

/** Returns the reciprocal (inverse) of a number, `1/x`. */
export function recip(value: number): number {
    return 1 / value;
}