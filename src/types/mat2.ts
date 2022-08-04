import { implementType } from "../base";
import { assert, panic } from "../debug";
import { eqf, recip, sincos } from "../math";
import { vec2 } from "./vec2";

/** A 2x2 column major matrix. */
export interface mat2 extends Mat2 { }

export const mat2 = implementType({
    /** Creates a 2x2 matrix */
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
    set<T extends num2x2>(target: T,
        m00: number = 0,
        m01: number = m00,
        m10: number = m01,
        m11: number = m10): T {
        target.c0.x = m00;
        target.c0.y = m01;
        target.c1.x = m10;
        target.c1.y = m11;
        return target;
    },
    /** Copy properies from `b` to target matrix `a` */
    copy<T extends num2x2>(a: T, b: num2x2): T {
        return this.set(a, b.c0.x, b.c0.y, b.c1.x, b.c1.y);
    },
    /** Returns a string representation  */
    fmt(target: num2x2) {
        return `(${vec2.fmt(target.c0)},${vec2.fmt(target.c1)})`;
    },
    /** Creates a 2x2 matrix from two column vectors. */
    fromCols<T extends num2x2>(x: num2, y: num2, out?: T): T {
        return this.set(out ?? create(), x.x, x.y, y.x, y.y) as T;
    },
    /** Creates a 2x2 matrix from an array-like. */
    fromArray<T extends num2x2>(array: ArrayLike<number>, out?: T): T {
        return this.set(out ?? create(), array[0], array[1], array[2], array[3]) as T;
    },
    /** Creates a 2x2 matrix from an 2d array. */
    fromArray2d<T extends num2x2>(array: [ArrayLike<number>, ArrayLike<number>], out?: T): T {
        return this.set(out ?? create(), array[0][0], array[0][1], array[1][0], array[1][1]) as T;
    },
    /** Creates a 2x2 matrix with its diagonal set to `diagonal` and all other entries set to 0. */
    fromDiagonal<T extends num2x2>(diagonal: num2, out?: T): T {
        return this.set(out ?? create(), diagonal.x, 0, 0, diagonal.y) as T;
    },
    /** Creates a 2x2 matrix containing the combining non-uniform `scale` and rotation of `radians`. */
    fromScaleAngle<T extends num2x2>(scale: num2, radians: number, out?: T): T {
        let [sin, cos] = sincos(radians);
        return this.set(out ?? create(), scale.x * cos, scale.x * sin, -scale.y * sin, scale.y * cos) as T;
    },
    /** Creates a 2x2 matrix containing a rotation of `radians`. */
    fromAngle<T extends num2x2>(radians: number, out?: T): T {
        let [sin, cos] = sincos(radians);
        return this.set(out ?? create(), cos, sin, -sin, cos) as T;
    },
    /** Returns an array storing data in column major order. */
    toColsArray(target: num2x2): ColsArray {
        return [target.c0.x, target.c0.y, target.c1.x, target.c1.y];
    },
    /** Returns a 2d array storing data in column major order. */
    toColsArray2d(target: num2x2): ColsArray2d {
        return [vec2.toArray(target.c0), vec2.toArray(target.c1)];
    },
    /** Returns the diagonal entries of given matrix `target`. */
    toDiagonal<T extends num2>(target: num2x2, out?: T): T {
        return vec2.set(out ?? vec2(), target.c0.x, target.c1.y) as T;
    },
    /** Returns true if each entry of `target` is finite. */
    isFinite(target: num2x2): boolean {
        return vec2.isFinite(target.c0) && vec2.isFinite(target.c1);
    },
    /** Returns true if any entry of `target` is NaN. */
    isNan(target: num2x2): boolean {
        return vec2.isNan(target.c0) || vec2.isNan(target.c1);
    },
    /** Returns true if `target` is an identity matrix */
    isIdentity(target: num2x2): boolean {
        return eqf(target.c0.x, 1) && eqf(target.c0.y, 0) && eqf(target.c1.x, 0) && eqf(target.c1.y, 1);
    },
    /** Adds two matrices `lhs` and `rhs`. */
    add<T extends num2x2>(lhs: num2x2, rhs: num2x2, out?: T): T {
        return this.fromCols(
            vec2.add(lhs.c0, rhs.c0, v1),
            vec2.add(lhs.c1, rhs.c1, v2),
            out);
    },
    /** Subtracts two matrices `lhs` and `rhs`. */
    sub<T extends num2x2>(lhs: num2x2, rhs: num2x2, out?: T): T {
        return this.fromCols(
            vec2.sub(lhs.c0, rhs.c0, v1),
            vec2.sub(lhs.c1, rhs.c1, v2),
            out);
    },
    /** Multiplies two matrices `lhs` and `rhs`. */
    mul<T extends num2x2>(lhs: num2x2, rhs: num2x2, out?: T): T {
        return this.fromCols(
            this.vmul2(lhs, rhs.c0, v1),
            this.vmul2(lhs, rhs.c1, v2),
            out);
    },
    /** Multiplies a matrix `lhs` and a 2d vector `rhs`. */
    vmul2<T extends vec2>(lhs: num2x2, rhs: num2, out?: T): T {
        return vec2.set(out ?? vec2(),
            lhs.c0.x * rhs.x + lhs.c1.x * rhs.y,
            lhs.c0.y * rhs.x + lhs.c1.y * rhs.y) as T;
    },
    /** Multiplies a matrix `lhs` and a scale value `rhs`. */
    scale<T extends num2x2>(lhs: num2x2, rhs: number, out?: T): T {
        return this.fromCols(
            vec2.scale(lhs.c0, rhs, v1),
            vec2.scale(lhs.c1, rhs, v2),
            out);
    },
    /** Check equality between two matrices `lhs` and `rhs`. */
    eq(lhs: num2x2, rhs: num2x2): boolean {
        return vec2.eq(lhs.c0, rhs.c0) && vec2.eq(lhs.c1, rhs.c1);
    },
    /** Returns the column for given `index`. Throws if `index` is out of range. */
    col<T extends num2x2>(target: T, index: number): T["c0" | "c1"] {
        switch (index) {
            case 0: return target.c0;
            case 1: return target.c1;
            default: panic(`index out of range: ${index}`);
        }
    },
    /** Returns the row for given `index`. Throws if `index` is out of range. */
    row<T extends num2x2>(target: T, index: number): vec2 {
        switch (index) {
            case 0: return vec2(target.c0.x, target.c1.x);
            case 1: return vec2(target.c0.y, target.c1.y);
            default: panic(`index out of range: ${index}`);
        }
    },
    /** Returns the inverse matrix of the matrix `target`. Throws if the determinant of `target` is zero */
    inv<T extends num2x2>(target: num2x2, out?: T): T {
        let det = this.det(target);
        assert(det !== 0, "can't invert matrix with zero determinant");
        let inv = recip(det);
        return this.fromCols(
            vec2.set(v1, inv * target.c1.y, -inv * target.c0.y),
            vec2.set(v2, -inv * target.c1.x, inv * target.c0.x),
            out);
    },
    /** Returns the transpose of the matrix `target`. */
    transpose<T extends num2x2>(target: num2x2, out?: T): T {
        return this.fromCols(
            vec2.set(v1, target.c0.x, target.c1.x),
            vec2.set(v2, target.c0.y, target.c1.y),
            out);
    },
    /** Returns the determinant of the matrix `target`. */
    det(target: num2x2): number {
        return target.c0.x * target.c1.y - target.c0.y * target.c1.x;
    },
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
    /** Set properties */
    set(
        m00: number = 0,
        m01: number = m00,
        m10: number = m01,
        m11: number = m10): mat2 {
        return mat2.set(this, m00, m01, m10, m11);
    }
    /** Copy properies from `src` */
    copy(src: num2x2) {
        return mat2.copy(this, src);
    }
    /** Returns a string representation  */
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
    toDiagonal<T extends num2>(out?: T): T {
        return mat2.toDiagonal(this, out ?? vec2()) as T;
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
    vmul2<T extends vec2>(rhs: num2, out?: T): T {
        return mat2.vmul2(this, rhs, out) as T;
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

/** Creates a 2x2 matrix */
function create(
    m00: number = 0,
    m01: number = m00,
    m10: number = m01,
    m11: number = m10): mat2 {
    return new Mat2(m00, m01, m10, m11);
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
