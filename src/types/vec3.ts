import { deg, epsilon, recip, rsqrt, sincos } from "../math";
import { createType } from "../type";
import { vec2 } from "./vec2";

/** A 3-dimensional vector. */
export interface vec3 {
    x: number;
    y: number;
    z: number;
}

/** Implements math operations for a 3-dimensional vector. */
export const vec3 = createType({
    /** Creates a vector. */
    new(x: number = 0, y: number = x, z: number = y): vec3 {
        return { x, y, z };
    },
    /** Creates a vector where each element is set to `0`. */
    zero(): vec3 {
        return this.new(0);
    },
    /** Creates a vector where each element is set to `1`. */
    one(): vec3 {
        return this.new(1);
    },
    /** Creates a vector where each element is set to `-1`. */
    negOne(): vec3 {
        return this.new(-1);
    },
    /** A unit-length vector pointing along the positive y-axis. */
    up(): vec3 {
        return this.new(0, 1, 0);
    },
    /** A unit-length vector pointing along the negative y-axis. */
    down(): vec3 {
        return this.new(0, -1, 0);
    },
    /** A unit-length vector pointing along the negative x-axis. */
    left(): vec3 {
        return this.new(-1, 0, 0);
    },
    /** A unit-length vector pointing along the positive x-axis. */
    right(): vec3 {
        return this.new(1, 0, 0);
    },
    /** A unit-length vector pointing along the negative z-axis. */
    back(): vec3 {
        return this.new(0, 0, -1);
    },
    /** A unit-length vector pointing along the positive z-axis. */
    forward(): vec3 {
        return this.new(0, 0, 1);
    },
    /** Returns a string interpretation of given vector `self`. */
    fmt(self: vec3): string {
        return `(${self.x}, ${self.y}, ${self.z})`;
    },
    /** Create a vector from an array-like. */
    fromArray(array: ArrayLike<number>): vec3 {
        return this.new(array[0] as number, array[1] as number, array[2] as number);
    },
    /** Returns each elemnt of `self` as an array. */
    array(self: vec3): [x: number, y: number, z: number] {
        return [self.x, self.y, self.z];
    },
    /** Returns `x` and `y` components as a 2-dim vector. */
    xy(self: vec3): vec2 {
        return { x: self.x, y: self.y };
    },
    /** Returns given `self` vector with `z` component set to zero. */
    xy0(self: vec3): vec3 {
        return { x: self.x, y: self.y, z: 0 };
    },
    /** Returns `y` and `z` components as a 2-dim vector. */
    yz(self: vec3): vec2 {
        return { x: self.y, y: self.z };
    },
    /** Returns `x` and `z` components as a 2-dim vector. */
    xz(self: vec3): vec2 {
        return { x: self.z, y: self.x };
    },
    /** Adds two vectors `lhs` and `rhs`. */
    add(lhs: vec3, rhs: vec3): vec3 {
        return { x: lhs.x + rhs.x, y: lhs.y + rhs.y, z: lhs.z + rhs.z };
    },
    /** Substracts two vectors `lhs` and `rhs`. */
    sub(lhs: vec3, rhs: vec3): vec3 {
        return { x: lhs.x - rhs.x, y: lhs.y - rhs.y, z: lhs.z - rhs.z };
    },
    /** Multiplies two vectors `lhs` and `rhs`. */
    mul(lhs: vec3, rhs: vec3): vec3 {
        return { x: lhs.x * rhs.x, y: lhs.y * rhs.y, z: lhs.z * rhs.z };
    },
    /** Multiplies a vector `lhs` and a scalar value `rhs`. */
    scalar(self: vec3, scalar: number): vec3 {
        return { x: self.x * scalar, y: self.y * scalar, z: self.z * scalar };
    },
    /** Division between between two vectors `lhs` and `rhs`. */
    div(lhs: vec3, rhs: vec3): vec3 {
        return { x: lhs.x / rhs.x, y: lhs.y / rhs.y, z: lhs.z / rhs.z };
    },
    /** Check equality between two vectors `lhs` and `rhs`. */
    eq(lhs: vec3, rhs: vec3): boolean {
        return Math.abs(lhs.x - rhs.x) <= epsilon &&
            Math.abs(lhs.y - rhs.y) <= epsilon &&
            Math.abs(lhs.z - rhs.z) <= epsilon;
    },
    /** Returns true if each element of `self` is finite. */
    isFinite(self: vec3): boolean {
        return isFinite(self.x) && isFinite(self.y) && isFinite(self.z);
    },
    /** Returns true if any element of `self` is NaN. */
    isNan(self: vec3): boolean {
        return isNaN(self.x) || isNaN(self.y) || isNaN(self.z);
    },
    /** Returns true if given vector is normalized. */
    isNormalized(self: vec3): boolean {
        return Math.abs(this.len2(self) - 1) <= 1e-4;
    },
    /** Returns a vector containing the absolute value of each element of `self`. */
    abs(self: vec3): vec3 {
        return { x: Math.abs(self.x), y: Math.abs(self.y), z: Math.abs(self.z) };
    },
    /** Returns a vector containing the negative value of each element of `self`. */
    neg(self: vec3): vec3 {
        return { x: -self.x, y: -self.y, z: -self.z };
    },
    /** Returns a vector containing the inverse value of each element of `self`. */
    inv(self: vec3): vec3 {
        return { x: recip(self.x), y: recip(self.y), z: recip(self.z) };
    },
    /** Returns the length for given vector */
    len(self: vec3): number {
        return Math.sqrt(this.len2(self));
    },
    /** Returns the length squared for given vector. */
    len2(self: vec3): number {
        return self.x * self.x + self.y * self.y + self.z * self.z;
    },
    /** Computes `1.0 / len()` for given vector. */
    rlen(self: vec3): number {
        return rsqrt(this.len2(self));
    },
    /** Returns the euclidean distance between two vectors. */
    dist(lhs: vec3, rhs: vec3): number {
        return this.len(this.sub(lhs, rhs));
    },
    /** Returns the euclidean distance squared between two vectors. */
    dist2(lhs: vec3, rhs: vec3): number {
        return this.len2(this.sub(lhs, rhs));
    },
    /** Returns `self` as a normalized vector. */
    normalize(self: vec3): vec3 {
        return this.scalar(self, rsqrt(this.dot(self, self)));
    },
    /** Returns the normalized vector of `self` if possible, else returns `fallback` if supplied or defaults to `vec3.zero`. */
    normalizeSafe(self: vec3, fallback?: vec3): vec3 {
        return this.tryNormalize(self) ?? fallback ?? this.zero();
    },
    /** Returns the normalized vector of `self` if possible, else `undefined`. */
    tryNormalize(self: vec3): Maybe<vec3> {
        let rcp = this.rlen(self);
        return rcp > 0.0 && isFinite(rcp) ? this.normalize(self) : undefined;
    },
    /** Returns the dot product of given two vectors. */
    dot(lhs: vec3, rhs: vec3): number {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z;
    },
    /** Returns the cross product of given two vectors. */
    cross(lhs: vec3, rhs: vec3): vec3 {
        return this.new(
            lhs.y * rhs.z - lhs.z * rhs.y,
            lhs.z * rhs.x - lhs.x * rhs.z,
            lhs.x * rhs.y - lhs.y * rhs.x);
    },
    /** Returns the vector projection of `lhs` onto `rhs`. */
    project(lhs: vec3, rhs: vec3): vec3 {
        return this.scalar(rhs, this.dot(lhs, rhs) / this.dot(rhs, rhs));
    },
    /** Returns the reflection vector, given an incident vector `lhs` and a normal vector `rhs`. */
    reflect(lhs: vec3, rhs: vec3): vec3 {
        return this.sub(lhs, this.scalar(rhs, 2 * this.dot(lhs, rhs)));
    },
    /** Returns the angle (in radians) between the two vectors. */
    angle(lhs: vec3, rhs: vec3): number {
        return Math.acos(this.dot(lhs, rhs) / Math.sqrt((this.len2(lhs) * this.len2(rhs))));
    },
    /** Returns a vector where `self` is rotated by an angle in radians. */
    rotate(self: vec3, radians: number): vec3 {
        let [sin, cos] = sincos(radians)
        return {
            x: self.x * cos - self.y * sin,
            y: self.x * sin + self.y * cos,
            z: self.z
        };
    },
    /** Returns a vector where `self` is rotated by an angle in degrees. */
    rotateDeg(self: vec3, degrees: number): vec3 {
        return this.rotate(self, deg(degrees));
    },
    /** Returns a vector that is equal to `self` rotated by 90 degrees. */
    perp(self: vec3): vec3 {
        return { x: -self.y, y: self.x, z: self.z };
    },
    /** Performs a linear interpolation between `self` and `rhs` based on the value `t`. */
    lerp(self: vec3, rhs: vec3, t: number): vec3 {
        return this.add(self, this.scalar(this.sub(rhs, self), t));
    }
});