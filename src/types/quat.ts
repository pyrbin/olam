import { assert, panic } from "../debug";
import { epsilon2, sincos, sqrt } from "../math";
import { createImpl, Static } from "../type_impl";
import { vec3 } from "./vec3";
import { vec4 } from "./vec4";

/** A quaternion representing an orientation. */
export interface quat extends Quat { }

export const quat = createImpl(class QuatImpl extends Static {
    /** Create an identity quaternion. Corresponds to no rotation. */
    // @ts-ignore
    static create(): quat
    /** Create a quaternion with all elements set to `v`. */
    // @ts-ignore
    static create(v: number): quat
    /** Create a new rotation quaternion. */
    static create(x: number, y: number, z: number, w: number): quat
    static create(x: number, y: number, z: number, w: number = 1) {
        let v = x ?? 0;
        let vw = x ?? 1;
        return new Quat(x ?? v, y ?? v, z ?? v, w ?? vw);
    }
    /** Create a quaternion with all entries set to `0`. */
    static zero(): quat {
        return quat.create(0, 0, 0, 0);
    }
    /** Create an identity quaternion. Corresponds to no rotation. */
    static identity(): quat {
        return quat.create(0, 0, 0, 1);
    }
    /** Set properties of given quaternion `q` */
    static set = vec4.set;
    /** Copy properties from `b` to q quaternion `a`. */
    static copy<T extends num4>(a: T, b: num4): T {
        return quat.set(a, b.x, b.y, b.z, b.w);
    }
    /** Clone `q` quaternion. */
    static clone(q: num4): quat {
        return quat.copy(quat(), q);
    }
    /** Return a string representation.  */
    static fmt = vec4.fmt;
    /** Create a quaternion from an array-like. */
    static fromArray(array: ArrayLike<number>): quat
    static fromArray<T extends num4>(array: ArrayLike<number>, out: T): T
    static fromArray(array: ArrayLike<number>, out = quat()) {
        return quat.set(out, array[0], array[1], array[2], array[3]);
    }
    /** Create a quaternion from a 4-dim vector. */
    static fromVec4(vec: num4): quat
    static fromVec4<T extends num4>(vec: num4, out: T): T
    static fromVec4(vec: num4, out = quat()) {
        return quat.set(out, vec.x, vec.y, vec.z, vec.w);
    }
    /** Create a quaternion from a rotation `axis` and angle `radians`. */
    static fromAxisAngle(axis: num3, radians: Rad): quat
    static fromAxisAngle<T extends num4>(axis: num3, radians: Rad, out: T): T
    static fromAxisAngle(axis: num3, radians: Rad, out = quat()): quat {
        const [s, c] = sincos(radians / 2);
        return quat.set(out, axis.x * s, axis.y * s, axis.z * s, c);
    }
    /** Create a quaternion that rotates `vec3.len(v)` radians around `vec3.normalize(v)`. */
    static fromScaledAxis(v: num3): quat
    static fromScaledAxis<T extends num4>(v: num3, out: T): T
    static fromScaledAxis(v: num3, out = quat()) {
        let len = vec3.len(v);
        if (len === 0) {
            return quat.copy(out, identity)
        }
        return quat.fromAxisAngle(vec3.scale(v, 1 / len, v1), len);
    }
    /** Create a quaternion from angle `radians` around the x-axis */
    static fromRotationX(radians: Rad): quat
    static fromRotationX<T extends num4>(radians: Rad, out: T): T
    static fromRotationX(radians: Rad, out = quat()) {
        const [s, c] = sincos(radians / 2);
        return quat.set(out, s, 0, 0, c);
    }
    /** Create a quaternion from angle `radians` around the y-axis */
    static fromRotationY(radians: Rad): quat
    static fromRotationY<T extends num4>(radians: Rad, out: T): T
    static fromRotationY(radians: Rad, out = quat()) {
        const [s, c] = sincos(radians / 2);
        return quat.set(out, 0, s, 0, c);
    }
    /** Create a quaternion from angle `radians` around the z-axis */
    static fromRotationZ(radians: Rad): quat
    static fromRotationZ<T extends num4>(radians: Rad, out: T): T
    static fromRotationZ(radians: Rad, out = quat()) {
        const [s, c] = sincos(radians / 2);
        return quat.set(out, 0, 0, s, c);
    }
    /** Create a quaternion from given euler. */
    static fromEuler(rot: num3, euler?: EulerRot): quat
    static fromEuler<T extends num4>(rot: num3, euler?: EulerRot, out?: T): T
    static fromEuler(rot: num3, euler: EulerRot = EulerRot.ZXY, out = quat()) {
        const rotX = quat.fromRotationX;
        const rotY = quat.fromRotationY;
        const rotZ = quat.fromRotationZ;
        switch (euler) {
            case EulerRot.ZYX:
                return quat.mul(rotZ(rot.x, q3), rotY(rot.y, q1).mul(rotX(rot.z, q2)), out);
            case EulerRot.ZXY:
                return quat.mul(rotZ(rot.x, q3), rotY(rot.z, q1).mul(rotX(rot.y, q2)), out);
            case EulerRot.YXZ:
                return quat.mul(rotZ(rot.z, q3), rotY(rot.x, q1).mul(rotX(rot.y, q2)), out);
            case EulerRot.YZX:
                return quat.mul(rotZ(rot.y, q3), rotY(rot.x, q1).mul(rotX(rot.z, q2)), out);
            case EulerRot.XYZ:
                return quat.mul(rotZ(rot.z, q3), rotY(rot.y, q1).mul(rotX(rot.x, q2)), out);
            case EulerRot.XZY:
                return quat.mul(rotZ(rot.y, q3), rotY(rot.z, q1).mul(rotX(rot.y, q2)), out);
            default: panic(`Unknown euler rotation: ${euler}`);
        }
    }
    /** Create a quaternion from the columns of a 3x3 rotation matrix. */
    static fromAxes(x: num3, y: num3, z: num3): quat
    static fromAxes<T extends num4>(x: num3, y: num3, z: num3, out: T): T
    static fromAxes(x: num3, y: num3, z: num3, out = quat()) {
        // Based on https://docs.rs/glam/latest/q/glam/f64/dquat.rs.html#178
        let { x: m00, y: m01, z: m02 } = x;
        let { x: m10, y: m11, z: m12 } = y;
        let { x: m20, y: m21, z: m22 } = z;
        if (m22 <= 0.0) {
            let dif10 = m11 - m00;
            let omm22 = 1.0 - m22;
            if (dif10 <= 0) {
                let fourXsq = omm22 - dif10;
                let inv4x = 0.5 / sqrt(fourXsq);
                return quat.set(out,
                    fourXsq * inv4x,
                    (m01 + m10) * inv4x,
                    (m02 + m20) * inv4x,
                    (m12 - m21) * inv4x
                );
            } else {
                let fourYsq = omm22 + dif10;
                let inv4y = 0.5 / sqrt(fourYsq);
                return quat.set(out,
                    (m01 + m10) * inv4y,
                    fourYsq * inv4y,
                    (m12 + m21) * inv4y,
                    (m20 - m02) * inv4y,
                )
            }
        } else {
            // z^2 + w^2 >= x^2 + y^2
            let sum10 = m11 + m00;
            let opm22 = 1.0 + m22;
            if (sum10 <= 0.0) {
                // z^2 >= w^2
                let fourZsq = opm22 - sum10;
                let inv4z = 0.5 / sqrt(fourZsq);
                return quat.set(out,
                    (m02 + m20) * inv4z,
                    (m12 + m21) * inv4z,
                    fourZsq * inv4z,
                    (m01 - m10) * inv4z,
                )
            } else {
                let fourWsq = opm22 + sum10;
                let inv4w = 0.5 / sqrt(fourWsq);
                return quat.set(out,
                    (m12 - m21) * inv4w,
                    (m20 - m02) * inv4w,
                    (m01 - m10) * inv4w,
                    fourWsq * inv4w,
                )
            }
        }
    }
    /** Create a quaternion from a 3x3 matrix. */
    static fromMat3(m: num3x3): quat
    static fromMat3<T extends num4>(m: num3x3, out: T): T
    static fromMat3(m: num3x3, out = quat()) {
        return quat.fromAxes(m.c0, m.c1, m.c2, out);
    }
    /** Create a quaternion from a 4x4 matrix. */
    static fromMat4(m: num4x4): quat
    static fromMat4<T extends num4>(m: num4x4, out: T): T
    static fromMat4(m: num4x4, out = quat()) {
        return quat.fromAxes(m.c0, m.c1, m.c2, out);
    }
    /** Return each element of `q` as an array. */
    static toArray = vec4.toArray;
    /**Returns the rotation axis and angle (in radians) of `q`. */
    static toAxisAngle(q: num4): [axis: vec3, radians: Rad]
    static toAxisAngle<T extends num3>(q: num4, out: T): [axis: T, radians: Rad]
    static toAxisAngle(q: num4, out = vec3()) {
        let { x, y, z, w } = q;
        let angle = 2 * Math.acos(w);
        let s = Math.max(1 - w * w, 0);
        if (s < epsilon2) {
            return [vec3.set(out ?? vec3(), 1, 0, 0), angle];
        } else {
            let s2 = sqrt(s);
            return [vec3.set(out ?? vec3(), x / s2, y / s2, z / s2), angle];
        }
    }
    /** Returns the rotation axis scaled by the rotation in radians. */
    static toScaledAxis(q: num4): vec3
    static toScaledAxis<T extends num3>(q: num4, out: T): T
    static toScaledAxis(q: num4, out = vec3()) {
        let [axis, angle] = quat.toAxisAngle(q, out);
        return vec3.scale(axis, angle, out ?? vec3());
    }
    /** Returns the rotation angles for the given euler rotation sequence. */
    static toEuler(q: num4, euler?: EulerRot): vec3
    static toEuler<T extends num3>(q: num4, euler?: EulerRot, out?: T): T
    static toEuler(q: num4, euler: EulerRot = EulerRot.ZXY, out = vec3()) {
        switch (euler) {
            case EulerRot.ZXY:
                return vec3.set(out,
                    Math.atan2(2 * (q.x * q.w - q.y * q.z), 1 - 2 * (q.x * q.x + q.y * q.y)),
                    Math.asin(2 * (q.x * q.y + q.z * q.w)),
                    Math.atan2(2 * (q.x * q.z - q.y * q.w), 1 - 2 * (q.y * q.y + q.z * q.z)));
            case EulerRot.ZYX:
                return vec3.set(out,
                    Math.atan2(2 * (q.x * q.w - q.y * q.z), 1 - 2 * (q.x * q.x + q.y * q.y)),
                    Math.atan2(2 * (q.x * q.y + q.z * q.w), 1 - 2 * (q.x * q.x + q.z * q.z)),
                    Math.asin(2 * (q.x * q.z - q.y * q.w)));
            case EulerRot.YZX:
                return vec3.set(out,
                    Math.asin(2 * (q.x * q.w + q.y * q.z)),
                    Math.atan2(2 * (q.z * q.w - q.x * q.y), 1 - 2 * (q.y * q.y + q.z * q.z)),
                    Math.atan2(2 * (q.x * q.z - q.y * q.w), 1 - 2 * (q.x * q.x + q.y * q.y)));
            case EulerRot.XZY:
                return vec3.set(out,
                    Math.atan2(2 * (q.x * q.w + q.y * q.z), 1 - 2 * (q.x * q.x + q.y * q.y)),
                    Math.asin(2 * (q.x * q.y - q.z * q.w)),
                    Math.atan2(2 * (q.x * q.z + q.y * q.w), 1 - 2 * (q.x * q.x + q.z * q.z)));
            case EulerRot.YXZ:
                return vec3.set(out,
                    Math.atan2((2.0 * (q.x * q.z + q.w * q.y)), (q.w * q.w - q.x * q.x - q.y * q.y + q.z * q.z)),
                    Math.asin(-2.0 * (q.y * q.z - q.w * q.x)),
                    Math.atan2((2.0 * (q.x * q.y + q.w * q.z)), (q.w * q.w - q.x * q.x + q.y * q.y - q.z * q.z)));
            case EulerRot.XYZ:
                return vec3.set(out,
                    Math.atan2(2 * (q.x * q.w + q.y * q.z), 1 - 2 * (q.x * q.x + q.y * q.y)),
                    Math.asin(2 * (q.x * q.y - q.z * q.w)),
                    Math.atan2(2 * (q.x * q.z + q.y * q.w), 1 - 2 * (q.x * q.x + q.y * q.y)));
            default: panic(`Unknown euler rotation: ${euler}`);
        }
    }
    /** Return true if each element of `q` is finite. */
    static isFinite = vec4.isFinite;
    /** Return true if any element of `q` is NaN. */
    static isNan = vec4.isNan;
    /** Return true if given quaternion is normalized. */
    static isNormalized = vec4.isNormalized;
    /** Adds `lhs` and `rhs`. */
    static add(lhs: num4, rhs: num4): quat
    static add<T extends num4>(lhs: num4, rhs: num4, out: T): T
    static add(lhs: num4, rhs: num4, out = quat()) {
        return vec4.add(lhs, rhs, out);
    }
    /** Subtracts `lhs` and `rhs`. */
    static sub(lhs: num4, rhs: num4): quat
    static sub<T extends num4>(lhs: num4, rhs: num4, out: T): T
    static sub(lhs: num4, rhs: num4, out = quat()) {
        return vec4.sub(lhs, rhs, out);
    }
    /** Multiplies `lhs` and `rhs`. If they each represent a rotation, the result will represent the combined rotation.*/
    static mul(lhs: num4, rhs: num4): quat
    static mul<T extends num4>(lhs: num4, rhs: num4, out: T): T
    static mul(lhs: num4, rhs: num4, out = quat()) {
        let { x: x0, y: y0, z: z0, w: w0 } = lhs;
        let { x: x1, y: y1, z: z1, w: w1 } = rhs;
        return quat.set(out,
            w0 * x1 + x0 * w1 + y0 * z1 - z0 * y1,
            w0 * y1 - x0 * z1 + y0 * w1 + z0 * x1,
            w0 * z1 + x0 * y1 - y0 * x1 + z0 * w1,
            w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1,
        )
    }
    /** Multiplies a quaternion `lhs` and a scale value `rhs`. */
    static scale(lhs: num4, rhs: number): quat
    static scale<T extends num4>(lhs: num4, rhs: number, out: T): T
    static scale(lhs: num4, rhs: number, out = quat()) {
        return vec4.scale(lhs, rhs, out);
    }
    /** Check equality between `this` and `rhs`. */
    static eq = vec4.eq;
    /** Returns the quaternion conjugate of `q`. */
    static conj(q: quat): quat
    static conj<T extends num4>(q: quat, out: T): T
    static conj(q: quat, out = quat()) {
        return quat.set(out, -q.x, -q.y, -q.z, q.w);
    }
    /** Return the length for given quaternion. */
    static len = vec4.len;
    /** Return the length squared for given quaternion. */
    static len2 = vec4.len2;
    /** Computes `1.0 / len()` for given quaternion. */
    static rlen = vec4.rlen;
    /** Return `q` as a normalized quaternion. */
    static normalize(q: num4): quat
    static normalize<T extends num4>(q: num4, out: T): T
    static normalize(q: num4, out = quat()) {
        return vec4.normalize(q, out);
    }
    /** Return the normalized quaternion of `q` if possible, else `(0,0,0)`. */
    static normalizeSafe(q: num4): quat
    static normalizeSafe<T extends num4>(q: num4, out: T): T
    static normalizeSafe(q: num4, out = quat()) {
        return vec4.normalizeSafe(q, out);
    }
    /** Return the dot product of given quaternions. */
    static dot = vec4.dot;
    /** Returns the angle (in radians) for the minimal rotation for transforming this quaternion into another. */
    static angle(lhs: num4, rhs: num4): number {
        assert(vec4.isNormalized(lhs) && vec4.isNormalized(rhs), "arguments must be normalized.");
        return Math.acos(Math.abs(quat.dot(lhs, rhs))) * 2.0;
    }
    /** Performs a linear interpolation between `a` and `b` based on the value `t`. */
    static lerp(a: num4, b: num4, t: number): quat
    static lerp<T extends num4>(a: num4, b: num4, t: number, out: T): T
    static lerp(a: num4, b: num4, t: number, out = quat()) {
        return vec4.lerp(a, b, t, out);
    }
});

