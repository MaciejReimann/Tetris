import {
  getSquareCenters,
  getTetrisVertices,
  isColliding
} from "../../logic/tetrisCreation";
import { getRandomTetris } from "../../logic/tetrisDefinition";

// getSquareCenters
test("The same tetris when angle 0 and scale 1", () => {
  const tetris = getRandomTetris();
  const point = { x: 0, y: 0 };
  expect(getSquareCenters(tetris)(point)(0)(1)).toEqual(tetris);
});

test("The same points when angle 0 and scale 1", () => {
  const tetris = getRandomTetris();
  const point = { x: 0, y: 0 };
  const scale = 1;
  expect(
    getSquareCenters(tetris)(point)(0)(scale).every(
      (point, i) => point.x === tetris[i].x && point.y === tetris[i].y
    )
  ).toBeTruthy();
});

test("Points moved by 2 when angle 0, pivot (2,2) and scale 1", () => {
  const tetris = getRandomTetris();
  const point = { x: 2, y: 2 };
  const scale = 1;
  expect(
    getSquareCenters(tetris)(point)(0)(scale).every(
      (point, i) => point.x === tetris[i].x + 2 && point.y === tetris[i].y + 2
    )
  ).toBeTruthy();
});

test("Points scaled by 10 when angle 0, and scale 10", () => {
  const tetris = getRandomTetris();
  const point = { x: 0, y: 0 };
  const scale = 10;
  expect(
    getSquareCenters(tetris)(point)(0)(scale).every(
      (point, i) => point.x === tetris[i].x * 10 && point.y === tetris[i].y * 10
    )
  ).toBeTruthy();
});

// getTetrisVertices

test("Truthy when the same tetris are checked for collision", () => {
  const tetris_1 = getRandomTetris();
  const tetris_2 = getRandomTetris();
  const pivot = { x: 0, y: 0 };
  const angle = 0;
  const scale = 1;
  expect(isColliding(tetris_1)(tetris_1)(pivot)(angle)(scale)).toBeTruthy();
});

test("Falsy when teris pivot moved by 10", () => {
  const tetris_1 = getRandomTetris();
  const tetris_2 = getRandomTetris();
  const pivot = { x: 10, y: 10 };
  const angle = 0;
  const scale = 1;
  expect(isColliding(tetris_1)(tetris_1)(pivot)(angle)(scale)).toBeFalsy();
});
