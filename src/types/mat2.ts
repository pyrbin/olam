import { createImpl, Static } from "../base";
import { assert, panic } from "../debug";
import { feq, recip, sincos } from "../math";
import { vec2 } from "./vec2";

/** A 2x2 column major matrix. */
export interface mat2 extends Mat2 { }

export const mat2 = createImpl(class Mat2Impl extends Static {
    /** Creates a 2x2 matrix */
    static create(
        m00: number = 0,
        m01: number = m00,
        m10: number = m01,
        m11: number = m10): mat2 {
        return new Mat2(m00, m01, m10, m11);
    }
    /** Set properties of given matrix `target` */
    static set<T extends num2x2>(target: T, ...args: SetParams<typeof Mat2Impl>) {
        target.c0.x = args[0];
        target.c0.y = args[1];
        target.c1.x = args[2];
        target.c1.y = args[3];
        return target;
    }
    /** Copy properies from `b` to target matrix `a` */
    static copy<T extends num2x2>(a: T, b: num2x2): T {
        return this.set(a, b.c0.x, b.c0.y, b.c1.x, b.c1.y);
    }
    /** Creates a matrix with all entries set to `0`. */
    static zero(): mat2 {
        return this.create(0, 0, 0, 0);
    }
    /** Creates an identity matrix, where all diagonal elements are `1`, and all off-diagonal elements are `0`. */
    static identity(): mat2 {
        return this.create(1, 0, 0, 1);
    }
    /** Returns a string representation  */
    static fmt(target: num2x2) {
        return `(${vec2.fmt(target.c0)},${vec2.fmt(target.c1)})`;
    }
    /** Creates a 2x2 matrix from two column vectors. */
    static fromCols(x: num2, y: num2): mat2
    static fromCols<T extends num2x2>(x: num2, y: num2, out?: T): T
    static fromCols<T extends num2x2>(x: num2, y: num2, out?: T) {
        return this.set(out ?? mat2(), x.x, x.y, y.x, y.y);
    }
    /** Creates a 2x2 matrix from an array-like. */
    static fromArray(array: ArrayLike<number>): mat2
    static fromArray<T extends num2x2>(array: ArrayLike<number>, out?: T): T
    static fromArray<T extends num2x2>(array: ArrayLike<number>, out?: T) {
        return this.set(out ?? mat2(), array[0], array[1], array[2], array[3]);
    }
    /** Creates a 2x2 matrix from an 2d array. */
    static fromArray2d(array: [ArrayLike<number>, ArrayLike<number>]): mat2
    static fromArray2d<T extends num2x2>(array: [ArrayLike<number>, ArrayLike<number>], out?: T): T
    static fromArray2d<T extends num2x2>(array: [ArrayLike<number>, ArrayLike<number>], out?: T) {
        return this.set(out ?? mat2(), array[0][0], array[0][1], array[1][0], array[1][1]) as T;
    }
    /** Creates a 2x2 matrix with its diagonal set to `diagonal` and all other entries set to 0. */
    static fromDiagonal(diagonal: num2): mat2
    static fromDiagonal<T extends num2x2>(diagonal: num2, out?: T): T
    static fromDiagonal<T extends num2x2>(diagonal: num2, out?: T) {
        return this.set(out ?? mat2(), diagonal.x, 0, 0, diagonal.y);
    }
    /** Creates a 2x2 matrix containing the combining non-uniform `scale` and rotation of `radians`. */
    static fromScaleAngle(scale: num2, radians: number): mat2
    static fromScaleAngle<T extends num2x2>(scale: num2, radians: number, out?: T): T
    static fromScaleAngle<T extends num2x2>(scale: num2, radians: number, out?: T) {
        let [sin, cos] = sincos(radians);
        return this.set(out ?? mat2(), scale.x * cos, scale.x * sin, -scale.y * sin, scale.y * cos);
    }
    /** Creates a 2x2 matrix containing a rotation of `radians`. */
    static fromAngle(radians: number): mat2
    static fromAngle<T extends num2x2>(radians: number, out?: T): T
    static fromAngle<T extends num2x2>(radians: number, out?: T) {
        let [sin, cos] = sincos(radians);
        return this.set(out ?? mat2(), cos, sin, -sin, cos);
    }
    /** Returns an array storing data in column major order. */
    static toColsArray(target: num2x2): ColsArray {
        return [target.c0.x, target.c0.y, target.c1.x, target.c1.y];
    }
    /** Returns a 2d array storing data in column major order. */
    static toColsArray2d(target: num2x2): ColsArray2d {
        return [vec2.toArray(target.c0), vec2.toArray(target.c1)];
    }
    /** Returns the diagonal entries of given matrix `target`. */
    static toDiagonal(target: num2x2): vec2
    static toDiagonal<T extends num2>(target: num2x2, out?: T): T
    static toDiagonal<T extends num2>(target: num2x2, out?: T) {
        return vec2.set(out ?? vec2(), target.c0.x, target.c1.y);
    }
    /** Returns true if each entry of `target` is finite. */
    static isFinite(target: num2x2): boolean {
        return vec2.isFinite(target.c0) && vec2.isFinite(target.c1);
    }
    /** Returns true if any entry of `target` is NaN. */
    static isNan(target: num2x2): boolean {
        return vec2.isNan(target.c0) || vec2.isNan(target.c1);
    }
    /** Returns true if `target` is an identity matrix */
    static isIdentity(target: num2x2): boolean {
        return feq(target.c0.x, 1) && feq(target.c0.y, 0) && feq(target.c1.x, 0) && feq(target.c1.y, 1);
    }
    /** Adds two matrices `lhs` and `rhs`. */
    static add(lhs: num2x2, rhs: num2x2): mat2
    static add<T extends num2x2>(lhs: num2x2, rhs: num2x2, out?: T): T
    static add<T extends num2x2>(lhs: num2x2, rhs: num2x2, out?: T) {
        return this.fromCols(
            vec2.add(lhs.c0, rhs.c0, v1),
            vec2.add(lhs.c1, rhs.c1, v2),
            out);
    }
    /** Subtracts two matrices `lhs` and `rhs`. */
    static sub(lhs: num2x2, rhs: num2x2): mat2
    static sub<T extends num2x2>(lhs: num2x2, rhs: num2x2, out?: T): T
    static sub<T extends num2x2>(lhs: num2x2, rhs: num2x2, out?: T) {
        return this.fromCols(
            vec2.sub(lhs.c0, rhs.c0, v1),
            vec2.sub(lhs.c1, rhs.c1, v2),
            out);
    }
    /** Multiplies two matrices `lhs` and `rhs`. */
    static mul(lhs: num2x2, rhs: num2x2): mat2
    static mul<T extends num2x2>(lhs: num2x2, rhs: num2x2, out?: T): T
    static mul<T extends num2x2>(lhs: num2x2, rhs: num2x2, out?: T) {
        return this.fromCols(
            this.vmul2(lhs, rhs.c0, v1),
            this.vmul2(lhs, rhs.c1, v2),
            out);
    }
    /** Multiplies a matrix `lhs` and a 2d vector `rhs`. */
    static vmul2(lhs: num2x2, rhs: num2): vec2
    static vmul2<T extends num2>(lhs: num2x2, rhs: num2, out?: T): T
    static vmul2<T extends num2>(lhs: num2x2, rhs: num2, out?: T) {
        return vec2.set(out ?? vec2(),
            lhs.c0.x * rhs.x + lhs.c1.x * rhs.y,
            lhs.c0.y * rhs.x + lhs.c1.y * rhs.y);
    }
    /** Multiplies a matrix `lhs` and a scale value `rhs`. */
    static scale(lhs: num2x2, rhs: number): mat2
    static scale<T extends num2x2>(lhs: num2x2, rhs: number, out?: T): T
    static scale<T extends num2x2>(lhs: num2x2, rhs: number, out?: T) {
        return this.fromCols(
            vec2.scale(lhs.c0, rhs, v1),
            vec2.scale(lhs.c1, rhs, v2),
            out);
    }
    /** Check equality between two matrices `lhs` and `rhs`. */
    static eq(lhs: num2x2, rhs: num2x2): boolean {
        return vec2.eq(lhs.c0, rhs.c0) && vec2.eq(lhs.c1, rhs.c1);
    }
    /** Returns the column for given `index`. Throws if `index` is out of range. */
    static col<T extends num2x2>(target: T, index: number): T["c0" | "c1"] {
        switch (index) {
            case 0: return target.c0;
            case 1: return target.c1;
            default: panic(`index out of range: ${index}`);
        }
    }
    /** Returns the row for given `index`. Throws if `index` is out of range. */
    static row<T extends num2x2>(target: T, index: number): vec2 {
        switch (index) {
            case 0: return vec2(target.c0.x, target.c1.x);
            case 1: return vec2(target.c0.y, target.c1.y);
            default: panic(`index out of range: ${index}`);
        }
    }
    /** Returns the inverse matrix of `target`. Throws if the determinant of `target` is zero */
    static inv<T extends num2x2>(target: num2x2, out?: T) {
        let det = this.det(target);
        assert(det !== 0, "can't invert matrix with zero determinant");
        let inv = recip(det);
        return this.fromCols(
            vec2.set(v1, inv * target.c1.y, -inv * target.c0.y),
            vec2.set(v2, -inv * target.c1.x, inv * target.c0.x),
            out);
    }
    /** Returns the transpose of the matrix `target`. */
    static transpose<T extends num2x2>(target: num2x2, out?: T) {
        return this.fromCols(
            vec2.set(v1, target.c0.x, target.c1.x),
            vec2.set(v2, target.c0.y, target.c1.y),
            out);
    }
    /** Returns the determinant of the matrix `target`. */
    static det(target: num2x2): number {
        return target.c0.x * target.c1.y - target.c0.y * target.c1.x;
    }
})

