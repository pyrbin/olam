import { createImpl, Static } from "../base";
import { deg, epsilon, feq, rsqrt, sincos } from "../math";
import { vec2 } from "./vec2";
import { vec4 } from "./vec4";

/** A 3-dimensional vector.*/
export interface vec3 extends Vec3 { };

export const vec3 = createImpl(class Vec3Impl extends Static {
    /** Creates a 3-dimensional vector with all elements set to `v`. */
    // @ts-ignore
    static create(v: number = 0): Vec3
    /** Creates a 3-dimensional vector. */
    static create(x: number, y: number, z: number): Vec3
    static create(x: number, y: number, z: number) {
        return new Vec3(x, y ?? x, z ?? x);
    }
    /** Creates a vector where each element is set to `0`. */
    static zero(): vec3 {
        return this.create(0);
    }
    /** Creates a vector where each element is set to `1`. */
    static one(): vec3 {
        return this.create(1);
    }
    /** Creates a unit-length vector pointing along the positive y-axis. */
    static up(): vec3 {
        return this.create(0, 1, 0);
    }
    /** Creates a unit-length vector pointing along the negative y-axis. */
    static down(): vec3 {
        return this.create(0, -1, 0);
    }
    /** Creates a unit-length vector pointing along the negative x-axis. */
    static left(): vec3 {
        return this.create(-1, 0, 0);
    }
    /** Creates a unit-length vector pointing along the positive x-axis. */
    static right(): vec3 {
        return this.create(1, 0, 0);
    }
    /** Creates a unit-length vector pointing along the negative z-axis. */
    static back(): vec3 {
        return this.create(0, 0, -1);
    }
    /** Creates a unit-length vector pointing along the positive z-axis. */
    static forward(): vec3 {
        return this.create(0, 0, 1);
    }
    /** Set properties of given vector `target` */
    static set<T extends num3>(target: T, ...args: SetParams<typeof vec3>): T {
        target.x = args[0];
        target.y = args[1];
        target.z = args[2];
        return target;
    }
    /** Copy properties from `b` to target vector `a` */
    static copy<T extends num3>(a: T, b: num3): T {
        return this.set(a, b.x, b.y, b.z);
    }
    /** Clone `target` vector. */
    static clone(target: num3) {
        return this.copy(vec3(), target);
    }
    /** Returns a string representation  */
    static fmt(target: num3) {
        return `(${target.x}, ${target.y}, ${target.z})`;
    }
    /** Create a vector from an array-like. */
    static fromArray(array: ArrayLike<number>): vec3
    static fromArray<T extends num3>(array: ArrayLike<number>, out?: T): T
    static fromArray<T extends num3>(array: ArrayLike<number>, out?: T) {
        return this.set(out ?? vec3(), array[0] as number, array[1] as number, array[2] as number);
    }
    /** Returns each element of `target` as an array. */
    static toArray(target: num3): [x: number, y: number, z: number] {
        return [target.x, target.y, target.z];
    }
    /** Returns `x` and `y` components as a 2-dim vector. */
    static xy(target: num3): vec2
    static xy<T extends num2>(target: num3, out?: T): T
    static xy<T extends num2>(target: num3, out?: T) {
        return vec2.set(out ?? vec2(), target.x, target.y) as T;
    }
    /** Returns `x` and `y` components as a 2-dim vector. */
    static trunc(target: num3): vec2
    static trunc<T extends num2>(target: num3, out?: T): T
    static trunc<T extends num2>(target: num3, out?: T) {
        return this.xy(target, out) as T;
    }
    static extend(target: num4, w?: number): vec3
    static extend<T extends num4>(target: num3, w?: number, out?: T): T
    static extend<T extends num4>(target: num3, w?: number, out?: T) {
        return vec4.set(out ?? vec4(), target.x, target.y, target.z, w ?? 0) as T;
    }
    /** Returns `y` and `z` components as a 2-dim vector. */
    static yz(target: num3): vec2
    static yz<T extends num2>(target: num3, out?: T): T
    static yz<T extends num2>(target: num3, out?: T) {
        return vec2.set(out ?? vec2(), target.y, target.z) as T;
    }
    /** Returns `x` and `z` components as a 2-dim vector. */
    static xz(target: num3): vec2
    static xz<T extends num2>(target: num3, out?: T): T
    static xz<T extends num2>(target: num3, out?: T) {
        return vec2.set(out ?? vec2(), target.x, target.z) as T;
    }
    /** Returns given `target` vector with `z` component set to zero. */
    static xy0(target: num3): vec3
    static xy0<T extends num3>(target: num3, out?: T): T
    static xy0<T extends num3>(target: num3, out?: T) {
        return this.set(out ?? vec3(), target.x, target.y, 0) as T;
    }
    /** Returns true if each element of `target` is finite. */
    static isFinite(target: num3): boolean {
        return isFinite(target.x) && isFinite(target.y) && isFinite(target.z);
    }
    /** Returns true if any element of `target` is NaN. */
    static isNan(target: num3): boolean {
        return isNaN(target.x) || isNaN(target.y) || isNaN(target.z);
    }
    /** Returns true if given vector is normalized. */
    static isNormalized(target: num3): boolean {
        return Math.abs(this.len2(target) - 1) <= epsilon;
    }
    /** Adds `lhs` and `rhs`. */
    static add(lhs: num3, rhs: num3): vec3
    static add<T extends num3>(lhs: num3, rhs: num3, out?: T): T
    static add<T extends num3>(lhs: num3, rhs: num3, out?: T) {
        return this.set(out ?? vec3(), lhs.x + rhs.x, lhs.y + rhs.y, lhs.z + rhs.z) as T;
    }
    /** Subtracts `lhs` and `rhs`. */
    static sub(lhs: num3, rhs: num3): vec3
    static sub<T extends num3>(lhs: num3, rhs: num3, out?: T): T
    static sub<T extends num3>(lhs: num3, rhs: num3, out?: T) {
        return this.set(out ?? vec3(), lhs.x - rhs.x, lhs.y - rhs.y, lhs.z - rhs.z) as T;
    }
    /** Multiplies `lhs` and `rhs`. */
    static mul(lhs: num3, rhs: num3): vec3
    static mul<T extends num3>(lhs: num3, rhs: num3, out?: T): T
    static mul<T extends num3>(lhs: num3, rhs: num3, out?: T) {
        return this.set(out ?? vec3(), lhs.x * rhs.x, lhs.y * rhs.y, lhs.z * rhs.z) as T;
    }
    /** Multiplies a vector `lhs` and a scale value `rhs`. */
    static scale(lhs: num3, rhs: number): vec3
    static scale<T extends num3>(lhs: num3, rhs: number, out?: T): T
    static scale<T extends num3>(lhs: num3, scale: number, out?: T) {
        return this.set(out ?? vec3(), lhs.x * scale, lhs.y * scale, lhs.z * scale) as T;
    }
    /** Division between between `lhs` and `rhs`. */
    static div(lhs: num3, rhs: num3): vec3
    static div<T extends num3>(lhs: num3, rhs: num3, out?: T): T
    static div<T extends num3>(lhs: num3, rhs: num3, out?: T) {
        return this.set(out ?? vec3(), lhs.x / rhs.x, lhs.y / rhs.y, lhs.z / rhs.z) as T;
    }
    /** Check equality between `lhs` and `rhs`. */
    static eq(lhs: num3, rhs: num3): boolean {
        return feq(lhs.x, rhs.x) && feq(lhs.y, rhs.y) && feq(lhs.z, rhs.z);
    }
    /** Returns a vector containing the absolute value of each element of `target`. */
    static abs(target: num3): vec3
    static abs<T extends num3>(target: num3, out?: T): T
    static abs<T extends num3>(target: num3, out?: T) {
        return this.set(out ?? vec3(), Math.abs(target.x), Math.abs(target.y), Math.abs(target.z)) as T;
    }
    /** Returns a vector containing the negative value of each element of `target`. */
    static neg(target: num3): vec3
    static neg<T extends num3>(target: num3, out?: T): T
    static neg<T extends num3>(target: num3, out?: T) {
        return this.set(out ?? vec3(), -target.x, -target.y, -target.z) as T;
    }
    /** Returns a vector containing the inverse value of each element of `target`. */
    static inv(target: num3): vec3
    static inv<T extends num3>(target: num3, out?: T): T
    static inv<T extends num3>(target: num3, out?: T) {
        return this.set(out ?? vec3(), 1 / target.x, 1 / target.y, 1 / target.z) as T;
    }
    /** Returns a vector that is equal to `target` rotated by 90 degrees. */
    static perp(target: num3): vec3
    static perp<T extends num3>(target: num3, out?: T): T
    static perp<T extends num3>(target: num3, out?: T) {
        return this.rotate(target, deg(90), out) as T;
    }
    /** Returns the length for given vector */
    static len(target: num3): number {
        return Math.sqrt(this.len2(target));
    }
    /** Returns the length squared for given vector. */
    static len2(target: num3): number {
        return target.x * target.x + target.y * target.y + target.z * target.z;
    }
    /** Computes `1.0 / len()` for given vector. */
    static rlen(target: num3): number {
        return rsqrt(this.len2(target));
    }
    /** Returns the euclidean distance between `lhs` and `rhs`. */
    static dist(lhs: num3, rhs: num3): number {
        return this.len(this.sub(lhs, rhs));
    }
    /** Returns the euclidean distance squared between `lhs` and `rhs`. */
    static dist2(lhs: num3, rhs: num3): number {
        return this.len2(this.sub(lhs, rhs));
    }
    /** Returns `target` as a normalized vector. */
    static normalize(target: num3): vec3
    static normalize<T extends num3>(target: num3, out?: T): T
    static normalize<T extends num3>(target: num3, out?: T) {
        return this.scale(target, rsqrt(this.dot(target, target)), out) as T;
    }
    /** Returns the normalized vector of `target` if possible, else `(0,0,0)`. */
    static normalizeSafe(target: num3): vec3
    static normalizeSafe<T extends num3>(target: num3, out?: T): T
    static normalizeSafe<T extends num3>(target: num3, out?: T) {
        let rcp = this.rlen(target);
        if (rcp > 0.0 && isFinite(rcp)) {
            return this.normalize(target, out) as T;
        }
        return this.set(out ?? vec3(), 0, 0, 0) as T;
    }
    /** Returns the dot product of given vectors. */
    static dot(lhs: num3, rhs: num3): number {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z;
    }
    /** Returns the cross product of given vectors. */
    static cross(lhs: num3, rhs: num3): vec3
    static cross<T extends num3>(lhs: num3, rhs: num3, out?: T): T
    static cross<T extends num3>(lhs: num3, rhs: num3, out?: T) {
        return this.set(out ?? vec3(),
            lhs.y * rhs.z - lhs.z * rhs.y,
            lhs.z * rhs.x - lhs.x * rhs.z,
            lhs.x * rhs.y - lhs.y * rhs.x) as T;
    }
    /** Returns the vector projection of `self` onto `rhs`. */
    static project(lhs: num3, rhs: num3): vec3
    static project<T extends num3>(lhs: num3, rhs: num3, out?: T): T
    static project<T extends num3>(lhs: num3, rhs: num3, out?: T) {
        return vec3.scale(rhs, this.dot(lhs, rhs) / this.dot(rhs, rhs), out) as T;
    }
    /** Returns the vector rejection of `lhs` from `rhs`. */
    static reject(lhs: num3, rhs: num3): vec3
    static reject<T extends num3>(lhs: num3, rhs: num3, out?: T): T
    static reject<T extends num3>(lhs: num3, rhs: num3, out?: T) {
        return this.sub(lhs, this.project(lhs, rhs, out), out) as T;
    }
    /** Returns the angle (in radians) between the . */
    static angle(lhs: num3, rhs: num3): number {
        return Math.acos(this.dot(lhs, rhs) / Math.sqrt((this.len2(lhs) * this.len2(rhs))));
    }
    /** Returns a vector where `target` is rotated by an angle in radians. */
    static rotate(target: num3, radians: number): vec3
    static rotate<T extends num3>(target: num3, radians: number, out?: T): T
    static rotate<T extends num3>(target: num3, radians: number, out?: T) {
        let [sin, cos] = sincos(radians)
        return this.set(out ?? vec3(),
            target.x * cos - target.y * sin,
            target.x * sin + target.y * cos,
            target.z) as T;
    }
    /** Performs a linear interpolation between `a` and `b` based on the value `t`. */
    static lerp(a: num3, b: num3, t: number): vec3
    static lerp<T extends num3>(a: num3, b: num3, t: number, out?: T): T
    static lerp<T extends num3>(a: num3, b: num3, t: number, out?: T) {
        return this.add(a, this.scale(this.sub(b, a, v1), t, v1), out) as T;
    }
});

