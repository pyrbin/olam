import { assert, panic } from "../debug";
import { feq, recip, sincos } from "../math";
import { createImpl, Static } from "../type_impl";
import { mat2 } from "./mat2";
import { vec2 } from "./vec2";
import { vec3 } from "./vec3";

/** A 3x3 column major matrix. */
export interface mat3 extends Mat3 { }

export const mat3 = createImpl(class Mat3Impl extends Static {
    /** Create an identity matrix, where all diagonal elements are `1`, and all off-diagonal elements are `0`. */
    //@ts-ignore
    static create()
    /** Create a 3x3 matrix */
    static create(...args: ColsArray): mat3
    static create(...args: ColsArray): mat3 {
        //@ts-ignore
        return args.length === 0 ? mat3.identity() : new Mat3(...args);
    }
    /** Create a matrix with all entries set to `0`. */
    static zero(): mat3 {
        return new Mat3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    /** Create an identity matrix, where all diagonal elements are `1`, and all off-diagonal elements are `0`. */
    static identity(): mat3 {
        return new Mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }
    /** Set properties of given matrix `m` */
    static set<T extends num3x3>(m: T, ...args: SetParams<typeof mat3>): T {
        m.c0.x = args[0] ?? m.c0.x;
        m.c0.y = args[1] ?? m.c0.y;
        m.c0.z = args[2] ?? m.c0.z;
        m.c1.x = args[3] ?? m.c1.x;
        m.c1.y = args[4] ?? m.c1.y;
        m.c1.z = args[5] ?? m.c1.z;
        m.c2.x = args[6] ?? m.c2.x;
        m.c2.y = args[7] ?? m.c2.y;
        m.c2.z = args[8] ?? m.c2.z;
        return m;
    }
    /** Copy properties from `b` to m matrix `a` */
    static copy<T extends num3x3>(a: T, b: num3x3) {
        return mat3.set(a,
            b.c0.x, b.c0.y, b.c0.z,
            b.c1.x, b.c1.y, b.c1.z,
            b.c2.x, b.c2.y, b.c2.z);
    }
    /** Clone `m` matrix */
    static clone(m: num3x3): mat3 {
        return mat3.copy(mat3.zero(), m);
    }
    /** Return a string representation  */
    static fmt(m: num3x3) {
        return `(${vec3.fmt(m.c0)},${vec3.fmt(m.c1)},${vec3.fmt(m.c2)})`;
    }
    /** Create a 3x3 matrix from three column vectors. */
    static fromCols(x: num3, y: num3, z: num3): mat3
    static fromCols<T extends num3x3>(x: num3, y: num3, z: num3, out: T): T
    static fromCols(x: num3, y: num3, z: num3, out = mat3()) {
        return mat3.set(out,
            x.x, x.y, x.z,
            y.x, y.y, y.z,
            z.x, z.y, z.z);
    }
    /** Create a 3x3 matrix from an array-like. */
    static fromArray(array: ArrayLike<number>): mat3
    static fromArray<T extends num3x3>(array: ArrayLike<number>, out: T): T
    static fromArray(array: ArrayLike<number>, out = mat3()) {
        return mat3.set(out,
            array[0], array[1], array[2],
            array[3], array[4], array[5],
            array[6], array[7], array[8]);
    }
    /** Create a 3x3 matrix from an 3d array. */
    static fromArray2d(array: [ArrayLike<number>, ArrayLike<number>, ArrayLike<number>]): mat3
    static fromArray2d<T extends num3x3>(array: [ArrayLike<number>, ArrayLike<number>, ArrayLike<number>], out: T): T
    static fromArray2d(array: [ArrayLike<number>, ArrayLike<number>, ArrayLike<number>], out = mat3()) {
        return mat3.fromCols(
            vec3.fromArray(array[0], v1),
            vec3.fromArray(array[1], v2),
            vec3.fromArray(array[2], v3),
            out);
    }
    /** Create a 3x3 matrix with its diagonal set to `diagonal` and all other entries set to 0. */
    static fromDiagonal(diagonal: num3): mat3
    static fromDiagonal<T extends num3x3>(diagonal: num3, out: T): T
    static fromDiagonal(diagonal: num3, out = mat3()) {
        return mat3.set(out,
            diagonal.x, 0, 0,
            0, diagonal.y, 0,
            0, 0, diagonal.z);
    }
    /** Create a 3x3 rotation matrix from a rotation `axis` and angle `radians` */
    static fromAxisAngle(axis: num3, radians: Rad): mat3
    static fromAxisAngle<T extends num3x3>(axis: num3, radians: Rad, out: T): T
    static fromAxisAngle(axis: num3, radians: Rad, out = mat3()) {
        assert(vec3.isNormalized(axis), "axis is not normalized");
        let [sin, cos] = sincos(radians);
        let [xsin, ysin, zsin] = vec3.toArray(vec3.scale(axis, sin));
        let [x, y, z] = vec3.toArray(axis);
        let [x2, y2, z2] = vec3.toArray(vec3.mul(axis, axis));
        let omc = 1 - cos;
        let xyomc = x * y * omc;
        let xzomc = x * z * omc;
        let yzomc = y * z * omc;
        return mat3.fromCols(
            vec3.set(v1, x2 * omc + cos, xyomc + zsin, xzomc - ysin),
            vec3.set(v2, xyomc - zsin, y2 * omc + cos, yzomc + xsin),
            vec3.set(v3, xzomc + ysin, yzomc - xsin, z2 * omc + cos),
            out);
    }
    /** Create a 3x3 rotation matrix from angle `radians` around the x-axis */
    static fromRotationX(radians: Rad): mat3
    static fromRotationX<T extends num3x3>(radians: Rad, out: T): T
    static fromRotationX(radians: Rad, out = mat3()) {
        let [sin, cos] = sincos(radians);
        return mat3.fromCols(
            vec3.right(),
            vec3.set(v1, 0, cos, sin),
            vec3.set(v2, 0, -sin, cos),
            out);
    }
    /** Create a 3x3 rotation matrix from angle `radians` around the y-axis */
    static fromRotationY(radians: Rad): mat3
    static fromRotationY<T extends num3x3>(radians: Rad, out: T): T
    static fromRotationY(radians: Rad, out = mat3()) {
        let [sin, cos] = sincos(radians);
        return mat3.fromCols(
            vec3.set(v1, cos, 0, -sin),
            vec3.up(),
            vec3.set(v2, sin, 0, cos),
            out);
    }
    /** Create a 3x3 rotation matrix from angle `radians` around the z-axis */
    static fromRotationZ(radians: Rad): mat3
    static fromRotationZ<T extends num3x3>(radians: Rad, out: T): T
    static fromRotationZ(radians: Rad, out = mat3()) {
        let [sin, cos] = sincos(radians);
        return mat3.fromCols(
            vec3.set(v1, cos, sin, 0),
            vec3.set(v2, -sin, cos, 0),
            vec3.forward(),
            out);
    }
    /** Create an affine transformation matrix from given `translation` */
    static fromTranslation(translation: num2): mat3
    static fromTranslation<T extends num3x3>(translation: num2, out: T): T
    static fromTranslation(translation: num2, out = mat3()) {
        return mat3.fromCols(
            vec3.right(),
            vec3.up(),
            vec3.set(v1, translation.x, translation.y, 1.0),
            out);
    }
    /** Create an affine transformation matrix from given angle `radians` */
    static fromAngle(radians: Rad): mat3
    static fromAngle<T extends num3x3>(radians: Rad, out: T): T
    static fromAngle(radians: Rad, out = mat3()) {
        let [sin, cos] = sincos(radians);
        return mat3.fromCols(
            vec3.set(v1, cos, sin, 0),
            vec3.set(v2, -sin, cos, 0),
            vec3.forward(),
            out);
    }
    /** Create an affine transformation matrix from given non-uniform `scale` */
    static fromScale(scale: num2): mat3
    static fromScale<T extends num3x3>(scale: num2, out: T): T
    static fromScale(scale: num2, out = mat3()) {
        assert(scale.x !== 0 || scale.y !== 0, "both scale vector components can't zero.");
        return mat3.fromCols(
            vec3.set(v1, scale.x, 0, 0),
            vec3.set(v2, 0, scale.y, 0),
            vec3.forward(),
            out);
    }
    /** Create an affine transformation matrix from given `scale`, angle `radians` and `translation` */
    static fromScaleAngleTranslation(scale: num2, radians: Rad, translation: num2): mat3
    static fromScaleAngleTranslation<T extends num3x3>(scale: num2, radians: Rad, translation: num2, out: T): T
    static fromScaleAngleTranslation(scale: num2, radians: Rad, translation: num2, out = mat3()) {
        let [sin, cos] = sincos(radians);
        return mat3.fromCols(
            vec3.set(v1, cos * scale.x, sin * scale.x, 0.0),
            vec3.set(v2, -sin * scale.y, cos * scale.y, 0.0),
            vec3.set(v3, translation.x, translation.y, 1.0),
            out);
    }
    /** Create an affine transformation matrix from the given 2x2 matrix. */
    static fromMat2(mat: mat2): mat3
    static fromMat2<T extends num3x3>(mat: mat2, out: T): T
    static fromMat2(mat: mat2, out = mat3()) {
        return mat3.fromCols(vec2.extend(mat.c0), vec2.extend(mat.c1), vec3.forward(), out);
    }
    /** Return an array storing data in column major order. */
    static toColsArray(m: num3x3): ColsArray {
        return [
            m.c0.x, m.c0.y, m.c0.z,
            m.c1.x, m.c1.y, m.c1.z,
            m.c2.x, m.c2.y, m.c2.z];
    }
    /** Return a 3d array storing data in column major order. */
    static toColsArray2d(m: num3x3): ColsArray2d {
        return [vec3.toArray(m.c0), vec3.toArray(m.c1), vec3.toArray(m.c2)];
    }
    /** Return the diagonal entries of given matrix `m`. */
    static toDiagonal(m: num3x3): vec3
    static toDiagonal<T extends num3>(m: num3x3, out: T): T
    static toDiagonal(m: num3x3, out = vec3()) {
        return vec3.set(out, m.c0.x, m.c1.y, m.c2.z);
    }
    /** Return true if each entry of `m` is finite. */
    static isFinite(m: num3x3): boolean {
        return vec3.isFinite(m.c0) && vec3.isFinite(m.c1) && vec3.isFinite(m.c2);
    }
    /** Return true if any entry of `m` is NaN. */
    static isNan(m: num3x3): boolean {
        return vec3.isNan(m.c0) || vec3.isNan(m.c1) || vec3.isNan(m.c2);
    }
    /** Return true if `m` is an identity matrix */
    static isIdentity(m: num3x3): boolean {
        return feq(m.c0.x, 1.0) && feq(m.c0.y, 0.0) && feq(m.c0.z, 0.0) &&
            feq(m.c1.x, 0.0) && feq(m.c1.y, 1.0) && feq(m.c1.z, 0.0) &&
            feq(m.c2.x, 0.0) && feq(m.c2.y, 0.0) && feq(m.c2.z, 1.0);
    }
    /** Adds two matrices `lhs` and `rhs`. */
    static add(lhs: num3x3, rhs: num3x3): mat3
    static add<T extends num3x3>(lhs: num3x3, rhs: num3x3, out: T): T
    static add(lhs: num3x3, rhs: num3x3, out = mat3()) {
        return mat3.fromCols(
            vec3.add(lhs.c0, rhs.c0, v1),
            vec3.add(lhs.c1, rhs.c1, v2),
            vec3.add(lhs.c2, rhs.c2, v3),
            out);
    }
    /** Subtracts two matrices `lhs` and `rhs`. */
    static sub(lhs: num3x3, rhs: num3x3): mat3
    static sub<T extends num3x3>(lhs: num3x3, rhs: num3x3, out: T): T
    static sub(lhs: num3x3, rhs: num3x3, out = mat3()) {
        return mat3.fromCols(
            vec3.sub(lhs.c0, rhs.c0, v1),
            vec3.sub(lhs.c1, rhs.c1, v2),
            vec3.sub(lhs.c2, rhs.c2, v3),
            out);
    }
    /** Multiplies two matrices `lhs` and `rhs`. */
    static mul(lhs: num3x3, rhs: num3x3): mat3
    static mul<T extends num3x3>(lhs: num3x3, rhs: num3x3, out: T): T
    static mul(lhs: num3x3, rhs: num3x3, out = mat3()) {
        return mat3.fromCols(
            mat3.vmul3(lhs, rhs.c0, v1),
            mat3.vmul3(lhs, rhs.c1, v2),
            mat3.vmul3(lhs, rhs.c2, v3),
            out)
    }
    /** Multiplies a matrix `lhs` and a 3d vector `rhs`. */
    static vmul3(lhs: num3x3, rhs: num3): vec3
    static vmul3<T extends num3>(lhs: num3x3, rhs: num3, out: T): T
    static vmul3(lhs: num3x3, rhs: num3, out = vec3()) {
        out = vec3.scale(lhs.c0, rhs.x, out);
        vec3.add(out, vec3.scale(lhs.c1, rhs.y, v4), out);
        vec3.add(out, vec3.scale(lhs.c2, rhs.z, v4), out);
        return out;
    }
    /** Multiplies a matrix `lhs` and a scale value `rhs`. */
    static scale(lhs: num3x3, rhs: number): mat3
    static scale<T extends num3x3>(lhs: num3x3, rhs: number, out: T): T
    static scale(lhs: num3x3, rhs: number, out = mat3()) {
        return mat3.fromCols(
            vec3.scale(lhs.c0, rhs, v1),
            vec3.scale(lhs.c1, rhs, v2),
            vec3.scale(lhs.c2, rhs, v3),
            out);
    }
    /** Check equality between two matrices `lhs` and `rhs`. */
    static eq(lhs: num3x3, rhs: num3x3): boolean {
        return vec3.eq(lhs.c0, rhs.c0) && vec3.eq(lhs.c1, rhs.c1) && vec3.eq(lhs.c2, rhs.c2);
    }
    /** Return the column for given `index`. Throws if `index` is out of range. */
    static col<T extends num3x3>(m: T, index: number): T["c0" | "c1" | "c2"] {
        switch (index) {
            case 0: return m.c0;
            case 1: return m.c1;
            case 2: return m.c2;
            default: panic(`index out of range: ${index}`);
        }
    }
    /** Return the row for given `index`. Throws if `index` is out of range. */
    static row<T extends num3x3>(m: T, index: number): vec3 {
        switch (index) {
            case 0: return vec3(m.c0.x, m.c1.x, m.c2.x);
            case 1: return vec3(m.c0.y, m.c1.y, m.c2.y);
            case 2: return vec3(m.c0.z, m.c1.z, m.c2.z);
            default: panic(`index out of range: ${index}`);
        }
    }
    /** Return the inverse matrix of `m`. Throws if the determinant of `m` is zero */
    static inv(m: num3x3, out = mat3()) {
        let det = mat3.det(m);
        assert(det !== 0, "can't invert matrix with determinant zero.");
        let cr0 = vec3.cross(m.c1, m.c2);
        let cr1 = vec3.cross(m.c2, m.c0);
        let cr2 = vec3.cross(m.c0, m.c1);
        let invDet = vec3(recip(det));
        return mat3.transpose(mat3.fromCols(
            vec3.mul(cr0, invDet, cr0),
            vec3.mul(cr1, invDet, cr1),
            vec3.mul(cr2, invDet, cr2),
            out));
    }
    /** Return the transpose of the matrix `m`. */
    static transpose(m: num3x3, out = mat3()) {
        return mat3.fromCols(
            vec3.set(v1, m.c0.x, m.c1.x, m.c2.x),
            vec3.set(v2, m.c0.y, m.c1.y, m.c2.y),
            vec3.set(v3, m.c0.z, m.c1.z, m.c2.z),
            out);
    }
    /** Return the determinant of the matrix `m`. */
    static det(m: num3x3): number {
        let cross = vec3.cross(m.c0, m.c1);
        return vec3.dot(m.c2, cross);
    }
    /** Transforms the given 2D vector as a point. Assumes that `m` is a valid affine transform */
    static transformPoint2(m: num3x3, rhs: num2): vec2
    static transformPoint2<T extends num2>(m: num3x3, rhs: num2, out: T): T
    static transformPoint2(m: num3x3, rhs: num2, out = vec2()) {
        return vec2.add(mat3.transformVec2(m, rhs), vec3.xy(m.c2), out);
    }
    /** Rotates the given 2D vector. Assumes that `m` is valid a affine transform */
    static transformVec2(m: num3x3, rhs: num2): vec2
    static transformVec2<T extends num2>(m: num3x3, rhs: num2, out: T): T
    static transformVec2(m: num3x3, rhs: num2, out = vec2()) {
        return mat2.vmul2(mat2.fromCols(
            vec3.xy(m.c0, v1),
            vec3.xy(m.c1, v2),
            m1
        ), rhs, out);
    }
});

/** @internal */
class Mat3 implements num3x3 {
    c0: vec3;
    c1: vec3;
    c2: vec3;
    /** Create a 3x3 matrix */
    constructor(...args: ColsArray) {
        this.c0 = vec3(args[0], args[1], args[2]);
        this.c1 = vec3(args[3], args[4], args[5]);
        this.c2 = vec3(args[6], args[7], args[8]);
    }
    /** Set properties. */
    set(...args: SetParams<typeof mat3>): this {
        return mat3.set(this, ...args) as this;
    }
    /** Copy properties from `m`. */
    copy(m: num3x3): this {
        return mat2.copy(this, m);
    }
    /** Clone `this` matrix. */
    clone(): mat3 {
        return mat3.clone(this);
    }
    /** Return a string representation. */
    toString() {
        return mat3.fmt(this);
    }
    /** Return an array storing data in column major order. */
    toColsArray(): ColsArray {
        return mat3.toColsArray(this);
    }
    /** Return a 3d array storing data in column major order. */
    toColsArray2d(): ColsArray2d {
        return mat3.toColsArray2d(this);
    }
    /** Return the diagonal entries. */
    toDiagonal(): vec3
    toDiagonal<T extends num3>(out: T): T
    toDiagonal(out = vec3()) {
        return mat3.toDiagonal(this, out);
    }
    /** Return true if each entry is finite. */
    isFinite(): boolean {
        return mat3.isFinite(this);
    }
    /** Return true if any entry is NaN. */
    isNan(): boolean {
        return mat3.isNan(this);
    }
    /** Return true if this is an identity matrix */
    isIdentity(): boolean {
        return mat3.isIdentity(this);
    }
    /** Adds `rhs` to `this`. */
    add(rhs: num3x3): this {
        return mat3.add(this, rhs, this) as this;
    }
    /** Subtracts `rhs` from `this`. */
    sub(rhs: num3x3): this {
        return mat3.sub(this, rhs, this) as this;
    }
    /** Multiplies `rhs` with `this`. */
    mul(rhs: num3x3): this {
        return mat3.mul(this, rhs, this) as this;
    }
    /** Multiplies a 3d vector `rhs` withthe matrix. */
    vmul3(rhs: num3): vec3
    vmul3<T extends num3>(rhs: num3, out: T): T
    vmul3(rhs: num3, out = vec3()) {
        return mat3.vmul3(this, rhs, out);
    }
    /** Multiplies the matrix by a scalar. */
    scale(rhs: number): this {
        return mat3.scale(this, rhs, this) as this;
    }
    /** Check equality between `this`` and `rhs`. */
    eq(rhs: num3x3): boolean {
        return mat3.eq(this, rhs);
    }
    /** Return the column for given `index`. Throws if `index` is out of range. */
    col(index: number): vec3 {
        return mat3.col(this, index);
    }
    /** Return the row for given `index`. Throws if `index` is out of range. */
    row(index: number): vec3 {
        return mat3.row(this, index);
    }
    /** Inverse the matrix. Throws if the determinant is zero */
    inv(): this {
        return mat3.inv(this, this) as this;
    }
    /** Transpose the matrix. */
    transpose(): this {
        return mat3.transpose(this, this) as this;
    }
    /** Return the determinant. */
    det(): number {
        return mat3.det(this);
    }
    /** Transforms the given 2D vector as a point. Assumes that `this` is a valid affine transform */
    transformPoint2(rhs: num2): vec2
    transformPoint2<T extends num2>(rhs: num2, out: T): T
    transformPoint2(rhs: num2, out = vec2()) {
        return mat3.transformPoint2(this, rhs, out);
    }
    /** Rotates the given 2D vector. Assumes that `this` is valid a affine transform */
    transformVec2(rhs: num2): vec2
    transformVec2<T extends num2>(rhs: num2, out: T): T
    transformVec2(rhs: num2, out = vec2()) {
        return mat3.transformVec2(this, rhs, out);
    }
}

/** @internal */
let v1 = vec3();
let v2 = vec3();
let v3 = vec3();
let v4 = vec3();
let m1 = mat2();

/** @internal */
type ColsArray = [
    m00: number,
    m01: number,
    m02: number,
    m10: number,
    m11: number,
    m12: number,
    m20: number,
    m21: number,
    m22: number
];

/** @internal */
type ColsArray2d = [
    c0: [ColsArray[0], ColsArray[1], ColsArray[2]],
    c1: [ColsArray[3], ColsArray[4], ColsArray[5]],
    c2: [ColsArray[6], ColsArray[7], ColsArray[8]]
];
