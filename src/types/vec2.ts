import { rsqrt, sinCos } from "../math";
import { createType } from "../type";
import { vec3 } from "./vec3";

/** A 2-dimensional vector. */
export interface vec2 {
    x: number;
    y: number;
}

/** Implements math operations for a 2-dimensional vector. */
export const vec2 = createType({
    /** Creates a new vector. */
    new(x: number = 0, y: number = x): vec2 {
        return { x, y };
    },
    /** Create a new vector from an array-like. */
    fromArray(array: ArrayLike<number>): vec2 {
        return this.new(array[0] as number, array[1] as number);
    },
    /** Creates a new vector where each element is set to zero. */
    zero(): vec2 {
        return this.new(0);
    },
    /** Creates a new vector where each element is set to one. */
    one(): vec2 {
        return this.new(1);
    },
    /** Creates a new vector where each element is set to negative one. */
    negOne(): vec2 {
        return this.new(-1);
    },
    /** A unit-length vector pointing along the positive y-axis. */
    up(): vec2 {
        return this.new(0, 1);
    },
    /** A unit-length vector pointing along the negative y-axis. */
    down(): vec2 {
        return this.new(0, -1);
    },
    /** A unit-length vector pointing along the negative x-axis. */
    left(): vec2 {
        return this.new(-1, 0);
    },
    /** A unit-length vector pointing along the positive x-axis. */
    right(): vec2 {
        return this.new(1, 0);
    },
    /** Returns a string interpretation of given vector `self`. */
    str(self: vec2): string {
        return `(${self.x}, ${self.y})`;
    },
    /** Returns each elemnt of `self` as an array. */
    array(self: vec2): readonly [x: number, y: number] {
        return [self.x, self.y];
    },
    /** Returns `self` as a 3-dimensional vector with given `z` value. */
    extend(self: vec2, z: number = 0): vec3 {
        return vec3.new(self.x, self.y, z);
    },
    /** Addition between between two vectors `lhs` and `rhs`. */
    add(lhs: vec2, rhs: vec2): vec2 {
        return { x: lhs.x + rhs.x, y: lhs.y + rhs.y };
    },
    /** Subtraction between between two vectors `lhs` and `rhs`. */
    sub(lhs: vec2, rhs: vec2): vec2 {
        return { x: lhs.x - rhs.x, y: lhs.y - rhs.y };
    },
    /** Multiplication between between two vectors `lhs` and `rhs`. */
    mul(lhs: vec2, rhs: vec2): vec2 {
        return { x: lhs.x * rhs.x, y: lhs.y * rhs.y };
    },
    /** Multiplication operation between a vector `lhs` and a scalar value `rhs`. */
    scalar(lhs: vec2, rhs: number): vec2 {
        return { x: lhs.x * rhs, y: lhs.y * rhs };
    },
    /** Division operation between two vectors `lhs` and `rhs`. */
    div(lhs: vec2, rhs: vec2): vec2 {
        return { x: lhs.x / rhs.x, y: lhs.y / rhs.y };
    },
    /** Equal operation between two vectors `lhs` and `rhs`. */
    eq(lhs: vec2, rhs: vec2): boolean {
        return lhs.x === rhs.x && lhs.y === rhs.y;
    },
    /** Returns true if each element of `self` is finite. */
    isFinite(self: vec2): boolean {
        return isFinite(self.x) && isFinite(self.y);
    },
    /** Returns true if any element of `self` is NaN. */
    isNan(self: vec2): boolean {
        return isNaN(self.x) || isNaN(self.y);
    },
    /** Returns true if given vector is normalized. */
    isNormalized(self: vec2): boolean {
        return Math.abs(this.len2(self) - 1) <= 1e-4;
    },
    /** Returns a vector containing the absolute value of each element of `self`. */
    abs(self: vec2): vec2 {
        return { x: Math.abs(self.x), y: Math.abs(self.y) };
    },
    /** Returns a vector containing the negative value of each element of `self`. */
    neg(self: vec2): vec2 {
        return { x: -self.x, y: -self.y };
    },
    /** Returns a vector containing the inverse value of each element of `self`. */
    inv(self: vec2): vec2 {
        return { x: 1 / self.x, y: 1 / self.y };
    },
    /** Returns the length for given vector */
    len(self: vec2): number {
        return Math.sqrt(this.len2(self));
    },
    /** Returns the length squared for given vector. */
    len2(self: vec2): number {
        return self.x * self.x + self.y * self.y;
    },
    /** Computes `1.0 / len()` for given vector. */
    rlen(self: vec2): number {
        return 1 / this.len(self);
    },
    /** Returns the euclidean distance between two vectors. */
    dist(lhs: vec2, rhs: vec2): number {
        return this.len(this.sub(lhs, rhs));
    },
    /** Returns the euclidean distance squared between two vectors. */
    dist2(lhs: vec2, rhs: vec2): number {
        return this.len2(this.sub(lhs, rhs));
    },
    /** Returns `self` as a normalized vector. */
    normalize(self: vec2): vec2 {
        return this.scalar(self, rsqrt(this.dot(self, self)));
    },
    /** Returns the normalized vector of `self` if possible, else `undefined`. */
    tryNormalize(self: vec2): Maybe<vec2> {
        let rcp = this.rlen(self);
        return rcp > 0.0 && isFinite(rcp) ? this.normalize(self) : undefined;
    },
    /** Returns the normalized vector of `self` if possible, else returns `fallback` if supplied or defaults to `vec2.zero`. */
    normalizeSafe(self: vec2, fallback?: vec2): vec2 {
        return this.tryNormalize(self) ?? fallback ?? this.zero();
    },
    /** Returns the dot product of given two vectors. */
    dot(lhs: vec2, rhs: vec2): number {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    },
    /** Returns the cross product of given two vectors. */
    cross(lhs: vec2, rhs: vec2): number {
        return lhs.x * rhs.y - lhs.y * rhs.x;
    },
    /** Returns the vector projection of `lhs` onto `rhs`. */
    project(lhs: vec2, rhs: vec2): vec2 {
        return this.scalar(rhs, this.dot(lhs, rhs));
    },
    /** Returns the reflection vector, given an incident vector `lhs` and a normal vector `rhs`. */
    reflect(lhs: vec2, rhs: vec2): vec2 {
        return this.sub(lhs, this.project(lhs, rhs));
    },
    /** Returns the angle (in radians) between the two vectors. */
    angle(lhs: vec2, rhs: vec2): number {
        let angle = Math.acos(this.dot(lhs, rhs) / (this.len(lhs) * this.len(rhs)));
        return angle * Math.sign(this.cross(lhs, rhs));
    },
    /** Returns a vector where `self` is rotated by an angle in radians. */
    rotate(self: vec2, radians: number): vec2 {
        let [sin, cos] = sinCos(radians);
        return { x: self.x * cos - self.y * sin, y: self.x * sin + self.y * cos };
    },
    /** Returns a vector where `self` is rotated by an angle in degrees. */
    rotateDeg(self: vec2, degrees: number): vec2 {
        return this.rotate(self, (degrees * Math.PI) / 180)
    },
    /** Returns a vector that is equal to `self` rotated by 90 degrees. */
    perp(self: vec2): vec2 {
        return { x: -self.y, y: self.x };
    },
    /** Performs a linear interpolation between `self` and `rhs` based on the value `t`. */
    lerp(self: vec2, rhs: vec2, t: number): vec2 {
        return this.add(self, this.scalar(this.sub(rhs, self), t));
    }
})
