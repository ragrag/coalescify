import coalescify from "../src/index";
import { describe, test, expect } from "bun:test";

describe("coalescify", () => {
  test("should return the result of the original function", async () => {
    const fn = async (x: number) => {
      return new Promise<number>((resolve) =>
        setTimeout(() => resolve(x * 2), 150)
      );
    };

    const coalescedFn = coalescify(fn);

    const result = await coalescedFn(5);
    expect(result).toBe(10);
  });

  test("should cache promise for the same arguments", async () => {
    let callCount = 0;
    const fn = async (...args: any) => {
      callCount++;
      return new Promise<number>((resolve) =>
        setTimeout(() => resolve(args[0] * 2), 150)
      );
    };

    const coalescedFn = coalescify(fn);

    const res = await Promise.all([
      coalescedFn(5, {}, []),
      coalescedFn(5, {}, []),
      coalescedFn(5, {}, []),
      coalescedFn(5, {}, []),
      coalescedFn(5, {}, []),
    ]);

    for (const r of res) {
      expect(r).toBe(10);
    }

    expect(callCount).toBe(1);
  });

  test("should have repeated calls if no parallel calls are done", async () => {
    let callCount = 0;
    const fn = async (...args: any) => {
      callCount++;
      return new Promise<number>((resolve) =>
        setTimeout(() => resolve(args[0] * 2), 150)
      );
    };

    const coalescedFn = coalescify(fn);

    const res1 = await coalescedFn(5, {}, []);
    const res2 = await coalescedFn(5, {}, []);
    const res3 = await coalescedFn(5, {}, []);

    for (const r of [res1, res2, res3]) {
      expect(r).toBe(10);
    }

    expect(callCount).toBe(3);
  });

  test("should have repeated calls if different args passed", async () => {
    let callCount = 0;
    const fn = async (...args: any) => {
      callCount++;
      return new Promise<number>((resolve) =>
        setTimeout(() => resolve(args[0] * 2), 150)
      );
    };

    const coalescedFn = coalescify(fn);

    const res = await Promise.all([
      coalescedFn(5, {}, []),
      coalescedFn(5, {}),
      coalescedFn(5),
    ]);

    for (const r of res) {
      expect(r).toBe(10);
    }

    expect(callCount).toBe(3);
  });
});
