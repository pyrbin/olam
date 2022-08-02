import { expect, suite, test } from "vitest";
import { deg, eqf, recip } from "../math";
import { vec2 } from '../mod';

suite("vec2", () => {
    test("create a new vector", () => {
        let v = vec2(1, 2);
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
    });
    test("create a vector from typed array", () => {
        let v = vec2.fromArray(new Float32Array([1, 2]));
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
    });
    test("add two vectors", () => {
        let v1 = vec2(1, 2);
        let v2 = vec2(3, 4);
        v1.add(v2);
        expect(v1.x).toBe(4);
        expect(v1.y).toBe(6);
    });
    test("subtract two vectors", () => {
        let v1 = vec2(1, 2);
        let v2 = vec2(3, 4);
        v1.sub(v2);
        expect(v1.x).toBe(-2);
        expect(v1.y).toBe(-2);
    });
    test("multiply two vectors", () => {
        let v1 = vec2(1, 2);
        let v2 = vec2(3, 4);
        v1.mul(v2);
        expect(v1.x).toBe(3);
        expect(v1.y).toBe(8);
    });
    test("multiply a vector by a scale", () => {
        let v1 = vec2(1, 2);
        v1.scale(3);
        expect(v1.x).toBe(3);
        expect(v1.y).toBe(6);
    });
    test("divide two vectors", () => {
        let v1 = vec2(1, 2);
        let v2 = vec2(3, 4);
        v1.div(v2);
        expect(v1.x).toBe(1 / 3);
        expect(v1.y).toBe(2 / 4);
    });
    test("compute the length of a vector", () => {
        let v1 = vec2(1, 2);
        expect(v1.len()).toBe(Math.sqrt(5));
        expect(v1.len2()).toBe(5);
        expect(v1.rlen()).toBe(recip(Math.sqrt(5)));
    });
    test("dot product of two vectors", () => {
        let v1 = vec2(1, 2);
        let v2 = vec2(3, 4);
        let dot = v1.dot(v2);
        expect(dot).toBe(11);
    });
    test("cross product of two vectors", () => {
        let v1 = vec2(1, 2);
        let v2 = vec2(3, 4);
        let cross = v1.cross(v2);
        expect(cross).toBe(-2);
    });
    test("normalize a vector", () => {
        let v1 = vec2(1, 2);
        v1.normalize();
        expect(v1.x).toBe(1 / Math.sqrt(5));
        expect(v1.y).toBe(2 / Math.sqrt(5));
        expect(vec2.isNormalized(v1)).toBe(true);
    });
    test("normalize an invalid vector", () => {
        let v1 = vec2(0, 0);
        let v2 = vec2(0, 0);
        v1.normalize();
        v2.normalizeSafe();
        expect(vec2.isNormalized(v1)).toBe(false);
        expect(v2.x).toBe(0);
        expect(v2.y).toBe(0);
        expect(vec2.isNormalized(v2)).toBe(false);
    });
    test("compute the angle between two vectors", () => {
        let v1 = vec2(1, 0);
        let v2 = vec2(0, 1);
        let angle = v1.angle(v2);
        expect(angle).toBe(Math.PI / 2);
    });
    test("reflect a vector onto a normal", () => {
        let v1 = vec2(1, 0);
        let n = vec2(0, 1);
        let v2 = v1.reflect(n);
        expect(eqf(v2.x, 1)).toBe(true);
        expect(eqf(v2.y, 0)).toBe(true);
    });
    test("compute the distance between two vectors", () => {
        let v1 = vec2(3, 2);
        let v2 = vec2(5, -1);
        let dist = v1.dist(v2);
        expect(dist).toBe(Math.sqrt(13));
    });
    test("compute the squared distance between two vectors", () => {
        let v1 = vec2(3, 2);
        let v2 = vec2(5, -1);
        let dist = v1.dist2(v2);
        expect(dist).toBe(13);
    });
    test("extend a vector", () => {
        let v1 = vec2(1, 2);
        let v2 = v1.extend(3);
        expect(v2.x).toBe(1);
        expect(v2.y).toBe(2);
        expect(v2.z).toBe(3);
    });
    test("rotate a vector", () => {
        let v1 = vec2(1, 0);
        v1.rotate(deg(90));
        expect(eqf(v1.x, 0)).toBe(true);
        expect(eqf(v1.y, 1)).toBe(true);
    });
    test("lerp two vectors", () => {
        let v1 = vec2(1, 2);
        let v2 = vec2(3, 4);
        v1.lerp(v2, 0.5);
        expect(v1.x).toBe(2);
        expect(v1.y).toBe(3);
    });
});
