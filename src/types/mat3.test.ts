import { expect, suite, test } from "vitest";
import { mat3 } from './mat3';
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
        expect(mat3.eq(mat3.tm(m1), m2)).toBe(true);
    });
    test("compute determinant of matrix", () => {
        const m1 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
        expect(mat3.det(m1)).toBe(0);
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