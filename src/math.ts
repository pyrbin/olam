/** Returns sin and cos of a number.*/
export function sincos(value: number): [sin: number, cos: number] {
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

/** Converts degrees to radians. */
export function rad(degrees: number): number {
    return degrees * Math.PI / 180;
}

/** Converts radians to degrees. */
export function deg(radian: number): number {
    return radian * 180 / Math.PI;
}

/** Epsilon */
export const epsilon = 1E-12;