import {
  scalePoints,
  rotatePoints,
  movePoints,
  getPointsInLine,
  sortPoints,
  findHeightOfMatrix,
  sortPointsinMatrix
} from "../../helpers/pointsArrays";
import { getRandomTetris } from "../../logic/tetrisDefinition";

// scaleSquareCenters
test("Returns array of the same points when scaled up and down again", () => {
  let tetris = getRandomTetris();
  let scaledUp = scalePoints(tetris)(10);
  let scaledDown = scalePoints(scaledUp)(0.1);
  expect(
    scaledDown.every((p, i) => p.x === tetris[i].x && p.y === tetris[i].y)
  ).toBeTruthy();
});

test("Returns array of the same points when scaled with 1", () => {
  let tetris = getRandomTetris();
  let scaledWithOne = scalePoints(tetris)(1);
  expect(
    scaledWithOne.every((p, i) => p.x === tetris[i].x && p.y === tetris[i].y)
  ).toBeTruthy();
});

test("Returns all zeros when scaled with 0 ", () => {
  let zeros = scalePoints(getRandomTetris())(0);
  expect(zeros.every(p => p.x === 0 && p.y === 0)).toBeTruthy();
});

// rotateOnGlobalZero
test("Returns array of the same points when rotated by zero angle", () => {
  let tetris = getRandomTetris();
  let rotated = rotatePoints(tetris)(0);
  expect(
    rotated.every((p, i) => p.x === tetris[i].x && p.y === tetris[i].y)
  ).toBeTruthy();
});

test("Returns array of the same points when rotated by 360 angle", () => {
  let tetris = getRandomTetris();
  let rotated = rotatePoints(tetris)(360);
  expect(
    rotated.every((p, i) => p.x === tetris[i].x && p.y === tetris[i].y)
  ).toBeTruthy();
});

test("Returns array of different points when rotated by 30 angle", () => {
  let tetris = getRandomTetris();
  let rotated = rotatePoints(tetris)(30);
  expect(
    rotated.every((p, i) => p.x !== tetris[i].x && p.y !== tetris[i].y)
  ).toBeTruthy();
});

// movePoints
test("Returns array of the same points when moved by 0", () => {
  let tetris = getRandomTetris();
  let moved = movePoints(tetris)({ x: 0, y: 0 });
  expect(
    moved.every((p, i) => p.x === tetris[i].x && p.y === tetris[i].y)
  ).toBeTruthy();
});

test("Returns array of points + 1 when moved by 1", () => {
  let tetris = getRandomTetris();
  let moved = movePoints(tetris)({ x: 1, y: 1 });
  expect(
    moved.every((p, i) => p.x === tetris[i].x + 1 && p.y === tetris[i].y + 1)
  ).toBeTruthy();
});

test("Returns array of points -2 when moved by -2", () => {
  let tetris = getRandomTetris();
  let moved = movePoints(tetris)({ x: -2, y: -2 });
  expect(
    moved.every((p, i) => p.x === tetris[i].x - 2 && p.y === tetris[i].y - 2)
  ).toBeTruthy();
});

// getPointsInLine
test("Returns points specified", () => {
  const pointsIn = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 0, y: 4 }
  ];
  let value = 0;
  let axis = "y";
  let pointsOut = [{ x: 0, y: 0 }];
  expect(getPointsInLine(pointsIn)(axis)(value)).toEqual(pointsOut);
});

test("Returns points specified", () => {
  const pointsIn = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 0, y: 4 }
  ];
  let value = 0;
  let axis = "x";
  let pointsOut = [{ x: 0, y: 0 }];
  expect(getPointsInLine(pointsIn)(axis)(value)).toEqual(pointsIn);
});

test("Returns points specified", () => {
  const pointsIn = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 0, y: 4 }
  ];
  let value = 10;
  let axis = "x";
  let pointsOut = [];
  expect(getPointsInLine(pointsIn)(axis)(value)).toEqual(pointsOut);
});

//sortPoints
test("Returns truthy", () => {
  const pointsIn = [
    { x: 0, y: 4 },
    { x: 0, y: 2 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 3 }
  ];
  const pointsOut = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 0, y: 4 }
  ];
  expect(sortPoints(pointsIn)).toEqual(pointsOut);
});

//sortPoints
test("Puts { x: 2, y: 3 } before { x: 0, y: 4 }", () => {
  const pointsIn = [
    { x: 2, y: 3 },
    { x: 1, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 2 },
    { x: 0, y: 0 },
    { x: 2, y: 4 },
    { x: 0, y: 1 },
    { x: 0, y: 3 }
  ];
  const pointsOut = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 2, y: 3 },
    { x: 0, y: 4 },
    { x: 1, y: 4 },
    { x: 2, y: 4 }
  ];
  expect(sortPoints(pointsIn)).toEqual(pointsOut);
});

// findHeightOfMatrix
test("Returns 1", () => {
  const pointsIn = [{ x: 2, y: 3 }];
  expect(findHeightOfMatrix(pointsIn)(1)).toBe(1);
});

test("Returns 3", () => {
  const pointsIn = [
    { x: 2, y: 3 },
    { x: 1, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 2 }
  ];
  expect(findHeightOfMatrix(pointsIn)(1)).toBe(3);
});

test("Returns 2", () => {
  const pointsIn = [
    { x: 2, y: 3 },
    { x: 1, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 2 }
  ];
  expect(findHeightOfMatrix(pointsIn)(2)).toBe(2);
});

test("Returns 2", () => {
  const pointsIn = [
    { x: 2, y: 3 },
    { x: 1, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 2 }
  ];
  expect(findHeightOfMatrix(pointsIn)(0.5)).toBe(4);
});

test("Returns 3", () => {
  const pointsIn = [
    { x: 2, y: 3 },
    { x: 1, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 2 }
  ];
  expect(findHeightOfMatrix(pointsIn)(1)).toBe(3);
});

test("Returns 2", () => {
  const pointsIn = [
    { x: 2, y: 4 },
    { x: 1, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 4 }
  ];
  expect(findHeightOfMatrix(pointsIn)(1)).toBe(1);
});

test("Returns 4", () => {
  const pointsIn = [
    { x: 2, y: 1 },
    { x: 1, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 4 }
  ];
  expect(findHeightOfMatrix(pointsIn)(1)).toBe(4);
});
test("Returns 10", () => {
  const pointsIn = [{ x: 2, y: 1 }, { x: 1, y: 10 }];
  expect(findHeightOfMatrix(pointsIn)(1)).toBe(10);
});

// sortPointsinMatrix
test("Truthy", () => {
  const pointsIn = [
    { x: 2, y: 3 },
    { x: 1, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 2 }
  ];
  const pointsOut = [
    [{ x: 0, y: 2 }],
    [{ x: 2, y: 3 }],
    [{ x: 0, y: 4 }, { x: 1, y: 4 }]
  ];
  expect(sortPointsinMatrix(pointsIn)(0.5)).toEqual(pointsOut);
});

// test("Truthy", () => {
//   const pointsIn = [
//     { x: 2, y: 4 },
//     { x: 1, y: 4 }
//   ];
//   const pointsOut = [
//     [],
//     [{ x: 2, y: 3 }],
//     [{ x: 0, y: 4 }, { x: 1, y: 4 }, { x: 0, y: 2 }]
//   ];
//   expect(sortPointsinMatrix(pointsIn)(1)).toEqual([pointsIn]);
// });