/** @internal */
class Vec3 implements num3 {
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
    set(...args: SetParams<typeof vec3>): this {
        return vec3.set(this, ...args);
    }
    /** Copy properties from `src` */
    copy(src: num3): this {
        return vec3.copy(this, src);
    }
    /** Clone this vector. */
    clone(): vec3 {
        return vec3.clone(this);
    }
    /** Returns a string representation  */
    toString() {
        return vec3.fmt(this);
    }
    /** Returns each element as an array. */
    toArray(): [x: number, y: number, z: number] {
        return vec3.toArray(this);
    }
    /** Returns `x` and `y` components as a 2-dim vector. */
    xy(): vec2
    xy<T extends num2>(out?: T): T
    xy<T extends num2>(out?: T) {
        return vec3.xy(this, out ?? vec2()) as T;
    }
    /** Returns `x` and `y` components as a 2-dim vector. Defaults to `this` if no `out` parameter is given. */
    trunc(): vec2
    trunc<T extends num2>(out?: T): T
    trunc<T extends num2>(out?: T) {
        return vec3.trunc(this, out ?? this) as T;
    }
    /** Returns `target` as a 3-dimensional vector with given `z` value. */
    extend(w?: number): vec4
    extend<T extends num4>(w?: number, out?: T): T
    extend<T extends num4>(w?: number, out?: T) {
        return vec3.extend(this, w, out ?? vec4()) as T;
    }
    /** Returns `y` and `z` components as a 2-dim vector. */
    yz(): vec2
    yz<T extends num2>(out?: T): T
    yz<T extends num2>(out?: T) {
        return vec3.yz(this, out ?? vec2()) as T;
    }
    /** Returns `x` and `z` components as a 2-dim vector. */
    xz(): vec2
    xz<T extends num2>(out?: T): T
    xz<T extends num2>(out?: T) {
        return vec3.xz(this, out ?? vec2()) as T;
    }
    /** Returns vector with `z` component set to zero. */
    xy0(): vec3
    xy0<T extends num3>(out?: T): T
    xy0<T extends num3>(out?: T) {
        return vec3.xy0(this, out ?? vec3()) as T;
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
    /** Adds `rhs` to `this`. */
    add(rhs: num3): this {
        return vec3.add(this, rhs, this);
    }
    /** Subtracts `rhs` from `this`. */
    sub(rhs: num3): this {
        return vec3.sub(this, rhs, this);
    }
    /** Multiplies the vector by a scalar. */
    mul(rhs: num3): this {
        return vec3.mul(this, rhs, this);
    }
    /** Scales the vector by `rhs`. */
    scale(scale: number): this {
        return vec3.scale(this, scale, this);
    }
    /** Divides `this` by `rhs`. */
    div(rhs: num3): this {
        return vec3.div(this, rhs, this);
    }
    /** Check equality between `this` and `rhs`. */
    eq(rhs: num3): boolean {
        return vec3.eq(this, rhs);
    }
    /** Set vector to absolute values. */
    abs(): this {
        return vec3.abs(this, this);
    }
    /** Negates the vector.*/
    neg(): this {
        return vec3.neg(this, this);
    }
    /** Inverse the vector */
    inv(): this {
        return vec3.inv(this, this);
    }
    /** Rotate vector by 90 degrees */
    perp(): this {
        return vec3.perp(this, this);
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
    dist(rhs: num3): number {
        return vec3.dist(this, rhs);
    }
    /** Returns the cross product of `this` & `rhs`. */
    dist2(rhs: num3): number {
        return vec3.dist2(this, rhs);
    }
    /** Normalizes the vector. */
    normalize(): this {
        return vec3.normalize(this, this);
    }
    /** Safely normalizes `this` if possible, else `(0,0)`. */
    normalizeSafe(): this {
        return vec3.normalizeSafe(this, this);
    }
    /** Dot product of `this` & `rhs`. */
    dot(rhs: num3): number {
        return vec3.dot(this, rhs);
    }
    /** Cross product of `this` & `rhs`. */
    cross(rhs: num3): this {
        return vec3.cross(this, rhs, this);
    }
    /** Project `this` onto `rhs`. */
    project(rhs: num3): this
    project<T extends num3>(rhs: num3, out?: T): T
    project<T extends num3>(rhs: num3, out?: T) {
        return vec3.project(this, rhs, out ?? this);
    }
    /** Rejection of `this` from `rhs`. */
    reject(rhs: num3): this
    reject<T extends num3>(rhs: num3, out?: T): T
    reject<T extends num3>(rhs: num3, out?: T) {
        return vec3.reject(this, rhs, out ?? this);
    }
    /** Returns the angle (in radians) between `this` and `rhs`. */
    angle(rhs: num3): number {
        return vec3.angle(this, rhs);
    }
    /** Rotate by an angle in radians. */
    rotate(radians: number): this {
        return vec3.rotate(this, radians, this);
    }
    /** Performs a linear interpolation between `this` and `target` based on the value `t`. */
    lerp(target: num3, t: number): this {
        return vec3.lerp(this, target, t, this);
    }
}

/** @internal */
let v1 = vec3(0, 0, 0);