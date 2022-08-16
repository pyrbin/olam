import { epsilon, feq, recip, rsqrt, sqrt } from "../math";
import { createImpl, Static } from "../type_impl";
import { vec3 } from "./vec3";

/** A 4-dimensional vector.*/
export interface vec4 extends Vec4 { };

export const vec4 = createImpl(class Vec4Impl extends Static {
    /** Create a 4-dimensional vector with all elements set to `v`. */
    // @ts-ignore
    static create(v: number = 0): vec4
    /** Create a 4-dimensional vector. */
    static create(x: number, y: number, z: number, w: number): vec4
    static create(x: number, y: number, z: number, w: number) {
        return new Vec4(x, y ?? x, z ?? x, w ?? x);
    }
    /** Create a vector where each element is set to `0`. */
    static zero(): vec4 {
        return vec4.create(0);
    }
    /** Create a vector where each element is set to `1`. */
    static one(): vec4 {
        return vec4.create(1);
    }
    /** Create a unit-length vector pointing along the positive y-axis. */
    static up(): vec4 {
        return vec4.create(1, 0, 0, 0);
    }
    /** Create a unit-length vector pointing along the negative y-axis. */
    static down(): vec4 {
        return vec4.create(-1, 0, 0, 0);
    }
    /** Create a unit-length vector pointing along the negative x-axis. */
    static left(): vec4 {
        return vec4.create(0, -1, 0, 0);
    }
    /** Create a unit-length vector pointing along the positive x-axis. */
    static right(): vec4 {
        return vec4.create(0, 1, 0, 0);
    }
    /** Create a unit-length vector pointing along the negative z-axis. */
    static back(): vec4 {
        return vec4.create(0, 0, -1, 0);
    }
    /** Create a unit-length vector pointing along the positive z-axis. */
    static forward(): vec4 {
        return vec4.create(0, 0, 1, 0);
    }
    /** Set properties of given vector `v` */
    static set<T extends num4>(v: T, x: number, y: number, z: number, w: number): T {
        v.x = x;
        v.y = y;
        v.z = z;
        v.w = w;
        return v;
    }
    /** Copy properties from `b` to v vector `a` */
    static copy<T extends num4>(v: T, source: num4): T {
        return vec4.set(v, source.x, source.y, source.z, source.w);
    }
    /** Clone `v` vector. */
    static clone(v: num4) {
        return vec4.copy(vec4(), v);
    }
    /** Return a string representation  */
    static fmt(v: num4): string {
        return `(${v.x}, ${v.y}, ${v.z}, ${v.w})`;
    }
    /** Create a vector from an array-like. */
    static fromArray(array: ArrayLike<number>): vec4
    static fromArray<T extends num4>(array: ArrayLike<number>, out?: T): T
    static fromArray<T extends num4>(array: ArrayLike<number>, out?: T) {
        return vec4.set(out ?? vec4(), array[0], array[1], array[2], array[3]);
    }
    /** Return each element of `v` as an array. */
    static toArray(v: num4): [x: number, y: number, z: number, w: number] {
        return [v.x, v.y, v.z, v.w];
    }
    /** Return `x`, `y` and `z` components as a 3-dim vector. */
    static trunc(v: num4): vec3
    static trunc<T extends num3>(v: num4, out?: T): T
    static trunc<T extends num3>(v: num4, out?: T) {
        return vec3.set(out ?? vec3(), v.x, v.y, v.z) as T;
    }
    /** Return true if each element of `v` is finite. */
    static isFinite(v: num4): boolean {
        return isFinite(v.x) && isFinite(v.y) && isFinite(v.z) && isFinite(v.w);
    }
    /** Return true if any element of `v` is NaN. */
    static isNan(v: num4): boolean {
        return isNaN(v.x) || isNaN(v.y) || isNaN(v.z) || isNaN(v.w);
    }
    /** Return true if given vector is normalized. */
    static isNormalized(v: num4): boolean {
        return Math.abs(vec4.len2(v) - 1) <= epsilon;
    }
    /** Adds `lhs` and `rhs`. */
    static add(lhs: num4, rhs: num4): vec4
    static add<T extends num4>(lhs: num4, rhs: num4, out?: T): T
    static add<T extends num4>(lhs: num4, rhs: num4, out?: T) {
        return vec4.set(out ?? vec4(), lhs.x + rhs.x, lhs.y + rhs.y, lhs.z + rhs.z, lhs.w + rhs.w);
    }
    /** Subtracts `lhs` and `rhs`. */
    static sub(lhs: num4, rhs: num4): vec4
    static sub<T extends num4>(lhs: num4, rhs: num4, out?: T): T
    static sub<T extends num4>(lhs: num4, rhs: num4, out?: T) {
        return vec4.set(out ?? vec4(), lhs.x - rhs.x, lhs.y - rhs.y, lhs.z - rhs.z, lhs.w - rhs.w);
    }
    /** Multiplies `lhs` and `rhs`. */
    static mul(lhs: num4, rhs: num4): vec4
    static mul<T extends num4>(lhs: num4, rhs: num4, out?: T): T
    static mul<T extends num4>(lhs: num4, rhs: num4, out?: T) {
        return vec4.set(out ?? vec4(), lhs.x * rhs.x, lhs.y * rhs.y, lhs.z * rhs.z, lhs.w * rhs.w);
    }
    /** Multiplies a vector `lhs` and a scale value `rhs`. */
    static scale(lhs: num4, rhs: number): vec4
    static scale<T extends num4>(lhs: num4, rhs: number, out?: T): T
    static scale<T extends num4>(lhs: num4, rhs: number, out?: T) {
        return vec4.set(out ?? vec4(), lhs.x * rhs, lhs.y * rhs, lhs.z * rhs, lhs.w * rhs);
    }
    /** Division between between `lhs` and `rhs`. */
    static div(lhs: num4, rhs: num4): vec4
    static div<T extends num4>(lhs: num4, rhs: num4, out?: T): T
    static div<T extends num4>(lhs: num4, rhs: num4, out?: T) {
        return vec4.set(out ?? vec4(), lhs.x / rhs.x, lhs.y / rhs.y, lhs.z / rhs.z, lhs.w / rhs.w);
    }
    /** Check equality between `lhs` and `rhs`. */
    static eq(lhs: num4, rhs: num4): boolean {
        return feq(lhs.x, rhs.x) && feq(lhs.y, rhs.y) && feq(lhs.z, rhs.z) && feq(lhs.w, rhs.w);
    }
    /** Return a vector containing the absolute value of each element of `v`. */
    static abs(v: num4): vec4
    static abs<T extends num4>(v: num4, out?: T): T
    static abs<T extends num4>(v: num4, out?: T) {
        return vec4.set(out ?? vec4(), Math.abs(v.x), Math.abs(v.y), Math.abs(v.z), Math.abs(v.w));
    }
    /** Return a vector containing the negative value of each element of `v`. */
    static neg(v: num4): vec4
    static neg<T extends num4>(v: num4, out?: T): T
    static neg<T extends num4>(v: num4, out?: T) {
        return vec4.set(out ?? vec4(), -v.x, -v.y, -v.z, -v.w);
    }
    /** Return a vector containing the inverse value of each element of `v`. */
    static inv(v: num4): vec4
    static inv<T extends num4>(v: num4, out?: T): T
    static inv<T extends num4>(v: num4, out?: T) {
        return vec4.set(out ?? vec4(), 1 / v.x, 1 / v.y, 1 / v.z, 1 / v.w);
    }
    /** Return the length for given vector */
    static len(v: num4): number {
        return sqrt(vec4.len2(v));
    }
    /** Return the length squared for given vector. */
    static len2(v: num4): number {
        return v.x * v.x + v.y * v.y + v.z * v.z + v.w * v.w;
    }
    /** Computes `1.0 / len()` for given vector. */
    static rlen(v: num4): number {
        return rsqrt(vec4.len2(v));
    }
    /** Return the euclidean distance between `lhs` and `rhs`. */
    static dist(lhs: num4, rhs: num4): number {
        return vec4.len(vec4.sub(lhs, rhs));
    }
    /** Return the euclidean distance squared between `lhs` and `rhs`. */
    static dist2(lhs: num4, rhs: num4): number {
        return vec4.len2(vec4.sub(lhs, rhs));
    }
    /** Return `v` as a normalized vector. */
    static normalize(v: num4): vec4
    static normalize<T extends num4>(v: num4, out?: T): T
    static normalize<T extends num4>(v: num4, out?: T) {
        return vec4.scale(v, recip(vec4.len(v)), out);
    }
    /** Return the normalized vector of `v` if possible, else `(0,0,0)`. */
    static normalizeSafe(v: num4): vec4
    static normalizeSafe<T extends num4>(v: num4, out?: T): T
    static normalizeSafe<T extends num4>(v: num4, out?: T) {
        let rcp = vec4.rlen(v);
        if (rcp > 0.0 && isFinite(rcp)) {
            return vec4.normalize(v, out) as T;
        }
        return vec4.set(out ?? vec4(), 0, 0, 0, 0) as T;
    }
    /** Return the dot product of given vectors. */
    static dot(lhs: num4, rhs: num4): number {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z + lhs.w * rhs.w;
    }
    /** Return the vector projection of `self` onto `rhs`. */
    static project(lhs: num4, rhs: num4): vec4
    static project<T extends num4>(lhs: num4, rhs: num4, out?: T): T
    static project<T extends num4>(lhs: num4, rhs: num4, out?: T) {
        return vec4.scale(rhs, vec4.dot(lhs, rhs) / vec4.dot(rhs, rhs), out);
    }
    /** Return the vector rejection of `lhs` from `rhs`. */
    static reject(lhs: num4, rhs: num4): vec4
    static reject<T extends num4>(lhs: num4, rhs: num4, out?: T): T
    static reject<T extends num4>(lhs: num4, rhs: num4, out?: T) {
        return vec4.sub(lhs, vec4.project(lhs, rhs, out), out);
    }
    /** Performs a linear interpolation between `a` and `b` based on the value `t`. */
    static lerp(a: num4, b: num4, t: number): vec4
    static lerp<T extends num4>(a: num4, b: num4, t: number, out?: T): T
    static lerp<T extends num4>(a: num4, b: num4, t: number, out?: T) {
        return vec4.add(a, vec4.scale(vec4.sub(b, a, v1), t, v1), out) as T;
    }
});

