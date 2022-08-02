import { expect, suite, test } from "vitest";
import { deg, eqf, recip } from "../math";
import { vec2 } from "./vec2";
import { vec3 } from "./vec3";

suite("vec3", () => {
    test("create a new vector", () => {
        let v = vec3(1, 2, 3);
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
        expect(v.z).toBe(3);
    });
    test("create a vector from typed array", () => {
        let v = vec3.fromArray(new Float32Array([1, 2, 3]));
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
        expect(v.z).toBe(3);
    });
    test("format a vector to a string", () => {
        let v = vec3(1, 2, 3);
        expect(v.toString()).toBe("(1, 2, 3)");
    })
    test("add two vectors", () => {
        let v1 = vec3(1, 2, 3);
        let v2 = vec3(4, 5, 6);
        let v3 = v1.add(v2);
        expect(v3.x).toBe(5);
        expect(v3.y).toBe(7);
        expect(v3.z).toBe(9);
    });
    test("subtract two vectors", () => {
        let v1 = vec3(1, 2, 3);
        let v2 = vec3(4, 5, 6);
        let v3 = v1.sub(v2);
        expect(v3.x).toBe(-3);
        expect(v3.y).toBe(-3);
        expect(v3.z).toBe(-3);
    });
    test("multiply two vectors", () => {
        let v1 = vec3(1, 2, 3);
        let v2 = vec3(4, 5, 6);
        let v3 = v1.mul(v2);
        expect(v3.x).toBe(4);
        expect(v3.y).toBe(10);
        expect(v3.z).toBe(18);
    });
    test("multiply a vector by a scale", () => {
        let v1 = vec3(1, 2, 3);
        let v2 = v1.scale(4);
        expect(v2.x).toBe(4);
        expect(v2.y).toBe(8);
        expect(v2.z).toBe(12);
    });
    test("divide two vectors", () => {
        let v1 = vec3(1, 2, 3);
        let v2 = vec3(4, 5, 6);
        let v3 = v1.div(v2);
        expect(v3.x).toBe(1 / 4);
        expect(v3.y).toBe(2 / 5);
        expect(v3.z).toBe(3 / 6);
    });
    test("compute the length of a vector", () => {
        let v1 = vec3(1, 2, 3);
        expect(v1.len()).toBe(Math.sqrt(14));
        expect(v1.len2()).toBe(14);
        expect(v1.rlen()).toBe(recip(v1.len()));

    });
    test("dot product of two vectors", () => {
        let v1 = vec3(1, 2, 3);
        let v2 = vec3(4, 5, 6);
        let dot = v1.dot(v2);
        expect(dot).toBe(32);
    });
    test("cross product of two vectors", () => {
        let v1 = vec3(1, 2, 3);
        let v2 = vec3(4, 5, 6);
        let v3 = v1.cross(v2);
        expect(v3.x).toBe(-3);
        expect(v3.y).toBe(6);
        expect(v3.z).toBe(-3);
    });
    test("normalize a vector", () => {
        let v1 = vec3(1, 2, 3);
        let v2 = v1.normalize();
        expect(v2.x).toBe(1 / Math.sqrt(14));
        expect(v2.y).toBe(2 / Math.sqrt(14));
        expect(v2.z).toBe(3 / Math.sqrt(14));
        expect(vec3.isNormalized(v2)).toBe(true);
    });
    test("normalize an invalid vector", () => {
        let v2 = vec3(0, 0, 0);
        let v3 = vec3(0, 0, 0);
        v2.normalizeSafe();
        v3.normalize();
        expect(v3.isNormalized()).toBe(false);
        expect(v2.x).toBe(0);
        expect(v2.y).toBe(0);
        expect(v2.z).toBe(0);
        expect(v2.isNormalized()).toBe(false);
    });
    test("compute the angle between two vectors", () => {
        let v1 = vec3(1, 0, 0);
        let v2 = vec3(0, 1, 0);
        let angle = v1.angle(v2);
        expect(angle).toBe(Math.PI / 2);
    });
    test("reflect a vector onto a normal", () => {
        let v1 = vec3(1, 0, 0);
        let n = vec3(0, 1, 0);
        let v2 = v1.reflect(n);
        expect(v2.x).toBe(1);
        expect(v2.y).toBe(0);
        expect(v2.z).toBe(0);
    });
    test("compute the distance between two vectors", () => {
        let v1 = vec3(3, 2, -2);
        let v2 = vec3(5, -1, 5);
        let dist = v1.dist(v2);
        expect(dist).toBe(Math.sqrt(62));
    });
    test("compute the squared distance between two vectors", () => {
        let v1 = vec3(3, 2, -2);
        let v2 = vec3(5, -1, 5);
        let dist = v1.dist2(v2);
        expect(dist).toBe(62);
    });
    test("vector swizzles", () => {
        let v1 = vec3(1, 2, 3);
        let xy = v1.trunc();
        expect(xy.x).toBe(1);
        expect(xy.y).toBe(2);
        let xy0 = v1.xy0();
        expect(xy0.x).toBe(1);
        expect(xy0.y).toBe(2);
        expect(xy0.z).toBe(0);
        let yz = v1.yz(vec2());
        expect(yz.x).toBe(v1.y);
        expect(yz.y).toBe(v1.z);
        let xz = v1.xz(vec2());
        expect(xz.x).toBe(v1.x);
        expect(xz.y).toBe(v1.z);
    });
    test("rotate a vector", () => {
        let v1 = vec3(1, 0, 0);
        let v2 = v1.rotate(deg(90));
        expect(eqf(v2.x, 0)).toBe(true);
        expect(eqf(v2.y, 1)).toBe(true);
        expect(eqf(v2.z, 0)).toBe(true);
    });
    test("lerp two vectors", () => {
        let v1 = vec3(1, 2, 3);
        let v2 = vec3(4, 5, 6);
        let v3 = v1.lerp(v2, 0.5);
        expect(v3.x).toBe(2.5);
        expect(v3.y).toBe(3.5);
        expect(v3.z).toBe(4.5);
    });
});
