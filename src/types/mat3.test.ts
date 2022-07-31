import { expect, suite, test } from "vitest";
import { deg } from "../math";
import { mat3 } from './mat3';
import { vec2 } from "./vec2";
import { vec3 } from "./vec3";

suite("mat3", () => {
    test("create a new matrix", () => {
        const m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        expect(m.c0.x).toBe(1);
        expect(m.c0.y).toBe(2);
        expect(m.c0.z).toBe(3);
        expect(m.c1.x).toBe(4);
        expect(m.c1.y).toBe(5);
        expect(m.c1.z).toBe(6);
        expect(m.c2.x).toBe(7);
        expect(m.c2.y).toBe(8);
        expect(m.c2.z).toBe(9);
    });
    test("create a matrix from typed array", () => {
        const m = mat3.fromArray(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9]));
        expect(m.c0.x).toBe(1);
        expect(m.c0.y).toBe(2);
        expect(m.c0.z).toBe(3);
        expect(m.c1.x).toBe(4);
        expect(m.c1.y).toBe(5);
        expect(m.c1.z).toBe(6);
        expect(m.c2.x).toBe(7);
        expect(m.c2.y).toBe(8);
        expect(m.c2.z).toBe(9);
    });
    test("create identity matrix", () => {
        const m = mat3.identity();
        expect(mat3.eq(m, mat3.fromDiagonal(vec3(1, 1, 1)))).toBe(true);
        expect(vec3.eq(mat3.diagonal(m), vec3(1, 1, 1))).toBe(true);
    });
    test("create matrix from rotation", () => {
        const m1x = mat3.fromAxisAngle(vec3.right(), deg(180.0));
        const m2x = mat3.fromRotationX(deg(180.0))

        expect(mat3.eq(m1x, m2x)).toBe(true);
        expect(mat3.eq(m1x, mat3.fromDiagonal(vec3(1, -1, -1)))).toBe(true);

        const m1y = mat3.fromAxisAngle(vec3.up(), deg(180.0));
        const m2y = mat3.fromRotationY(deg(180.0))
        expect(mat3.eq(m1y, m2y)).toBe(true);

        const m1z = mat3.fromAxisAngle(vec3.forward(), deg(180.0));
        const m2z = mat3.fromRotationZ(deg(180.0))
        expect(mat3.eq(m1z, m2z)).toBe(true);
    });
    test("transform 2d", () => {
        let m = mat3.fromTranslation(vec2(2, 4));
        expect(vec2.eq(vec2.zero(), mat3.transformVec2(m, vec2.zero()))).toBe(true);
        expect(vec2.eq(vec2(2.0, 4.0), mat3.transformPoint2(m, vec2.zero()))).toBe(true);
        expect(vec2.eq(vec2.zero(), mat3.transformPoint2(m, vec2(-2.0, -4.0)))).toBe(true);

        m = mat3.fromAngle(deg(90.0));
        expect(vec2.eq(vec2.up(), mat3.transformVec2(m, vec2.right()))).toBe(true);
        expect(vec2.eq(vec2.up(), mat3.transformPoint2(m, vec2.right()))).toBe(true);

        m = mat3.fromScaleAngleTranslation(
            vec2(0.5, 1.5),
            deg(90.0),
            vec2(1.0, 2.0),
        );

        let result = mat3.transformVec2(m, vec2.up());
        expect(vec2.eq(result, vec2(-1.5, 0.0))).toBe(true);
        expect(vec2.eq(result, mat3.mulVec3(m, vec3.up()))).toBe(true);

        result = mat3.transformPoint2(m, vec2.up());
        expect(vec2.eq(result, vec2(-0.5, 2.0))).toBe(true);
        expect(vec2.eq(result, mat3.mulVec3(m, vec3(0, 1, 1)))).toBe(true)
    });
    test("add two matrices", () => {
        const m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        const m2 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        const m3 = mat3.add(m1, m2);
        expect(mat3.eq(m3, mat3(2, 4, 6, 8, 10, 12, 14, 16, 18))).toBe(true);
    });
    test("subtract two matrices", () => {
        const m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        const m2 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        const m3 = mat3.sub(m1, m2);
        expect(mat3.eq(m3, mat3(0, 0, 0, 0, 0, 0, 0, 0, 0))).toBe(true);
    });
    test("multiply two matrices", () => {
        const m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        const m2 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        const m3 = mat3.mul(m1, m2);
        expect(mat3.eq(m3, mat3(30, 36, 42, 66, 81, 96, 102, 126, 150))).toBe(true);
    });
    test("multiply matrix by scalar", () => {
        const m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        const m2 = mat3.scalar(m1, 2);
        expect(mat3.eq(m2, mat3(2, 4, 6, 8, 10, 12, 14, 16, 18))).toBe(true);
    });
    test("multiply matrix by vector", () => {
        const m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        const v1 = vec3(1, 2, 3);
        const v2 = mat3.mulVec3(m1, v1);
        expect(vec3.eq(v2, vec3(30, 36, 42))).toBe(true);
    });
    test("get column of matrix", () => {
        const m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        const v1 = mat3.col(m1, 0);
        expect(vec3.eq(v1, vec3(1, 2, 3))).toBe(true);
    });
    test("get column out of bounds", () => {
        const m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        expect(() => mat3.col(m1, 3)).toThrow();
    });
    test("get row of matrix", () => {
        const m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        const v1 = mat3.row(m1, 2);
        expect(vec3.eq(v1, vec3(3, 6, 9))).toBe(true);
    });
    test("get row out of bounds", () => {
        const m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        expect(() => mat3.row(m1, 3)).toThrow();
    });
    test("compute transpose of matrix", () => {
        const m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        const m2 = mat3(1, 4, 7, 2, 5, 8, 3, 6, 9);
        expect(mat3.eq(mat3.transpose(m1), m2)).toBe(true);
    });
    test("compute determinant of matrix", () => {
        const m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        expect(mat3.det(m1)).toBe(0);
        expect(mat3.det(mat3.zero())).toBe(0);
        expect(mat3.det(mat3.identity())).toBe(1);
        expect(mat3.det(mat3.fromRotationX(deg(90)))).toBe(1);
    });
    test("compute inverse of matrix", () => {
        const m1 = mat3(-5, 3, -2, 3, -1, 1, 6, -7, 2);
        const m2 = mat3(1, 1.6, 0.2, 0, 0.4, -0.2, -3, -3.4, -0.8);
        expect(mat3.eq(mat3.inv(m1), m2)).toBe(true);
    });
    test("compute inverse of a matrix A where |A| = 0", () => {
        const m1 = mat3(0, 0, 0, 0, 0, 0, 0, 0, 0);
        expect(() => mat3.inv(m1)).toThrow();
    });
});