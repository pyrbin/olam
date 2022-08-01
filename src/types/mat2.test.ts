import { expect, suite, test } from "vitest";
import { vec2 } from "../mod";
import { mat2 } from './mat2';

suite("mat2", () => {
    test("create a new matrix", () => {
        const m = mat2(1, 2, 3, 4);
        expect(m.c0.x).toBe(1);
        expect(m.c0.y).toBe(2);
        expect(m.c1.x).toBe(3);
        expect(m.c1.y).toBe(4);
    });
    test("create a matrix from typed array", () => {
        const m = mat2.fromArray(new Float32Array([1, 2, 3, 4]));
        expect(m.c0.x).toBe(1);
        expect(m.c0.y).toBe(2);
        expect(m.c1.x).toBe(3);
        expect(m.c1.y).toBe(4);
    });
    test("create identity matrix", () => {
        const m = mat2.identity();
        expect(mat2.eq(m, mat2.fromDiagonal(vec2(1, 1)))).toBe(true);
        expect(vec2.eq(mat2.toDiagonal(m), vec2(1, 1))).toBe(true);
    });
    test("add two matrices", () => {
        const m1 = mat2(1, 2, 3, 2);
        const m2 = mat2(1, 2, 3, 2);
        const m3 = mat2.add(m1, m2);
        expect(mat2.eq(m3, mat2(2, 4, 6, 4))).toBe(true);
    });
    test("subtract two matrices", () => {
        const m1 = mat2(1, 2, 3, 2);
        const m2 = mat2(1, 2, 3, 2);
        const m3 = mat2.sub(m1, m2);
        expect(mat2.eq(m3, mat2(0, 0, 0, 0))).toBe(true);
    });
    test("multiply two matrices", () => {
        const m1 = mat2(1, 3, 2, 2);
        const m2 = mat2(4, 6, 5, 5);
        const m3 = mat2.mul(m1, m2);
        expect(mat2.eq(m3, mat2(16, 24, 15, 25))).toBe(true);
    });
    test("multiply a matrix by a vector", () => {
        const m = mat2(5, 2, 9, 7);
        const v = vec2(6, 5);
        const v2 = mat2.vmul2(m, v);
        expect(v2.x).toBe(75);
        expect(v2.y).toBe(47);
    });
    test("multiply a matrix by a scale", () => {
        const m = mat2(1, 2, 3, 2);
        const m2 = mat2.scale(m, 3);
        expect(mat2.eq(m2, mat2(3, 6, 9, 6))).toBe(true);
    });
    test("get column of a matrix", () => {
        const m = mat2(1, 2, 3, 2);
        const v = mat2.col(m, 0);
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
    });
    test("get row out of range", () => {
        const m = mat2(1, 2, 3, 2);
        expect(() => mat2.col(m, 3)).toThrow();
    });
    test("get row of a matrix", () => {
        const m = mat2(1, 2, 3, 2);
        const v = mat2.row(m, 1);
        expect(v.x).toBe(2);
        expect(v.y).toBe(2);
    });
    test("get row out of range", () => {
        const m = mat2(1, 2, 3, 2);
        expect(() => mat2.row(m, 2)).toThrow();
    });
    test("compute determinant of a matrix", () => {
        const m = mat2(1, 2, 3, 4);
        const m2 = mat2.transpose(m);
        expect(mat2.eq(m2, mat2(1, 3, 2, 4))).toBe(true);
    });
    test("compute determinant of a matrix", () => {
        const m = mat2(1, 2, 3, 4);
        expect(mat2.det(m)).toBe(-2);
        expect(mat2.det(mat2.zero())).toBe(0);
        expect(mat2.det(mat2.identity())).toBe(1);
    });
    test("compute inverse of a matrix", () => {
        const m = mat2(1, 2, 3, 4);
        const m2 = mat2.inv(m);
        expect(mat2.eq(m2, mat2(-2, 1, 3 / 2, -1 / 2))).toBe(true);
    });
    test("compute inverse of a matrix A where |A| = 0", () => {
        const m = mat2(1, 3, 2, 6);
        expect(() => mat2.inv(m)).toThrow();
    });
});