/** @internal */
class Mat2 implements num2x2 {
    c0: vec2;
    c1: vec2;
    /** Creates a 2x2 matrix */
    constructor(
        m00: number = 0,
        m01: number = m00,
        m10: number = m01,
        m11: number = m10) {
        this.c0 = vec2(m00, m01);
        this.c1 = vec2(m10, m11);
    }
    /** Set properties. */
    set(...args: SetParams<typeof mat2>): mat2 {
        return mat2.set(this, ...args);
    }
    /** Copy properies from `src`. */
    copy(src: num2x2) {
        return mat2.copy(this, src);
    }
    /** Returns a string representation. */
    toString() {
        return mat2.fmt(this);
    }
    /** Returns an array storing data in column major order. */
    toColsArray(): ColsArray {
        return mat2.toColsArray(this);
    }
    /** Returns a 2d array storing data in column major order. */
    toColsArray2d(): ColsArray2d {
        return mat2.toColsArray2d(this)
    }
    /** Returns the diagonal entries. */
    toDiagonal(): vec2
    toDiagonal<T extends num2>(out?: T): T
    toDiagonal<T extends num2>(out?: T) {
        return mat2.toDiagonal(this, out);
    }
    /** Returns true if each entry is finite. */
    isFinite(): boolean {
        return mat2.isFinite(this);
    }
    /** Returns true if any entry is NaN. */
    isNan(): boolean {
        return mat2.isNan(this);
    }
    /** Returns true if this is an identity matrix */
    isIdentity(): boolean {
        return mat2.isIdentity(this)
    }
    /** Adds `rhs` to `this`. */
    add(rhs: num2x2): this {
        return mat2.add(this, rhs, this);
    }
    /** Subtracts `rhs` from `this`. */
    sub(rhs: num2x2): this {
        return mat2.sub(this, rhs, this);
    }
    /** Multiplies `rhs` with `this`. */
    mul(rhs: num2x2): this {
        return mat2.mul(this, rhs, this);
    }
    /** Multiplies 2d vector `rhs` with `this`. */
    vmul2(rhs: num2): vec2
    vmul2<T extends num2>(rhs: num2, out?: T): T
    vmul2<T extends vec2>(rhs: num2, out?: T) {
        return mat2.vmul2(this, rhs, out);
    }
    /** Multiplies the matrix by a scalar. */
    scale(rhs: number): this {
        return mat2.scale(this, rhs, this);
    }
    /** Check equality between two matrices `this` and `rhs`. */
    eq(rhs: num2x2): boolean {
        return mat2.eq(this, rhs);
    }
    /** Returns the column for given `index`. Throws if `index` is out of range. */
    col(index: number): vec2 {
        return mat2.col(this, index);
    }
    /** Returns the row for given `index`. Throws if `index` is out of range. */
    row(index: number): vec2 {
        return mat2.row(this, index);
    }
    /** Inverse the matrix. Throws if the determinant is zero */
    inv(): this {
        return mat2.inv(this, this);
    }
    /** Transpose the matrix. */
    transpose(): this {
        return mat2.transpose(this, this);
    }
    /** Returns the determinant. */
    det(): number {
        return mat2.det(this);
    }
}

/** @internal */
let v1 = vec2();
let v2 = vec2();

/** @internal */
type ColsArray = [
    m00: number,
    m01: number,
    m10: number,
    m11: number
];

/** @internal */
type ColsArray2d = [
    c0: [ColsArray[0], ColsArray[1]],
    c1: [ColsArray[2], ColsArray[3]]
];
