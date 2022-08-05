/** Create an object with implemented math operations (by given `impl`) for given type `T` */
export function implementType<T, Impl extends BaseImpl<T>>(impl: Impl): Type_Obsolete<T, Impl> {
    return Object.assign(impl["new"], impl);
}

/** Describes the default implementation that's required by all types */
interface BaseImpl<Type> {
    new: (...args: any[]) => Type,
    eq: (lhs: Type, rhs: Type) => boolean,
    fmt: (target: Type) => string,
}

/** Describes the exported object that contains implemented oprations for a type (eg. `Vec2`, `Quat` etc.) */
type Type_Obsolete<Type, Impl extends BaseImpl<Type>> = Impl & Impl["new"];

const ignored = ["length", "name", "prototype", "constructor", "new"] as const;
const allocName = "create" as const;

interface ImplBase<T> {
    [allocName]: (...args: any[]) => T;
}

interface Impl<Type = unknown> extends ImplBase<Type>, Class { }

type NonIgnoredMethods<T> = Omit<T, typeof ignored[number]>;

type Type<T extends Impl> = NonIgnoredMethods<T> & T[typeof allocName];

export function createImpl<T extends Impl>(impl: T) {
    const methods = Object.getOwnPropertyNames(impl)
        .filter(x => !ignored.includes(x as typeof ignored[number]))
        .reduce((r, x) => {
            // @ts-ignore
            Object.assign(r, { [x]: impl[x] });
            return r;
        }, {}) as NonIgnoredMethods<T>;
    return Object.assign(methods.create, methods) as Type<T>;
}

