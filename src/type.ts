/** Create an object with implemented math operations (by given `impl`) for given type `T` */
export function implement<T, Impl extends BaseImpl<T>>(impl: Impl): Type<T, Impl> {
    return Object.assign(impl["new"], impl);
}

/** Describes the default implementation that's required by all types */
interface BaseImpl<Type> {
    new: (...args: any[]) => Type,
    eq: (lhs: Type, rhs: Type) => boolean,
}

/** Describes the exported object that contains implemented oprations for a type (eg. `Vec2`, `Quat` etc.) */
type Type<Type, Impl extends BaseImpl<Type>> = Impl & Impl["new"];

/** A 2-dimensional vector. */
export type Vec2 = { x: number, y: number };
/** A 3-dimensional vector. */
export type Vec3 = Vec2 & { z: number };
/** A 4-dimensional vector. */
export type Vec4 = Vec3 & { w: number };

/** A 2x2 matrix */
export type Mat2 = {
    c0: Vec2,
    c1: Vec2
}
/** A 3x3 matrix */
export type Mat3 = {
    c0: Vec3,
    c1: Vec3,
    c2: Vec3
};
/** A 4x4 matrix */
export type Mat4 = {
    c0: Vec4,
    c1: Vec4,
    c2: Vec4,
    c3: Vec4
};

export type Quat = {
    x: number,
    y: number,
    z: number,
    w: number
}

export type Affine2 = {
    scale: Vec2,
    rotate: Rad,
    translate: Vec2
}

export type Affine3 = {
    scale: Vec3,
    rotate: Quat,
    translate: Vec3
}