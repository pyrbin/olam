/** Create an object with implemented math operations (by given `impl`) for given type `T` */
export function implementType<T, Impl extends BaseImpl<T>>(impl: Impl): Type<T, Impl> {
    return Object.assign(impl["new"], impl);
}

/** Describes the default implementation that's required by all types */
interface BaseImpl<Type> {
    new: (...args: any[]) => Type,
    eq: (lhs: Type, rhs: Type) => boolean,
    fmt: (target: Type) => string,
}

/** Describes the exported object that contains implemented oprations for a type (eg. `Vec2`, `Quat` etc.) */
type Type<Type, Impl extends BaseImpl<Type>> = Impl & Impl["new"];
