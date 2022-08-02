import { expect, suite, test } from "vitest";
import { deg } from "../math";
import { vec3 } from "./vec3";

suite("vec3", () => {
    test("create a new vector", () => {
        const v = vec3(1, 2, 3);
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
        expect(v.z).toBe(3);
    });
    test("create a vector from typed array", () => {
        const v = vec3.fromArray(new Float32Array([1, 2, 3]));
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
        expect(v.z).toBe(3);
    });
    test("add two vectors", () => {
        const v1 = vec3(1, 2, 3);
        const v2 = vec3(4, 5, 6);
        const v3 = vec3.add(v1, v2);
        expect(v3.x).toBe(5);
        expect(v3.y).toBe(7);
        expect(v3.z).toBe(9);
    });
    test("subtract two vectors", () => {
        const v1 = vec3(1, 2, 3);
        const v2 = vec3(4, 5, 6);
        const v3 = vec3.sub(v1, v2);
        expect(v3.x).toBe(-3);
        expect(v3.y).toBe(-3);
        expect(v3.z).toBe(-3);
    });
    test("multiply two vectors", () => {
        const v1 = vec3(1, 2, 3);
        const v2 = vec3(4, 5, 6);
        const v3 = vec3.mul(v1, v2);
        expect(v3.x).toBe(4);
        expect(v3.y).toBe(10);
        expect(v3.z).toBe(18);
    });
    test("multiply a vector by a scale", () => {
        const v1 = vec3(1, 2, 3);
        const v2 = vec3.scale(v1, 4);
        expect(v2.x).toBe(4);
        expect(v2.y).toBe(8);
        expect(v2.z).toBe(12);
    });
    test("divide two vectors", () => {
        const v1 = vec3(1, 2, 3);
        const v2 = vec3(4, 5, 6);
        const v3 = vec3.div(v1, v2);
        expect(v3.x).toBe(1 / 4);
        expect(v3.y).toBe(2 / 5);
        expect(v3.z).toBe(3 / 6);
    });
    test("compute the length of a vector", () => {
        const v1 = vec3(1, 2, 3);
        const len = vec3.len(v1);
        expect(len).toBe(Math.sqrt(14));
    });
    test("dot product of two vectors", () => {
        const v1 = vec3(1, 2, 3);
        const v2 = vec3(4, 5, 6);
        const dot = vec3.dot(v1, v2);
        expect(dot).toBe(32);
    });
    test("cross product of two vectors", () => {
        const v1 = vec3(1, 2, 3);
        const v2 = vec3(4, 5, 6);
        const v3 = vec3.cross(v1, v2);
        expect(v3.x).toBe(-3);
        expect(v3.y).toBe(6);
        expect(v3.z).toBe(-3);
    });
    test("normalize a vector", () => {
        const v1 = vec3(1, 2, 3);
        const v2 = vec3.normalize(v1);
        expect(v2.x).toBe(1 / Math.sqrt(14));
        expect(v2.y).toBe(2 / Math.sqrt(14));
        expect(v2.z).toBe(3 / Math.sqrt(14));
        expect(vec3.isNormalized(v2)).toBe(true);
    });
    test("normalize an invalid vector", () => {
        const v1 = vec3(0, 0, 0);
        const v2 = vec3.normalizeSafe(v1);
        const v3 = vec3.normalize(v1);
        expect(vec3.isNormalized(v3)).toBe(false);
        expect(v2.x).toBe(0);
        expect(v2.y).toBe(0);
        expect(v2.z).toBe(0);
        expect(vec3.isNormalized(v2)).toBe(false);
    });
    test("compute the angle between two vectors", () => {
        const v1 = vec3(1, 0, 0);
        const v2 = vec3(0, 1, 0);
        const angle = vec3.angle(v1, v2);
        expect(angle).toBe(Math.PI / 2);
    });
    test("reflect a vector onto a normal", () => {
        const v1 = vec3(1, 0, 0);
        const n = vec3(0, 1, 0);
        const v2 = vec3.reflect(v1, n);
        expect(v2.x).toBe(1);
        expect(v2.y).toBe(0);
        expect(v2.z).toBe(0);
    });
    test("compute the distance between two vectors", () => {
        const v1 = vec3(3, 2, -2);
        const v2 = vec3(5, -1, 5);
        const dist = vec3.dist(v1, v2);
        expect(dist).toBe(Math.sqrt(62));
    });
    test("compute the squared distance between two vectors", () => {
        const v1 = vec3(3, 2, -2);
        const v2 = vec3(5, -1, 5);
        const dist = vec3.dist2(v1, v2);
        expect(dist).toBe(62);
    });
    test("return x and y components of a vector", () => {
        const v1 = vec3(1, 2, 3);
        const v2 = vec3.xy(v1);
        expect(v2.x).toBe(1);
        expect(v2.y).toBe(2);
    });
    test("rotate a vector", () => {
        test("by a radian", () => {
            const v1 = vec3(1, 0, 0);
            const v2 = vec3.rotate(v1, Math.PI / 2);
            expect(v2.x).toBe(0);
            expect(v2.y).toBe(1);
            expect(v2.z).toBe(0);
        });
        test("by a degree", () => {
            const v1 = vec3(1, 0, 0);
            const v2 = vec3.rotate(v1, deg(90));
            expect(v2.x).toBe(0);
            expect(v2.y).toBe(1);
            expect(v2.z).toBe(0);
        });
    });
    test("lerp two vectors", () => {
        const v1 = vec3(1, 2, 3);
        const v2 = vec3(4, 5, 6);
        const v3 = vec3.lerp(v1, v2, 0.5);
        expect(v3.x).toBe(2.5);
        expect(v3.y).toBe(3.5);
        expect(v3.z).toBe(4.5);
    });
});
