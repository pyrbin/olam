import { expect, suite, test } from "vitest";
import { num2 } from './num2';

suite("num2", () => {
    test("create a new vector", () => {
        const v = num2(1, 2);
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
    });

    test("create a vector from typed array", () => {
        const v = num2.fromArray(new Float32Array([1, 2]));
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
    });

    test("add two vectors", () => {
        const v1 = num2(1, 2);
        const v2 = num2(3, 4);
        const v3 = num2.add(v1, v2);
        expect(v3.x).toBe(4);
        expect(v3.y).toBe(6);
    });

    test("subtract two vectors", () => {
        const v1 = num2(1, 2);
        const v2 = num2(3, 4);
        const v3 = num2.sub(v1, v2);
        expect(v3.x).toBe(-2);
        expect(v3.y).toBe(-2);
    });

    test("multiply two vectors", () => {
        const v1 = num2(1, 2);
        const v2 = num2(3, 4);
        const v3 = num2.mul(v1, v2);
        expect(v3.x).toBe(3);
        expect(v3.y).toBe(8);
    });

    test("multiply a vector by a scalar", () => {
        const v1 = num2(1, 2);
        const v2 = num2.scalar(v1, 3);
        expect(v2.x).toBe(3);
        expect(v2.y).toBe(6);
    });

    test("divide two vectors", () => {
        const v1 = num2(1, 2);
        const v2 = num2(3, 4);
        const v3 = num2.div(v1, v2);
        expect(v3.x).toBe(1 / 3);
        expect(v3.y).toBe(2 / 4);
    });

    test("compute the length of a vector", () => {
        const v1 = num2(1, 2);
        const len = num2.len(v1);
        expect(len).toBe(Math.sqrt(5));
    });

    test("dot product of two vectors", () => {
        const v1 = num2(1, 2);
        const v2 = num2(3, 4);
        const dot = num2.dot(v1, v2);
        expect(dot).toBe(11);
    });

    test("cross product of two vectors", () => {
        const v1 = num2(1, 2);
        const v2 = num2(3, 4);
        const cross = num2.cross(v1, v2);
        expect(cross).toBe(-2);
    });

    test("normalize a vector", () => {
        const v1 = num2(1, 2);
        const v2 = num2.normalize(v1);
        expect(v2.x).toBe(1 / Math.sqrt(5));
        expect(v2.y).toBe(2 / Math.sqrt(5));
        expect(num2.isNormalized(v2)).toBe(true);
    });

    test("normalize an invalid vector", () => {
        const v1 = num2(0, 0);
        const v2 = num2.normalizeSafe(v1, num2(5, 5));
        expect(v2.x).toBe(5);
        expect(v2.y).toBe(5);
        expect(num2.isNormalized(v2)).toBe(false);
    });

    test("compute the angle between two vectors", () => {
        const v1 = num2(1, 0);
        const v2 = num2(0, 1);
        const angle = num2.angle(v1, v2);
        expect(angle).toBe(Math.PI / 2);
    });

    test("reflect a vector onto a normal", () => {
        const v1 = num2(1, 0);
        const n = num2(0, 1);
        const v2 = num2.reflect(v1, n);
        expect(v2.x).toBe(1);
        expect(v2.y).toBe(0);
    });

    test("compute the distance between two vectors", () => {
        const v1 = num2(3, 2);
        const v2 = num2(5, -1);
        const dist = num2.dist(v1, v2);
        expect(dist).toBe(Math.sqrt(13));
    });

    test("compute the squared distance between two vectors", () => {
        const v1 = num2(3, 2);
        const v2 = num2(5, -1);
        const dist = num2.dist2(v1, v2);
        expect(dist).toBe(13);
    });

    test("extend a vector", () => {
        const v1 = num2(1, 2);
        const v2 = num2.extend(v1, 3);
        expect(v2.x).toBe(1);
        expect(v2.y).toBe(2);
        expect(v2.z).toBe(3);
    });

    test("rotate a vector", () => {
        test("by a radian", () => {
            const v1 = num2(1, 0);
            const v2 = num2.rotate(v1, Math.PI / 2);
            expect(v2.x).toBe(0);
            expect(v2.y).toBe(1);
        });
        test("by a degree", () => {
            const v1 = num2(1, 0);
            const v2 = num2.rotatedeg(v1, 90);
            expect(v2.x).toBe(0);
            expect(v2.y).toBe(1);
        });
    });
});
