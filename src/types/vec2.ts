import { createImpl, Static } from "../base";
import { assert } from "../debug";
import { deg, epsilon, feq, recip, rsqrt, sincos } from "../math";
import { vec3 } from "./vec3";

/** A 2-dimensional vector.*/
export interface vec2 extends Vec2 { }

export const vec2 = createImpl(class Vec2Impl extends Static {
    /** Creates a 2-dimensional vector with all elements set to `v`. */
    // @ts-ignore
    static create(v: number = 0): vec2
    /** Creates a 2-dimensional vector. */
    static create(x: number, y: number): vec2
    static create(x: number, y: number) {
        return new Vec2(x, y ?? x);
    }
    /** Creates a vector where each element is set to `0`. */
    static zero(): vec2 {
        return this.create(0);
    }
    /** Creates a vector where each element is set to `1`. */
    static one(): vec2 {
        return this.create(1);
    }
    /** Creates a unit-length vector pointing along the positive y-axis. */
    static up(): vec2 {
        return this.create(0, 1);
    }
    /** Creates a unit-length vector pointing along the negative y-axis. */
    static down(): vec2 {
        return this.create(0, -1);
    }
    /** Creates a unit-length vector pointing along the negative x-axis. */
    static left(): vec2 {
        return this.create(-1, 0);
    }
    /** Creates a unit-length vector pointing along the positive x-axis. */
    static right(): vec2 {
        return this.create(1, 0);
    }
    /** Set properties of given vector `target` */
    static set<T extends num2>(target: T, ...args: SetParams<typeof vec2>): T {
        target.x = args[0];
        target.y = args[1];
        return target;
    }
    /** Copy properties from `b` to target vector `a` */
    static copy<T extends num2>(a: T, b: num2): T {
        return this.set(a, b.x, b.y);
    }
    /** Clone this vector. */
    static clone(target: num2): vec2 {
        return this.copy(vec2(), target);
    }
    /** Returns a string representation  */
    static fmt(target: num2) {
        return `(${target.x}, ${target.y})`;
    }
    /** Create a vector from an array-like. */
    static fromArray(array: ArrayLike<number>): vec2
    static fromArray<T extends num2>(array: ArrayLike<number>, out?: T): T
    static fromArray<T extends num2>(array: ArrayLike<number>, out?: T) {
        return this.set(out ?? vec2(), array[0] as number, array[1] as number);
    }
    /** Returns each element of `target` as an array. */
    static toArray(target: num2): [x: number, y: number] {
        return [target.x, target.y];
    }
    /** Returns `target` as a 3-dimensional vector with given `z` value. */
    static extend(target: num2, z?: number): vec3
    static extend<T extends num3>(target: num2, z?: number, out?: T): T
    static extend<T extends num3>(target: num2, z?: number, out?: T) {
        return vec3.set(out ?? vec3(), target.x, target.y, z ?? 0) as T;
    }
    /** Returns true if each element of `target` is finite. */
    static isFinite(target: num2): boolean {
        return isFinite(target.x) && isFinite(target.y);
    }
    /** Returns true if any element of `target` is NaN. */
    static isNan(target: num2): boolean {
        return isNaN(target.x) || isNaN(target.y);
    }
    /** Returns true if given vector is normalized. */
    static isNormalized(target: num2): boolean {
        return Math.abs(this.len2(target) - 1) <= epsilon;
    }
    /** Adds `lhs` and `rhs`. */
    static add(lhs: num2, rhs: num2): vec2
    static add<T extends num2>(lhs: num2, rhs: num2, out?: T): T
    static add<T extends num2>(lhs: num2, rhs: num2, out?: T) {
        return this.set(out ?? vec2(), lhs.x + rhs.x, lhs.y + rhs.y) as T;
    }
    /** Subtracts `lhs` and `rhs`. */
    static sub(lhs: num2, rhs: num2): vec2
    static sub<T extends num2>(lhs: num2, rhs: num2, out?: T): T
    static sub<T extends num2>(lhs: num2, rhs: num2, out?: T) {
        return this.set(out ?? vec2(), lhs.x - rhs.x, lhs.y - rhs.y) as T;
    }
    /** Multiplies `lhs` and `rhs`. */
    static mul(lhs: num2, rhs: num2): vec2
    static mul<T extends num2>(lhs: num2, rhs: num2, out?: T): T
    static mul<T extends num2>(lhs: num2, rhs: num2, out?: T) {
        return this.set(out ?? vec2(), lhs.x * rhs.x, lhs.y * rhs.y) as T;
    }
    /** Multiplies a vector `lhs` and a scale value `rhs`. */
    static scale(lhs: num2, rhs: number): vec2
    static scale<T extends num2>(lhs: num2, rhs: number, out?: T): T
    static scale<T extends num2>(lhs: num2, rhs: number, out?: T) {
        return this.set(out ?? vec2(), lhs.x * rhs, lhs.y * rhs) as T;
    }
    /** Division between `lhs` and `rhs`. */
    static div(lhs: num2, rhs: num2): vec2
    static div<T extends num2>(lhs: num2, rhs: num2, out?: T): T
    static div<T extends num2>(lhs: num2, rhs: num2, out?: T) {
        return this.set(out ?? vec2(), lhs.x / rhs.x, lhs.y / rhs.y) as T;
    }
    /** Check equality between `lhs` and `rhs`. */
    static eq(lhs: num2, rhs: num2): boolean {
        return feq(lhs.x, rhs.x) && feq(lhs.y, rhs.y);
    }
    /** Returns a vector containing the absolute value of each element of `target`. */
    static abs(target: num2): vec2
    static abs<T extends num2>(target: num2, out?: T): T
    static abs<T extends num2>(target: num2, out?: T) {
        return this.set(out ?? vec2(), Math.abs(target.x), Math.abs(target.y)) as T;
    }
    /** Returns a vector containing the negative value of each element of `target`. */
    static neg(target: num2): vec2
    static neg<T extends num2>(target: num2, out?: T): T
    static neg<T extends num2>(target: num2, out?: T) {
        return this.set(out ?? vec2(), -target.x, -target.y) as T;
    }
    /** Returns a vector containing the inverse value of each element of `target`. */
    static inv(target: num2): vec2
    static inv<T extends num2>(target: num2, out?: T): T
    static inv<T extends num2>(target: num2, out?: T) {
        return this.set(out ?? vec2(), recip(target.x), recip(target.y)) as T;
    }
    /** Returns a vector that is equal to `target` rotated by 90 degrees. */
    static perp(target: num2): vec2
    static perp<T extends num2>(target: num2, out?: T): T
    static perp<T extends num2>(target: num2, out?: T) {
        return this.rotate(target, deg(90), out);
    }
    /** Returns the length for given vector. */
    static len(target: num2): number {
        return Math.sqrt(this.len2(target));
    }
    /** Returns the length squared for given vector. */
    static len2(target: num2): number {
        return target.x * target.x + target.y * target.y;
    }
    /** Computes `1.0 / len()` for given vector. */
    static rlen(target: num2): number {
        return rsqrt(this.len2(target));
    }
    /** Returns the euclidean distance between. */
    static dist(lhs: num2, rhs: num2): number {
        return this.len(this.sub(lhs, rhs));
    }
    /** Returns the euclidean distance squared between. */
    static dist2(lhs: num2, rhs: num2): number {
        return this.len2(this.sub(lhs, rhs));
    }
    /** Returns `target` as a normalized vector. */
    static normalize(target: num2): vec2
    static normalize<T extends num2>(target: num2, out?: T): T
    static normalize<T extends num2>(target: num2, out?: T) {
        return this.scale(target, recip(this.len(target)), out);
    }
    /** Returns the normalized vector of `target` if possible, else `(0,0)`. */
    static normalizeSafe(target: num2): vec2
    static normalizeSafe<T extends num2>(target: num2, out?: T): T
    static normalizeSafe<T extends num2>(target: num2, out?: T) {
        let rcp = this.rlen(target);
        if (rcp > 0.0 && isFinite(rcp)) {
            return this.normalize(target, out);
        }
        return this.set(out ?? vec2(), 0, 0) as T;
    }
    /** Returns the dot product of given. */
    static dot(lhs: num2, rhs: num2): number {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    }
    /** Returns the cross product of given. */
    static cross(lhs: num2, rhs: num2): number {
        return lhs.x * rhs.y - lhs.y * rhs.x;
    }
    /** Returns the vector projection of `lhs` onto `rhs`. */
    static project(lhs: num2, rhs: num2): vec2
    static project<T extends num2>(lhs: num2, rhs: num2, out?: T): T
    static project<T extends num2>(lhs: num2, rhs: num2, out?: T) {
        return vec2.scale(rhs, vec2.dot(lhs, rhs) / vec2.dot(rhs, rhs), out);
    }
    /** Returns the vector rejection of `lhs` from `rhs`. */
    static reject(lhs: num2, rhs: num2): vec2
    static reject<T extends num2>(lhs: num2, rhs: num2, out?: T): T
    static reject<T extends num2>(lhs: num2, rhs: num2, out?: T) {
        assert(this.isNormalized(rhs), "must be normalized");
        return this.sub(lhs, this.project(lhs, rhs, v1), out);
    }
    /** Returns the angle (in radians) between the. */
    static angle(lhs: num2, rhs: num2): number {
        let angle = Math.acos(this.dot(lhs, rhs) / (this.len(lhs) * this.len(rhs)));
        return angle * Math.sign(this.cross(lhs, rhs));
    }
    /** Returns a vector where `target` is rotated by an angle in radians. */
    static rotate(target: num2, radians: number): vec2
    static rotate<T extends num2>(target: num2, radians: number, out?: T): T
    static rotate<T extends num2>(target: num2, radians: number, out?: T): T {
        let [sin, cos] = sincos(radians);
        return this.set(out ?? vec2(), target.x * cos - target.y * sin, target.x * sin + target.y * cos) as T;
    }
    /** Performs a linear interpolation between `a` and `b` based on the value `t`. */
    static lerp(a: num2, b: num2, t: number): vec2
    static lerp<T extends num2>(a: num2, b: num2, t: number, out?: T): T
    static lerp<T extends num2>(a: num2, b: num2, t: number, out?: T): T {
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
    set(...args: SetParams<typeof vec2>): this {
        return vec2.set(this, ...args);
    }
    /** Copy properties from `src` */
    copy(src: num2): this {
        return vec2.copy(this, src);
    }
    /** Clone this vector */
    clone(): vec2 {
        return vec2.clone(this);
    }
    /** Returns a string representation  */
    toString() {
        return vec2.fmt(this);
    }
    /** Returns each element as an array. */
    toArray(): [x: number, y: number] {
        return vec2.toArray(this);
    }
    /** Returns `this` as a 3-dimensional vector with given `z` value. */
    extend(z?: number): vec3
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
    /** Inverse the vector */
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

/** @internal */
let v1 = vec2(0, 0);