/** Describes the default implementation that's required by all types */
interface BaseImpl<Struct> {
    new: (...args: any[]) => Struct,
    eq: (lhs: Struct, rhs: Struct) => boolean
    isFinite: (self: Struct) => boolean
    isNan: (self: Struct) => boolean
}

/** Describes the exported object that contains implemented oprations for a type (eg. `vec2`, `quat` etc.) */
type Type<Struct, Impl extends BaseImpl<Struct>> = Impl & Impl["new"];

/** Create an object with implemented math operations (by given `impl`) for given type `Struct` */
export function createType<Struct, Impl extends BaseImpl<Struct>>(impl: Impl): Type<Struct, Impl> {
    return Object.assign(impl["new"], impl);
}