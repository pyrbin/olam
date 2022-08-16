import { assert, panic } from "../debug";
import { feq, recip, sincos } from "../math";
import { createImpl, Static } from "../type_impl";
import { vec2 } from "./vec2";

/** A 2x2 column major matrix. */
export interface mat2 extends Mat2 { }

export const mat2 = createImpl(class Mat2Impl extends Static {
    /** Create an identity matrix, where all diagonal elements are `1`, and all off-diagonal elements are `0`. */
    //@ts-ignore
    static create()
    /** Create a 2x2 matrix */
    static create(...args: ColsArray): mat2
    static create(...args: ColsArray): mat2 {
        //@ts-ignore
        return args.length === 0 ? mat2.identity() : new Mat2(...args);
    }
    /** Create a matrix with all entries set to `0`. */
    static zero(): mat2 {
        return new Mat2(0, 0, 0, 0);
    }
    /** Create an identity matrix, where all diagonal elements are `1`, and all off-diagonal elements are `0`. */
    static identity(): mat2 {
        return new Mat2(1, 0, 0, 1);
    }
    /** Set properties of given matrix `m` */
    static set<T extends num2x2>(m: T, ...args: SetParams<typeof mat2>) {
        m.c0.x = args[0];
        m.c0.y = args[1];
        m.c1.x = args[2];
        m.c1.y = args[3];
        return m;
    }
    /** Copy properties from `b` to m matrix `a` */
    static copy<T extends num2x2>(a: T, b: num2x2): T {
        return mat2.set(a, b.c0.x, b.c0.y, b.c1.x, b.c1.y);
    }
    /** Clone `m` matrix */
    static clone(m: num2x2): mat2 {
        return mat2.copy(mat2.zero(), m);
    }
    /** Return a string representation  */
    static fmt(m: num2x2) {
        return `(${vec2.fmt(m.c0)},${vec2.fmt(m.c1)})`;
    }
    /** Create a 2x2 matrix from two column vectors. */
    static fromCols(x: num2, y: num2): mat2
    static fromCols<T extends num2x2>(x: num2, y: num2, out: T): T
    static fromCols(x: num2, y: num2, out = mat2()) {
        return mat2.set(out, x.x, x.y, y.x, y.y);
    }
    /** Create a 2x2 matrix from an array-like. */
    static fromArray(array: ArrayLike<number>): mat2
    static fromArray<T extends num2x2>(array: ArrayLike<number>, out: T): T
    static fromArray(array: ArrayLike<number>, out = mat2()) {
        return mat2.set(out, array[0], array[1], array[2], array[3]);
    }
    /** Create a 2x2 matrix from an 2d array. */
    static fromArray2d(array: [ArrayLike<number>, ArrayLike<number>]): mat2
    static fromArray2d<T extends num2x2>(array: [ArrayLike<number>, ArrayLike<number>], out: T): T
    static fromArray2d(array: [ArrayLike<number>, ArrayLike<number>], out = mat2()) {
        return mat2.set(out, array[0][0], array[0][1], array[1][0], array[1][1]);
    }
    /** Create a 2x2 matrix with its diagonal set to `diagonal` and all other entries set to 0. */
    static fromDiagonal(diagonal: num2): mat2
    static fromDiagonal<T extends num2x2>(diagonal: num2, out: T): T
    static fromDiagonal(diagonal: num2, out = mat2()) {
        return mat2.set(out, diagonal.x, 0, 0, diagonal.y);
    }
    /** Create a 2x2 matrix containing the combining non-uniform `scale` and rotation of `radians`. */
    static fromScaleAngle(scale: num2, radians: Rad): mat2
    static fromScaleAngle<T extends num2x2>(scale: num2, radians: Rad, out: T): T
    static fromScaleAngle(scale: num2, radians: Rad, out = mat2()) {
        let [sin, cos] = sincos(radians);
        return mat2.set(out, scale.x * cos, scale.x * sin, -scale.y * sin, scale.y * cos);
    }
    /** Create a 2x2 matrix containing a rotation of `radians`. */
    static fromAngle(radians: Rad): mat2
    static fromAngle<T extends num2x2>(radians: Rad, out: T): T
    static fromAngle(radians: Rad, out = mat2()) {
        let [sin, cos] = sincos(radians);
        return mat2.set(out, cos, sin, -sin, cos);
    }
    /** Return an array storing data in column major order. */
    static toColsArray(m: num2x2): ColsArray {
        return [m.c0.x, m.c0.y, m.c1.x, m.c1.y];
    }
    /** Return a 2d array storing data in column major order. */
    static toColsArray2d(m: num2x2): ColsArray2d {
        return [vec2.toArray(m.c0), vec2.toArray(m.c1)];
    }
    /** Return the diagonal entries of given matrix `m`. */
    static toDiagonal(m: num2x2): vec2
    static toDiagonal<T extends num2>(m: num2x2, out: T): T
    static toDiagonal(m: num2x2, out = vec2()) {
        return vec2.set(out, m.c0.x, m.c1.y);
    }
    /** Return true if each entry of `m` is finite. */
    static isFinite(m: num2x2): boolean {
        return vec2.isFinite(m.c0) && vec2.isFinite(m.c1);
    }
    /** Return true if any entry of `m` is NaN. */
    static isNan(m: num2x2): boolean {
        return vec2.isNan(m.c0) || vec2.isNan(m.c1);
    }
    /** Return true if `m` is an identity matrix */
    static isIdentity(m: num2x2): boolean {
        return feq(m.c0.x, 1) && feq(m.c0.y, 0) && feq(m.c1.x, 0) && feq(m.c1.y, 1);
    }
    /** Adds two matrices `lhs` and `rhs`. */
    static add(lhs: num2x2, rhs: num2x2): mat2
    static add<T extends num2x2>(lhs: num2x2, rhs: num2x2, out: T): T
    static add(lhs: num2x2, rhs: num2x2, out = mat2()) {
        return mat2.fromCols(
            vec2.add(lhs.c0, rhs.c0, v1),
            vec2.add(lhs.c1, rhs.c1, v2),
            out);
    }
    /** Subtracts two matrices `lhs` and `rhs`. */
    static sub(lhs: num2x2, rhs: num2x2): mat2
    static sub<T extends num2x2>(lhs: num2x2, rhs: num2x2, out: T): T
    static sub(lhs: num2x2, rhs: num2x2, out = mat2()) {
        return mat2.fromCols(
            vec2.sub(lhs.c0, rhs.c0, v1),
            vec2.sub(lhs.c1, rhs.c1, v2),
            out);
    }
    /** Multiplies two matrices `lhs` and `rhs`. */
    static mul(lhs: num2x2, rhs: num2x2): mat2
    static mul<T extends num2x2>(lhs: num2x2, rhs: num2x2, out: T): T
    static mul(lhs: num2x2, rhs: num2x2, out = mat2()) {
        return mat2.fromCols(
            mat2.vmul2(lhs, rhs.c0, v1),
            mat2.vmul2(lhs, rhs.c1, v2),
            out);
    }
    /** Multiplies a matrix `lhs` and a 2d vector `rhs`. */
    static vmul2(lhs: num2x2, rhs: num2): vec2
    static vmul2<T extends num2>(lhs: num2x2, rhs: num2, out: T): T
    static vmul2(lhs: num2x2, rhs: num2, out = vec2()) {
        return vec2.set(out,
            lhs.c0.x * rhs.x + lhs.c1.x * rhs.y,
            lhs.c0.y * rhs.x + lhs.c1.y * rhs.y);
    }
    /** Multiplies a matrix `lhs` and a scale value `rhs`. */
    static scale(lhs: num2x2, rhs: number): mat2
    static scale<T extends num2x2>(lhs: num2x2, rhs: number, out: T): T
    static scale(lhs: num2x2, rhs: number, out = mat2()) {
        return mat2.fromCols(
            vec2.scale(lhs.c0, rhs, v1),
            vec2.scale(lhs.c1, rhs, v2),
            out);
    }
    /** Check equality between two matrices `lhs` and `rhs`. */
    static eq(lhs: num2x2, rhs: num2x2): boolean {
        return vec2.eq(lhs.c0, rhs.c0) && vec2.eq(lhs.c1, rhs.c1);
    }
    /** Return the column for given `index`. Throws if `index` is out of range. */
    static col<T extends num2x2>(m: T, index: number): T["c0" | "c1"] {
        switch (index) {
            case 0: return m.c0;
            case 1: return m.c1;
            default: panic(`index out of range: ${index}`);
        }
    }
    /** Return the row for given `index`. Throws if `index` is out of range. */
    static row<T extends num2x2>(m: T, index: number): vec2 {
        switch (index) {
            case 0: return vec2(m.c0.x, m.c1.x);
            case 1: return vec2(m.c0.y, m.c1.y);
            default: panic(`index out of range: ${index}`);
        }
    }
    /** Return the inverse matrix of `m`. Throws if the determinant of `m` is zero */
    static inv(m: num2x2): mat2
    static inv<T extends num2x2>(m: num2x2, out: T): T
    static inv(m: num2x2, out = mat2()) {
        let det = mat2.det(m);
        assert(det !== 0, "can't invert matrix with zero determinant");
        let inv = recip(det);
        return mat2.fromCols(
            vec2.set(v1, inv * m.c1.y, -inv * m.c0.y),
            vec2.set(v2, -inv * m.c1.x, inv * m.c0.x),
            out);
    }
    /** Return the transpose of the matrix `m`. */
    static transpose(m: num2x2): mat2
    static transpose<T extends num2x2>(m: num2x2, out: T): T
    static transpose(m: num2x2, out = mat2()) {
        return mat2.fromCols(
            vec2.set(v1, m.c0.x, m.c1.x),
            vec2.set(v2, m.c0.y, m.c1.y),
            out);
    }
    /** Return the determinant of the matrix `m`. */
    static det(m: num2x2): number {
        return m.c0.x * m.c1.y - m.c0.y * m.c1.x;
    }
})

