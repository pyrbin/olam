import { createImpl, Static } from "../base";
import { epsilon, feq, recip, rsqrt } from "../math";
import { vec3 } from "./vec3";

/** A 4-dimensional vector.*/
export interface vec4 extends Vec4 { };

export const vec4 = createImpl(class Vec4Impl extends Static {
    /** Creates a 4-dimensional vector with all elements set to `v`. */
    // @ts-ignore
    static create(v: number = 0): vec4
    /** Creates a 4-dimensional vector. */
    static create(x: number, y: number, z: number, w: number): vec4
    static create(x: number, y: number, z: number, w: number) {
        return new Vec4(x, y ?? x, z ?? x, w ?? x);
    }
    /** Creates a vector where each element is set to `0`. */
    static zero(): vec4 {
        return this.create(0);
    }
    /** Creates a vector where each element is set to `1`. */
    static one(): vec4 {
        return this.create(1);
    }
    /** Creates a unit-length vector pointing along the positive y-axis. */
    static up(): vec4 {
        return this.create(1, 0, 0, 0);
    }
    /** Creates a unit-length vector pointing along the negative y-axis. */
    static down(): vec4 {
        return this.create(-1, 0, 0, 0);
    }
    /** Creates a unit-length vector pointing along the negative x-axis. */
    static left(): vec4 {
        return this.create(0, -1, 0, 0);
    }
    /** Creates a unit-length vector pointing along the positive x-axis. */
    static right(): vec4 {
        return this.create(0, 1, 0, 0);
    }
    /** Creates a unit-length vector pointing along the negative z-axis. */
    static back(): vec4 {
        return this.create(0, 0, -1, 0);
    }
    /** Creates a unit-length vector pointing along the positive z-axis. */
    static forward(): vec4 {
        return this.create(0, 0, 1, 0);
    }
    /** Set properties of given vector `target` */
    static set<T extends num4>(target: T, x: number, y: number, z: number, w: number): T {
        target.x = x;
        target.y = y;
        target.z = z;
        target.w = w;
        return target;
    }
    /** Copy properties from `b` to target vector `a` */
    static copy<T extends num4>(target: T, source: num4): T {
        return this.set(target, source.x, source.y, source.z, source.w);
    }
    /** Returns a string representation  */
    static fmt(target: num4): string {
        return `(${target.x}, ${target.y}, ${target.z}, ${target.w})`;
    }
    /** Create a vector from an array-like. */
    static fromArray(array: ArrayLike<number>): vec4
    static fromArray<T extends num4>(array: ArrayLike<number>, out?: T): T
    static fromArray<T extends num4>(array: ArrayLike<number>, out?: T) {
        return this.set(out ?? vec4(), array[0], array[1], array[2], array[3]);
    }
    /** Returns each element of `target` as an array. */
    static toArray(target: num4): [x: number, y: number, z: number, w: number] {
        return [target.x, target.y, target.z, target.w];
    }
    /** Returns `x`, `y` and `z` components as a 3-dim vector. */
    static trunc(target: num4): vec3
    static trunc<T extends num3>(target: num4, out?: T): T
    static trunc<T extends num3>(target: num4, out?: T) {
        return vec3.set(out ?? vec3(), target.x, target.y, target.z) as T;
    }
    /** Returns true if each element of `target` is finite. */
    static isFinite(target: num4): boolean {
        return isFinite(target.x) && isFinite(target.y) && isFinite(target.z) && isFinite(target.w);
    }
    /** Returns true if any element of `target` is NaN. */
    static isNan(target: num4): boolean {
        return isNaN(target.x) || isNaN(target.y) || isNaN(target.z) || isNaN(target.w);
    }
    /** Returns true if given vector is normalized. */
    static isNormalized(target: num4): boolean {
        return Math.abs(this.len2(target) - 1) <= epsilon;
    }
    /** Adds `lhs` and `rhs`. */
    static add(lhs: num4, rhs: num4): vec4
    static add<T extends num4>(lhs: num4, rhs: num4, out?: T): T
    static add<T extends num4>(lhs: num4, rhs: num4, out?: T) {
        return this.set(out ?? vec4(), lhs.x + rhs.x, lhs.y + rhs.y, lhs.z + rhs.z, lhs.w + rhs.w);
    }
    /** Subtracts `lhs` and `rhs`. */
    static sub(lhs: num4, rhs: num4): vec4
    static sub<T extends num4>(lhs: num4, rhs: num4, out?: T): T
    static sub<T extends num4>(lhs: num4, rhs: num4, out?: T) {
        return this.set(out ?? vec4(), lhs.x - rhs.x, lhs.y - rhs.y, lhs.z - rhs.z, lhs.w - rhs.w);
    }
    /** Multiplies `lhs` and `rhs`. */
    static mul(lhs: num4, rhs: num4): vec4
    static mul<T extends num4>(lhs: num4, rhs: num4, out?: T): T
    static mul<T extends num4>(lhs: num4, rhs: num4, out?: T) {
        return this.set(out ?? vec4(), lhs.x * rhs.x, lhs.y * rhs.y, lhs.z * rhs.z, lhs.w * rhs.w);
    }
    /** Multiplies a vector `lhs` and a scale value `rhs`. */
    static scale(lhs: num4, rhs: number): vec4
    static scale<T extends num4>(lhs: num4, rhs: number, out?: T): T
    static scale<T extends num4>(lhs: num4, scale: number, out?: T) {
        return this.set(out ?? vec4(), lhs.x * scale, lhs.y * scale, lhs.z * scale, lhs.w * scale);
    }
    /** Division between between `lhs` and `rhs`. */
    static div(lhs: num4, rhs: num4): vec4
    static div<T extends num4>(lhs: num4, rhs: num4, out?: T): T
    static div<T extends num4>(lhs: num4, rhs: num4, out?: T) {
        return this.set(out ?? vec4(), lhs.x / rhs.x, lhs.y / rhs.y, lhs.z / rhs.z, lhs.w / rhs.w);
    }
    /** Check equality between `lhs` and `rhs`. */
    static eq(lhs: num4, rhs: num4): boolean {
        return feq(lhs.x, rhs.x) && feq(lhs.y, rhs.y) && feq(lhs.z, rhs.z) && feq(lhs.w, rhs.w);
    }
    /** Returns a vector containing the absolute value of each element of `target`. */
    static abs(target: num4): vec4
    static abs<T extends num4>(target: num4, out?: T): T
    static abs<T extends num4>(target: num4, out?: T) {
        return this.set(out ?? vec4(), Math.abs(target.x), Math.abs(target.y), Math.abs(target.z), Math.abs(target.w));
    }
    /** Returns a vector containing the negative value of each element of `target`. */
    static neg(target: num4): vec4
    static neg<T extends num4>(target: num4, out?: T): T
    static neg<T extends num4>(target: num4, out?: T) {
        return this.set(out ?? vec4(), -target.x, -target.y, -target.z, -target.w);
    }
    /** Returns a vector containing the inverse value of each element of `target`. */
    static inv(target: num4): vec4
    static inv<T extends num4>(target: num4, out?: T): T
    static inv<T extends num4>(target: num4, out?: T) {
        return this.set(out ?? vec4(), 1 / target.x, 1 / target.y, 1 / target.z, 1 / target.w);
    }
    /** Returns the length for given vector */
    static len(target: num4): number {
        return Math.sqrt(this.len2(target));
    }
    /** Returns the length squared for given vector. */
    static len2(target: num4): number {
        return target.x * target.x + target.y * target.y + target.z * target.z + target.w * target.w;
    }
    /** Computes `1.0 / len()` for given vector. */
    static rlen(target: num4): number {
        return rsqrt(this.len2(target));
    }
    /** Returns the euclidean distance between `lhs` and `rhs`. */
    static dist(lhs: num4, rhs: num4): number {
        return this.len(this.sub(lhs, rhs));
    }
    /** Returns the euclidean distance squared between `lhs` and `rhs`. */
    static dist2(lhs: num4, rhs: num4): number {
        return this.len2(this.sub(lhs, rhs));
    }
    /** Returns `target` as a normalized vector. */
    static normalize(target: num4): vec3
    static normalize<T extends num4>(target: num4, out?: T): T
    static normalize<T extends num4>(target: num4, out?: T) {
        return this.scale(target, recip(this.len(target)), out);
    }
    /** Returns the normalized vector of `target` if possible, else `(0,0,0)`. */
    static normalizeSafe(target: num4): vec3
    static normalizeSafe<T extends num4>(target: num4, out?: T): T
    static normalizeSafe<T extends num4>(target: num4, out?: T) {
        let rcp = this.rlen(target);
        if (rcp > 0.0 && isFinite(rcp)) {
            return this.normalize(target, out) as T;
        }
        return this.set(out ?? vec4(), 0, 0, 0, 0) as T;
    }
    /** Returns the dot product of given vectors. */
    static dot(lhs: num4, rhs: num4): number {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z + lhs.w * rhs.w;
    }
    /** Returns the vector projection of `self` onto `rhs`. */
    static project(lhs: num4, rhs: num4): vec3
    static project<T extends num4>(lhs: num4, rhs: num4, out?: T): T
    static project<T extends num4>(lhs: num4, rhs: num4, out?: T) {
        return this.scale(rhs, this.dot(lhs, rhs) / this.dot(rhs, rhs), out);
    }
    /** Returns the vector rejection of `lhs` from `rhs`. */
    static reject(lhs: num4, rhs: num4): vec3
    static reject<T extends num4>(lhs: num4, rhs: num4, out?: T): T
    static reject<T extends num4>(lhs: num4, rhs: num4, out?: T) {
        return this.sub(lhs, this.project(lhs, rhs, out), out);
    }
    /** Performs a linear interpolation between `a` and `b` based on the value `t`. */
    static lerp(a: num4, b: num4, t: number): vec4
    static lerp<T extends num4>(a: num4, b: num4, t: number, out?: T): T
    static lerp<T extends num4>(a: num4, b: num4, t: number, out?: T) {
        return this.add(a, this.scale(this.sub(b, a, v1), t, v1), out) as T;
    }
});


