import { expect, suite, test } from "vitest";
import { vec2 } from "../mod";
import { mat2 } from './mat2';

suite("mat2", () => {
    test("create a new matrix", () => {
        let m = mat2(1, 2, 3, 4);
        expect(m.c0.x).toBe(1);
        expect(m.c0.y).toBe(2);
        expect(m.c1.x).toBe(3);
        expect(m.c1.y).toBe(4);
    });
    test("create a matrix from typed array", () => {
        let m = mat2.fromArray(new Float32Array([1, 2, 3, 4]));
        expect(m.c0.x).toBe(1);
        expect(m.c0.y).toBe(2);
        expect(m.c1.x).toBe(3);
        expect(m.c1.y).toBe(4);
    });
    test("create identity matrix", () => {
        let m = mat2();
        expect(mat2.eq(m, mat2.fromDiagonal(vec2(1, 1)))).toBe(true);
        expect(vec2.eq(m.toDiagonal(), vec2(1, 1))).toBe(true);
    });
    test("format a matrix to a string", () => {
        let m = mat2(1, 2, 3, 4);
        expect(m.toString()).toBe("((1, 2),(3, 4))");
    });
    test("check nan, infinitiy", () => {
        let m = mat2(1, 2, 3, 4);
        expect(m.isNan()).toBe(false);
        expect(m.isFinite()).toBe(true);
    });
    test("add two matrices", () => {
        let m1 = mat2(1, 2, 3, 2);
        let m2 = mat2(1, 2, 3, 2);
        m1.add(m2);
        expect(m1.eq(mat2(2, 4, 6, 4))).toBe(true);
    });
    test("subtract two matrices", () => {
        let m1 = mat2(1, 2, 3, 2);
        let m2 = mat2(1, 2, 3, 2);
        let m3 = m1.sub(m2);
        expect(mat2.eq(m3, mat2(0, 0, 0, 0))).toBe(true);
    });
    test("multiply two matrices", () => {
        let m1 = mat2(1, 3, 2, 2);
        let m2 = mat2(4, 6, 5, 5);
        let m3 = m1.mul(m2);
        expect(mat2.eq(m3, mat2(16, 24, 15, 25))).toBe(true);
    });
    test("multiply a matrix by a vector", () => {
        let m = mat2(5, 2, 9, 7);
        let v = vec2(6, 5);
        let v2 = m.vmul2(v);
        expect(v2.x).toBe(75);
        expect(v2.y).toBe(47);
    });
    test("multiply a matrix by a scale", () => {
        let m = mat2(1, 2, 3, 2);
        let m2 = m.scale(3);
        expect(mat2.eq(m2, mat2(3, 6, 9, 6))).toBe(true);
    });
    test("get column of a matrix", () => {
        let m = mat2(1, 2, 3, 2);
        let v = m.col(0);
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
    });
    test("get row out of range", () => {
        let m = mat2(1, 2, 3, 2);
        expect(() => m.col(3)).toThrow();
    });
    test("get row of a matrix", () => {
        let m = mat2(1, 2, 3, 2);
        let v = m.row(1);
        expect(v.x).toBe(2);
        expect(v.y).toBe(2);
    });
    test("get row out of range", () => {
        let m = mat2(1, 2, 3, 2);
        expect(() => m.row(2)).toThrow();
    });
    test("compute transpose of a matrix", () => {
        let m = mat2(1, 2, 3, 4);
        let m2 = m.transpose();
        expect(mat2.eq(m2, mat2(1, 3, 2, 4))).toBe(true);
    });
    test("compute determinant of a matrix", () => {
        let m = mat2(1, 2, 3, 4);
        expect(m.det()).toBe(-2);
        expect(mat2.det(mat2.zero())).toBe(0);
        expect(mat2.det(mat2())).toBe(1);
    });
    test("compute inverse of a matrix", () => {
        let m = mat2(1, 2, 3, 4);
        let m2 = m.inv();
        expect(mat2.eq(m2, mat2(-2, 1, 3 / 2, -1 / 2))).toBe(true);
    });
    test("compute inverse of a matrix A where |A| = 0", () => {
        let m = mat2(1, 3, 2, 6);
        expect(() => m.inv()).toThrow();
    });
});