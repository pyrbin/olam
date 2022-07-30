import { rsqrt, sinCos } from "../math";
import { createType } from "../type";
import { num2 } from "./num2";

/** A 3-dimensional vector. */
export interface num3 {
    x: number;
    y: number;
    z: number;
}

/** Implements math operations for a 3-dimensional vector. */
export const num3 = createType({
    /** Creates a new vector. */
    new(x: number = 0, y: number = x, z: number = y): num3 {
        return { x, y, z };
    },
    /** Create a new vector from an array-like. */
    fromArray(array: ArrayLike<number>): num3 {
        return this.new(array[0] as number, array[1] as number, array[2] as number);
    },
    /** Creates a new vector where each element is set to zero. */
    zero(): num3 {
        return this.new(0);
    },
    /** Creates a new vector where each element is set to one. */
    one(): num3 {
        return this.new(1);
    },
    /** Creates a new vector where each element is set to negative one. */
    negOne(): num3 {
        return this.new(-1);
    },
    /** A unit-length vector pointing along the positive y-axis. */
    up(): num3 {
        return this.new(0, 1, 0);
    },
    /** A unit-length vector pointing along the negative y-axis. */
    down(): num3 {
        return this.new(0, -1, 0);
    },
    /** A unit-length vector pointing along the negative x-axis. */
    left(): num3 {
        return this.new(-1, 0, 0);
    },
    /** A unit-length vector pointing along the positive x-axis. */
    right(): num3 {
        return this.new(1, 0, 0);
    },
    /** A unit-length vector pointing along the negative z-axis. */
    back(): num3 {
        return this.new(0, 0, -1);
    },
    /** A unit-length vector pointing along the positive z-axis. */
    forward(): num3 {
        return this.new(0, 0, 1);
    },
    /** Returns a string interpretation of given vector `self`. */
    str(self: num3): string {
        return `(${self.x}, ${self.y}, ${self.z})`;
    },
    /** Returns each elemnt of `self` as an array. */
    array(self: num3): readonly [x: number, y: number, z: number] {
        return [self.x, self.y, self.z];
    },
    /** Returns `x` and `y` components as a 2-dim vector. */
    xy(self: num3): num2 {
        return { x: self.x, y: self.y };
    },
    /** Returns given `self` vector with `z` component set to zero. */
    xy0(self: num3): num3 {
        return { x: self.x, y: self.y, z: 0 };
    },
    /** Returns `y` and `z` components as a 2-dim vector. */
    yz(self: num3): num2 {
        return { x: self.y, y: self.z };
    },
    /** Returns `x` and `z` components as a 2-dim vector. */
    xz(self: num3): num2 {
        return { x: self.z, y: self.x };
    },
    /** Addition between between two vectors `lhs` and `rhs`. */
    add(lhs: num3, rhs: num3): num3 {
        return { x: lhs.x + rhs.x, y: lhs.y + rhs.y, z: lhs.z + rhs.z };
    },
    /** Subtraction between between two vectors `lhs` and `rhs`. */
    sub(lhs: num3, rhs: num3): num3 {
        return { x: lhs.x - rhs.x, y: lhs.y - rhs.y, z: lhs.z - rhs.z };
    },
    /** Multiplication between between two vectors `lhs` and `rhs`. */
    mul(lhs: num3, rhs: num3): num3 {
        return { x: lhs.x * rhs.x, y: lhs.y * rhs.y, z: lhs.z * rhs.z };
    },
    /** Multiplication operation between a vector `lhs` and a scalar value `rhs`. */
    scalar(self: num3, scalar: number): num3 {
        return { x: self.x * scalar, y: self.y * scalar, z: self.z * scalar };
    },
    /** Division between between two vectors `lhs` and `rhs`. */
    div(lhs: num3, rhs: num3): num3 {
        return { x: lhs.x / rhs.x, y: lhs.y / rhs.y, z: lhs.z / rhs.z };
    },
    /** Equal operation between two vectors `lhs` and `rhs`. */
    eq(lhs: num3, rhs: num3): boolean {
        return lhs.x === rhs.x && lhs.y === rhs.y && lhs.z === rhs.z;
    },
    /** Returns true if each element of `self` is finite. */
    isFinite(self: num3): boolean {
        return isFinite(self.x) && isFinite(self.y) && isFinite(self.z);
    },
    /** Returns true if any element of `self` is NaN. */
    isNan(self: num3): boolean {
        return isNaN(self.x) || isNaN(self.y) || isNaN(self.z);
    },
    /** Returns true if given vector is normalized. */
    isNormalized(self: num3): boolean {
        return Math.abs(this.len2(self) - 1) <= 1e-4;
    },
    /** Returns a vector containing the absolute value of each element of `self`. */
    abs(self: num3): num3 {
        return { x: Math.abs(self.x), y: Math.abs(self.y), z: Math.abs(self.z) };
    },
    /** Returns a vector containing the negative value of each element of `self`. */
    neg(self: num3): num3 {
        return { x: -self.x, y: -self.y, z: -self.z };
    },
    /** Returns a vector containing the inverse value of each element of `self`. */
    inv(self: num3): num3 {
        return { x: 1 / self.x, y: 1 / self.y, z: 1 / self.z };
    },
    /** Returns the length for given vector */
    len(self: num3): number {
        return Math.sqrt(this.len2(self));
    },
    /** Returns the length squared for given vector. */
    len2(self: num3): number {
        return self.x * self.x + self.y * self.y + self.z * self.z;
    },
    /** Computes `1.0 / len()` for given vector. */
    rlen(self: num3): number {
        return rsqrt(this.len2(self));
    },
    /** Returns the euclidean distance between two vectors. */
    dist(lhs: num3, rhs: num3): number {
        return this.len(this.sub(lhs, rhs));
    },
    /** Returns the euclidean distance squared between two vectors. */
    dist2(lhs: num3, rhs: num3): number {
        return this.len2(this.sub(lhs, rhs));
    },
    /** Returns `self` as a normalized vector. */
    normalize(self: num3): num3 {
        return this.scalar(self, rsqrt(this.dot(self, self)));
    },
    /** Returns the normalized vector of `self` if possible, else returns `fallback` if supplied or defaults to `num3.zero`. */
    normalizeSafe(self: num3, fallback?: num3): num3 {
        return this.tryNormalize(self) ?? fallback ?? this.zero();
    },
    /** Returns the normalized vector of `self` if possible, else `undefined`. */
    tryNormalize(self: num3): Maybe<num3> {
        let rcp = this.rlen(self);
        return rcp > 0.0 && isFinite(rcp) ? this.normalize(self) : undefined;
    },
    /** Returns the dot product of given two vectors. */
    dot(lhs: num3, rhs: num3): number {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z;
    },
    /** Returns the cross product of given two vectors. */
    cross(lhs: num3, rhs: num3): num3 {
        return this.new(
            lhs.y * rhs.z - lhs.z * rhs.y,
            lhs.z * rhs.x - lhs.x * rhs.z,
            lhs.x * rhs.y - lhs.y * rhs.x);
    },
    /** Returns the vector projection of `lhs` onto `rhs`. */
    project(lhs: num3, rhs: num3): num3 {
        return this.scalar(rhs, this.dot(lhs, rhs) / this.dot(rhs, rhs));
    },
    /** Returns the reflection vector, given an incident vector `lhs` and a normal vector `rhs`. */
    reflect(lhs: num3, rhs: num3): num3 {
        return this.sub(lhs, this.scalar(rhs, 2 * this.dot(lhs, rhs)));
    },
    /** Returns the angle (in radians) between the two vectors. */
    angle(lhs: num3, rhs: num3): number {
        return Math.acos(this.dot(lhs, rhs) / Math.sqrt((this.len2(lhs) * this.len2(rhs))));
    },
    /** Returns a vector where `self` is rotated by an angle in radians. */
    rotate(self: num3, radians: number): num3 {
        let [sin, cos] = sinCos(radians)
        return {
            x: self.x * cos - self.y * sin,
            y: self.x * sin + self.y * cos,
            z: self.z
        };
    },
    /** Returns a vector where `self` is rotated by an angle in degrees. */
    rotateDeg(self: num3, degrees: number): num3 {
        return this.rotate(self, (degrees * Math.PI) / 180)
    },
    /** Returns a vector that is equal to `self` rotated by 90 degrees. */
    perp(self: num3): num3 {
        return { x: -self.y, y: self.x, z: self.z };
    },
    /** Performs a linear interpolation between `self` and `rhs` based on the value `t`. */
    lerp(self: num3, rhs: num3, t: number): num3 {
        return this.add(self, this.scalar(this.sub(rhs, self), t));
    }
});