/** Euler rotation sequences. */
export enum EulerRot {
    ZYX,
    ZXY,
    YXZ,
    YZX,
    XYZ,
    XZY,
}

/** @internal */
class Quat implements num4 {
    x: number;
    y: number;
    z: number;
    w: number;
    /** Create a new rotation quaternion. */
    constructor(x: number, y: number, z: number, w: number = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    /** Set properties of this quaternion */
    set(...args: SetParams<typeof quat>): this {
        return quat.set(this, ...args);
    }
    /** Clone this quaternion. */
    clone(): quat {
        return quat.clone(this);
    }
    /** Return a string representation  */
    toString() {
        return quat.fmt(this);
    }
    /** Return each element as an array. */
    toArray(): [x: number, y: number, z: number, w: number] {
        return quat.toArray(this);
    }
    toAxisAngle(): [axis: vec3, radians: Rad]
    toAxisAngle<T extends num3>(out: T): [axis: T, radians: Rad]
    toAxisAngle(out = vec3()) {
        return quat.toAxisAngle(this, out);
    }
    /** Returns the rotation axis scaled by the rotation in radians. */
    toScaledAxis(): vec3
    toScaledAxis<T extends num3>(out: T): T
    toScaledAxis(out = vec3()) {
        return quat.toScaledAxis(this, out);
    }
    /** Returns the rotation angles for the given euler rotation sequence. */
    toEuler(euler?: EulerRot): vec3
    toEuler<T extends num3>(euler?: EulerRot, out?: T): T
    toEuler(euler: EulerRot = EulerRot.ZXY, out = vec3()) {
        return quat.toEuler(this, euler, out);
    }
    /** Return true if each element of `this` is finite. */
    isFinite(): boolean {
        return quat.isFinite(this);
    }
    /** Return true if any element of `this` is NaN. */
    isNan(): boolean {
        return quat.isNan(this);
    }
    /** Return true if `this` is normalized. */
    isNormalized(): boolean {
        return quat.isNormalized(this);
    }
    /** Adds `rhs` to `this`. */
    add(rhs: num4): this {
        return quat.add(this, rhs, this);
    }
    /** Subtracts `rhs` from `this`. */
    sub(rhs: num4): this {
        return quat.sub(this, rhs, this);
    }
    /** Multiplies `this` with `rhs`. If they each represent a rotation, the result will represent the combined rotation.*/
    mul(rhs: num4): this {
        return quat.mul(this, rhs, this);
    }
    /** Scales the quaternion by a scalar. */
    scale(scale: number): this {
        return quat.scale(this, scale, this);
    }
    /** Check equality between `this` and `rhs`. */
    eq(rhs: num4): boolean {
        return quat.eq(this, rhs);
    }
    /** Returns the quaternion conjugate of `q`. */
    conj(): quat
    conj<T extends num4>(out: T): T
    conj(out = quat()) {
        return quat.conj(this, out);
    }
    /** Return the length. */
    len(): number {
        return quat.len(this);
    }
    /** Return the length squared. */
    len2(): number {
        return quat.len2(this);
    }
    /** Computes `1.0 / len()`. */
    rlen(): number {
        return quat.rlen(this);
    }
    /** Normalizes the vector. */
    normalize(): this {
        return quat.normalize(this, this);
    }
    /** Safely normalizes `this` if possible, else `(0,0)`. */
    normalizeSafe(): this {
        return quat.normalizeSafe(this, this);
    }
    /** Dot product of `this` & `rhs`. */
    dot(rhs: num4): number {
        return quat.dot(this, rhs);
    }
    /** Returns the angle (in radians) for the minimal rotation for transforming this quaternion into another. */
    angle(rhs: num4): number {
        return quat.angle(this, rhs);
    }
    /** Performs a linear interpolation between `this` and `v` based on the value `t`. */
    lerp(v: num4, t: number): this {
        return quat.lerp(this, v, t, this);
    }
}

/** @internal */
const v1 = vec3.zero();
const q1 = quat.zero();
const q2 = quat.zero();
const q3 = quat.zero();
const identity = quat.identity();
