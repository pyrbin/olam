import { assert } from "../debug";
import { deg, epsilon, feq, recip, rsqrt, sincos, sqrt } from "../math";
import { createImpl, Static } from "../type_impl";
import { vec3 } from "./vec3";

/** A 2-dimensional vector.*/
export interface vec2 extends Vec2 { }

export const vec2 = createImpl(class Vec2Impl extends Static {
    /** Create a 2-dimensional vector with all elements set to `v`. */
    // @ts-ignore
    static create(v: number = 0): vec2
    /** Create a 2-dimensional vector. */
    static create(x: number, y: number): vec2
    static create(x: number, y: number) {
        return new Vec2(x, y ?? x);
    }
    /** Create a vector where each element is set to `0`. */
    static zero(): vec2 {
        return vec2.create(0);
    }
    /** Create a vector where each element is set to `1`. */
    static one(): vec2 {
        return vec2.create(1);
    }
    /** Create a unit-length vector pointing along the positive y-axis. */
    static up(): vec2 {
        return vec2.create(0, 1);
    }
    /** Create a unit-length vector pointing along the negative y-axis. */
    static down(): vec2 {
        return vec2.create(0, -1);
    }
    /** Create a unit-length vector pointing along the negative x-axis. */
    static left(): vec2 {
        return vec2.create(-1, 0);
    }
    /** Create a unit-length vector pointing along the positive x-axis. */
    static right(): vec2 {
        return vec2.create(1, 0);
    }
    /** Set properties of given vector `v` */
    static set<T extends num2>(v: T, ...args: SetParams<typeof vec2>): T {
        v.x = args[0];
        v.y = args[1];
        return v;
    }
    /** Copy properties from `b` to v vector `a` */
    static copy<T extends num2>(a: T, b: num2): T {
        return vec2.set(a, b.x, b.y);
    }
    /** Clone this vector. */
    static clone(v: num2): vec2 {
        return vec2.copy(vec2(), v);
    }
    /** Return a string representation  */
    static fmt(v: num2) {
        return `(${v.x}, ${v.y})`;
    }
    /** Create a vector from an array-like. */
    static fromArray(array: ArrayLike<number>): vec2
    static fromArray<T extends num2>(array: ArrayLike<number>, out?: T): T
    static fromArray<T extends num2>(array: ArrayLike<number>, out?: T) {
        return vec2.set(out ?? vec2(), array[0] as number, array[1] as number);
    }
    /** Return each element of `v` as an array. */
    static toArray(v: num2): [x: number, y: number] {
        return [v.x, v.y];
    }
    /** Return `v` as a 3-dimensional vector with given `z` value. */
    static extend(v: num2, z?: number): vec3
    static extend<T extends num3>(v: num2, z?: number, out?: T): T
    static extend<T extends num3>(v: num2, z?: number, out?: T) {
        return vec3.set(out ?? vec3(), v.x, v.y, z ?? 0) as T;
    }
    /** Return true if each element of `v` is finite. */
    static isFinite(v: num2): boolean {
        return isFinite(v.x) && isFinite(v.y);
    }
    /** Return true if any element of `v` is NaN. */
    static isNan(v: num2): boolean {
        return isNaN(v.x) || isNaN(v.y);
    }
    /** Return true if given vector is normalized. */
    static isNormalized(v: num2): boolean {
        return Math.abs(vec2.len2(v) - 1) <= epsilon;
    }
    /** Adds `lhs` and `rhs`. */
    static add(lhs: num2, rhs: num2): vec2
    static add<T extends num2>(lhs: num2, rhs: num2, out?: T): T
    static add<T extends num2>(lhs: num2, rhs: num2, out?: T) {
        return vec2.set(out ?? vec2(), lhs.x + rhs.x, lhs.y + rhs.y) as T;
    }
    /** Subtracts `lhs` and `rhs`. */
    static sub(lhs: num2, rhs: num2): vec2
    static sub<T extends num2>(lhs: num2, rhs: num2, out?: T): T
    static sub<T extends num2>(lhs: num2, rhs: num2, out?: T) {
        return vec2.set(out ?? vec2(), lhs.x - rhs.x, lhs.y - rhs.y) as T;
    }
    /** Multiplies `lhs` and `rhs`. */
    static mul(lhs: num2, rhs: num2): vec2
    static mul<T extends num2>(lhs: num2, rhs: num2, out?: T): T
    static mul<T extends num2>(lhs: num2, rhs: num2, out?: T) {
        return vec2.set(out ?? vec2(), lhs.x * rhs.x, lhs.y * rhs.y) as T;
    }
    /** Multiplies a vector `lhs` and a scale value `rhs`. */
    static scale(lhs: num2, rhs: number): vec2
    static scale<T extends num2>(lhs: num2, rhs: number, out?: T): T
    static scale<T extends num2>(lhs: num2, rhs: number, out?: T) {
        return vec2.set(out ?? vec2(), lhs.x * rhs, lhs.y * rhs) as T;
    }
    /** Division between `lhs` and `rhs`. */
    static div(lhs: num2, rhs: num2): vec2
    static div<T extends num2>(lhs: num2, rhs: num2, out?: T): T
    static div<T extends num2>(lhs: num2, rhs: num2, out?: T) {
        return vec2.set(out ?? vec2(), lhs.x / rhs.x, lhs.y / rhs.y) as T;
    }
    /** Check equality between `lhs` and `rhs`. */
    static eq(lhs: num2, rhs: num2): boolean {
        return feq(lhs.x, rhs.x) && feq(lhs.y, rhs.y);
    }
    /** Return a vector containing the absolute value of each element of `v`. */
    static abs(v: num2): vec2
    static abs<T extends num2>(v: num2, out?: T): T
    static abs<T extends num2>(v: num2, out?: T) {
        return vec2.set(out ?? vec2(), Math.abs(v.x), Math.abs(v.y)) as T;
    }
    /** Return a vector containing the negative value of each element of `v`. */
    static neg(v: num2): vec2
    static neg<T extends num2>(v: num2, out?: T): T
    static neg<T extends num2>(v: num2, out?: T) {
        return vec2.set(out ?? vec2(), -v.x, -v.y) as T;
    }
    /** Return a vector containing the inverse value of each element of `v`. */
    static inv(v: num2): vec2
    static inv<T extends num2>(v: num2, out?: T): T
    static inv<T extends num2>(v: num2, out?: T) {
        return vec2.set(out ?? vec2(), recip(v.x), recip(v.y)) as T;
    }
    /** Return a vector that is equal to `v` rotated by 90 degrees. */
    static perp(v: num2): vec2
    static perp<T extends num2>(v: num2, out?: T): T
    static perp<T extends num2>(v: num2, out?: T) {
        return vec2.rotate(v, deg(90), out);
    }
    /** Return the length for given vector. */
    static len(v: num2): number {
        return sqrt(vec2.len2(v));
    }
    /** Return the length squared for given vector. */
    static len2(v: num2): number {
        return v.x * v.x + v.y * v.y;
    }
    /** Computes `1.0 / len()` for given vector. */
    static rlen(v: num2): number {
        return rsqrt(vec2.len2(v));
    }
    /** Return the euclidean distance between. */
    static dist(lhs: num2, rhs: num2): number {
        return vec2.len(vec2.sub(lhs, rhs));
    }
    /** Return the euclidean distance squared between. */
    static dist2(lhs: num2, rhs: num2): number {
        return vec2.len2(vec2.sub(lhs, rhs));
    }
    /** Return `v` as a normalized vector. */
    static normalize(v: num2): vec2
    static normalize<T extends num2>(v: num2, out?: T): T
    static normalize<T extends num2>(v: num2, out?: T) {
        return vec2.scale(v, recip(vec2.len(v)), out);
    }
    /** Return the normalized vector of `v` if possible, else `(0,0)`. */
    static normalizeSafe(v: num2): vec2
    static normalizeSafe<T extends num2>(v: num2, out?: T): T
    static normalizeSafe<T extends num2>(v: num2, out?: T) {
        let rcp = vec2.rlen(v);
        if (rcp > 0.0 && isFinite(rcp)) {
            return vec2.normalize(v, out);
        }
        return vec2.set(out ?? vec2(), 0, 0) as T;
    }
    /** Return the dot product of given. */
    static dot(lhs: num2, rhs: num2): number {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    }
    /** Return the cross product of given. */
    static cross(lhs: num2, rhs: num2): number {
        return lhs.x * rhs.y - lhs.y * rhs.x;
    }
    /** Return the vector projection of `lhs` onto `rhs`. */
    static project(lhs: num2, rhs: num2): vec2
    static project<T extends num2>(lhs: num2, rhs: num2, out?: T): T
    static project<T extends num2>(lhs: num2, rhs: num2, out?: T) {
        return vec2.scale(rhs, vec2.dot(lhs, rhs) / vec2.dot(rhs, rhs), out);
    }
    /** Return the vector rejection of `lhs` from `rhs`. */
    static reject(lhs: num2, rhs: num2): vec2
    static reject<T extends num2>(lhs: num2, rhs: num2, out?: T): T
    static reject<T extends num2>(lhs: num2, rhs: num2, out?: T) {
        assert(vec2.isNormalized(rhs), "must be normalized");
        return vec2.sub(lhs, vec2.project(lhs, rhs, v1), out);
    }
    /** Return the angle (in radians) between the. */
    static angle(lhs: num2, rhs: num2): number {
        let angle = Math.acos(vec2.dot(lhs, rhs) / (vec2.len(lhs) * vec2.len(rhs)));
        return angle * Math.sign(vec2.cross(lhs, rhs));
    }
    /** Return a vector where `v` is rotated by an angle in radians. */
    static rotate(v: num2, radians: Rad): vec2
    static rotate<T extends num2>(v: num2, radians: Rad, out?: T): T
    static rotate<T extends num2>(v: num2, radians: Rad, out?: T): T {
        let [sin, cos] = sincos(radians);
        return vec2.set(out ?? vec2(), v.x * cos - v.y * sin, v.x * sin + v.y * cos) as T;
    }
    /** Performs a linear interpolation between `a` and `b` based on the value `t`. */
    static lerp(a: num2, b: num2, t: number): vec2
    static lerp<T extends num2>(a: num2, b: num2, t: number, out?: T): T
    static lerp<T extends num2>(a: num2, b: num2, t: number, out?: T): T {
        return vec2.add(a, vec2.scale(vec2.sub(b, a, v1), t, v1), out);
    }
});

