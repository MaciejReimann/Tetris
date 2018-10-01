import { regularPolygon } from "../../helpers/regularPolygon.js";

test("A point on x axis on 1", () => {
  expect(regularPolygon(0)({ x: 0, y: 0 })(1)(1)).toEqual([{ x: 1, y: 0 }]);
});

test("A line on x axis from -1 to 1", () => {
  expect(regularPolygon(0)({ x: 0, y: 0 })(2)(1)).toEqual([
    { x: 1, y: 0 },
    { x: -1, y: 0 }
  ]);
});

test("A line on y axis from -1 to 1", () => {
  expect(regularPolygon(90)({ x: 0, y: 0 })(2)(1)).toEqual([
    { x: 0, y: 1 },
    { x: 0, y: -1 }
  ]);
});

test("A square parallell to x and y axes, side length of 2", () => {
  expect(regularPolygon(45)({ x: 0, y: 0 })(4)(1.41421356237)).toEqual([
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 }
  ]);
});

test("A square 45deg to x and y axes, side length of 2 * sqrt(2)", () => {
  expect(regularPolygon(0)({ x: 0, y: 0 })(4)(1)).toEqual([
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 }
  ]);
});