/** @internal */
class Vec4 implements num4 {
    x: number;
    y: number;
    z: number;
    w: number;
    /** Creates a 4-dimensional vector. */
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
    /** Copy properties from `src` */
    copy(src: num4): this {
        return vec4.copy(this, src);
    }
    /** Returns a string representation  */
    toString() {
        return vec4.fmt(this);
    }
    /** Returns each element as an array. */
    toArray(): [x: number, y: number, z: number, w: number] {
        return vec4.toArray(this);
    }
    /** Returns `x`, `y` and `z` components as a 2-dim vector. Defaults to `this` if no `out` parameter is given. */
    trunc<T extends num3>(): vec3
    trunc<T extends num3>(out?: T): T
    trunc<T extends num3>(out?: T) {
        return vec4.trunc(this, out ?? this) as T;
    }
    /** Returns true if each element of `this` is finite. */
    isFinite(): boolean {
        return vec4.isFinite(this);
    }
    /** Returns true if any element of `this` is NaN. */
    isNan(): boolean {
        return vec4.isNan(this);
    }
    /** Returns true if `this` is normalized. */
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
    /** Returns the length. */
    len(): number {
        return vec4.len(this);
    }
    /** Returns the length squared. */
    len2(): number {
        return vec4.len2(this);
    }
    /** Computes `1.0 / len()`. */
    rlen(): number {
        return vec4.rlen(this);
    }
    /** Returns the dot product of of `this` & `rhs`. */
    dist(rhs: num4): number {
        return vec4.dist(this, rhs);
    }
    /** Returns the cross product of `this` & `rhs`. */
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
        return vec3.dot(this, rhs);
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
    /** Performs a linear interpolation between `this` and `target` based on the value `t`. */
    lerp(target: num4, t: number): this {
        return vec4.lerp(this, target, t, this);
    }
}

/** @internal */
let v1 = vec4();
