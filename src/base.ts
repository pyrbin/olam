/** Create an object with implemented math operations (by given `impl`) for given type `T` */
export function createImpl<T extends Impl>(impl: T) {
    const methods = Object.getOwnPropertyNames(impl)
        .filter(x => !ignored.includes(x as typeof ignored[number]))
        .reduce((r, x) => {
            // @ts-ignore
            Object.assign(r, { [x]: impl[x] });
            return r;
        }, {}) as Omit<T, typeof ignored[number]>;
    return Object.assign(methods.create, methods) as TypeImpl<T>;
}

const ignored = ["length", "name", "prototype", "constructor", "new"] as const;
const create = "create" as const;

export const Static = null;

/** Describes the default implementation that's required by all type implementations */
interface ImplBase<T> {
    [create]: (...args: any[]) => T;
}

/** Describes the required interface for a type implementation */
interface Impl<Type = unknown> extends ImplBase<Type>, Class { }

/** Describes the exported object that contains implemented oprations for a type (eg. `vec2`, `quat` etc.) */
type TypeImpl<T extends Impl> = Omit<T, typeof ignored[number]> & T[typeof create];

