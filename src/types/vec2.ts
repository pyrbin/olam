import { implementType } from "../base";
import { assert } from "../debug";
import { deg, epsilon, feq, recip, rsqrt, sincos } from "../math";
import { vec3 } from "./vec3";

/** A 2-dimensional vector.*/
export interface vec2 extends Vec2 { }

export const vec2 = implementType({
    /** Creates a 2-dimensional vector. */
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
    set<T extends num2>(target: T, x: number, y: number): T {
        target.x = x;
        target.y = y;
        return target;
    },
    /** Copy properies from `b` to target vector `a` */
    copy<T extends num2>(a: T, b: num2): T {
        return this.set(a, b.x, b.y);
    },
    /** Returns a string representation  */
    fmt(target: num2) {
        return `(${target.x}, ${target.y})`;
    },
    /** Create a vector from an array-like. */
    fromArray<T extends num2>(array: ArrayLike<number>, out?: T): T {
        return this.set(out ?? vec2(), array[0] as number, array[1] as number) as T;
    },
    /** Returns each elemnt of `target` as an array. */
    toArray(target: num2): [x: number, y: number] {
        return [target.x, target.y];
    },
    /** Returns `target` as a 3-dimensional vector with given `z` value. */
    extend<T extends num3>(target: num2, z: number = 0, out?: T): T {
        return vec3.set(out ?? vec3(), target.x, target.y, z) as T;
    },
    /** Returns true if each element of `target` is finite. */
    isFinite(target: num2): boolean {
        return isFinite(target.x) && isFinite(target.y);
    },
    /** Returns true if any element of `target` is NaN. */
    isNan(target: num2): boolean {
        return isNaN(target.x) || isNaN(target.y);
    },
    /** Returns true if given vector is normalized. */
    isNormalized(target: num2): boolean {
        return Math.abs(this.len2(target) - 1) <= epsilon;
    },
    /** Adds `lhs` and `rhs`. */
    add<T extends num2>(lhs: num2, rhs: num2, out?: T): T {
        return this.set(out ?? vec2(), lhs.x + rhs.x, lhs.y + rhs.y) as T;
    },
    /** Subtracts `lhs` and `rhs`. */
    sub<T extends num2>(lhs: num2, rhs: num2, out?: T): T {
        return this.set(out ?? vec2(), lhs.x - rhs.x, lhs.y - rhs.y) as T;
    },
    /** Multiplies `lhs` and `rhs`. */
    mul<T extends num2>(lhs: num2, rhs: num2, out?: T): T {
        return this.set(out ?? vec2(), lhs.x * rhs.x, lhs.y * rhs.y) as T;
    },
    /** Multiplies a vector `lhs` and a scale value `rhs`. */
    scale<T extends num2>(lhs: num2, rhs: number, out?: T): T {
        return this.set(out ?? vec2(), lhs.x * rhs, lhs.y * rhs) as T;
    },
    /** Division between `lhs` and `rhs`. */
    div<T extends num2>(lhs: num2, rhs: num2, out?: T): T {
        return this.set(out ?? vec2(), lhs.x / rhs.x, lhs.y / rhs.y) as T;
    },
    /** Check equality between `lhs` and `rhs`. */
    eq(lhs: num2, rhs: num2): boolean {
        return feq(lhs.x, rhs.x) && feq(lhs.y, rhs.y);
    },
    /** Returns a vector containing the absolute value of each element of `target`. */
    abs<T extends num2>(target: num2, out?: T): T {
        return this.set(out ?? vec2(), Math.abs(target.x), Math.abs(target.y)) as T;
    },
    /** Returns a vector containing the negative value of each element of `target`. */
    neg<T extends num2>(target: num2, out?: T): T {
        return this.set(out ?? vec2(), -target.x, -target.y) as T;
    },
    /** Returns a vector containing the inverse value of each element of `target`. */
    inv<T extends num2>(target: num2, out?: T): T {
        return this.set(out ?? vec2(), recip(target.x), recip(target.y)) as T;
    },
    /** Returns a vector that is equal to `target` rotated by 90 degrees. */
    perp<T extends num2>(target: num2, out?: T): T {
        return this.rotate(target, deg(90), out);
    },
    /** Returns the length for given vector. */
    len(target: num2): number {
        return Math.sqrt(this.len2(target));
    },
    /** Returns the length squared for given vector. */
    len2(target: num2): number {
        return target.x * target.x + target.y * target.y;
    },
    /** Computes `1.0 / len()` for given vector. */
    rlen(target: num2): number {
        return rsqrt(this.len2(target));
    },
    /** Returns the euclidean distance between. */
    dist(lhs: num2, rhs: num2): number {
        return this.len(this.sub(lhs, rhs));
    },
    /** Returns the euclidean distance squared between. */
    dist2(lhs: num2, rhs: num2): number {
        return this.len2(this.sub(lhs, rhs));
    },
    /** Returns `target` as a normalized vector. */
    normalize<T extends num2>(target: num2, out?: T): T {
        return this.scale(target, recip(this.len(target)), out);
    },
    /** Returns the normalized vector of `target` if possible, else `(0,0)`. */
    normalizeSafe<T extends num2>(target: num2, out?: T): T {
        let rcp = this.rlen(target);
        if (rcp > 0.0 && isFinite(rcp)) {
            return this.normalize(target, out);
        }
        return this.set(out ?? vec2(), 0, 0) as T;
    },
    /** Returns the dot product of given. */
    dot(lhs: num2, rhs: num2): number {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    },
    /** Returns the cross product of given. */
    cross(lhs: num2, rhs: num2): number {
        return lhs.x * rhs.y - lhs.y * rhs.x;
    },
    /** Returns the vector projection of `lhs` onto `rhs`. */
    project<T extends num2>(lhs: num2, rhs: num2, out?: T): T {
        return vec2.scale(rhs, vec2.dot(lhs, rhs) / vec2.dot(rhs, rhs), out);
    },
    /** Returns the vector rejection of `lhs` from `rhs`. */
    reject<T extends num2>(lhs: num2, rhs: num2, out?: T): T {
        assert(this.isNormalized(rhs), "must be normalized");
        return this.sub(lhs, this.project(lhs, rhs, v1), out);
    },
    /** Returns the angle (in radians) between the. */
    angle(lhs: num2, rhs: num2): number {
        let angle = Math.acos(this.dot(lhs, rhs) / (this.len(lhs) * this.len(rhs)));
        return angle * Math.sign(this.cross(lhs, rhs));
    },
    /** Returns a vector where `target` is rotated by an angle in radians. */
    rotate<T extends num2>(target: num2, radians: number, out?: T): T {
        let [sin, cos] = sincos(radians);
        return this.set(out ?? vec2(), target.x * cos - target.y * sin, target.x * sin + target.y * cos) as T;
    },
    /** Performs a linear interpolation between `a` and `b` based on the value `t`. */
    lerp<T extends num2>(a: num2, b: num2, t: number, out?: T): T {
        return this.add(a, this.scale(this.sub(b, a, v1), t, v1), out);
    }
});

