import { assert } from "../debug";
import { deg, epsilon, eqf, recip, rsqrt, sincos } from "../math";
import * as type from "../type";
import { vec3 } from "./vec3";

export const vec2 = type.implement({
    /** Creates a 2-dimensional vector. */
    new: create,
    /** Creates a vector where each element is set to `0`. */
    zero(): Vec2 {
        return create(0);
    },
    /** Creates a vector where each element is set to `1`. */
    one(): Vec2 {
        return create(1);
    },
    /** A unit-length vector pointing along the positive y-axis. */
    up(): Vec2 {
        return create(0, 1);
    },
    /** A unit-length vector pointing along the negative y-axis. */
    down(): Vec2 {
        return create(0, -1);
    },
    /** A unit-length vector pointing along the negative x-axis. */
    left(): Vec2 {
        return create(-1, 0);
    },
    /** A unit-length vector pointing along the positive x-axis. */
    right(): Vec2 {
        return create(1, 0);
    },
    /** Set properties of given vector `target` */
    set<T extends type.Vec2>(target: T, x: number, y: number): T {
        target.x = x;
        target.y = y;
        return target;
    },
    /** Copy properies from `b` to target vector `a` */
    copy<T extends type.Vec2>(a: T, b: type.Vec2): T {
        return this.set(a, b.x, b.y);
    },
    /** Returns a string representation  */
    fmt(target: type.Vec2) {
        return `(${target.x}, ${target.y})`;
    },
    /** Create a vector from an array-like. */
    fromArray<T extends type.Vec2>(array: ArrayLike<number>, out?: T): T {
        return this.set(out ?? create(), array[0] as number, array[1] as number) as T;
    },
    /** Returns each elemnt of `target` as an array. */
    toArray(target: type.Vec2): [x: number, y: number] {
        return [target.x, target.y];
    },
    /** Returns `target` as a 3-dimensional vector with given `z` value. */
    extend<T extends type.Vec3>(target: type.Vec2, z: number = 0, out?: T): T {
        return vec3.set(out ?? vec3(), target.x, target.y, z) as T;
    },
    /** Returns true if each element of `target` is finite. */
    isFinite(target: type.Vec2): boolean {
        return isFinite(target.x) && isFinite(target.y);
    },
    /** Returns true if any element of `target` is NaN. */
    isNan(target: type.Vec2): boolean {
        return isNaN(target.x) || isNaN(target.y);
    },
    /** Returns true if given vector is normalized. */
    isNormalized(target: type.Vec2): boolean {
        return Math.abs(this.len2(target) - 1) <= epsilon;
    },
    /** Adds two vectors `lhs` and `rhs`. */
    add<T extends type.Vec2>(lhs: type.Vec2, rhs: type.Vec2, out?: T): T {
        return this.set(out ?? create(), lhs.x + rhs.x, lhs.y + rhs.y) as T;
    },
    /** Subtracts two vectors `lhs` and `rhs`. */
    sub<T extends type.Vec2>(lhs: type.Vec2, rhs: type.Vec2, out?: T): T {
        return this.set(out ?? create(), lhs.x - rhs.x, lhs.y - rhs.y) as T;
    },
    /** Multiplies two vectors `lhs` and `rhs`. */
    mul<T extends type.Vec2>(lhs: type.Vec2, rhs: type.Vec2, out?: T): T {
        return this.set(out ?? create(), lhs.x * rhs.x, lhs.y * rhs.y) as T;
    },
    /** Multiplies a vector `lhs` and a scale value `rhs`. */
    scale<T extends type.Vec2>(lhs: type.Vec2, rhs: number, out?: T): T {
        return this.set(out ?? create(), lhs.x * rhs, lhs.y * rhs) as T;
    },
    /** Division between two vectors `lhs` and `rhs`. */
    div<T extends type.Vec2>(lhs: type.Vec2, rhs: type.Vec2, out?: T): T {
        return this.set(out ?? create(), lhs.x / rhs.x, lhs.y / rhs.y) as T;
    },
    /** Check equality between two vectors `lhs` and `rhs`. */
    eq(lhs: type.Vec2, rhs: type.Vec2): boolean {
        return eqf(lhs.x, rhs.x) && eqf(lhs.y, rhs.y);
    },
    /** Returns a vector containing the absolute value of each element of `target`. */
    abs<T extends type.Vec2>(target: type.Vec2, out?: T): T {
        return this.set(out ?? create(), Math.abs(target.x), Math.abs(target.y)) as T;
    },
    /** Returns a vector containing the negative value of each element of `target`. */
    neg<T extends type.Vec2>(target: type.Vec2, out?: T): T {
        return this.set(out ?? create(), -target.x, -target.y) as T;
    },
    /** Returns a vector containing the inverse value of each element of `target`. */
    inv<T extends type.Vec2>(target: type.Vec2, out?: T): T {
        return this.set(out ?? create(), recip(target.x), recip(target.y)) as T;
    },
    /** Returns a vector that is equal to `target` rotated by 90 degrees. */
    perp<T extends type.Vec2>(target: type.Vec2, out?: T): T {
        return this.rotate(target, deg(90), out ?? create()) as T;
    },
    /** Returns the length for given vector. */
    len(target: type.Vec2): number {
        return Math.sqrt(this.len2(target));
    },
    /** Returns the length squared for given vector. */
    len2(target: type.Vec2): number {
        return target.x * target.x + target.y * target.y;
    },
    /** Computes `1.0 / len()` for given vector. */
    rlen(target: type.Vec2): number {
        return rsqrt(this.len2(target));
    },
    /** Returns the euclidean distance between two vectors. */
    dist(lhs: type.Vec2, rhs: type.Vec2): number {
        return this.len(this.sub(lhs, rhs));
    },
    /** Returns the euclidean distance squared between two vectors. */
    dist2(lhs: type.Vec2, rhs: type.Vec2): number {
        return this.len2(this.sub(lhs, rhs));
    },
    /** Returns `target` as a normalized vector. */
    normalize<T extends type.Vec2>(target: type.Vec2, out?: T): T {
        return this.scale(target, recip(this.len(target)), out ?? create()) as T;
    },
    /** Returns the normalized vector of `target` if possible, else `(0,0)`. */
    normalizeSafe<T extends type.Vec2>(target: type.Vec2, out?: T): T {
        let rcp = this.rlen(target);
        if (rcp > 0.0 && isFinite(rcp)) {
            return this.normalize(target, out ?? create()) as T;
        }
        return this.set(out ?? create(), 0, 0) as T;
    },
    /** Returns the dot product of given two vectors. */
    dot(lhs: type.Vec2, rhs: type.Vec2): number {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    },
    /** Returns the cross product of given two vectors. */
    cross(lhs: type.Vec2, rhs: type.Vec2): number {
        return lhs.x * rhs.y - lhs.y * rhs.x;
    },
    /** Returns the vector projection of `lhs` onto `rhs`. */
    project<T extends type.Vec2>(lhs: type.Vec2, rhs: type.Vec2, out?: T): T {
        return this.scale(rhs, this.dot(lhs, rhs), out ?? create()) as T;
    },
    /** Returns the reflection vector, given an incident vector `lhs` and a normal vector `rhs`. */
    reflect<T extends type.Vec2>(lhs: type.Vec2, rhs: type.Vec2, out?: T): T {
        assert(this.isNormalized(rhs), "must be normalized");
        return this.sub(lhs, this.project(lhs, rhs, v1), out ?? create()) as T;
    },
    /** Returns the angle (in radians) between the two vectors. */
    angle(lhs: type.Vec2, rhs: type.Vec2): number {
        let angle = Math.acos(this.dot(lhs, rhs) / (this.len(lhs) * this.len(rhs)));
        return angle * Math.sign(this.cross(lhs, rhs));
    },
    /** Returns a vector where `target` is rotated by an angle in radians. */
    rotate<T extends type.Vec2>(target: type.Vec2, radians: number, out?: T): T {
        let [sin, cos] = sincos(radians);
        return this.set(out ?? create(), target.x * cos - target.y * sin, target.x * sin + target.y * cos) as T;
    },
    /** Performs a linear interpolation between `a` and `b` based on the value `t`. */
    lerp<T extends type.Vec2>(a: type.Vec2, b: type.Vec2, t: number, out?: T): T {
        return this.add(a, this.scale(this.sub(b, a, v1), t, v1), out ?? create()) as T;
    }
});

