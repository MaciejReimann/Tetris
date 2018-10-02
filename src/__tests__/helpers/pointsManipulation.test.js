import {
  merge,
  arePoints,
  addPoints,
  multiplyPoint,
  arePointsEqual,
  arePointsWithinRange,
  roundValue,
  translateToPolar,
  translateToCartesian,
  rotateOnGlobalZero
} from "../../helpers/pointsManipulation.js";

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

// multiplyPoint
test("When multiplied by 0 returns (0,0)", () => {
  expect(multiplyPoint({ x: 1, y: 1 })(0)).toEqual({ x: 0, y: 0 });
});

test("When multiplied by 1 returns itself", () => {
  expect(multiplyPoint({ x: 1, y: 1 })(1)).toEqual({ x: 1, y: 1 });
});

test("When multiplied by -1 returns symmetrical point to global zero", () => {
  expect(multiplyPoint({ x: 0.5, y: -1 })(-1)).toEqual({ x: -0.5, y: 1 });
});

// arePointsEqual
test("Checks if two points are equal", () => {
  expect(arePointsEqual({ x: -1, y: -1 })({ x: 1, y: 1 })).toBeFalsy();
  expect(arePointsEqual({ x: 0, y: 0 })({})).toBeFalsy();
  expect(arePointsEqual({ x: 1, y: 1 })({ x: 1, y: 1 })).toBeTruthy();
  expect(arePointsEqual({ x: 1, y: 1 })({ x: 1, y: 1, z: 0 })).toBeTruthy();
});

// arePointsWithinRange
test("Returns falsy", () => {
  let arrayOfPoints = [{ x: -1, y: -1 }, { x: 1, y: 1 }, { x: 0.5, y: -1 }];
  expect(arePointsWithinRange(arrayOfPoints)("x")(0)(1)).toBeFalsy();
});
test("Returns falsy", () => {
  let arrayOfPoints = [{ x: -1, y: -1 }, { x: 1, y: 1 }, { x: 0.5, y: -1 }];
  expect(arePointsWithinRange(arrayOfPoints)("y")(0)(1)).toBeFalsy();
});
test("Returns truthy", () => {
  let arrayOfPoints = [{ x: -1, y: -1 }, { x: 1, y: 1 }, { x: 0.5, y: -1 }];
  expect(arePointsWithinRange(arrayOfPoints)("x")(-5)(5)).toBeTruthy();
});
test("Returns falsy", () => {
  let arrayOfPoints = [{ x: -1, y: -1 }, { x: 1, y: 1 }, { x: 0.5, y: -1 }];
  expect(arePointsWithinRange(arrayOfPoints)("y")(-5)(0)).toBeFalsy();
});

// roundValue
test("Returns truthy", () => {
  let n = -1.092837092309489324;
  expect(roundValue(n)).not.toBe(n);
});

test("Returns truthy", () => {
  let n = -1.092837092309489324;
  let m = -1.93824983409209375832498237;
  expect(roundValue(n)).toBe(-1.093);
  expect(roundValue(m)).toBe(-1.938);
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

// rotateOnGlobalZero
test("Returns the same point when rotated by zero angle", () => {
  let point = { x: 1, y: 1 };
  expect(rotateOnGlobalZero(point)(0)).toEqual(point);
});

test("Returns the same point when rotated by 360 angle", () => {
  let point = { x: 1, y: 1 };
  expect(rotateOnGlobalZero(point)(360)).toEqual(point);
});

test("Returns a flipped by (0,0) point when rotated by 180 angle", () => {
  let point = { x: 1, y: 1 };
  expect(rotateOnGlobalZero(point)(180)).toEqual({ x: -1, y: -1 });
});

test("Returns a fliped by y axis point when rotated by 90 angle", () => {
  let point = { x: 1, y: 1 };
  expect(rotateOnGlobalZero(point)(90)).toEqual({ x: -1, y: 1 });
});

test("Returns a fliped by x axis point when rotated by -90 angle", () => {
  let point = { x: 1, y: 1 };
  expect(rotateOnGlobalZero(point)(-90)).toEqual({ x: 1, y: -1 });
});

test("Points are not equal wwhen rotated by 30 angle", () => {
  let point = { x: 1, y: 1 };
  expect(rotateOnGlobalZero(point)(30)).not.toEqual(point);
});
