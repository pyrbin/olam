/** Epsilon */
export const epsilon = 1E-8;

/** Returns sin and cos of a number.*/
export function sincos(value: number): [sin: number, cos: number] {
    return [Math.sin(value), Math.cos(value)];
}

/** Returns the reciprocal square root of a number `1 / sqrt(x)`. */
export function rsqrt(value: number): number {
    return recip(Math.sqrt(value));
}

/** Returns the reciprocal (inverse) of a number, `1 / x`. */
export function recip(value: number): number {
    return 1 / value;
}

/** Converts degrees to radians. */
export function deg(degrees: Deg): Rad {
    return degrees * (Math.PI / 180.0);
}

/** Checks if two float numbers are equal within an epsilon. */
export function feq(lhs: number, rhs: number): boolean {
    return Math.abs(lhs - rhs) < epsilon;
}

/** Clamp a number to (min, max).*/
export function clamp(x: number, min: number, max: number): number {
    return x < min ? min : x > max ? max : x;
}

/** Linear interpolates between 2 numbers. */
export function lerp(a: number, b: number, t: number): number {
    return a * (1 - t) + b * t;
}
