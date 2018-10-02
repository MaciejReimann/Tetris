import {
  regularPolygon,
  getSquareVertices
} from "../../helpers/regularPolygon.js";

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

// getSquareVertices
test("Gets a 2 by 2 square vertices, center in (0,0)", () => {
  let center = { x: 0, y: 0 };
  expect(getSquareVertices(0)(center)(2)).toEqual([
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 }
  ]);
});

test("Gets a sgrt2 by sgrt2 at 45deg angle square vertices, center in (0,0)", () => {
  let center = { x: 0, y: 0 };
  expect(getSquareVertices(45)(center)(Math.sqrt(2))).toEqual([
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: 1, y: 0 }
  ]);
});

test("Gets a 4 by 4 square vertices, center in (0,0)", () => {
  let center = { x: 2, y: 0 };
  expect(getSquareVertices(0)(center)(4)).toEqual([
    { x: 4, y: 2 },
    { x: 0, y: 2 },
    { x: 0, y: -2 },
    { x: 4, y: -2 }
  ]);
});
