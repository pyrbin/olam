import { createImpl } from "../base";
import { assert, panic } from "../debug";
import { feq, recip, sincos } from "../math";
import { mat2 } from "./mat2";
import { vec2 } from "./vec2";
import { vec3 } from "./vec3";

/** A 3x3 column major matrix. */
export interface mat3 extends Mat3 { }

export const mat3 = createImpl(class Mat3Impl extends null {
    /** Create a new 3x3 matrix */
    static create(
        m00: number = 0,
        m01: number = m00,
        m02: number = m01,
        m10: number = m02,
        m11: number = m10,
        m12: number = m11,
        m20: number = m12,
        m21: number = m20,
        m22: number = m21): mat3 {
        return new Mat3(m00, m01, m02, m10, m11, m12, m20, m21, m22);
    }
    /** Set properties of given matrix `target` */
    static set<T extends num3x3>(target: T, ...args: SetParams<typeof Mat3Impl>): T {
        target.c0.x = args[0] ?? target.c0.x;
        target.c0.y = args[1] ?? target.c0.y;
        target.c0.z = args[2] ?? target.c0.z;
        target.c1.x = args[3] ?? target.c1.x;
        target.c1.y = args[4] ?? target.c1.y;
        target.c1.z = args[5] ?? target.c1.z;
        target.c2.x = args[6] ?? target.c2.x;
        target.c2.y = args[7] ?? target.c2.y;
        target.c2.z = args[8] ?? target.c2.z;
        return target;
    }
    /** Creates a 3x3 matrix from three column vectors. */
    static fromCols(x: num3, y: num3, z: num3): mat3
    static fromCols<T extends num3x3>(x: num3, y: num3, z: num3, out?: T): T
    static fromCols<T extends num3x3>(x: num3, y: num3, z: num3, out?: T) {
        return mat3.set(out ?? mat3(),
            x.x, x.y, x.z,
            y.x, y.y, y.z,
            z.x, z.y, z.z) as T;
    }
    /** Creates a 3x3 matrix from an array-like. */
    static fromArray(array: ArrayLike<number>): mat3
    static fromArray<T extends num3x3>(array: ArrayLike<number>, out?: T): T
    static fromArray<T extends num3x3>(array: ArrayLike<number>, out?: T) {
        return this.set(out ?? mat3(),
            array[0], array[1], array[2],
            array[3], array[4], array[5],
            array[6], array[7], array[8]);
    }
    /** Creates a 3x3 matrix from an 3d array. */
    static fromArray3d<T extends num3x3>(array: [ArrayLike<number>, ArrayLike<number>, ArrayLike<number>]): mat3
    static fromArray3d<T extends num3x3>(array: [ArrayLike<number>, ArrayLike<number>, ArrayLike<number>], out?: T): T
    static fromArray3d<T extends num3x3>(array: [ArrayLike<number>, ArrayLike<number>, ArrayLike<number>], out?: T) {
        return this.fromCols(
            vec3.fromArray(array[0], v1),
            vec3.fromArray(array[1], v2),
            vec3.fromArray(array[2], v3),
            out);
    }
    /** Creates a 3x3 matrix with its diagonal set to `diagonal` and all other entries set to 0. */
    static fromDiagonal<T extends num3x3>(diagonal: num3): mat3
    static fromDiagonal<T extends num3x3>(diagonal: num3, out?: T): T
    static fromDiagonal<T extends num3x3>(diagonal: num3, out?: T) {
        return this.set(out ?? mat3(),
            diagonal.x, 0, 0,
            0, diagonal.y, 0,
            0, 0, diagonal.z);
    }
    /** Creates a 3x3 rotation matrix from a rotation `axis` and angle `radians` */
    static fromAxisAngle<T extends num3x3>(axis: num3, radians: number): mat3
    static fromAxisAngle<T extends num3x3>(axis: num3, radians: number, out?: T): T
    static fromAxisAngle<T extends num3x3>(axis: num3, radians: number, out?: T) {
        assert(vec3.isNormalized(axis), "axis is not normalized");
        let [sin, cos] = sincos(radians);
        let [xsin, ysin, zsin] = vec3.toArray(vec3.scale(axis, sin));
        let [x, y, z] = vec3.toArray(axis);
        let [x2, y2, z2] = vec3.toArray(vec3.mul(axis, axis));
        let omc = 1 - cos;
        let xyomc = x * y * omc;
        let xzomc = x * z * omc;
        let yzomc = y * z * omc;
        return this.fromCols(
            vec3(x2 * omc + cos, xyomc + zsin, xzomc - ysin),
            vec3(xyomc - zsin, y2 * omc + cos, yzomc + xsin),
            vec3(xzomc + ysin, yzomc - xsin, z2 * omc + cos),
            out);
    }
    /** Creates a 3x3 rotation matrix from angle `radians` around the x-axis */
    static fromRotationX<T extends Maybe<num3x3>>(radians: number): mat3
    static fromRotationX<T extends Maybe<num3x3>>(radians: number, out?: T): T
    static fromRotationX<T extends Maybe<num3x3>>(radians: number, out?: T) {
        let [sin, cos] = sincos(radians);
        return this.fromCols(
            vec3.right(),
            vec3(0, cos, sin),
            vec3(0, -sin, cos),
            out);
    }
    /** Creates a 3x3 rotation matrix from angle `radians` around the y-axis */
    static fromRotationY<T extends num3x3>(radians: number, out?: T): mat3
    static fromRotationY<T extends num3x3>(radians: number, out?: T): T
    static fromRotationY<T extends num3x3>(radians: number, out?: T) {
        let [sin, cos] = sincos(radians);
        return this.fromCols(
            vec3(cos, 0, -sin),
            vec3.up(),
            vec3(sin, 0, cos),
            out);
    }
    /** Creates a 3x3 rotation matrix from angle `radians` around the z-axis */
    static fromRotationZ<T extends num3x3>(radians: number): mat3
    static fromRotationZ<T extends num3x3>(radians: number, out?: T): T
    static fromRotationZ<T extends num3x3>(radians: number, out?: T) {
        let [sin, cos] = sincos(radians);
        return this.fromCols(
            vec3(cos, sin, 0),
            vec3(-sin, cos, 0),
            vec3.forward(),
            out);
    }
    /** Creates an affine transformation matrix from given `translation` */
    static fromTranslation<T extends num3x3>(translation: num2): mat3
    static fromTranslation<T extends num3x3>(translation: num2, out?: T): T
    static fromTranslation<T extends num3x3>(translation: num2, out?: T) {
        return this.fromCols(
            vec3.right(),
            vec3.up(),
            vec3(translation.x, translation.y, 1.0),
            out);
    }
    /** Creates an affine transformation matrix from given angle `radians` */
    static fromAngle<T extends num3x3>(radians: number): mat3
    static fromAngle<T extends num3x3>(radians: number, out?: T): T
    static fromAngle<T extends num3x3>(radians: number, out?: T) {
        let [sin, cos] = sincos(radians);
        return this.fromCols(
            vec3(cos, sin, 0),
            vec3(-sin, cos, 0),
            vec3.forward(),
            out);
    }
    /** Creates an affine transformation matrix from given non-uniform `scale` */
    static fromScale<T extends num3x3>(scale: num2): mat3
    static fromScale<T extends num3x3>(scale: num2, out?: T): T
    static fromScale<T extends num3x3>(scale: num2, out?: T) {
        assert(scale.x !== 0 || scale.y !== 0, "both scale vector components can't zero.");
        return this.fromCols(
            vec3(scale.x, 0, 0),
            vec3(0, scale.y, 0),
            vec3.forward(),
            out);
    }
    /** Creates an affine transformation matrix from given `scale`, angle `radians` and `translation` */
    static fromScaleAngleTranslation<T extends num3x3>(scale: num2, radians: number, translation: num2): mat3
    static fromScaleAngleTranslation<T extends num3x3>(scale: num2, radians: number, translation: num2, out?: T): T
    static fromScaleAngleTranslation<T extends num3x3>(scale: num2, radians: number, translation: num2, out?: T) {
        let [sin, cos] = sincos(radians);
        return this.fromCols(
            vec3.set(v1, cos * scale.x, sin * scale.x, 0.0),
            vec3.set(v2, -sin * scale.y, cos * scale.y, 0.0),
            vec3.set(v3, translation.x, translation.y, 1.0),
            out);
    }
    /** Creates an affine transformation matrix from the given 2x2 matrix. */
    static fromMat2<T extends num3x3>(mat: mat2): mat3
    static fromMat2<T extends num3x3>(mat: mat2, out?: T): T
    static fromMat2<T extends num3x3>(mat: mat2, out?: T) {
        return this.fromCols(vec2.extend(mat.c0), vec2.extend(mat.c1), vec3.forward(), out);
    }
    /** Copy properies from `b` to target matrix `a` */
    static copy<T extends num3x3>(a: T, b: num3x3) {
        return this.set(a,
            b.c0.x, b.c0.y, b.c0.z,
            b.c1.x, b.c1.y, b.c1.z,
            b.c2.x, b.c2.y, b.c2.z);
    }
    /** Creates a matrix with all entries set to `0`. */
    static zero(): mat3 {
        return this.create(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    /** Creates an identity matrix, where all diagonal elements are `1`, and all off-diagonal elements are `0`. */
    static identity(): mat3 {
        return this.create(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }
    /** Returns a string representation  */
    static fmt(target: num3x3) {
        return `(${vec3.fmt(target.c0)},${vec3.fmt(target.c1)},${vec3.fmt(target.c2)})`;
    }
    /** Returns an array storing data in column major order. */
    static toColsArray(target: num3x3): ColsArray {
        return [
            target.c0.x, target.c0.y, target.c0.z,
            target.c1.x, target.c1.y, target.c1.z,
            target.c2.x, target.c2.y, target.c2.z];
    }
    /** Returns a 3d array storing data in column major order. */
    static toColsArray3d(target: num3x3): ColsArray3d {
        return [vec3.toArray(target.c0), vec3.toArray(target.c1), vec3.toArray(target.c2)];
    }
    /** Returns the diagonal entries of given matrix `target`. */
    static toDiagonal(target: num3x3): vec3
    static toDiagonal<T extends num3>(target: num3x3, out?: T): T
    static toDiagonal<T extends num3>(target: num3x3, out?: T): T {
        return vec3.set(out ?? vec3(), target.c0.x, target.c1.y, target.c2.z) as T;
    }
    /** Returns true if each entry of `target` is finite. */
    static isFinite(target: num3x3): boolean {
        return vec3.isFinite(target.c0) && vec3.isFinite(target.c1) && vec3.isFinite(target.c2);
    }
    /** Returns true if any entry of `target` is NaN. */
    static isNan(target: num3x3): boolean {
        return vec3.isNan(target.c0) || vec3.isNan(target.c1) || vec3.isNan(target.c2);
    }
    /** Returns true if `target` is an identity matrix */
    static isIdentity(target: num3x3): boolean {
        return feq(target.c0.x, 1.0) && feq(target.c0.y, 0.0) && feq(target.c0.z, 0.0) &&
            feq(target.c1.x, 0.0) && feq(target.c1.y, 1.0) && feq(target.c1.z, 0.0) &&
            feq(target.c2.x, 0.0) && feq(target.c2.y, 0.0) && feq(target.c2.z, 1.0);
    }
    /** Adds two matrices `lhs` and `rhs`. */
    static add<T extends num3x3>(lhs: num3x3, rhs: num3x3): mat3
    static add<T extends num3x3>(lhs: num3x3, rhs: num3x3, out?: T): T
    static add<T extends num3x3>(lhs: num3x3, rhs: num3x3, out?: T) {
        return this.fromCols(
            vec3.add(lhs.c0, rhs.c0, v1),
            vec3.add(lhs.c1, rhs.c1, v2),
            vec3.add(lhs.c2, rhs.c2, v3),
            out);
    }
    /** Subtracts two matrices `lhs` and `rhs`. */
    static sub<T extends num3x3>(lhs: num3x3, rhs: num3x3): mat3
    static sub<T extends num3x3>(lhs: num3x3, rhs: num3x3, out?: T): T
    static sub<T extends num3x3>(lhs: num3x3, rhs: num3x3, out?: T) {
        return this.fromCols(
            vec3.sub(lhs.c0, rhs.c0, v1),
            vec3.sub(lhs.c1, rhs.c1, v2),
            vec3.sub(lhs.c2, rhs.c2, v3),
            out);
    }
    /** Multiplies two matrices `lhs` and `rhs`. */
    static mul<T extends num3x3>(lhs: num3x3, rhs: num3x3): mat3
    static mul<T extends num3x3>(lhs: num3x3, rhs: num3x3, out?: T): T
    static mul<T extends num3x3>(lhs: num3x3, rhs: num3x3, out?: T) {
        return this.fromCols(
            this.vmul3(lhs, rhs.c0, v1),
            this.vmul3(lhs, rhs.c1, v2),
            this.vmul3(lhs, rhs.c2, v3),
            out)
    }
    /** Multiplies a matrix `lhs` and a 3d vector `rhs`. */
    static vmul3(lhs: num3x3, rhs: num3): vec3
    static vmul3<T extends num3>(lhs: num3x3, rhs: num3, out?: T): T
    static vmul3<T extends num3>(lhs: num3x3, rhs: num3, out?: T) {
        out = vec3.scale(lhs.c0, rhs.x, out);
        vec3.add(out as T, vec3.scale(lhs.c1, rhs.y, v4), out);
        vec3.add(out as T, vec3.scale(lhs.c2, rhs.z, v4), out);
        return out as T;
    }
    /** Multiplies a matrix `lhs` and a scale value `rhs`. */
    static scale<T extends num3x3>(lhs: num3x3, rhs: number): mat3
    static scale<T extends num3x3>(lhs: num3x3, rhs: number, out?: T): T
    static scale<T extends num3x3>(lhs: num3x3, rhs: number, out?: T) {
        return this.fromCols(
            vec3.scale(lhs.c0, rhs, v1),
            vec3.scale(lhs.c1, rhs, v2),
            vec3.scale(lhs.c2, rhs, v3),
            out);
    }
    /** Check equality between two matrices `lhs` and `rhs`. */
    static eq(lhs: num3x3, rhs: num3x3): boolean {
        return vec3.eq(lhs.c0, rhs.c0) && vec3.eq(lhs.c1, rhs.c1) && vec3.eq(lhs.c2, rhs.c2);
    }
    /** Returns the column for given `index`. Throws if `index` is out of range. */
    static col<T extends num3x3>(target: T, index: number): T["c0" | "c1" | "c2"] {
        switch (index) {
            case 0: return target.c0;
            case 1: return target.c1;
            case 2: return target.c2;
            default: panic(`index out of range: ${index}`);
        }
    }
    /** Returns the row for given `index`. Throws if `index` is out of range. */
    static row<T extends num3x3>(target: T, index: number): vec3 {
        switch (index) {
            case 0: return vec3(target.c0.x, target.c1.x, target.c2.x);
            case 1: return vec3(target.c0.y, target.c1.y, target.c2.y);
            case 2: return vec3(target.c0.z, target.c1.z, target.c2.z);
            default: panic(`index out of range: ${index}`);
        }
    }
    /** Returns the inverse matrix of `target`. Throws if the determinant of `target` is zero */
    static inv<T extends num3x3>(target: num3x3, out?: T) {
        let det = this.det(target);
        assert(det !== 0, "can't invert matrix with determinant zero.");
        let cr0 = vec3.cross(target.c1, target.c2);
        let cr1 = vec3.cross(target.c2, target.c0);
        let cr2 = vec3.cross(target.c0, target.c1);
        let invDet = vec3(recip(det));
        return mat3.transpose(this.fromCols(
            vec3.mul(cr0, invDet, cr0),
            vec3.mul(cr1, invDet, cr1),
            vec3.mul(cr2, invDet, cr2),
            out));
    }
    /** Returns the transpose of the matrix `target`. */
    static transpose<T extends num3x3>(target: num3x3, out?: T) {
        return this.fromCols(
            vec3.set(v1, target.c0.x, target.c1.x, target.c2.x),
            vec3.set(v2, target.c0.y, target.c1.y, target.c2.y),
            vec3.set(v3, target.c0.z, target.c1.z, target.c2.z),
            out);
    }
    /** Returns the determinant of the matrix `target`. */
    static det(target: num3x3): number {
        let cross = vec3.cross(target.c0, target.c1);
        return vec3.dot(target.c2, cross);
    }
    /** Transforms the given 2D vector as a point. Assumes that `target` is a valid affine transform */
    static transformPoint2(target: num3x3, rhs: num2): vec2
    static transformPoint2<T extends num2>(target: num3x3, rhs: num2, out?: T): T
    static transformPoint2<T extends num2>(target: num3x3, rhs: num2, out?: T): T {
        return vec2.add(this.transformVec2(target, rhs), vec3.xy(target.c2), out);
    }
    /** Rotates the given 2D vector. Assumes that `target` is valid a affine transform */
    static transformVec2(target: num3x3, rhs: num2): vec2
    static transformVec2<T extends num2>(target: num3x3, rhs: num2, out?: T): T
    static transformVec2<T extends num2>(target: num3x3, rhs: num2, out?: T): T {
        return mat2.vmul2(mat2.fromCols(
            vec3.xy(target.c0, v1),
            vec3.xy(target.c1, v2),
            m1
        ), rhs, out) as unknown as T
    }
});

/** @internal */
class Mat3 implements num3x3 {
    c0: vec3;
    c1: vec3;
    c2: vec3;
    /** Creates a 3x3 matrix */
    constructor(
        m00: number = 0,
        m01: number = m00,
        m02: number = m01,
        m10: number = m02,
        m11: number = m10,
        m12: number = m11,
        m20: number = m12,
        m21: number = m20,
        m22: number = m21) {
        this.c0 = vec3(m00, m01, m02);
        this.c1 = vec3(m10, m11, m12);
        this.c2 = vec3(m20, m21, m22);
    }
    /** Set properties. */
    set(...args: SetParams<typeof mat3>): this {
        return mat3.set(this, ...args) as this;
    }
    /** Copy properies from `src`. */
    copy(src: num3x3): this {
        return mat2.copy(this, src);
    }
    /** Returns a string representation. */
    toString() {
        return mat3.fmt(this);
    }
    /** Returns an array storing data in column major order. */
    toColsArray(): ColsArray {
        return mat3.toColsArray(this);
    }
    /** Returns a 3d array storing data in column major order. */
    toColsArray3d(): ColsArray3d {
        return mat3.toColsArray3d(this);
    }
    /** Returns the diagonal entries. */
    toDiagonal(): vec3
    toDiagonal<T extends num3>(out?: T): T
    toDiagonal<T extends num3>(out?: T) {
        return mat3.toDiagonal(this, out);
    }
    /** Returns true if each entry is finite. */
    isFinite(): boolean {
        return mat3.isFinite(this);
    }
    /** Returns true if any entry is NaN. */
    isNan(): boolean {
        return mat3.isNan(this);
    }
    /** Returns true if this is an identity matrix */
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
    vmul3<T extends num3>(rhs: num3, out?: T): T
    vmul3<T extends num3>(rhs: num3, out?: T): T {
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
    /** Returns the column for given `index`. Throws if `index` is out of range. */
    col(index: number): vec3 {
        return mat3.col(this, index);
    }
    /** Returns the row for given `index`. Throws if `index` is out of range. */
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
    /** Returns the determinant. */
    det(): number {
        return mat3.det(this);
    }
    /** Transforms the given 2D vector as a point. Assumes that `this` is a valid affine transform */
    transformPoint2(rhs: num2): vec2
    transformPoint2<T extends num2>(rhs: num2, out?: T): T
    transformPoint2<T extends num2>(rhs: num2, out?: T): T {
        return mat3.transformPoint2(this, rhs, out);
    }
    /** Rotates the given 2D vector. Assumes that `this` is valid a affine transform */
    transformVec2(rhs: num2): vec2
    transformVec2<T extends num2>(rhs: num2, out?: T): T
    transformVec2<T extends num2>(rhs: num2, out?: T) {
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
type ColsArray3d = [
    c0: [ColsArray[0], ColsArray[1], ColsArray[2]],
    c1: [ColsArray[3], ColsArray[4], ColsArray[5]],
    c2: [ColsArray[6], ColsArray[7], ColsArray[8]]
];
