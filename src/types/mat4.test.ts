import { expect, suite, test } from "vitest";
import { mat4 } from "./mat4";

suite("mat4", () => {
  test("create a new matrix", () => {
    let m = mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
    expect(m.c0.x).toBe(1);
    expect(m.c0.y).toBe(2);
    expect(m.c0.z).toBe(3);
    expect(m.c0.w).toBe(4);
    expect(m.c1.x).toBe(5);
    expect(m.c1.y).toBe(6);
    expect(m.c1.z).toBe(7);
    expect(m.c1.w).toBe(8);
    expect(m.c2.x).toBe(9);
    expect(m.c2.y).toBe(10);
    expect(m.c2.z).toBe(11);
    expect(m.c2.w).toBe(12);
    expect(m.c3.x).toBe(13);
    expect(m.c3.y).toBe(14);
    expect(m.c3.z).toBe(15);
    expect(m.c3.w).toBe(16);
  });
  test("create identity matrix", () => {
    let m = mat4();
    expect(m.c0.x).toBe(1);
    expect(m.c0.y).toBe(0);
    expect(m.c0.z).toBe(0);
    expect(m.c0.w).toBe(0);
    expect(m.c1.x).toBe(0);
    expect(m.c1.y).toBe(1);
    expect(m.c1.z).toBe(0);
    expect(m.c1.w).toBe(0);
    expect(m.c2.x).toBe(0);
    expect(m.c2.y).toBe(0);
    expect(m.c2.z).toBe(1);
    expect(m.c2.w).toBe(0);
    expect(m.c3.x).toBe(0);
    expect(m.c3.y).toBe(0);
    expect(m.c3.z).toBe(0);
    expect(m.c3.w).toBe(1);
  });
});
