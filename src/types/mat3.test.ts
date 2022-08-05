import { expect, suite, test } from "vitest";
import { deg } from "../math";
import { mat3 } from "./mat3";
import { vec2 } from "./vec2";
import { vec3 } from "./vec3";

suite("mat3", () => {
    test("create a new matrix", () => {
        let m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
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
        let m = mat3.fromArray(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8, 9]));
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
        let m = mat3.identity();
        expect(m.eq(mat3.fromDiagonal(vec3(1, 1, 1)))).toBe(true);
        expect(vec3.eq(mat3.toDiagonal(m), vec3(1, 1, 1))).toBe(true);
    });
    test("create matrix from rotation", () => {
        let m1x = mat3.fromAxisAngle(vec3.right(), deg(180.0));
        let m2x = mat3.fromRotationX(deg(180.0))
        expect(m1x.eq(m2x)).toBe(true);
        expect(m1x.eq(mat3.fromDiagonal(vec3(1, -1, -1)))).toBe(true);
        let m1y = mat3.fromAxisAngle(vec3.up(), deg(180.0));
        let m2y = mat3.fromRotationY(deg(180.0))
        expect(mat3.eq(m1y, m2y)).toBe(true);
        let m1z = mat3.fromAxisAngle(vec3.forward(), deg(180.0));
        let m2z = mat3.fromRotationZ(deg(180.0))
        expect(mat3.eq(m1z, m2z)).toBe(true);
    });
    test("transform 2d", () => {
        let m = mat3.fromTranslation(vec2(2, 4));
        expect(vec2.eq(vec2.zero(), m.transformVec2(vec2.zero()))).toBe(true);
        expect(vec2.eq(vec2(2.0, 4.0), m.transformPoint2(vec2.zero()))).toBe(true);
        expect(vec2.eq(vec2.zero(), m.transformPoint2(vec2(-2.0, -4.0)))).toBe(true);

        m = mat3.fromAngle(deg(90.0));
        expect(vec2.eq(vec2.up(), m.transformVec2(vec2.right()))).toBe(true);
        expect(vec2.eq(vec2.up(), m.transformPoint2(vec2.right()))).toBe(true);

        m = mat3.fromScaleAngleTranslation(
            vec2(0.5, 1.5),
            deg(90.0),
            vec2(1.0, 2.0),
        );

        let result = m.transformVec2(vec2.up());
        expect(vec2.eq(result, vec2(-1.5, 0.0))).toBe(true);
        expect(vec2.eq(result, m.vmul3(vec3.up()))).toBe(true);

        result = mat3.transformPoint2(m, vec2.up());
        expect(vec2.eq(result, vec2(-0.5, 2.0))).toBe(true);
        expect(vec2.eq(result, m.vmul3(vec3(0, 1, 1)))).toBe(true)
    });
    test("add two matrices", () => {
        let m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        let m2 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        let m3 = m1.add(m2);
        expect(mat3.eq(m3, mat3(2, 4, 6, 8, 10, 12, 14, 16, 18))).toBe(true);
    });
    test("subtract two matrices", () => {
        let m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        let m2 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        let m3 = m1.sub(m2);
        expect(mat3.eq(m3, mat3(0, 0, 0, 0, 0, 0, 0, 0, 0))).toBe(true);
    });
    test("multiply two matrices", () => {
        let m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        let m2 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        let m3 = m1.mul(m2);
        expect(m3.eq(mat3(30, 36, 42, 66, 81, 96, 102, 126, 150))).toBe(true);
    });
    test("multiply matrix by scale", () => {
        let m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        let m2 = m1.scale(2);
        expect(mat3.eq(m2, mat3(2, 4, 6, 8, 10, 12, 14, 16, 18))).toBe(true);
    });
    test("multiply matrix by vector", () => {
        let m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        let v1 = vec3(1, 2, 3);
        let v2 = m1.vmul3(v1);
        expect(vec3.eq(v2, vec3(30, 36, 42))).toBe(true);
    });
    test("get column of matrix", () => {
        let m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        let v1 = m1.col(0);
        expect(vec3.eq(v1, vec3(1, 2, 3))).toBe(true);
    });
    test("get column out of bounds", () => {
        let m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        expect(() => m1.col(3)).toThrow();
    });
    test("get row of matrix", () => {
        let m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        let v1 = m1.row(2);
        expect(vec3.eq(v1, vec3(3, 6, 9))).toBe(true);
    });
    test("get row out of bounds", () => {
        let m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        expect(() => m1.row(3)).toThrow();
    });
    test("compute transpose of matrix", () => {
        let m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        let m2 = mat3(1, 4, 7, 2, 5, 8, 3, 6, 9);
        expect(mat3.eq(m1.transpose(), m2)).toBe(true);
    });
    test("compute determinant of matrix", () => {
        let m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        expect(m1.det()).toBe(0);
        expect(mat3.det(mat3.zero())).toBe(0);
        expect(mat3.det(mat3.identity())).toBe(1);
        expect(mat3.det(mat3.fromRotationX(deg(90)))).toBe(1);
    });
    test("compute inverse of matrix", () => {
        let m1 = mat3(-5, 3, -2, 3, -1, 1, 6, -7, 2);
        let m2 = mat3(1, 1.6, 0.2, 0, 0.4, -0.2, -3, -3.4, -0.8);
        expect(mat3.eq(m1.inv(), m2)).toBe(true);
    });
    test("compute inverse of a matrix A where |A| = 0", () => {
        let m1 = mat3(0, 0, 0, 0, 0, 0, 0, 0, 0);
        expect(() => m1.inv()).toThrow();
    });
});