/** @internal */
export class Vec4 implements num4 {
    x: number;
    y: number;
    z: number;
    w: number;
    /** Create a 4-dimensional vector. */
    constructor(x: number, y: number, z: number, w: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    /** Set properties of this vector */
    set(...args: SetParams<typeof vec4>): this {
        return vec4.set(this, ...args);
    }
    /** Clone this vector */
    clone() {
        return vec4.clone(this);
    }
    /** Copy properties from `v` */
    copy(v: num4): this {
        return vec4.copy(this, v);
    }
    /** Return a string representation  */
    toString() {
        return vec4.fmt(this);
    }
    /** Return each element as an array. */
    toArray(): [x: number, y: number, z: number, w: number] {
        return vec4.toArray(this);
    }
    /** Return `x`, `y` and `z` components as a 2-dim vector. Defaults to `this` if no `out` parameter is given. */
    trunc<T extends num3>(): vec3
    trunc<T extends num3>(out?: T): T
    trunc<T extends num3>(out?: T) {
        return vec4.trunc(this, out ?? this) as T;
    }
    /** Return true if each element of `this` is finite. */
    isFinite(): boolean {
        return vec4.isFinite(this);
    }
    /** Return true if any element of `this` is NaN. */
    isNan(): boolean {
        return vec4.isNan(this);
    }
    /** Return true if `this` is normalized. */
    isNormalized(): boolean {
        return vec4.isNormalized(this);
    }
    /** Adds `rhs` to `this`. */
    add(rhs: num4): this {
        return vec4.add(this, rhs, this);
    }
    /** Subtracts `rhs` from `this`. */
    sub(rhs: num4): this {
        return vec4.sub(this, rhs, this);
    }
    /** Multiplies the vector by a scalar. */
    mul(rhs: num4): this {
        return vec4.mul(this, rhs, this);
    }
    /** Scales the vector by `rhs`. */
    scale(scale: number): this {
        return vec4.scale(this, scale, this);
    }
    /** Divides `this` by `rhs`. */
    div(rhs: num4): this {
        return vec4.div(this, rhs, this);
    }
    /** Check equality between `this` and `rhs`. */
    eq(rhs: num4): boolean {
        return vec4.eq(this, rhs);
    }
    /** Set vector to absolute values. */
    abs(): this {
        return vec4.abs(this, this);
    }
    /** Negates the vector.*/
    neg(): this {
        return vec4.neg(this, this);
    }
    /** Inverse the vector */
    inv(): this {
        return vec4.inv(this, this);
    }
    /** Return the length. */
    len(): number {
        return vec4.len(this);
    }
    /** Return the length squared. */
    len2(): number {
        return vec4.len2(this);
    }
    /** Computes `1.0 / len()`. */
    rlen(): number {
        return vec4.rlen(this);
    }
    /** Return the dot product of of `this` & `rhs`. */
    dist(rhs: num4): number {
        return vec4.dist(this, rhs);
    }
    /** Return the cross product of `this` & `rhs`. */
    dist2(rhs: num4): number {
        return vec4.dist2(this, rhs);
    }
    /** Normalizes the vector. */
    normalize(): this {
        return vec4.normalize(this, this);
    }
    /** Safely normalizes `this` if possible, else `(0,0)`. */
    normalizeSafe(): this {
        return vec4.normalizeSafe(this, this);
    }
    /** Dot product of `this` & `rhs`. */
    dot(rhs: num4): number {
        return vec4.dot(this, rhs);
    }
    /** Project `this` onto `rhs`. */
    project(rhs: num4): vec4
    project<T extends num4>(rhs: num4, out?: T): T
    project<T extends num4>(rhs: num4, out?: T) {
        return vec4.project(this, rhs, out ?? this);
    }
    /** Rejection of `this` from `rhs`. */
    reject(rhs: num4): vec4
    reject<T extends num4>(rhs: num4, out?: T): T
    reject<T extends num4>(rhs: num4, out?: T) {
        return vec4.reject(this, rhs, out ?? this);
    }
    /** Performs a linear interpolation between `this` and `v` based on the value `t`. */
    lerp(v: num4, t: number): this {
        return vec4.lerp(this, v, t, this);
    }
}

/** @internal */
let v1 = vec4();