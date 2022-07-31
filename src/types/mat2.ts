import { assert, panic } from "../debug";
import { recip, sincos } from "../math";
import { vec2 } from "../mod";
import { createType } from "../type";

/** A 2x2 column major matrix. */
export interface mat2 {
    c0: vec2;
    c1: vec2;
}

/** Implements math operations for a 2x2 column major matrix. */
export const mat2 = createType({
    /** Create a new 2x2 matrix */
    new(...args: ColsArray): mat2 {
        return {
            c0: vec2(args[0], args[1]),
            c1: vec2(args[2], args[3]),
        };
    },
    /** Creates a matrix with all entries set to `0`. */
    zero(): mat2 {
        return this.new(0, 0, 0, 0);
    },
    /** Creates an identity matrix, where all diagonal elements are `1`, and all off-diagonal elements are `0`. */
    identity(): mat2 {
        return this.new(1, 0, 0, 1);
    },
    /** Returns an array storing data in column major order. */
    colsArray(self: mat2): ColsArray {
        return [self.c0.x, self.c0.y, self.c1.x, self.c1.y];
    },
    /** Returns a 2d array storing data in column major order. */
    colsArray2d(self: mat2): ColsArray2d {
        return [vec2.array(self.c0), vec2.array(self.c1)];
    },
    /** Returns the diagonal entries of given matrix `self`. */
    diagonal(self: mat2): vec2 {
        return vec2(self.c0.x, self.c1.y);
    },
    /** Returns a string interpretation of given matrix `self`. */
    fmt(self: mat2): string {
        return `${vec2.fmt(this.row(self, 0))}\n${vec2.fmt(this.row(self, 1))}`;
    },
    /** Creates a 2x2 matrix from two column vectors. */
    fromCols(x: vec2, y: vec2): mat2 {
        return this.new(x.x, x.y, y.x, y.y);
    },
    /** Creates a 2x2 matrix from an array-like. */
    fromArray(array: ArrayLike<number>): mat2 {
        return this.new(array[0], array[1], array[2], array[3]);
    },
    /** Creates a 2x2 matrix from an 2d array. */
    fromArray2d(array: [ArrayLike<number>, ArrayLike<number>]): mat2 {
        return this.fromCols(vec2.fromArray(array[0]), vec2.fromArray(array[1]));
    },
    /** Creates a 2x2 matrix with its diagonal set to `diagonal` and all other entries set to 0. */
    fromDiagonal(diagonal: vec2): mat2 {
        return this.new(diagonal.x, 0, 0, diagonal.y);
    },
    /** Creates a 2x2 matrix containing the combining non-uniform `scale` and rotation of `radians`. */
    fromScaleAngle(scale: vec2, radians: number): mat2 {
        const [sin, cos] = sincos(radians);
        return this.new(scale.x * cos, scale.x * -sin, scale.y * sin, scale.y * cos);
    },
    /** Creates a 2x2 matrix containing a rotation of `radians`. */
    fromAngle(radians: number): mat2 {
        const [sin, cos] = sincos(radians);
        return this.new(cos, -sin, sin, cos);
    },
    /** Adds two matrices `lhs` and `rhs`. */
    add(lhs: mat2, rhs: mat2): mat2 {
        return this.fromCols(
            vec2.add(lhs.c0, rhs.c0),
            vec2.add(lhs.c1, rhs.c1)
        );
    },
    /** Substracts two matrices `lhs` and `rhs`. */
    sub(lhs: mat2, rhs: mat2): mat2 {
        return this.fromCols(
            vec2.sub(lhs.c0, rhs.c0),
            vec2.sub(lhs.c1, rhs.c1)
        );
    },
    /** Multiplies two matrices `lhs` and `rhs`. */
    mul(lhs: mat2, rhs: mat2): mat2 {
        return this.fromCols(
            this.mulVec2(lhs, rhs.c0),
            this.mulVec2(lhs, rhs.c1)
        );
    },
    /** Multiplies a matrix `lhs` and a 2d vector `rhs`. */
    mulVec2(lhs: mat2, rhs: vec2): vec2 {
        return {
            x: lhs.c0.x * rhs.x + lhs.c1.x * rhs.y,
            y: lhs.c0.y * rhs.x + lhs.c1.y * rhs.y,
        }
    },
    /** Multiplies a matrix `lhs` and a scalar value `rhs`. */
    scalar(lhs: mat2, rhs: number): mat2 {
        return this.fromCols(
            vec2.scalar(lhs.c0, rhs),
            vec2.scalar(lhs.c1, rhs)
        );
    },
    /** Check equality between two matrices `lhs` and `rhs`. */
    eq(lhs: mat2, rhs: mat2): boolean {
        return vec2.eq(lhs.c0, rhs.c0) && vec2.eq(lhs.c1, rhs.c1);
    },
    /** Returns true if each entry of `self` is finite. */
    isFinite(self: mat2): boolean {
        return vec2.isFinite(self.c0) && vec2.isFinite(self.c1);
    },
    /** Returns true if any entry of `self` is NaN. */
    isNan(self: mat2): boolean {
        return vec2.isNan(self.c0) || vec2.isNan(self.c1);
    },
    /** Returns the column for given `index`. Throws if `index` is out of range. */
    col(self: mat2, index: number): vec2 {
        switch (index) {
            case 0: return self.c0;
            case 1: return self.c1;
            default: panic(`index out of range: ${index}`);
        }
    },
    /** Returns the row for given `index`. Throws if `index` is out of range. */
    row(self: mat2, index: number): vec2 {
        switch (index) {
            case 0: return vec2(self.c0.x, self.c1.x);
            case 1: return vec2(self.c0.y, self.c1.y);
            default: panic(`index out of range: ${index}`);
        }
    },
    /** Returns the transpose of the matrix `self`. */
    tm(self: mat2): mat2 {
        return {
            c0: vec2(self.c0.x, self.c1.x),
            c1: vec2(self.c0.y, self.c1.y),
        }
    },
    /** Returns the determinant of the matrix `self`. */
    det(self: mat2): number {
        return self.c0.x * self.c1.y - self.c0.y * self.c1.x;
    },
    /** Returns the inverse matrix of the matrix `self`. Throws if the determinant of `self` is zero */
    inv(self: mat2): mat2 {
        let det = this.det(self);
        assert(det !== 0, "can't invert matrix with zero determinant");
        let inv = recip(det);
        return this.new(
            inv * self.c1.y, -inv * self.c0.y,
            -inv * self.c1.x, inv * self.c0.x
        );
    }
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
