import { assert, panic } from "../debug";
import { eqf, recip, sincos } from "../math";
import * as type from "../type";
import { vec2 } from "./vec2";

/** A 2x2 column major matrix. */
export interface mat2 extends type.Mat2 {

}


/** @internal */
function create(
    m00: number = 0,
    m01: number = m00,
    m10: number = m01,
    m11: number = m10): mat2 {
    return {
        c0: vec2(m00, m01),
        c1: vec2(m10, m11),
    };
}

/** @internal */
let tmp0 = vec2();
let tmp1 = vec2();

export const mat2 = type.implement({
    /** Create a new 2x2 matrix */
    new: create,
    /** Creates a matrix with all entries set to `0`. */
    zero(): mat2 {
        return create(0, 0, 0, 0);
    },
    /** Creates an identity matrix, where all diagonal elements are `1`, and all off-diagonal elements are `0`. */
    identity(): mat2 {
        return create(1, 0, 0, 1);
    },
    /** Set properties of given matrix `target` */
    set(target: mat2,
        m00: number = 0,
        m01: number = m00,
        m10: number = m01,
        m11: number = m10): mat2 {
        target.c0.x = m00;
        target.c0.y = m01;
        target.c1.x = m10;
        target.c1.y = m11;
        return target;
    },
    /** Copies properies from `b` to target matrix `a` */
    copy(a: mat2, b: mat2): mat2 {
        return this.set(a, b.c0.x, b.c0.y, b.c1.x, b.c1.y);
    },
    /** Creates a 2x2 matrix from two column vectors. */
    fromCols(x: type.Vec2, y: type.Vec2, out = create()): mat2 {
        return this.set(out, x.x, x.y, y.x, y.y);
    },
    /** Creates a 2x2 matrix from an array-like. */
    fromArray(array: ArrayLike<number>, out = create()): mat2 {
        return this.set(out, array[0], array[1], array[2], array[3]);
    },
    /** Creates a 2x2 matrix from an 2d array. */
    fromArray2d(array: [ArrayLike<number>, ArrayLike<number>], out = create()): mat2 {
        return this.set(out, array[0][0], array[0][1], array[1][0], array[1][1]);
    },
    /** Creates a 2x2 matrix with its diagonal set to `diagonal` and all other entries set to 0. */
    fromDiagonal(diagonal: type.Vec2, out = create()): mat2 {
        return this.set(out, diagonal.x, 0, 0, diagonal.y);
    },
    /** Creates a 2x2 matrix containing the combining non-uniform `scale` and rotation of `radians`. */
    fromScaleAngle(scale: type.Vec2, radians: number, out = create()): mat2 {
        let [sin, cos] = sincos(radians);
        return this.set(out, scale.x * cos, scale.x * sin, -scale.y * sin, scale.y * cos);
    },
    /** Creates a 2x2 matrix containing a rotation of `radians`. */
    fromAngle(radians: number, out = create()): mat2 {
        let [sin, cos] = sincos(radians);
        return this.set(out, cos, sin, -sin, cos);
    },
    /** Returns an array storing data in column major order. */
    toColsArray(target: mat2): ColsArray {
        return [target.c0.x, target.c0.y, target.c1.x, target.c1.y];
    },
    /** Returns a 2d array storing data in column major order. */
    toColsArray2d(target: mat2): ColsArray2d {
        return [vec2.toArray(target.c0), vec2.toArray(target.c1)];
    },
    /** Returns the diagonal entries of given matrix `target`. */
    toDiagonal(target: mat2, out = vec2()): type.Vec2 {
        return vec2.set(out, target.c0.x, target.c1.y);
    },
    /** Returns true if each entry of `target` is finite. */
    isFinite(target: mat2): boolean {
        return vec2.isFinite(target.c0) && vec2.isFinite(target.c1);
    },
    /** Returns true if any entry of `target` is NaN. */
    isNan(target: mat2): boolean {
        return vec2.isNan(target.c0) || vec2.isNan(target.c1);
    },
    /** Returns true if `target` is an identity matrix */
    isIdentity(target: mat2): boolean {
        return eqf(target.c0.x, 1) && eqf(target.c0.y, 0) && eqf(target.c1.x, 0) && eqf(target.c1.y, 1);
    },
    /** Adds two matrices `lhs` and `rhs`. */
    add(lhs: mat2, rhs: mat2, out = create()): mat2 {
        return this.fromCols(
            vec2.add(lhs.c0, rhs.c0, tmp0),
            vec2.add(lhs.c1, rhs.c1, tmp1),
            out);
    },
    /** Subtracts two matrices `lhs` and `rhs`. */
    sub(lhs: mat2, rhs: mat2, out = create()): mat2 {
        return this.fromCols(
            vec2.sub(lhs.c0, rhs.c0, tmp0),
            vec2.sub(lhs.c1, rhs.c1, tmp1),
            out);
    },
    /** Multiplies two matrices `lhs` and `rhs`. */
    mul(lhs: mat2, rhs: mat2, out = create()): mat2 {
        return this.fromCols(
            this.vmul2(lhs, rhs.c0, tmp0),
            this.vmul2(lhs, rhs.c1, tmp1),
            out);
    },
    /** Multiplies a matrix `lhs` and a 2d vector `rhs`. */
    vmul2(lhs: mat2, rhs: type.Vec2, out = vec2()): type.Vec2 {
        return vec2.set(out,
            lhs.c0.x * rhs.x + lhs.c1.x * rhs.y,
            lhs.c0.y * rhs.x + lhs.c1.y * rhs.y);
    },
    /** Multiplies a matrix `lhs` and a scale value `rhs`. */
    scale(lhs: mat2, rhs: number, out = create()): mat2 {
        return this.fromCols(
            vec2.scale(lhs.c0, rhs, tmp0),
            vec2.scale(lhs.c1, rhs, tmp1),
            out);
    },
    /** Check equality between two matrices `lhs` and `rhs`. */
    eq(lhs: mat2, rhs: mat2): boolean {
        return vec2.eq(lhs.c0, rhs.c0) && vec2.eq(lhs.c1, rhs.c1);
    },
    /** Returns the column for given `index`. Throws if `index` is out of range. */
    col(target: mat2, index: number): type.Vec2 {
        switch (index) {
            case 0: return target.c0;
            case 1: return target.c1;
            default: panic(`index out of range: ${index}`);
        }
    },
    /** Returns the row for given `index`. Throws if `index` is out of range. */
    row(target: mat2, index: number): type.Vec2 {
        switch (index) {
            case 0: return vec2(target.c0.x, target.c1.x);
            case 1: return vec2(target.c0.y, target.c1.y);
            default: panic(`index out of range: ${index}`);
        }
    },
    /** Returns the inverse matrix of the matrix `target`. Throws if the determinant of `target` is zero */
    inv(target: mat2, out = create()): mat2 {
        let det = this.det(target);
        assert(det !== 0, "can't invert matrix with zero determinant");
        let inv = recip(det);
        return this.fromCols(
            vec2.set(tmp0, inv * target.c1.y, -inv * target.c0.y),
            vec2.set(tmp1, -inv * target.c1.x, inv * target.c0.x),
            out);
    },
    /** Returns the transpose of the matrix `target`. */
    transpose(target: mat2, out = create()): mat2 {
        return this.fromCols(
            vec2.set(tmp0, target.c0.x, target.c1.x),
            vec2.set(tmp1, target.c0.y, target.c1.y),
            out);
    },
    /** Returns the determinant of the matrix `target`. */
    det(target: mat2): number {
        return target.c0.x * target.c1.y - target.c0.y * target.c1.x;
    },
})

/** Describes every entry of a 2x2 matrix as a single array */
type ColsArray = [
    m00: number,
    m01: number,
    m10: number,
    m11: number
];

/** Describes every entry of a 2x2 matrix as a 2-d array */
type ColsArray2d = [
    c0: [ColsArray[0], ColsArray[1]],
    c1: [ColsArray[2], ColsArray[3]]
];
