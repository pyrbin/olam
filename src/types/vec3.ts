import { deg, epsilon, eqf, rsqrt, sincos } from "../math";
import * as type from "../type";
import { vec2 } from "./vec2";

export const vec3 = type.implement({
    /** Creates a 3-dimensional vector. */
    new: create,
    /** Creates a vector where each element is set to `0`. */
    zero(): Vec3 {
        return create(0);
    },
    /** Creates a vector where each element is set to `1`. */
    one(): Vec3 {
        return create(1);
    },
    /** A unit-length vector pointing along the positive y-axis. */
    up(): Vec3 {
        return create(0, 1, 0);
    },
    /** A unit-length vector pointing along the negative y-axis. */
    down(): Vec3 {
        return create(0, -1, 0);
    },
    /** A unit-length vector pointing along the negative x-axis. */
    left(): Vec3 {
        return create(-1, 0, 0);
    },
    /** A unit-length vector pointing along the positive x-axis. */
    right(): Vec3 {
        return create(1, 0, 0);
    },
    /** A unit-length vector pointing along the negative z-axis. */
    back(): Vec3 {
        return create(0, 0, -1);
    },
    /** A unit-length vector pointing along the positive z-axis. */
    forward(): Vec3 {
        return create(0, 0, 1);
    },
    /** Set properties of given vector `target` */
    set<T extends type.Vec3>(target: T, x: number, y: number, z: number): T {
        target.x = x;
        target.y = y;
        target.z = z;
        return target;
    },
    /** Copy properies from `b` to target vector `a` */
    copy<T extends type.Vec3>(a: T, b: type.Vec3): T {
        return this.set(a, b.x, b.y, b.z);
    },
    /** Returns a string representation  */
    fmt(target: type.Vec3) {
        return `(${target.x}, ${target.y}, ${target.z})`;
    },
    /** Create a vector from an array-like. */
    fromArray<T extends type.Vec3>(array: ArrayLike<number>, out?: T): T {
        return this.set(out ?? create() ?? create(), array[0] as number, array[1] as number, array[2] as number) as T;
    },
    /** Returns each elemnt of `target` as an array. */
    toArray(target: type.Vec3): [x: number, y: number, z: number] {
        return [target.x, target.y, target.z];
    },
    /** Returns `x` and `y` components as a 2-dim vector. */
    xy<T extends type.Vec2>(target: type.Vec3, out?: T): T {
        return vec2.set(out ?? create() ?? vec2(), target.x, target.y) as T;
    },
    /** Returns `x` and `y` components as a 2-dim vector. */
    trunc<T extends type.Vec2>(target: type.Vec3, out?: T): T {
        return this.xy(target, out ?? vec2()) as T;
    },
    /** Returns `y` and `z` components as a 2-dim vector. */
    yz<T extends type.Vec2>(target: type.Vec3, out?: T): T {
        return vec2.set(out ?? create() ?? vec2(), target.y, target.z) as T;
    },
    /** Returns `x` and `z` components as a 2-dim vector. */
    xz<T extends type.Vec2>(target: type.Vec3, out?: T): T {
        return vec2.set(out ?? create() ?? vec2(), target.x, target.z) as T;
    },
    /** Returns given `target` vector with `z` component set to zero. */
    xy0<T extends type.Vec3>(target: type.Vec3, out?: T): T {
        return this.set(out ?? create() ?? create(), target.x, target.y, 0) as T;
    },
    /** Returns true if each element of `target` is finite. */
    isFinite(target: type.Vec3): boolean {
        return isFinite(target.x) && isFinite(target.y) && isFinite(target.z);
    },
    /** Returns true if any element of `target` is NaN. */
    isNan(target: type.Vec3): boolean {
        return isNaN(target.x) || isNaN(target.y) || isNaN(target.z);
    },
    /** Returns true if given vector is normalized. */
    isNormalized(target: type.Vec3): boolean {
        return Math.abs(this.len2(target) - 1) <= epsilon;
    },
    /** Adds two vectors `lhs` and `rhs`. */
    add<T extends type.Vec3>(lhs: type.Vec3, rhs: type.Vec3, out?: T): T {
        return this.set(out ?? create(), lhs.x + rhs.x, lhs.y + rhs.y, lhs.z + rhs.z) as T;
    },
    /** Subtracts two vectors `lhs` and `rhs`. */
    sub<T extends type.Vec3>(lhs: type.Vec3, rhs: type.Vec3, out?: T): T {
        return this.set(out ?? create(), lhs.x - rhs.x, lhs.y - rhs.y, lhs.z - rhs.z) as T;
    },
    /** Multiplies two vectors `lhs` and `rhs`. */
    mul<T extends type.Vec3>(lhs: type.Vec3, rhs: type.Vec3, out?: T): T {
        return this.set(out ?? create(), lhs.x * rhs.x, lhs.y * rhs.y, lhs.z * rhs.z) as T;
    },
    /** Multiplies a vector `lhs` and a scale value `rhs`. */
    scale<T extends type.Vec3>(target: type.Vec3, scale: number, out?: T): T {
        return this.set(out ?? create(), target.x * scale, target.y * scale, target.z * scale) as T;
    },
    /** Division between between two vectors `lhs` and `rhs`. */
    div<T extends type.Vec3>(lhs: type.Vec3, rhs: type.Vec3, out?: T): T {
        return this.set(out ?? create(), lhs.x / rhs.x, lhs.y / rhs.y, lhs.z / rhs.z) as T;
    },
    /** Check equality between two vectors `lhs` and `rhs`. */
    eq(lhs: type.Vec3, rhs: type.Vec3): boolean {
        return eqf(lhs.x, rhs.x) && eqf(lhs.y, rhs.y) && eqf(lhs.z, rhs.z);
    },
    /** Returns a vector containing the absolute value of each element of `target`. */
    abs<T extends type.Vec3>(target: type.Vec3, out?: T): T {
        return this.set(out ?? create(), Math.abs(target.x), Math.abs(target.y), Math.abs(target.z)) as T;
    },
    /** Returns a vector containing the negative value of each element of `target`. */
    neg<T extends type.Vec3>(target: type.Vec3, out?: T): T {
        return this.set(out ?? create(), -target.x, -target.y, -target.z) as T;
    },
    /** Returns a vector containing the inverse value of each element of `target`. */
    inv<T extends type.Vec3>(target: type.Vec3, out?: T): T {
        return this.set(out ?? create(), 1 / target.x, 1 / target.y, 1 / target.z) as T;
    },
    /** Returns a vector that is equal to `target` rotated by 90 degrees. */
    perp<T extends type.Vec3>(target: type.Vec3, out?: T): T {
        return this.rotate(target, deg(90), out ?? create()) as T;
    },
    /** Returns the length for given vector */
    len(target: type.Vec3): number {
        return Math.sqrt(this.len2(target));
    },
    /** Returns the length squared for given vector. */
    len2(target: type.Vec3): number {
        return target.x * target.x + target.y * target.y + target.z * target.z;
    },
    /** Computes `1.0 / len()` for given vector. */
    rlen(target: type.Vec3): number {
        return rsqrt(this.len2(target));
    },
    /** Returns the euclidean distance between two vectors. */
    dist(lhs: type.Vec3, rhs: type.Vec3): number {
        return this.len(this.sub(lhs, rhs));
    },
    /** Returns the euclidean distance squared between two vectors. */
    dist2(lhs: type.Vec3, rhs: type.Vec3): number {
        return this.len2(this.sub(lhs, rhs));
    },
    /** Returns `target` as a normalized vector. */
    normalize<T extends type.Vec3>(target: type.Vec3, out?: T): T {
        return this.scale(target, rsqrt(this.dot(target, target)), out ?? create()) as T;
    },
    /** Returns the normalized vector of `target` if possible, else `(0,0,0)`. */
    normalizeSafe<T extends type.Vec3>(target: type.Vec3, out?: T): T {
        let rcp = this.rlen(target);
        if (rcp > 0.0 && isFinite(rcp)) {
            return this.normalize(target, out ?? create()) as T;
        }
        return this.set(out ?? create(), 0, 0, 0) as T;
    },
    /** Returns the dot product of given two vectors. */
    dot(lhs: type.Vec3, rhs: type.Vec3): number {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z;
    },
    /** Returns the cross product of given two vectors. */
    cross<T extends type.Vec3>(lhs: type.Vec3, rhs: type.Vec3, out?: T): T {
        return this.set(out ?? create(),
            lhs.y * rhs.z - lhs.z * rhs.y,
            lhs.z * rhs.x - lhs.x * rhs.z,
            lhs.x * rhs.y - lhs.y * rhs.x) as T;
    },
    /** Returns the vector projection of `lhs` onto `rhs`. */
    project<T extends type.Vec3>(lhs: type.Vec3, rhs: type.Vec3, out?: T): T {
        return this.scale(rhs, this.dot(lhs, rhs) / this.dot(rhs, rhs), out ?? create()) as T;
    },
    /** Returns the reflection vector, given an incident vector `lhs` and a normal vector `rhs`. */
    reflect<T extends type.Vec3>(lhs: type.Vec3, rhs: type.Vec3, out?: T): T {
        return this.sub(lhs, this.scale(rhs, 2 * this.dot(lhs, rhs), out ?? create()));
    },
    /** Returns the angle (in radians) between the two vectors. */
    angle(lhs: type.Vec3, rhs: type.Vec3): number {
        return Math.acos(this.dot(lhs, rhs) / Math.sqrt((this.len2(lhs) * this.len2(rhs))));
    },
    /** Returns a vector where `target` is rotated by an angle in radians. */
    rotate<T extends type.Vec3>(target: type.Vec3, radians: number, out?: T): T {
        let [sin, cos] = sincos(radians)
        return this.set(out ?? create(),
            target.x * cos - target.y * sin,
            target.x * sin + target.y * cos,
            target.z) as T;
    },
    /** Performs a linear interpolation between `a` and `b` based on the value `t`. */
    lerp<T extends type.Vec3>(a: type.Vec3, b: type.Vec3, t: number, out?: T): T {
        return this.add(a, this.scale(this.sub(b, a, v1), t, v1), out ?? create()) as T;
    }
});

