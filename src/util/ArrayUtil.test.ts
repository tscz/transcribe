import ArrayUtil from "./ArrayUtil";

it("retrieves the last element in an array", () => {
  const given = ["first", "second", "third", "last"];

  expect(ArrayUtil.last(given)).toBe("last");
});

it("retrieves the borders of an array", () => {
  const given = ["8", "9", "10", "11"];
  const { start, end } = ArrayUtil.bordersOf(given);

  expect(start).toBe(8);
  expect(end).toBe(11);
});

it("creates a range array", () => {
  const result = ArrayUtil.range(0, 3);
  expect(result).toStrictEqual(["0", "1", "2", "3"]);
});

it("creates an one element range array", () => {
  const result = ArrayUtil.range(1, 0);
  expect(result).toStrictEqual(["0"]);
});
