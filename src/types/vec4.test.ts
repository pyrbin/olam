import { expect, suite, test } from "vitest";
import { recip, sqrt } from "../math";
import { vec4 } from "./vec4";

suite("vec4", () => {
    test("create a new vector", () => {
        let v = vec4(1, 2, 3, 4);
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
        expect(v.z).toBe(3);
        expect(v.w).toBe(4);
        v = vec4.create(7);
        expect(v.x).toBe(7);
        expect(v.y).toBe(7);
        expect(v.z).toBe(7);
        expect(v.w).toBe(7);
    });
    test("create a vector from typed array", () => {
        let v = vec4.fromArray(new Float32Array([1, 2, 3, 4]));
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
        expect(v.z).toBe(3);
        expect(v.w).toBe(4);
    });
    test("format a vector to a string", () => {
        let v = vec4(1, 2, 3, 4);
        expect(v.toString()).toBe("(1, 2, 3, 4)");
    });
    test("check nan, infinitiy", () => {
        let v = vec4(1, 2, 3, 4);
        expect(v.isNan()).toBe(false);
        expect(v.isFinite()).toBe(true);
    });
    test("add two vectors", () => {
        let v1 = vec4(1, 2, 3, 4);
        let v2 = vec4(4, 5, 6, 7);
        let v3 = v1.add(v2);
        expect(v3.x).toBe(5);
        expect(v3.y).toBe(7);
        expect(v3.z).toBe(9);
        expect(v3.w).toBe(11);
    });
    test("subtract two vectors", () => {
        let v1 = vec4(1, 2, 3, 4);
        let v2 = vec4(4, 5, 6, 7);
        let v3 = v1.sub(v2);
        expect(v3.x).toBe(-3);
        expect(v3.y).toBe(-3);
        expect(v3.z).toBe(-3);
        expect(v3.w).toBe(-3);
    });
    test("multiply two vectors", () => {
        let v1 = vec4(1, 2, 3, 4);
        let v2 = vec4(4, 5, 6, 7);
        let v3 = v1.mul(v2);
        expect(v3.x).toBe(4);
        expect(v3.y).toBe(10);
        expect(v3.z).toBe(18);
        expect(v3.w).toBe(28);
    });
    test("multiply a vector by a scalar", () => {
        let v1 = vec4(1, 2, 3, 4);
        let v2 = v1.scale(2);
        expect(v2.x).toBe(2);
        expect(v2.y).toBe(4);
        expect(v2.z).toBe(6);
        expect(v2.w).toBe(8);
    });
    test("divide two vectors", () => {
        let v1 = vec4(1, 2, 3, 4);
        let v2 = vec4(4, 5, 6, 7);
        let v3 = v1.div(v2);
        expect(v3.x).toBe(1 / 4);
        expect(v3.y).toBe(2 / 5);
        expect(v3.z).toBe(3 / 6);
        expect(v3.w).toBe(4 / 7);
    });
    test("dot product", () => {
        let v1 = vec4(1, 2, 3, 4);
        let v2 = vec4(4, 5, 6, 7);
        let v3 = v1.dot(v2);
        expect(v3).toBe(60);
    });
    test("compute the length of a vector", () => {
        let v1 = vec4(1, 2, 3, 4);
        expect(v1.len()).toBe(sqrt(30));
        expect(v1.len2()).toBe(30);
        expect(v1.rlen()).toBe(recip(v1.len()));
    });
    test("compute the distance between two vectors", () => {
        let v1 = vec4(1, 2, 3, 4);
        let v2 = vec4(4, 5, 6, 7);
        expect(v1.dist(v2)).toBe(6);
        expect(v1.dist2(v2)).toBe(36);
    });
    test("normalize a vector", () => {
        let v1 = vec4(1, 2, 3, 4);
        let v2 = v1.normalize();
        expect(v2.len()).toBeCloseTo(1, 8);
    });
    test("normalize an invalid vector", () => {
        let v1 = vec4(0, 0, 0, 0);
        let v2 = v1.normalizeSafe();
        expect(v2.len()).toBe(0);
    });
    test("project a vector onto another vector", () => {
        let v1 = vec4(1, 2, 3, 4);
        let v2 = vec4(4, 5, 6, 7);
        let v3 = v1.project(v2);
        expect(v3.x).toBeCloseTo(40 / 21);
        expect(v3.y).toBeCloseTo(50 / 21);
        expect(v3.z).toBeCloseTo(20 / 7);
        expect(v3.w).toBeCloseTo(10 / 3);
    });
    test("reject a vector onto another vector", () => {
        let v1 = vec4(1, 2, 3, 4);
        let v2 = vec4(4, 5, 6, 7);
        let v3 = vec4();
        let v4 = vec4();
        v1.reject(v2, v3);
        v1.project(v2, v4);
        expect(v3.eq(vec4.sub(v1, v4))).toBe(true);
    });
    test("truncate a vector", () => {
        let v1 = vec4(1, 2, 3, 4);
        let v2 = v1.trunc();
        expect(v2.x).toBe(1);
        expect(v2.y).toBe(2);
        expect(v2.z).toBe(3);
    });
    test("lerp two vectors", () => {
        let v1 = vec4(1, 2, 3, 4);
        let v2 = vec4(4, 5, 6, 7);
        let v3 = v1.lerp(v2, 0.5);
        expect(v3.x).toBe(2.5);
        expect(v3.y).toBe(3.5);
        expect(v3.z).toBe(4.5);
        expect(v3.w).toBe(5.5);
    });
});