/** @internal */
class Mat2 implements num2x2 {
    c0: vec2;
    c1: vec2;
    /** Create a 2x2 matrix */
    constructor(...args: ColsArray) {
        this.c0 = vec2(args[0], args[1]);
        this.c1 = vec2(args[2], args[3]);
    }
    /** Set properties. */
    set(...args: SetParams<typeof mat2>): mat2 {
        return mat2.set(this, ...args);
    }
    /** Copy properties from `m`. */
    copy(m: num2x2) {
        return mat2.copy(this, m);
    }
    /** Clone `m` matrix */
    clone(): mat2 {
        return mat2.clone(this);
    }
    /** Return a string representation. */
    toString() {
        return mat2.fmt(this);
    }
    /** Return an array storing data in column major order. */
    toColsArray(): ColsArray {
        return mat2.toColsArray(this);
    }
    /** Return a 2d array storing data in column major order. */
    toColsArray2d(): ColsArray2d {
        return mat2.toColsArray2d(this)
    }
    /** Return the diagonal entries. */
    toDiagonal(): vec2
    toDiagonal<T extends num2>(out: T): T
    toDiagonal(out = vec2()) {
        return mat2.toDiagonal(this, out);
    }
    /** Return true if each entry is finite. */
    isFinite(): boolean {
        return mat2.isFinite(this);
    }
    /** Return true if any entry is NaN. */
    isNan(): boolean {
        return mat2.isNan(this);
    }
    /** Return true if this is an identity matrix */
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
    vmul2<T extends num2>(rhs: num2, out: T): T
    vmul2(rhs: num2, out = vec2()) {
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
    /** Return the column for given `index`. Throws if `index` is out of range. */
    col(index: number): vec2 {
        return mat2.col(this, index);
    }
    /** Return the row for given `index`. Throws if `index` is out of range. */
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
    /** Return the determinant. */
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
