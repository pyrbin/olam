import { assert, expect, suite, test } from "vitest";
import { deg, feq } from "../math";
import { EulerRot, quat } from "./quat";
import { vec3 } from "./vec3";
import { vec4 } from "./vec4";

suite("quat", () => {
  test("create a new quaternion", () => {
    let q = quat(1, 2, 3, 4);
    expect(q.x).toBe(1);
    expect(q.y).toBe(2);
    expect(q.z).toBe(3);
    expect(q.w).toBe(4);
  });
  test("create identity quaternion", () => {
    let q = quat();
    expect(q.x).toBe(0);
    expect(q.y).toBe(0);
    expect(q.z).toBe(0);
    expect(q.w).toBe(1);
  });
  test("create a quaternion from typed array", () => {
    let q = quat.fromArray(new Float32Array([1, 2, 3, 4]));
    expect(q.x).toBe(1);
    expect(q.y).toBe(2);
    expect(q.z).toBe(3);
    expect(q.w).toBe(4);
  });
  test("from 4-dim vector", () => {
    let q = quat.fromVec4(vec4(1, 2, 3, 4));
    expect(q.x).toBe(1);
    expect(q.y).toBe(2);
    expect(q.z).toBe(3);
    expect(q.w).toBe(4);
  });
  test("from rotation", () => {
    let zero = deg(0.0);
    let yaw = deg(30.0);
    let y0 = quat.fromRotationY(yaw);
    assert(y0.isNormalized());
    let [axis, angle] = y0.toAxisAngle();
    assert(axis.eq(vec3.up()));
    assert(feq(angle, yaw));
    let e0 = vec3(yaw, zero, zero);
    let y1 = quat.fromEuler(e0, EulerRot.YXZ);
    assert(y0.eq(y1));
    let e1 = y1.toEuler(EulerRot.YXZ);
    assert(e0.eq(e1));
  });
  test("format a quaternion to a string", () => {
    let q = quat(1, 2, 3, 4);
    expect(q.toString()).toBe("(1, 2, 3, 4)");
  });
  test("check nan, infinitiy", () => {
    let q = quat(1, 2, 3, 4);
    expect(q.isNan()).toBe(false);
    expect(q.isFinite()).toBe(true);
  });
  test("add two quaternions", () => {
    let q1 = quat(1, 2, 3, 4);
    let q2 = quat(4, 5, 6, 7);
    let q3 = q1.add(q2);
    expect(q3.x).toBe(5);
    expect(q3.y).toBe(7);
    expect(q3.z).toBe(9);
    expect(q3.w).toBe(11);
  });
  test("subtract two quaternions", () => {
    let q1 = quat(1, 2, 3, 4);
    let q2 = quat(4, 5, 6, 7);
    let q3 = q1.sub(q2);
    expect(q3.x).toBe(-3);
    expect(q3.y).toBe(-3);
    expect(q3.z).toBe(-3);
    expect(q3.w).toBe(-3);
  });
  test("conjugate a quaternion", () => {
    let q = quat(1, 2, 3, 4);
    let qc = q.conj();
    expect(qc.x).toBe(-1);
    expect(qc.y).toBe(-2);
    expect(qc.z).toBe(-3);
    expect(qc.w).toBe(4);
  });
  test("angle between two quaternions", () => {
    const TAU = 2.0 * Math.PI;
    let q1 = quat.fromEuler(vec3(), EulerRot.YXZ);
    let q2 = quat.fromEuler(vec3(TAU * 0.25, 0.0, 0.0), EulerRot.YXZ);
    let angle = q1.angle(q2);
    expect(feq(angle, TAU * 0.25)).toBe(true);
  });
  test("lerp", () => {
    let q1 = quat(1, 2, 3, 1);
    let q2 = quat(4, 5, 6, 1);
    q1.lerp(q2, 0.5);
    expect(q1.x).toBe(2.5);
    expect(q1.y).toBe(3.5);
    expect(q1.z).toBe(4.5);
    expect(q1.w).toBe(1);
  });
});
