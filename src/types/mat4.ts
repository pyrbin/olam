import { createImpl, Static } from "../base";
import { vec4 } from "./vec4";

/** A 4x4 column major matrix. */
export interface mat4 extends Mat4 { }

export const mat4 = createImpl(class Mat4Impl extends Static {
    /** Create a new 4x4 matrix */
    static create(...args: ColsArray): mat4 {
        return new Mat4(...args);
    }
    /** Creates a matrix with all entries set to `0`. */
    static zero(): mat4 {
        return this.create(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    /** Creates an identity matrix, where all diagonal elements are `1`, and all off-diagonal elements are `0`. */
    static identity(): mat4 {
        return this.create(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1);
    }
    /** Set properties of given matrix `target` */
    static set<T extends num4x4>(target: T, ...args: SetParams<typeof mat4>): T {
        target.c0.x = args[0];
        target.c0.y = args[1];
        target.c0.z = args[2];
        target.c0.w = args[3];
        target.c1.x = args[4];
        target.c1.y = args[5];
        target.c1.z = args[6];
        target.c1.w = args[7];
        target.c2.x = args[8];
        target.c2.y = args[9];
        target.c2.z = args[10];
        target.c2.w = args[11];
        target.c3.x = args[12];
        target.c3.y = args[13];
        target.c3.z = args[14];
        target.c3.w = args[15];
        return target;
    }
    /** Copy properties from `b` to target matrix `a` */
    static copy<T extends num4x4>(a: T, b: num4x4): T {
        return this.set(a,
            b.c0.x, b.c0.y, b.c0.z, b.c0.w,
            b.c1.x, b.c1.y, b.c1.z, b.c1.w,
            b.c2.x, b.c2.y, b.c2.z, b.c2.w,
            b.c3.x, b.c3.y, b.c3.z, b.c3.w);
    }
    /** Clone `target` matrix */
    static clone(target: num4x4): mat4 {
        return this.copy(mat4.zero(), target);
    }
    /** Returns a string representation  */
    static fmt(target: num4x4) {
        return `(${vec4.fmt(target.c0)},${vec4.fmt(target.c1)},${vec4.fmt(target.c2)},${vec4.fmt(target.c3)})`;
    }
});

/** @internal */
class Mat4 implements num4x4 {
    c0: vec4;
    c1: vec4;
    c2: vec4;
    c3: vec4;
    /** Creates a 4x4 matrix */
    constructor(...args: ColsArray) {
        this.c0 = vec4(args[0], args[1], args[2], args[3]);
        this.c1 = vec4(args[4], args[5], args[6], args[7]);
        this.c2 = vec4(args[8], args[9], args[10], args[11]);
        this.c3 = vec4(args[12], args[13], args[14], args[15]);
    }
    /** Set properties. */
    set(...args: SetParams<typeof mat4>): this {
        return mat4.set(this, ...args) as this;
    }
    /** Copy properties from `src`. */
    copy(src: num4x4): this {
        return mat4.copy(this, src);
    }
    /** Clone `this` matrix */
    clone(): mat4 {
        return mat4.clone(this);
    }
    /** Returns a string representation. */
    toString() {
        return mat4.fmt(this);
    }
}


/** @internal */
type ColsArray = [
    m00: number,
    m01: number,
    m02: number,
    m03: number,
    m10: number,
    m11: number,
    m12: number,
    m13: number,
    m20: number,
    m21: number,
    m22: number,
    m23: number,
    m30: number,
    m31: number,
    m32: number,
    m33: number,
];

/** @internal */
type ColsArray2d = [
    c0: [ColsArray[0], ColsArray[1], ColsArray[2], ColsArray[3]],
    c1: [ColsArray[4], ColsArray[5], ColsArray[6], ColsArray[7]],
    c2: [ColsArray[8], ColsArray[9], ColsArray[10], ColsArray[11]],
    c3: [ColsArray[12], ColsArray[13], ColsArray[14], ColsArray[15]]
];