/** @internal */
class Vec2 implements num2 {
    x: number;
    y: number;
    /** Create a 2-dimensional vector. */
    constructor(x: number = 0, y: number = x) {
        this.x = x;
        this.y = y;
    }
    /** Set properties of this vector */
    set(...args: SetParams<typeof vec2>): this {
        return vec2.set(this, ...args);
    }
    /** Copy properties from `v` */
    copy(v: num2): this {
        return vec2.copy(this, v);
    }
    /** Clone this vector */
    clone(): vec2 {
        return vec2.clone(this);
    }
    /** Return a string representation  */
    toString() {
        return vec2.fmt(this);
    }
    /** Return each element as an array. */
    toArray(): [x: number, y: number] {
        return vec2.toArray(this);
    }
    /** Return `this` as a 3-dimensional vector with given `z` value. */
    extend(z?: number): vec3
    extend<T extends num3>(z: number = 0, out?: T): T {
        return vec2.extend(this, z, out);
    }
    /** Return true if each element is finite. */
    isFinite(): boolean {
        return vec2.isFinite(this);
    }
    /** Return true if any element is NaN. */
    isNan(): boolean {
        return vec2.isNan(this);
    }
    /** Return true if `this` is normalized. */
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
    /** Inverse the vector */
    inv() {
        return vec2.inv(this, this);
    }
    /** Rotate vector by 90 degrees */
    perp(): this {
        return vec2.perp(this, this);
    }
    /** Return the length. */
    len(): number {
        return vec2.len(this);
    }
    /** Return the length squared. */
    len2(): number {
        return vec2.len2(this);
    }
    /** Computes `1.0 / len()`. */
    rlen(): number {
        return vec2.rlen(this);
    }
    /** Return the euclidean distance between `this` and `rhs`. */
    dist(rhs: num2): number {
        return vec2.dist(this, rhs);
    }
    /** Return the euclidean distance squared between `this` and `rhs`. */
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
    project(rhs: num2): this
    project<T extends num2>(rhs: num2, out?: T): T
    project<T extends num2>(rhs: num2, out?: T) {
        return vec2.project(this, rhs, out ?? this);
    }
    /** Rejection of `this` from `rhs`. */
    reject(rhs: num2): this
    reject<T extends num2>(rhs: num2, out?: T): T
    reject<T extends num2>(rhs: num2, out?: T) {
        return vec2.reject(this, rhs, out ?? this);
    }
    /** Return the angle (in radians) between `this` and `rhs`. */
    angle(rhs: num2): number {
        return vec2.angle(this, rhs);
    }
    /** Rotate by an angle in radians. */
    rotate(angle: number): this {
        return vec2.rotate(this, angle, this);
    }
    /** Performs a linear interpolation between `this` and `v` based on the value `t`. */
    lerp(v: vec2, t: number): this {
        return vec2.lerp(this, v, t, this);
    }
}

/** @internal */
let v1 = vec2(0, 0);