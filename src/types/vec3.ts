import { epsilon, eqf, rsqrt, sincos } from "../math";
import { createType } from "../type";
import { vec2 } from "./vec2";

/** A 3-dimensional vector. */
export interface vec3 {
    x: number;
    y: number;
    z: number;
}

/** @interal */
function create(x: number = 0, y: number = x, z: number = y): vec3 {
    return { x, y, z };
}

/** Implements math operations for a 3-dimensional vector. */
export let vec3 = createType({
    /** Creates a vector. */
    new: create,
    /** Creates a vector where each element is set to `0`. */
    zero(): vec3 {
        return create(0);
    },
    /** Creates a vector where each element is set to `1`. */
    one(): vec3 {
        return create(1);
    },
    /** A unit-length vector pointing along the positive y-axis. */
    up(): vec3 {
        return create(0, 1, 0);
    },
    /** A unit-length vector pointing along the negative y-axis. */
    down(): vec3 {
        return create(0, -1, 0);
    },
    /** A unit-length vector pointing along the negative x-axis. */
    left(): vec3 {
        return create(-1, 0, 0);
    },
    /** A unit-length vector pointing along the positive x-axis. */
    right(): vec3 {
        return create(1, 0, 0);
    },
    /** A unit-length vector pointing along the negative z-axis. */
    back(): vec3 {
        return create(0, 0, -1);
    },
    /** A unit-length vector pointing along the positive z-axis. */
    forward(): vec3 {
        return create(0, 0, 1);
    },
    /** Set properties of given vector `target` */
    set(target: vec3, x: number, y: number, z: number): vec3 {
        target.x = x;
        target.y = y;
        target.z = z;
        return target;
    },
    /** Copies properies from `b` to target vector `a` */
    copy(a: vec3, b: vec3): vec3 {
        return this.set(a, b.x, b.y, b.z);
    },
    /** Create a vector from an array-like. */
    fromArray(array: ArrayLike<number>, out = create()): vec3 {
        return this.set(out, array[0] as number, array[1] as number, array[2] as number);
    },
    /** Returns each elemnt of `target` as an array. */
    toArray(target: vec3): [x: number, y: number, z: number] {
        return [target.x, target.y, target.z];
    },
    /** Returns `x` and `y` components as a 2-dim vector. */
    xy(target: vec3, out = vec2()): vec2 {
        return vec2.set(out, target.x, target.y);
    },
    /** Returns `x` and `y` components as a 2-dim vector. */
    trunc(target: vec3, out = vec2()): vec2 {
        return this.xy(target, out);
    },
    /** Returns `y` and `z` components as a 2-dim vector. */
    yz(target: vec3, out = vec2()): vec2 {
        return vec2.set(out, target.y, target.z);
    },
    /** Returns `x` and `z` components as a 2-dim vector. */
    xz(target: vec3, out = vec2()): vec2 {
        return vec2.set(out, target.x, target.z);
    },
    /** Returns given `target` vector with `z` component set to zero. */
    xy0(target: vec3, out = create()): vec3 {
        return this.set(out, target.x, target.y, 0);
    },
    /** Returns true if each element of `target` is finite. */
    isFinite(target: vec3): boolean {
        return isFinite(target.x) && isFinite(target.y) && isFinite(target.z);
    },
    /** Returns true if any element of `target` is NaN. */
    isNan(target: vec3): boolean {
        return isNaN(target.x) || isNaN(target.y) || isNaN(target.z);
    },
    /** Returns true if given vector is normalized. */
    isNormalized(target: vec3): boolean {
        return Math.abs(this.len2(target) - 1) <= epsilon;
    },
    /** Adds two vectors `lhs` and `rhs`. */
    add(lhs: vec3, rhs: vec3, out = create()): vec3 {
        return this.set(out, lhs.x + rhs.x, lhs.y + rhs.y, lhs.z + rhs.z);
    },
    /** Substracts two vectors `lhs` and `rhs`. */
    sub(lhs: vec3, rhs: vec3, out = create()): vec3 {
        return this.set(out, lhs.x - rhs.x, lhs.y - rhs.y, lhs.z - rhs.z);
    },
    /** Multiplies two vectors `lhs` and `rhs`. */
    mul(lhs: vec3, rhs: vec3, out = create()): vec3 {
        return this.set(out, lhs.x * rhs.x, lhs.y * rhs.y, lhs.z * rhs.z);
    },
    /** Multiplies a vector `lhs` and a scale value `rhs`. */
    scale(target: vec3, scale: number, out = create()): vec3 {
        return this.set(out, target.x * scale, target.y * scale, target.z * scale);
    },
    /** Division between between two vectors `lhs` and `rhs`. */
    div(lhs: vec3, rhs: vec3, out = create()): vec3 {
        return this.set(out, lhs.x / rhs.x, lhs.y / rhs.y, lhs.z / rhs.z);
    },
    /** Check equality between two vectors `lhs` and `rhs`. */
    eq(lhs: vec3, rhs: vec3): boolean {
        return eqf(lhs.x, rhs.x) && eqf(lhs.y, rhs.y) && eqf(lhs.z, rhs.z);
    },
    /** Returns a vector containing the absolute value of each element of `target`. */
    abs(target: vec3, out = create()): vec3 {
        return this.set(out, Math.abs(target.x), Math.abs(target.y), Math.abs(target.z));
    },
    /** Returns a vector containing the negative value of each element of `target`. */
    neg(target: vec3, out = create()): vec3 {
        return this.set(out, -target.x, -target.y, -target.z);
    },
    /** Returns a vector containing the inverse value of each element of `target`. */
    inv(target: vec3, out = create()): vec3 {
        return this.set(out, 1 / target.x, 1 / target.y, 1 / target.z);
    },
    /** Returns a vector that is equal to `target` rotated by 90 degrees. */
    perp(target: vec3, out = create()): vec3 {
        return this.set(out, -target.z, target.y, target.x);
    },
    /** Returns the length for given vector */
    len(target: vec3): number {
        return Math.sqrt(this.len2(target));
    },
    /** Returns the length squared for given vector. */
    len2(target: vec3): number {
        return target.x * target.x + target.y * target.y + target.z * target.z;
    },
    /** Computes `1.0 / len()` for given vector. */
    rlen(target: vec3): number {
        return rsqrt(this.len2(target));
    },
    /** Returns the euclidean distance between two vectors. */
    dist(lhs: vec3, rhs: vec3): number {
        return this.len(this.sub(lhs, rhs));
    },
    /** Returns the euclidean distance squared between two vectors. */
    dist2(lhs: vec3, rhs: vec3): number {
        return this.len2(this.sub(lhs, rhs));
    },
    /** Returns `target` as a normalized vector. */
    normalize(target: vec3, out = create()): vec3 {
        return this.scale(target, rsqrt(this.dot(target, target)), out);
    },
    /** Returns the normalized vector of `target` if possible, else `(0,0,0)`. */
    normalizeSafe(target: vec3, out = create()): vec3 {
        let rcp = this.rlen(target);
        if (rcp > 0.0 && isFinite(rcp)) {
            return this.normalize(target, out);
        }
        return this.set(out, 0, 0, 0);
    },
    /** Returns the dot product of given two vectors. */
    dot(lhs: vec3, rhs: vec3): number {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z;
    },
    /** Returns the cross product of given two vectors. */
    cross(lhs: vec3, rhs: vec3, out = create()): vec3 {
        return this.set(out,
            lhs.y * rhs.z - lhs.z * rhs.y,
            lhs.z * rhs.x - lhs.x * rhs.z,
            lhs.x * rhs.y - lhs.y * rhs.x);
    },
    /** Returns the vector projection of `lhs` onto `rhs`. */
    project(lhs: vec3, rhs: vec3, out = create()): vec3 {
        return this.scale(rhs, this.dot(lhs, rhs) / this.dot(rhs, rhs), out);
    },
    /** Returns the reflection vector, given an incident vector `lhs` and a normal vector `rhs`. */
    reflect(lhs: vec3, rhs: vec3, out = create()): vec3 {
        return this.sub(lhs, this.scale(rhs, 2 * this.dot(lhs, rhs), out));
    },
    /** Returns the angle (in radians) between the two vectors. */
    angle(lhs: vec3, rhs: vec3): number {
        return Math.acos(this.dot(lhs, rhs) / Math.sqrt((this.len2(lhs) * this.len2(rhs))));
    },
    /** Returns a vector where `target` is rotated by an angle in radians. */
    rotate(target: vec3, radians: number, out = create()): vec3 {
        let [sin, cos] = sincos(radians)
        return this.set(out,
            target.x * cos - target.y * sin,
            target.x * sin + target.y * cos,
            target.z);
    },
    /** Performs a linear interpolation between `a` and `b` based on the value `t`. */
    lerp(a: vec3, b: vec3, t: number, out = create()): vec3 {
        return this.add(a, this.scale(this.sub(b, a, out), t, out), out);
    }
});