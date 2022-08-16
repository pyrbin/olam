/** Return `target` object as readonly (freezes the object) */
export function asconst<T>(target: T) {
    return Object.freeze(target) as Readonly<T>;
}

/** Convert number as uint. */
export function asuint(target: number) {
    return target >>> 0;
}

/** Convert number as int. */
export function asint(target: number) {
    return target | 0;
}

