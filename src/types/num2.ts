import { rsqrt, sinCos } from "../math";
import { createType } from "../type";
import { num3 } from "./num3";

/** A 2-dimensional vector. */
export interface num2 {
    x: number;
    y: number;
}

/** Implements math operations for a 2-dimensional vector. */
export const num2 = createType({
    /** Creates a new vector. */
    new(x: number = 0, y: number = x): num2 {
        return { x, y };
    },
    /** Create a new vector from an array-like. */
    fromArray(array: ArrayLike<number>): num2 {
        return this.new(array[0] as number, array[1] as number);
    },
    /** Creates a new vector where each element is set to zero. */
    zero(): num2 {
        return this.new(0);
    },
    /** Creates a new vector where each element is set to one. */
    one(): num2 {
        return this.new(1);
    },
    /** Creates a new vector where each element is set to negative one. */
    negOne(): num2 {
        return this.new(-1);
    },
    /** A unit-length vector pointing along the positive y-axis. */
    up(): num2 {
        return this.new(0, 1);
    },
    /** A unit-length vector pointing along the negative y-axis. */
    down(): num2 {
        return this.new(0, -1);
    },
    /** A unit-length vector pointing along the negative x-axis. */
    left(): num2 {
        return this.new(-1, 0);
    },
    /** A unit-length vector pointing along the positive x-axis. */
    right(): num2 {
        return this.new(1, 0);
    },
    /** Returns a string interpretation of given vector `self`. */
    str(self: num2): string {
        return `(${self.x}, ${self.y})`;
    },
    /** Returns each elemnt of `self` as an array. */
    array(self: num2): readonly [x: number, y: number] {
        return [self.x, self.y];
    },
    /** Returns `self` as a 3-dimensional vector with given `z` value. */
    extend(self: num2, z: number = 0): num3 {
        return num3.new(self.x, self.y, z);
    },
    /** Addition between between two vectors `lhs` and `rhs`. */
    add(lhs: num2, rhs: num2): num2 {
        return { x: lhs.x + rhs.x, y: lhs.y + rhs.y };
    },
    /** Subtraction between between two vectors `lhs` and `rhs`. */
    sub(lhs: num2, rhs: num2): num2 {
        return { x: lhs.x - rhs.x, y: lhs.y - rhs.y };
    },
    /** Multiplication between between two vectors `lhs` and `rhs`. */
    mul(lhs: num2, rhs: num2): num2 {
        return { x: lhs.x * rhs.x, y: lhs.y * rhs.y };
    },
    /** Multiplication operation between a vector `lhs` and a scalar value `rhs`. */
    scalar(lhs: num2, rhs: number): num2 {
        return { x: lhs.x * rhs, y: lhs.y * rhs };
    },
    /** Division operation between two vectors `lhs` and `rhs`. */
    div(lhs: num2, rhs: num2): num2 {
        return { x: lhs.x / rhs.x, y: lhs.y / rhs.y };
    },
    /** Equal operation between two vectors `lhs` and `rhs`. */
    eq(lhs: num2, rhs: num2): boolean {
        return lhs.x === rhs.x && lhs.y === rhs.y;
    },
    /** Returns true if each element of `self` is finite. */
    isFinite(self: num2): boolean {
        return isFinite(self.x) && isFinite(self.y);
    },
    /** Returns true if any element of `self` is NaN. */
    isNan(self: num2): boolean {
        return isNaN(self.x) || isNaN(self.y);
    },
    /** Returns true if given vector is normalized. */
    isNormalized(self: num2): boolean {
        return Math.abs(this.len2(self) - 1) <= 1e-4;
    },
    /** Returns a vector containing the absolute value of each element of `self`. */
    abs(self: num2): num2 {
        return { x: Math.abs(self.x), y: Math.abs(self.y) };
    },
    /** Returns a vector containing the negative value of each element of `self`. */
    neg(self: num2): num2 {
        return { x: -self.x, y: -self.y };
    },
    /** Returns a vector containing the inverse value of each element of `self`. */
    inv(self: num2): num2 {
        return { x: 1 / self.x, y: 1 / self.y };
    },
    /** Returns the length for given vector */
    len(self: num2): number {
        return Math.sqrt(this.len2(self));
    },
    /** Returns the length squared for given vector. */
    len2(self: num2): number {
        return self.x * self.x + self.y * self.y;
    },
    /** Computes `1.0 / len()` for given vector. */
    rlen(self: num2): number {
        return 1 / this.len(self);
    },
    /** Returns the euclidean distance between two vectors. */
    dist(lhs: num2, rhs: num2): number {
        return this.len(this.sub(lhs, rhs));
    },
    /** Returns the euclidean distance squared between two vectors. */
    dist2(lhs: num2, rhs: num2): number {
        return this.len2(this.sub(lhs, rhs));
    },
    /** Returns `self` as a normalized vector. */
    normalize(self: num2): num2 {
        return this.scalar(self, rsqrt(this.dot(self, self)));
    },
    /** Returns the normalized vector of `self` if possible, else `undefined`. */
    tryNormalize(self: num2): Maybe<num2> {
        let rcp = this.rlen(self);
        return rcp > 0.0 && isFinite(rcp) ? this.normalize(self) : undefined;
    },
    /** Returns the normalized vector of `self` if possible, else returns `fallback` if supplied or defaults to `num2.zero`. */
    normalizeSafe(self: num2, fallback?: num2): num2 {
        return this.tryNormalize(self) ?? fallback ?? this.zero();
    },
    /** Returns the dot product of given two vectors. */
    dot(lhs: num2, rhs: num2): number {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    },
    /** Returns the cross product of given two vectors. */
    cross(lhs: num2, rhs: num2): number {
        return lhs.x * rhs.y - lhs.y * rhs.x;
    },
    /** Returns the vector projection of `lhs` onto `rhs`. */
    project(lhs: num2, rhs: num2): num2 {
        return this.scalar(rhs, this.dot(lhs, rhs));
    },
    /** Returns the reflection vector, given an incident vector `lhs` and a normal vector `rhs`. */
    reflect(lhs: num2, rhs: num2): num2 {
        return this.sub(lhs, this.project(lhs, rhs));
    },
    /** Returns the angle (in radians) between the two vectors. */
    angle(lhs: num2, rhs: num2): number {
        let angle = Math.acos(this.dot(lhs, rhs) / (this.len(lhs) * this.len(rhs)));
        return angle * Math.sign(this.cross(lhs, rhs));
    },
    /** Returns a vector where `self` is rotated by an angle in radians. */
    rotate(self: num2, radians: number): num2 {
        let [sin, cos] = sinCos(radians);
        return { x: self.x * cos - self.y * sin, y: self.x * sin + self.y * cos };
    },
    /** Returns a vector where `self` is rotated by an angle in degrees. */
    rotateDeg(self: num2, degrees: number): num2 {
        return this.rotate(self, (degrees * Math.PI) / 180)
    },
    /** Returns a vector that is equal to `self` rotated by 90 degrees. */
    perp(self: num2): num2 {
        return { x: -self.y, y: self.x };
    },
    /** Performs a linear interpolation between `self` and `rhs` based on the value `t`. */
    lerp(self: num2, rhs: num2, t: number): num2 {
        return this.add(self, this.scalar(this.sub(rhs, self), t));
    }
})
