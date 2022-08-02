import { assert, panic } from "../debug";
import { eqf, recip, sincos } from "../math";
import * as type from "../type";
import { mat2 } from "./mat2";
import { vec2 } from "./vec2";
import { vec3 } from "./vec3";

/** A 3x3 column major matrix. */
export interface mat3 extends type.Mat3 {

}

/** @internal */
function create(
    m00: number = 0,
    m01: number = m00,
    m02: number = m01,
    m10: number = m02,
    m11: number = m10,
    m12: number = m11,
    m20: number = m12,
    m21: number = m20,
    m22: number = m21): mat3 {
    return {
        c0: vec3(m00, m01, m02),
        c1: vec3(m10, m11, m12),
        c2: vec3(m20, m21, m22),
    };
}

/** @internal */
let tmp0 = vec3();
let tmp1 = vec3();
let tmp2 = vec3();
let tmp3 = vec3();
let tmpm20 = mat2();

export const mat3 = type.implement({
    /** Create a new 3x3 matrix */
    new: create,
    /** Creates a matrix with all entries set to `0`. */
    zero(): mat3 {
        return create(0, 0, 0, 0, 0, 0, 0, 0, 0);
    },
    /** Creates an identity matrix, where all diagonal elements are `1`, and all off-diagonal elements are `0`. */
    identity(): mat3 {
        return create(1, 0, 0, 0, 1, 0, 0, 0, 1);
    },
    /** Set properties of given matrix `target` */
    set(target: mat3,
        m00: number = 0,
        m01: number = m00,
        m02: number = m01,
        m10: number = m02,
        m11: number = m10,
        m12: number = m11,
        m20: number = m12,
        m21: number = m20,
        m22: number = m21): mat3 {
        target.c0.x = m00;
        target.c0.y = m01;
        target.c0.z = m02;
        target.c1.x = m10;
        target.c1.y = m11;
        target.c1.z = m12;
        target.c2.x = m20;
        target.c2.y = m21;
        target.c2.z = m22;
        return target;
    },
    /** Copies properies from `b` to target matrix `a` */
    copy(a: mat3, b: mat3): mat3 {
        return this.set(a,
            b.c0.x, b.c0.y, b.c0.z,
            b.c1.x, b.c1.y, b.c1.z,
            b.c2.x, b.c2.y, b.c2.z);
    },
    /** Returns a string representation  */
    fmt(target: mat3) {
        return `(${vec3.fmt(target.c0)},${vec3.fmt(target.c1)},${vec3.fmt(target.c2)})`;
    },
    /** Creates a 3x3 matrix from three column vectors. */
    fromCols(x: type.Vec3, y: type.Vec3, z: type.Vec3, out = create()): mat3 {
        return this.set(out,
            x.x, x.y, x.z,
            y.x, y.y, y.z,
            z.x, z.y, z.z);
    },
    /** Creates a 3x3 matrix from an array-like. */
    fromArray(array: ArrayLike<number>, out = create()): mat3 {
        return this.set(out,
            array[0], array[1], array[2],
            array[3], array[4], array[5],
            array[6], array[7], array[8]);
    },
    /** Creates a 3x3 matrix from an 3d array. */
    fromArray3d(array: [ArrayLike<number>, ArrayLike<number>, ArrayLike<number>], out = create()): mat3 {
        return this.fromCols(
            vec3.fromArray(array[0], tmp0),
            vec3.fromArray(array[1], tmp1),
            vec3.fromArray(array[2], tmp2),
            out);
    },
    /** Creates a 3x3 matrix with its diagonal set to `diagonal` and all other entries set to 0. */
    fromDiagonal(diagonal: type.Vec3, out = create()): mat3 {
        return this.set(out,
            diagonal.x, 0, 0,
            0, diagonal.y, 0,
            0, 0, diagonal.z);
    },
    /** Creates a 3x3 rotation matrix from a rotation `axis` and angle `radians` */
    fromAxisAngle(axis: type.Vec3, radians: number, out = create()): mat3 {
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
    },
    /** Creates a 3x3 rotation matrix from angle `radians` around the x-axis */
    fromRotationX(radians: number, out = create()): mat3 {
        let [sin, cos] = sincos(radians);
        return this.fromCols(
            vec3.right(),
            vec3(0, cos, sin),
            vec3(0, -sin, cos),
            out);
    },
    /** Creates a 3x3 rotation matrix from angle `radians` around the y-axis */
    fromRotationY(radians: number, out = create()): mat3 {
        let [sin, cos] = sincos(radians);
        return this.fromCols(
            vec3(cos, 0, -sin),
            vec3.up(),
            vec3(sin, 0, cos),
            out);
    },
    /** Creates a 3x3 rotation matrix from angle `radians` around the z-axis */
    fromRotationZ(radians: number, out = create()): mat3 {
        let [sin, cos] = sincos(radians);
        return this.fromCols(
            vec3(cos, sin, 0),
            vec3(-sin, cos, 0),
            vec3.forward(),
            out);
    },
    /** Creates an affine transformation matrix from given `translation` */
    fromTranslation(translation: type.Vec2, out = create()): mat3 {
        return this.fromCols(
            vec3.right(),
            vec3.up(),
            vec3(translation.x, translation.y, 1.0),
            out);
    },
    /** Creates an affine transformation matrix from given angle `radians` */
    fromAngle(radians: number, out = create()): mat3 {
        let [sin, cos] = sincos(radians);
        return this.fromCols(
            vec3(cos, sin, 0),
            vec3(-sin, cos, 0),
            vec3.forward(),
            out);
    },
    /** Creates an affine transformation matrix from given non-uniform `scale` */
    fromScale(scale: type.Vec2, out = create()): mat3 {
        assert(scale.x !== 0 || scale.y !== 0, "both scale vector components can't zero.");
        return this.fromCols(
            vec3(scale.x, 0, 0),
            vec3(0, scale.y, 0),
            vec3.forward(),
            out);
    },
    /** Creates an affine transformation matrix from given `scale`, angle `radians` and `translation` */
    fromScaleAngleTranslation(scale: type.Vec2, radians: number, translation: type.Vec2, out = create()): mat3 {
        let [sin, cos] = sincos(radians);
        return this.fromCols(
            vec3.set(tmp0, cos * scale.x, sin * scale.x, 0.0),
            vec3.set(tmp1, -sin * scale.y, cos * scale.y, 0.0),
            vec3.set(tmp2, translation.x, translation.y, 1.0),
            out);
    },
    /** Creates an affine transformation matrix from the given 2x2 matrix. */
    fromMat2(mat: mat2, out = create()): mat3 {
        return this.fromCols(vec2.extend(mat.c0), vec2.extend(mat.c1), vec3.forward(), out);
    },
    /** Returns an array storing data in column major order. */
    toColsArray(self: mat3): ColsArray {
        return [
            self.c0.x, self.c0.y, self.c0.z,
            self.c1.x, self.c1.y, self.c1.z,
            self.c2.x, self.c2.y, self.c2.z];
    },
    /** Returns a 3d array storing data in column major order. */
    toColsArray2d(self: mat3): ColsArray3d {
        return [vec3.toArray(self.c0), vec3.toArray(self.c1), vec3.toArray(self.c2)];
    },
    /** Returns the diagonal entries of given matrix `self`. */
    toDiagonal(self: mat3): type.Vec3 {
        return vec3(self.c0.x, self.c1.y, self.c2.z);
    },
    /** Returns true if each entry of `self` is finite. */
    isFinite(self: mat3): boolean {
        return vec3.isFinite(self.c0) && vec3.isFinite(self.c1) && vec3.isFinite(self.c2);
    },
    /** Returns true if any entry of `self` is NaN. */
    isNan(self: mat3): boolean {
        return vec3.isNan(self.c0) || vec3.isNan(self.c1) || vec3.isNan(self.c2);
    },
    /** Returns true if `target` is an identity matrix */
    isIdentity(target: mat3): boolean {
        return eqf(target.c0.x, 1.0) && eqf(target.c0.y, 0.0) && eqf(target.c0.z, 0.0) &&
            eqf(target.c1.x, 0.0) && eqf(target.c1.y, 1.0) && eqf(target.c1.z, 0.0) &&
            eqf(target.c2.x, 0.0) && eqf(target.c2.y, 0.0) && eqf(target.c2.z, 1.0);
    },
    /** Adds two matrices `lhs` and `rhs`. */
    add(lhs: mat3, rhs: mat3, out = create()): mat3 {
        return this.fromCols(
            vec3.add(lhs.c0, rhs.c0, tmp0),
            vec3.add(lhs.c1, rhs.c1, tmp1),
            vec3.add(lhs.c2, rhs.c2, tmp2),
            out);
    },
    /** Subtracts two matrices `lhs` and `rhs`. */
    sub(lhs: mat3, rhs: mat3, out = create()): mat3 {
        return this.fromCols(
            vec3.sub(lhs.c0, rhs.c0, tmp0),
            vec3.sub(lhs.c1, rhs.c1, tmp1),
            vec3.sub(lhs.c2, rhs.c2, tmp2),
            out);
    },
    /** Multiplies two matrices `lhs` and `rhs`. */
    mul(lhs: mat3, rhs: mat3, out = create()): mat3 {
        return this.fromCols(
            this.vmul3(lhs, rhs.c0, tmp0),
            this.vmul3(lhs, rhs.c1, tmp1),
            this.vmul3(lhs, rhs.c2, tmp2),
            out)
    },
    /** Multiplies a matrix `lhs` and a 3d vector `rhs`. */
    vmul3(lhs: mat3, rhs: type.Vec3, out = vec3()): type.Vec3 {
        vec3.scale(lhs.c0, rhs.x, out);
        vec3.add(out, vec3.scale(lhs.c1, rhs.y, tmp3), out);
        vec3.add(out, vec3.scale(lhs.c2, rhs.z, tmp3), out);
        return out;
    },
    /** Multiplies a matrix `lhs` and a scale value `rhs`. */
    scale(lhs: mat3, rhs: number, out = create()): mat3 {
        return this.fromCols(
            vec3.scale(lhs.c0, rhs, tmp0),
            vec3.scale(lhs.c1, rhs, tmp1),
            vec3.scale(lhs.c2, rhs, tmp2),
            out);
    },
    /** Check equality between two matrices `lhs` and `rhs`. */
    eq(lhs: mat3, rhs: mat3): boolean {
        return vec3.eq(lhs.c0, rhs.c0) && vec3.eq(lhs.c1, rhs.c1) && vec3.eq(lhs.c2, rhs.c2);
    },
    /** Returns the column for given `index`. Throws if `index` is out of range. */
    col(self: mat3, index: number): type.Vec3 {
        switch (index) {
            case 0: return self.c0;
            case 1: return self.c1;
            case 2: return self.c1;
            default: panic(`index out of range: ${index}`);
        }
    },
    /** Returns the row for given `index`. Throws if `index` is out of range. */
    row(self: mat3, index: number): type.Vec3 {
        switch (index) {
            case 0: return vec3(self.c0.x, self.c1.x, self.c2.x);
            case 1: return vec3(self.c0.y, self.c1.y, self.c2.y);
            case 2: return vec3(self.c0.z, self.c1.z, self.c2.z);
            default: panic(`index out of range: ${index}`);
        }
    },
    /** Returns the inverse matrix of the matrix `self`. Throws if the determinant of `self` is zero */
    inv(self: mat3, out = create()): mat3 {
        let tmp0 = vec3.cross(self.c1, self.c2);
        let tmp1 = vec3.cross(self.c2, self.c0);
        let tmp2 = vec3.cross(self.c0, self.c1);
        let det = this.det(self);
        assert(det !== 0, "can't invert matrix with determinant zero.");
        let invDet = vec3(recip(det));
        return mat3.transpose(this.fromCols(
            vec3.mul(tmp0, invDet, tmp0),
            vec3.mul(tmp1, invDet, tmp1),
            vec3.mul(tmp2, invDet, tmp2),
            out));
    },
    /** Returns the transpose of the matrix `self`. */
    transpose(self: mat3, out = create()): mat3 {
        return this.fromCols(
            vec3.set(tmp0, self.c0.x, self.c1.x, self.c2.x),
            vec3.set(tmp1, self.c0.y, self.c1.y, self.c2.y),
            vec3.set(tmp2, self.c0.z, self.c1.z, self.c2.z),
            out);
    },
    /** Returns the determinant of the matrix `self`. */
    det(self: mat3): number {
        let cross = vec3.cross(self.c0, self.c1);
        return vec3.dot(self.c2, cross);
    },
    /** Transforms the given 2D vector as a point. Assumes that `self` is a valid affine transform */
    transformPoint2(self: mat3, rhs: type.Vec2, out = vec2()): type.Vec2 {
        return vec2.add(this.transformVec2(self, rhs), vec3.xy(self.c2));
    },
    /** Rotates the given 2D vector. Assumes that `self` is valid a affine transform */
    transformVec2(self: mat3, rhs: type.Vec2, out = vec2()): type.Vec2 {
        return mat2.vmul2(mat2.fromCols(
            vec3.xy(self.c0, tmp0),
            vec3.xy(self.c1, tmp1),
            tmpm20
        ), rhs, out)
    }
});

/** Describes every entry of a 3x3 matrix as a single array */
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

/** Describes every entry of a 3x3 matrix as a 2-d array */
type ColsArray3d = [
    c0: [ColsArray[0], ColsArray[1], ColsArray[2]],
    c1: [ColsArray[3], ColsArray[4], ColsArray[5]],
    c2: [ColsArray[6], ColsArray[7], ColsArray[8]]
];
