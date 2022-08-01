import { epsilon, eqf, recip, sincos } from "../math";
import { createType } from "../type";
import { vec3 } from "./vec3";

/** A 2-dimensional vector. */
export interface vec2 {
    x: number;
    y: number;
}

/** @internal */
function create(x: number = 0, y: number = x): vec2 {
    return { x, y };
}

/** Implements math operations for a 2-dimensional vector. */
export let vec2 = createType({
    /** Creates a vector. */
    new: create,
    /** Creates a vector where each element is set to `0`. */
    zero(): vec2 {
        return create(0);
    },
    /** Creates a vector where each element is set to `1`. */
    one(): vec2 {
        return create(1);
    },
    /** A unit-length vector pointing along the positive y-axis. */
    up(): vec2 {
        return create(0, 1);
    },
    /** A unit-length vector pointing along the negative y-axis. */
    down(): vec2 {
        return create(0, -1);
    },
    /** A unit-length vector pointing along the negative x-axis. */
    left(): vec2 {
        return create(-1, 0);
    },
    /** A unit-length vector pointing along the positive x-axis. */
    right(): vec2 {
        return create(1, 0);
    },
    /** Set properties of given vector `target` */
    set(target: vec2, x: number, y: number): vec2 {
        target.x = x;
        target.y = y;
        return target;
    },
    /** Copies properies from `b` to target vector `a` */
    copy(a: vec2, b: vec2): vec2 {
        return this.set(a, b.x, b.y);
    },
    /** Create a vector from an array-like. */
    fromArray(array: ArrayLike<number>, out = create()): vec2 {
        return this.set(out, array[0] as number, array[1] as number);
    },
    /** Returns each elemnt of `target` as an array. */
    toArray(target: vec2): [x: number, y: number] {
        return [target.x, target.y];
    },
    /** Returns `target` as a 3-dimensional vector with given `z` value. */
    extend(target: vec2, z: number = 0, out = { x: 0, y: 0, z: 0 }): vec3 {
        return vec3.set(out, target.x, target.y, z);
    },
    /** Returns true if each element of `target` is finite. */
    isFinite(target: vec2): boolean {
        return isFinite(target.x) && isFinite(target.y);
    },
    /** Returns true if any element of `target` is NaN. */
    isNan(target: vec2): boolean {
        return isNaN(target.x) || isNaN(target.y);
    },
    /** Returns true if given vector is normalized. */
    isNormalized(target: vec2): boolean {
        return Math.abs(this.len2(target) - 1) <= epsilon;
    },
    /** Adds two vectors `lhs` and `rhs`. */
    add(lhs: vec2, rhs: vec2, out = create()): vec2 {
        return this.set(out, lhs.x + rhs.x, lhs.y + rhs.y);
    },
    /** Substracts two vectors `lhs` and `rhs`. */
    sub(lhs: vec2, rhs: vec2, out = create()): vec2 {
        return this.set(out, lhs.x - rhs.x, lhs.y - rhs.y);
    },
    /** Multiplies two vectors `lhs` and `rhs`. */
    mul(lhs: vec2, rhs: vec2, out = create()): vec2 {
        return this.set(out, lhs.x * rhs.x, lhs.y * rhs.y);
    },
    /** Multiplies a vector `lhs` and a scale value `rhs`. */
    scale(lhs: vec2, rhs: number, out = create()): vec2 {
        return this.set(out, lhs.x * rhs, lhs.y * rhs);
    },
    /** Division between two vectors `lhs` and `rhs`. */
    div(lhs: vec2, rhs: vec2, out = create()): vec2 {
        return this.set(out, lhs.x / rhs.x, lhs.y / rhs.y);
    },
    /** Check equality between two vectors `lhs` and `rhs`. */
    eq(lhs: vec2, rhs: vec2): boolean {
        return eqf(lhs.x, rhs.x) && eqf(lhs.y, rhs.y);
    },
    /** Returns a vector containing the absolute value of each element of `target`. */
    abs(target: vec2, out = create()): vec2 {
        return this.set(out, Math.abs(target.x), Math.abs(target.y));
    },
    /** Returns a vector containing the negative value of each element of `target`. */
    neg(target: vec2, out = create()): vec2 {
        return this.set(out, -target.x, -target.y);
    },
    /** Returns a vector containing the inverse value of each element of `target`. */
    inv(target: vec2, out = create()): vec2 {
        return this.set(out, recip(target.x), recip(target.y));
    },
    /** Returns a vector that is equal to `target` rotated by 90 degrees. */
    perp(target: vec2, out = create()): vec2 {
        return this.set(out, -target.y, target.x);
    },
    /** Returns the length for given vector */
    len(target: vec2): number {
        return Math.sqrt(this.len2(target));
    },
    /** Returns the length squared for given vector. */
    len2(target: vec2): number {
        return target.x * target.x + target.y * target.y;
    },
    /** Computes `1.0 / len()` for given vector. */
    rlen(target: vec2): number {
        return 1 / this.len(target);
    },
    /** Returns the euclidean distance between two vectors. */
    dist(lhs: vec2, rhs: vec2): number {
        return this.len(this.sub(lhs, rhs));
    },
    /** Returns the euclidean distance squared between two vectors. */
    dist2(lhs: vec2, rhs: vec2): number {
        return this.len2(this.sub(lhs, rhs));
    },
    /** Returns `target` as a normalized vector. */
    normalize(target: vec2, out = create()): vec2 {
        return this.scale(target, recip(this.len(target)), out);
    },
    /** Returns the normalized vector of `target` if possible, else `(0,0)`. */
    normalizeSafe(target: vec2, out = create()): vec2 {
        let rcp = this.rlen(target);
        if (rcp > 0.0 && isFinite(rcp)) {
            return this.normalize(target, out);
        }
        return this.set(out, 0, 0);
    },
    /** Returns the dot product of given two vectors. */
    dot(lhs: vec2, rhs: vec2): number {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    },
    /** Returns the cross product of given two vectors. */
    cross(lhs: vec2, rhs: vec2): number {
        return lhs.x * rhs.y - lhs.y * rhs.x;
    },
    /** Returns the vector projection of `lhs` onto `rhs`. */
    project(lhs: vec2, rhs: vec2, out = create()): vec2 {
        return this.scale(rhs, this.dot(lhs, rhs), out);
    },
    /** Returns the reflection vector, given an incident vector `lhs` and a normal vector `rhs`. */
    reflect(lhs: vec2, rhs: vec2, out = create()): vec2 {
        return this.sub(lhs, this.project(lhs, rhs, out), out);
    },
    /** Returns the angle (in radians) between the two vectors. */
    angle(lhs: vec2, rhs: vec2): number {
        let angle = Math.acos(this.dot(lhs, rhs) / (this.len(lhs) * this.len(rhs)));
        return angle * Math.sign(this.cross(lhs, rhs));
    },
    /** Returns a vector where `target` is rotated by an angle in radians. */
    rotate(target: vec2, radians: number, out = create()): vec2 {
        let [sin, cos] = sincos(radians);
        return this.set(out, target.x * cos - target.y * sin, target.x * sin + target.y * cos);
    },
    /** Performs a linear interpolation between `a` and `b` based on the value `t`. */
    lerp(a: vec2, b: vec2, t: number, out = create()): vec2 {
        return this.add(a, this.scale(this.sub(b, a, out), t, out), out);
    }
})
