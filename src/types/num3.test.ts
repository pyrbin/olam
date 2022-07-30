import { expect, suite, test } from "vitest";
import { num3 } from "./num3";

suite("num3", () => {
    test("create a new vector", () => {
        const v = num3(1, 2, 3);
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
        expect(v.z).toBe(3);
    });

    test("create a vector from typed array", () => {
        const v = num3.fromArray(new Float32Array([1, 2, 3]));
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
        expect(v.z).toBe(3);
    });

    test("add two vectors", () => {
        const v1 = num3(1, 2, 3);
        const v2 = num3(4, 5, 6);
        const v3 = num3.add(v1, v2);
        expect(v3.x).toBe(5);
        expect(v3.y).toBe(7);
        expect(v3.z).toBe(9);
    });

    test("subtract two vectors", () => {
        const v1 = num3(1, 2, 3);
        const v2 = num3(4, 5, 6);
        const v3 = num3.sub(v1, v2);
        expect(v3.x).toBe(-3);
        expect(v3.y).toBe(-3);
        expect(v3.z).toBe(-3);
    });

    test("multiply two vectors", () => {
        const v1 = num3(1, 2, 3);
        const v2 = num3(4, 5, 6);
        const v3 = num3.mul(v1, v2);
        expect(v3.x).toBe(4);
        expect(v3.y).toBe(10);
        expect(v3.z).toBe(18);
    });

    test("multiply a vector by a scalar", () => {
        const v1 = num3(1, 2, 3);
        const v2 = num3.scalar(v1, 4);
        expect(v2.x).toBe(4);
        expect(v2.y).toBe(8);
        expect(v2.z).toBe(12);
    });

    test("divide two vectors", () => {
        const v1 = num3(1, 2, 3);
        const v2 = num3(4, 5, 6);
        const v3 = num3.div(v1, v2);
        expect(v3.x).toBe(1 / 4);
        expect(v3.y).toBe(2 / 5);
        expect(v3.z).toBe(3 / 6);
    });

    test("compute the length of a vector", () => {
        const v1 = num3(1, 2, 3);
        const len = num3.len(v1);
        expect(len).toBe(Math.sqrt(14));
    });

    test("dot product of two vectors", () => {
        const v1 = num3(1, 2, 3);
        const v2 = num3(4, 5, 6);
        const dot = num3.dot(v1, v2);
        expect(dot).toBe(32);
    });

    test("cross product of two vectors", () => {
        const v1 = num3(1, 2, 3);
        const v2 = num3(4, 5, 6);
        const v3 = num3.cross(v1, v2);
        expect(v3.x).toBe(-3);
        expect(v3.y).toBe(6);
        expect(v3.z).toBe(-3);
    });

    test("normalize a vector", () => {
        const v1 = num3(1, 2, 3);
        const v2 = num3.normalize(v1);
        expect(v2.x).toBe(1 / Math.sqrt(14));
        expect(v2.y).toBe(2 / Math.sqrt(14));
        expect(v2.z).toBe(3 / Math.sqrt(14));
        expect(num3.isNormalized(v2)).toBe(true);
    });

    test("normalize an invalid vector", () => {
        const v1 = num3(0, 0, 0);
        const v2 = num3.normalizeSafe(v1, num3(5, 5, 5));
        expect(v2.x).toBe(5);
        expect(v2.y).toBe(5);
        expect(v2.z).toBe(5);
        expect(num3.isNormalized(v2)).toBe(false);
    });

    test("compute the angle between two vectors", () => {
        const v1 = num3(1, 0, 0);
        const v2 = num3(0, 1, 0);
        const angle = num3.angle(v1, v2);
        expect(angle).toBe(Math.PI / 2);
    });

    test("reflect a vector onto a normal", () => {
        const v1 = num3(1, 0, 0);
        const n = num3(0, 1, 0);
        const v2 = num3.reflect(v1, n);
        expect(v2.x).toBe(1);
        expect(v2.y).toBe(0);
        expect(v2.z).toBe(0);
    });

    test("compute the distance between two vectors", () => {
        const v1 = num3(3, 2, -2);
        const v2 = num3(5, -1, 5);
        const dist = num3.dist(v1, v2);
        expect(dist).toBe(Math.sqrt(62));
    });

    test("compute the squared distance between two vectors", () => {
        const v1 = num3(3, 2, -2);
        const v2 = num3(5, -1, 5);
        const dist = num3.dist2(v1, v2);
        expect(dist).toBe(62);
    });

    test("return x and y components of a vector", () => {
        const v1 = num3(1, 2, 3);
        const v2 = num3.xy(v1);
        expect(v2.x).toBe(1);
        expect(v2.y).toBe(2);
    });

    test("rotate a vector", () => {
        test("by a radian", () => {
            const v1 = num3(1, 0, 0);
            const v2 = num3.rotate(v1, Math.PI / 2);
            expect(v2.x).toBe(0);
            expect(v2.y).toBe(1);
            expect(v2.z).toBe(0);
        });
        test("by a degree", () => {
            const v1 = num3(1, 0, 0);
            const v2 = num3.rotatedeg(v1, 90);
            expect(v2.x).toBe(0);
            expect(v2.y).toBe(1);
            expect(v2.z).toBe(0);
        });
    });
});
