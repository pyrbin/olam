import { assert, panic } from "../debug";
import { recip, sincos } from "../math";
import { createType } from "../type";
import { mat2 } from "./mat2";
import { vec2 } from "./vec2";
import { vec3 } from "./vec3";

/** A 3x3 column major matrix. */
export interface mat3 {
    c0: vec3;
    c1: vec3;
    c2: vec3;
}

/** Implements math operations for a 3x3 column major matrix. */
export const mat3 = createType({
    /** Create a new 3x3 matrix */
    new(...args: ColsArray): mat3 {
        return {
            c0: vec3(args[0], args[1], args[2]),
            c1: vec3(args[3], args[4], args[5]),
            c2: vec3(args[6], args[7], args[8]),
        };
    },
    /** Creates a matrix with all entries set to `0`. */
    zero(): mat3 {
        return this.new(0, 0, 0, 0, 0, 0, 0, 0, 0);
    },
    /** Creates an identity matrix, where all diagonal elements are `1`, and all off-diagonal elements are `0`. */
    identity(): mat3 {
        return this.new(1, 0, 0, 0, 1, 0, 0, 0, 1);
    },
    /** Returns an array storing data in column major order. */
    colsArray(self: mat3): ColsArray {
        return [
            self.c0.x, self.c0.y, self.c0.z,
            self.c1.x, self.c1.y, self.c1.z,
            self.c2.x, self.c2.y, self.c2.z];
    },
    /** Returns a 3d array storing data in column major order. */
    colsArray2d(self: mat3): ColsArray3d {
        return [vec3.array(self.c0), vec3.array(self.c1), vec3.array(self.c2)];
    },
    /** Returns the diagonal entries of given matrix `self`. */
    diagonal(self: mat3): vec3 {
        return vec3(self.c0.x, self.c1.y, self.c2.z);
    },
    /** Returns a string interpretation of given matrix `self`. */
    fmt(self: mat3): string {
        return `${vec3.fmt(this.row(self, 0))}\n${vec3.fmt(this.row(self, 1))}\n${vec3.fmt(this.row(self, 2))}`;
    },
    /** Creates a 3x3 matrix from three column vectors. */
    fromCols(x: vec3, y: vec3, z: vec3): mat3 {
        return this.new(x.x, x.y, x.z, y.x, y.y, y.z, z.x, z.y, z.z);
    },
    /** Creates a 3x3 matrix from an array-like. */
    fromArray(array: ArrayLike<number>): mat3 {
        return this.new(
            array[0], array[1], array[2],
            array[3], array[4], array[5],
            array[6], array[7], array[8]);
    },
    /** Creates a 3x3 matrix from an 3d array. */
    fromArray3d(array: [ArrayLike<number>, ArrayLike<number>, ArrayLike<number>]): mat3 {
        return this.fromCols(
            vec3.fromArray(array[0]),
            vec3.fromArray(array[1]),
            vec3.fromArray(array[2]));
    },
    /** Creates a 3x3 matrix with its diagonal set to `diagonal` and all other entries set to 0. */
    fromDiagonal(diagonal: vec3): mat3 {
        return this.new(diagonal.x, 0, 0, 0, diagonal.y, 0, 0, 0, diagonal.z);
    },
    /** Creates a 3x3 rotation matrix from a rotation `axis` and angle `radians` */
    fromAxisAngle(axis: vec3, radians: number): mat3 {
        assert(vec3.isNormalized(axis), "axis is not normalized");
        let [sin, cos] = sincos(radians);
        let [xsin, ysin, zsin] = vec3.array(vec3.scalar(axis, sin));
        let [x, y, z] = vec3.array(axis);
        let [x2, y2, z2] = vec3.array(vec3.mul(axis, axis));
        let omc = 1 - cos;
        let xyomc = x * y * omc;
        let xzomc = x * z * omc;
        let yzomc = y * z * omc;
        return this.fromCols(
            vec3(x2 * omc + cos, xyomc + zsin, xzomc - ysin),
            vec3(xyomc - zsin, y2 * omc + cos, yzomc + xsin),
            vec3(xzomc + ysin, yzomc - xsin, z2 * omc + cos));
    },
    /** Creates a 3x3 rotation matrix from angle `radians` around the x-axis */
    fromRotationX(radians: number): mat3 {
        let [sin, cos] = sincos(radians);
        return this.fromCols(
            vec3.right(),
            vec3(0, cos, sin),
            vec3(0, -sin, cos));
    },
    /** Creates a 3x3 rotation matrix from angle `radians` around the y-axis */
    fromRotationY(radians: number): mat3 {
        let [sin, cos] = sincos(radians);
        return this.fromCols(
            vec3(cos, 0, -sin),
            vec3.up(),
            vec3(sin, 0, cos));
    },
    /** Creates a 3x3 rotation matrix from angle `radians` around the z-axis */
    fromRotationZ(radians: number): mat3 {
        let [sin, cos] = sincos(radians);
        return this.fromCols(
            vec3(cos, sin, 0),
            vec3(-sin, cos, 0),
            vec3.forward());
    },
    /** Creates an affine transformation matrix from given `translation` */
    fromTranslation(translation: vec2): mat3 {
        return this.fromCols(
            vec3.right(),
            vec3.up(),
            vec3(translation.x, translation.y, 1.0));
    },
    /** Creates an affine transformation matrix from given angle `radians` */
    fromAngle(radians: number): mat3 {
        let [sin, cos] = sincos(radians);
        return this.fromCols(
            vec3(cos, sin, 0),
            vec3(-sin, cos, 0),
            vec3.forward());
    },
    /** Creates an affine transformation matrix from given non-uniform `scale` */
    fromScale(scale: vec2): mat3 {
        assert(scale.x !== 0 || scale.y !== 0, "both scale vector components can't zero.");
        return this.fromCols(
            vec3(scale.x, 0, 0),
            vec3(0, scale.y, 0),
            vec3.forward());
    },
    /** Creates an affine transformation matrix from given `scale`, angle `radians` and `translation` */
    fromScaleAngleTranslation(scale: vec2, radians: number, translation: vec2): mat3 {
        let [sin, cos] = sincos(radians);
        return this.fromCols(
            vec3(cos * scale.x, sin * scale.x, 0.0),
            vec3(-sin * scale.y, cos * scale.y, 0.0),
            vec3(translation.x, translation.y, 1.0));
    },
    /** Creates an affine transformation matrix from the given 2x2 matrix. */
    fromMat2(mat: mat2): mat3 {
        return this.fromCols(vec2.extend(mat.c0), vec2.extend(mat.c1), vec3.forward());
    },
    /** Adds two matrices `lhs` and `rhs`. */
    add(lhs: mat3, rhs: mat3): mat3 {
        return this.fromCols(
            vec3.add(lhs.c0, rhs.c0),
            vec3.add(lhs.c1, rhs.c1),
            vec3.add(lhs.c2, rhs.c2)
        )
    },
    /** Substracts two matrices `lhs` and `rhs`. */
    sub(lhs: mat3, rhs: mat3): mat3 {
        return this.fromCols(
            vec3.sub(lhs.c0, rhs.c0),
            vec3.sub(lhs.c1, rhs.c1),
            vec3.sub(lhs.c2, rhs.c2)
        )
    },
    /** Multiplies two matrices `lhs` and `rhs`. */
    mul(lhs: mat3, rhs: mat3): mat3 {
        return this.fromCols(
            this.mulVec3(lhs, rhs.c0),
            this.mulVec3(lhs, rhs.c1),
            this.mulVec3(lhs, rhs.c2)
        )
    },
    /** Multiplies a matrix `lhs` and a 3d vector `rhs`. */
    mulVec3(lhs: mat3, rhs: vec3): vec3 {
        let res = vec3.scalar(lhs.c0, rhs.x);
        res = vec3.add(res, vec3.scalar(lhs.c1, rhs.y));
        res = vec3.add(res, vec3.scalar(lhs.c2, rhs.z));
        return res;
    },
    /** Multiplies a matrix `lhs` and a scalar value `rhs`. */
    scalar(lhs: mat3, rhs: number): mat3 {
        return this.fromCols(
            vec3.scalar(lhs.c0, rhs),
            vec3.scalar(lhs.c1, rhs),
            vec3.scalar(lhs.c2, rhs)
        );
    },
    /** Check equality between two matrices `lhs` and `rhs`. */
    eq(lhs: mat3, rhs: mat3): boolean {
        return vec3.eq(lhs.c0, rhs.c0) && vec3.eq(lhs.c1, rhs.c1) && vec3.eq(lhs.c2, rhs.c2);
    },
    /** Returns true if each entry of `self` is finite. */
    isFinite(self: mat3): boolean {
        return vec3.isFinite(self.c0) && vec3.isFinite(self.c1) && vec3.isFinite(self.c2);
    },
    /** Returns true if any entry of `self` is NaN. */
    isNan(self: mat3): boolean {
        return vec3.isNan(self.c0) || vec3.isNan(self.c1) || vec3.isNan(self.c2);
    },
    /** Returns the column for given `index`. Throws if `index` is out of range. */
    col(self: mat3, index: number): vec3 {
        switch (index) {
            case 0: return self.c0;
            case 1: return self.c1;
            case 2: return self.c1;
            default: panic(`index out of range: ${index}`);
        }
    },
    /** Returns the row for given `index`. Throws if `index` is out of range. */
    row(self: mat3, index: number): vec3 {
        switch (index) {
            case 0: return vec3(self.c0.x, self.c1.x, self.c2.x);
            case 1: return vec3(self.c0.y, self.c1.y, self.c2.y);
            case 2: return vec3(self.c0.z, self.c1.z, self.c2.z);
            default: panic(`index out of range: ${index}`);
        }
    },
    /** Returns the transpose of the matrix `self`. */
    transpose(self: mat3): mat3 {
        return this.fromCols(
            vec3(self.c0.x, self.c1.x, self.c2.x),
            vec3(self.c0.y, self.c1.y, self.c2.y),
            vec3(self.c0.z, self.c1.z, self.c2.z)
        );
    },
    /** Returns the determinant of the matrix `self`. */
    det(self: mat3): number {
        let cross = vec3.cross(self.c0, self.c1);
        return vec3.dot(self.c2, cross);
    },
    /** Returns the inverse matrix of the matrix `self`. Throws if the determinant of `self` is zero */
    inv(self: mat3): mat3 {
        let tmp0 = vec3.cross(self.c1, self.c2);
        let tmp1 = vec3.cross(self.c2, self.c0);
        let tmp2 = vec3.cross(self.c0, self.c1);
        let det = this.det(self);
        assert(det !== 0, "can't invert matrix with determinant zero.");
        let invDet = vec3(recip(det));
        return mat3.transpose(this.fromCols(
            vec3.mul(tmp0, invDet),
            vec3.mul(tmp1, invDet),
            vec3.mul(tmp2, invDet)
        ));
    },
    /** Transforms the given 2D vector as a point. Assumes that `self` is a valid affine transform */
    transformPoint2(self: mat3, rhs: vec2): vec2 {
        return vec2.add(this.transformVec2(self, rhs), vec3.xy(self.c2));
    },
    /** Rotates the given 2D vector. Assumes that `self` is valid a affine transform */
    transformVec2(self: mat3, rhs: vec2): vec2 {
        return mat2.mulVec2(mat2.fromCols(
            vec3.xy(self.c0),
            vec3.xy(self.c1),
        ), rhs)
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
