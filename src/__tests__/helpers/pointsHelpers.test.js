import {
  merge,
  arePoints,
  addPoints,
  arePointsEqual,
  translateToPolar,
  translateToCartesian
} from "../../helpers/pointsHelpers.js";

// merge
test("When objects have different properties, adds the properties", () => {
  expect(merge({ x: 0, y: 0 })({ z: "string" })).toEqual({
    x: 0,
    y: 0,
    z: "string"
  });
});
test("When objects have same properties, updates the values", () => {
  expect(merge({ x: 1, y: 1 })({ x: 2, y: 2 })).toEqual({ x: 2, y: 2 });
});
test("When second object is empty, leaves the first one", () => {
  expect(merge({ x: 1, y: 1 })({})).toEqual({ x: 1, y: 1 });
});
test("When first object is empty, leaves the second one", () => {
  expect(merge({})({ x: 1, y: 1 })).toEqual({ x: 1, y: 1 });
});

// arePoints
test("All are points", () => {
  expect(arePoints([{ x: 1, y: 1 }, { x: 2, y: 2 }])).toBeTruthy();
  expect(
    arePoints([{ x: 1, y: 1, someStuff: true }, { x: 2, y: 2 }])
  ).toBeTruthy();
  expect(arePoints([{ x: 1, y: 1 }, { x: 5 }])).toBeFalsy();
  expect(arePoints([{ x: 1, y: 1 }, {}])).toBeFalsy();
});

// addPoints
test("Adds two points, when both are points", () => {
  expect(addPoints({ x: -1, y: -1 })({ x: 1, y: 1 })).toEqual({ x: 0, y: 0 });
  expect(addPoints({ x: 1, y: 1 })({ x: 0.5, y: 0.5 })).toEqual({
    x: 1.5,
    y: 1.5
  });
});
test("Returns null when at least one is not a point", () => {
  expect(addPoints({ x: 1, y: 1 })({})).toBeNull();
});
test("Ignores non coord-related properties", () => {
  expect(
    addPoints({ x: -1, y: -1, someStuff: true })({ x: 1, y: 1, otherStuff: 0 })
  ).toEqual({
    x: 0,
    y: 0
  });
});

// arePointsEqual
it("Checks if two points are equal", () => {
  expect(arePointsEqual({ x: -1, y: -1 })({ x: 1, y: 1 })).toBeFalsy();
  expect(arePointsEqual({ x: 0, y: 0 })({})).toBeFalsy();
  expect(arePointsEqual({ x: 1, y: 1 })({ x: 1, y: 1 })).toBeTruthy();
  expect(arePointsEqual({ x: 1, y: 1 })({ x: 1, y: 1, z: 0 })).toBeTruthy();
});

// translateToPolar
test("Returns a point on (1.4142135623730951, 45)", () => {
  expect(translateToPolar({ x: 1, y: 1 })(0)).toEqual({
    r: 1.4142135623730951,
    angle: 45
  });
});

test("Returns a point on (1.4142135623730951, 135)", () => {
  expect(translateToPolar({ x: 1, y: 1 })(90)).toEqual({
    r: 1.4142135623730951,
    angle: 135
  });
});

test("Returns a point on (1, 0)", () => {
  expect(translateToPolar({ x: 1, y: 0 })(0)).toEqual({
    r: 1,
    angle: 0
  });
});

// translateToCartesian
test("Returns a point on (0,0)", () => {
  expect(translateToCartesian({ r: 0, angle: 0 })).toEqual({ x: 0, y: 0 });
});

test("Returns a point on (1,1)", () => {
  expect(translateToCartesian({ r: 1.4142135623730951, angle: 45 })).toEqual({
    x: 1,
    y: 1
  });
});

test("Returns a point on (2,-2)", () => {
  expect(translateToCartesian({ r: 2.82842712475, angle: -45 })).toEqual({
    x: 2,
    y: -2
  });
});

test("Returns a point on (0,-2)", () => {
  expect(translateToCartesian({ r: 2, angle: -90 })).toEqual({ x: 0, y: -2 });
});