/** @internal */
class Vec2 implements num2 {
    x: number;
    y: number;
    /** Creates a 2-dimensional vector. */
    constructor(x: number = 0, y: number = x) {
        this.x = x;
        this.y = y;
    }
    /** Set properties of this vector */
    set(x: number, y: number): this {
        return vec2.set(this, x, y);
    }
    /** Copy properies from `src` */
    copy(src: num2): this {
        return vec2.copy(this, src);
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
    extend<T extends num3>(z: number = 0, out?: T): T {
        return vec2.extend(this, z, out);
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
    /** Adds `rhs` to `this`. */
    add(rhs: num2): this {
        return vec2.add(this, rhs, this);
    }
    /** Subtracts `rhs` from `this`. */
    sub(rhs: num2): this {
        return vec2.sub(this, rhs, this);
    }
    /** Multiplies the vector by a scalar. */
    mul(rhs: num2): this {
        return vec2.mul(this, rhs, this);
    }
    /** Scales the vector by `rhs`. */
    scale(rhs: number): this {
        return vec2.scale(this, rhs, this);
    }
    /** Divides `this` by `rhs`. */
    div(rhs: num2): this {
        return vec2.div(this, rhs, this);
    }
    /** Check equality between `this` and `rhs`. */
    eq(rhs: num2): boolean {
        return vec2.eq(this, rhs);
    }
    /** Set vector to absolute values. */
    abs(): this {
        return vec2.abs(this, this);
    }
    /** Negates the vector.*/
    neg(): this {
        return vec2.neg(this, this);
    }
    /** Inverse vector */
    inv() {
        return vec2.inv(this, this);
    }
    /** Rotate vector by 90 degrees */
    perp(): this {
        return vec2.perp(this, this);
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
    dist(rhs: num2): number {
        return vec2.dist(this, rhs);
    }
    /** Returns the euclidean distance squared between `this` and `rhs`. */
    dist2(rhs: num2): number {
        return vec2.dist2(this, rhs);
    }
    /** Normalizes the vector. */
    normalize(): this {
        return vec2.normalize(this, this);
    }
    /** Safely normalizes `this` if possible, else `(0,0)`. */
    normalizeSafe(): this {
        return vec2.normalizeSafe(this, this);
    }
    /** Dot product of `this` & `rhs`. */
    dot(rhs: num2): number {
        return vec2.dot(this, rhs);
    }
    /** Cross product of `this` & `rhs`. */
    cross(rhs: num2): number {
        return vec2.cross(this, rhs);
    }
    /** Project `this` onto `rhs`. */
    project(rhs: num2): this {
        return vec2.project(this, rhs, this);
    }
    /** Rejection of `this` from `rhs`. */
    reject(rhs: num2): this {
        return vec2.reject(this, rhs, this);
    }
    /** Returns the angle (in radians) between `this` and `rhs`. */
    angle(rhs: num2): number {
        return vec2.angle(this, rhs);
    }
    /** Rotate by an angle in radians. */
    rotate(angle: number): this {
        return vec2.rotate(this, angle, this);
    }
    /** Performs a linear interpolation between `this` and `target` based on the value `t`. */
    lerp(target: vec2, t: number): this {
        return vec2.lerp(this, target, t, this);
    }
}

/** Creates a 2-dimensional vector. */
function create(x: number = 0, y: number = x): vec2 {
    return new Vec2(x, y);
}

/** @internal */
let v1 = vec2(0, 0);