/** A 3-dimensional vector. */
export class Vec3 implements type.Vec3 {
    x: number;
    y: number;
    z: number;
    /** Creates a 3-dimensional vector. */
    constructor(x: number = 0, y: number = x, z: number = y) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    /** Set properties of this vector */
    set(x: number, y: number, z: number): Vec3 {
        return vec3.set(this, x, y, z) as Vec3;
    }
    /** Copy properies from `src` */
    copy(src: type.Vec3): Vec3 {
        return vec3.copy(this, src) as Vec3;
    }
    /** Returns a string representation  */
    toString() {
        return vec3.fmt(this);
    }
    /** Returns each elemnt as an array. */
    toArray(): [x: number, y: number, z: number] {
        return vec3.toArray(this);
    }
    /** Returns `x` and `y` components as a 2-dim vector. */
    xy<T extends type.Vec2>(out?: T): T {
        return vec2.set(out ?? this, this.x, this.y) as T;
    }
    /** Returns `x` and `y` components as a 2-dim vector. */
    trunc<T extends type.Vec2>(out?: T): T {
        return vec3.xy(this, out ?? this) as T;
    }
    /** Returns `y` and `z` components as a 2-dim vector. */
    yz<T extends type.Vec2>(out?: T): T {
        return vec2.set(out ?? this, this.y, this.z) as T;
    }
    /** Returns `x` and `z` components as a 2-dim vector. */
    xz<T extends type.Vec2>(out?: T): T {
        return vec2.set(out ?? this, this.x, this.z) as T;
    }
    /** Returns vector with `z` component set to zero. */
    xy0<T extends type.Vec3>(out?: T): T {
        return vec3.set(out ?? this, this.x, this.y, 0) as T;
    }
    /** Returns true if each element is finite. */
    isFinite(): boolean {
        return vec3.isFinite(this);
    }
    /** Returns true if any element is NaN. */
    isNan(): boolean {
        return vec3.isNan(this);
    }
    /** Returns true if `this` is normalized. */
    isNormalized(): boolean {
        return vec3.isNormalized(this);
    }
    /** Adds `rhs` to `target`. */
    add(rhs: type.Vec3): Vec3 {
        return vec3.add(this, rhs) as Vec3;
    }
    /** Subtracts `rhs` from `this`. */
    sub(rhs: type.Vec3): Vec3 {
        return vec3.sub(this, rhs) as Vec3;
    }
    /** Multiplies the vector by a scalar. */
    mul(rhs: type.Vec3): Vec3 {
        return vec3.mul(this, rhs) as Vec3;
    }
    /** Scales the vector by `rhs`. */
    scale(scale: number): Vec3 {
        return vec3.scale(this, scale) as Vec3;
    }
    /** Divides `this` by `rhs`. */
    div(rhs: type.Vec3): Vec3 {
        return vec3.div(this, rhs) as Vec3;
    }
    /** Check equality between `this` and `rhs`. */
    eq(rhs: type.Vec3): boolean {
        return vec3.eq(this, rhs);
    }
    /** Set vector to absolute values. */
    abs(): Vec3 {
        return vec3.abs(this) as Vec3;
    }
    /** Negates the vector.*/
    neg(): Vec3 {
        return vec3.neg(this) as Vec3;
    }
    /** Inverse vector */
    inv(): Vec3 {
        return vec3.inv(this) as Vec3;
    }
    /** Rotate vector by 90 degrees */
    perp(): Vec3 {
        return vec3.perp(this) as Vec3;
    }
    /** Returns the length. */
    len(): number {
        return vec3.len(this);
    }
    /** Returns the length squared. */
    len2(): number {
        return vec3.len2(this);
    }
    /** Computes `1.0 / len()`. */
    rlen(): number {
        return vec3.rlen(this);
    }
    /** Returns the dot product of of `this` & `rhs`. */
    dist(rhs: type.Vec3): number {
        return vec3.dist(this, rhs);
    }
    /** Returns the cross product of `this` & `rhs`. */
    dist2(rhs: type.Vec3): number {
        return vec3.dist2(this, rhs);
    }
    /** Normalizes the vector. */
    normalize(): Vec3 {
        return vec3.normalize(this) as Vec3;
    }
    /** Safely normalizes `this` if possible, else `(0,0)`. */
    normalizeSafe(): Vec3 {
        return vec3.normalizeSafe(this) as Vec3;
    }
    /** Dot product of `this` & `rhs`. */
    dot(rhs: type.Vec3): number {
        return vec3.dot(this, rhs);
    }
    /** Cross product of `this` & `rhs`. */
    cross(rhs: type.Vec3): Vec3 {
        return vec3.cross(this, rhs) as Vec3;
    }
    /** Project `this` onto `rhs`. */
    project(rhs: type.Vec3): Vec3 {
        return vec3.project(this, rhs) as Vec3;
    }
    /** Computes the reflection vector, given an incident vector `this` and a normal vector `rhs`. */
    reflect(rhs: type.Vec3): Vec3 {
        return vec3.reflect(this, rhs) as Vec3;
    }
    /** Returns the angle (in radians) between `this` and `rhs`. */
    angle(rhs: type.Vec3): number {
        return vec3.angle(this, rhs);
    }
    /** Rotate by an angle in radians. */
    rotate(radians: number): Vec3 {
        return vec3.rotate(this, radians) as Vec3;
    }
    /** Performs a linear interpolation between `this` and `target` based on the value `t`. */
    lerp(target: type.Vec3, t: number): Vec3 {
        return vec3.lerp(this, target, t) as Vec3;
    }
}

/** @interal */
function create(x: number = 0, y: number = x, z: number = y): Vec3 {
    return new Vec3(x, y, z);
}

/** @internal */
let v1 = vec3(0, 0, 0);