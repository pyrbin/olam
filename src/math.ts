/** Returns sin and cos of a number.*/
export function sinCos(value: number): [sin: number, cos: number] {
    return [Math.sin(value), Math.cos(value)];
}

/** Returns the reciprocal square root of a number. */
export function rsqrt(value: number): number {
    return 1 / Math.sqrt(value);
}