/** A 2-dimensional vector. */
export class Vec2 implements type.Vec2 {
    x: number;
    y: number;
    /** Creates a 2-dimensional vector. */
    constructor(x: number = 0, y: number = x) {
        this.x = x;
        this.y = y;
    }
    /** Set properties of this vector */
    set(x: number, y: number): Vec2 {
        return vec2.set(this, x, y) as Vec2;
    }
    /** Copy properies from `src` */
    copy(src: type.Vec2): Vec2 {
        return vec2.copy(this, src) as Vec2;
    }
    /** Returns a string representation  */
    toString() {
        return vec2.fmt(this);
    }
    /** Returns each elemnt as an array. */
    toArray(): [x: number, y: number] {
        return vec2.toArray(this);
    }
    /** Returns `this` as a 3-dimensional vector with given `z` value. */
    extend<T extends type.Vec3>(z: number = 0, out?: T): T {
        return vec2.extend(this, z, out ?? vec3()) as T;
    }
    /** Returns true if each element is finite. */
    isFinite(): boolean {
        return vec2.isFinite(this);
    }
    /** Returns true if any element is NaN. */
    isNan(): boolean {
        return vec2.isNan(this);
    }
    /** Returns true if `this` is normalized. */
    isNormalized(): boolean {
        return vec2.isNormalized(this);
    }
    /** Adds `rhs` to `target`. */
    add(rhs: type.Vec2): Vec2 {
        return vec2.add(this, rhs, this) as Vec2;
    }
    /** Subtracts `rhs` from `this`. */
    sub(rhs: type.Vec2): Vec2 {
        return vec2.sub(this, rhs, this) as Vec2;
    }
    /** Multiplies the vector by a scalar. */
    mul(rhs: type.Vec2): Vec2 {
        return vec2.mul(this, rhs, this) as Vec2;
    }
    /** Scales the vector by `rhs`. */
    scale(rhs: number): Vec2 {
        return vec2.scale(this, rhs, this) as Vec2;
    }
    /** Divides `this` by `rhs`. */
    div(rhs: type.Vec2): Vec2 {
        return vec2.div(this, rhs, this) as Vec2;
    }
    /** Check equality between `this` and `rhs`. */
    eq(rhs: type.Vec2): boolean {
        return vec2.eq(this, rhs);
    }
    /** Set vector to absolute values. */
    abs(): Vec2 {
        return vec2.abs(this, this) as Vec2;
    }
    /** Negates the vector.*/
    neg(): Vec2 {
        return vec2.neg(this, this) as Vec2;
    }
    /** Inverse vector */
    inv() {
        return vec2.inv(this, this) as Vec2;
    }
    /** Rotate vector by 90 degrees */
    perp(): Vec2 {
        return vec2.perp(this, this) as Vec2;
    }
    /** Returns the length. */
    len(): number {
        return vec2.len(this);
    }
    /** Returns the length squared. */
    len2(): number {
        return vec2.len2(this);
    }
    /** Computes `1.0 / len()`. */
    rlen(): number {
        return vec2.rlen(this);
    }
    /** Returns the euclidean distance between `this` and `rhs`. */
    dist(rhs: type.Vec2): number {
        return vec2.dist(this, rhs);
    }
    /** Returns the euclidean distance squared between `this` and `rhs`. */
    dist2(rhs: type.Vec2): number {
        return vec2.dist2(this, rhs);
    }
    /** Normalizes the vector. */
    normalize(): Vec2 {
        return vec2.normalize(this, this) as Vec2;
    }
    /** Safely normalizes `this` if possible, else `(0,0)`. */
    normalizeSafe(): Vec2 {
        return vec2.normalizeSafe(this, this) as Vec2;
    }
    /** Dot product of `this` & `rhs`. */
    dot(rhs: type.Vec2): number {
        return vec2.dot(this, rhs);
    }
    /** Cross product of `this` & `rhs`. */
    cross(rhs: type.Vec2): number {
        return vec2.cross(this, rhs);
    }
    /** Project `this` onto `rhs`. */
    project(rhs: type.Vec2): Vec2 {
        return vec2.project(this, rhs, this) as Vec2;
    }
    /** Computes the reflection vector, given an incident vector `this` and a normal vector `rhs`. */
    reflect(rhs: type.Vec2): Vec2 {
        return vec2.reflect(this, rhs, this) as Vec2;
    }
    /** Returns the angle (in radians) between `this` and `rhs`. */
    angle(rhs: type.Vec2): number {
        return vec2.angle(this, rhs);
    }
    /** Rotate by an angle in radians. */
    rotate(angle: number): Vec2 {
        return vec2.rotate(this, angle, this) as Vec2;
    }
    /** Performs a linear interpolation between `this` and `target` based on the value `t`. */
    lerp(target: Vec2, t: number): Vec2 {
        return vec2.lerp(this, target, t, this) as Vec2;
    }
}

/** @internal */
function create(x: number = 0, y: number = x): Vec2 {
    return new Vec2(x, y);
}

/** @internal */
let v1 = vec2(0, 0);