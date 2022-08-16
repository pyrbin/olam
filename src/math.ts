/** Epsilon */
export let epsilon = 1E-8;

/** Epsilon squared */
export let epsilon2 = epsilon * epsilon;

/** Return sin and cos of a number.*/
export function sincos(value: number): [sin: number, cos: number] {
    return [Math.sin(value), Math.cos(value)];
}

/** Returns the value of a base expression taken to a specified power. */
export function pow(value: number, power: number): number {
    return value ** power;
}

/** Returns the square root of a number. */
export const sqrt: (value: number) => number = (() => {
    const max = 300_000;
    function benchPow() {
        let r = .5;
        for (let i = 1; i <= max; ++i) r *= 1. / pow(r, .5);
        return r;
    }
    function benchSqrt() {
        let r = .5;
        for (let i = 1; i <= max; ++i) r *= 1. / Math.sqrt(r);
        return r;
    }
    let startTS = Date.now()
    let r = benchPow()
    let endPow = Date.now() - startTS
    startTS = Date.now()
    r = benchSqrt()
    let endSqrt = Date.now() - startTS
    let sqrt = endSqrt < endPow ? Math.sqrt : (value: number) => pow(value, .5);
    return sqrt
})();

/** Return the reciprocal square root of a number `1 / sqrt(x)`. */
export function rsqrt(value: number): number {
    return recip(sqrt(value));
}

/** Return the reciprocal (inverse) of a number, `1 / x`. */
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
