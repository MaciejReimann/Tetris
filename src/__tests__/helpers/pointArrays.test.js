import { scalePoints, rotatePoints } from "../../helpers/pointArrays";
import { getRandomTetris } from "../../logic/tetrisDefinition";

test("Returns truthy", () => {});

// scaleSquareCenters
test("Returns truthy when scaled up and down again", () => {
  let tetris = getRandomTetris();
  let scaledUp = scalePoints(getRandomTetris())(10);
  expect(
    scalePoints(tetris)(0.1).toString() === tetris.toString()
  ).toBeTruthy();
});

test("Returns all zeros when scaled with 0 ", () => {
  let zeros = scalePoints(getRandomTetris())(0);
  expect(zeros.every(p => p.x === 0 && p.y === 0)).toBeTruthy();
});

// rotateOnGlobalZero
test("Returns truthy when rotated by zero angle", () => {
  let tetris = getRandomTetris();
  let rotated = rotatePoints(tetris)(0);
  expect(rotated.toString() === tetris.toString()).toBeTruthy();
});

test("Returns truthy when rotated by 360 angle", () => {
  let tetris = getRandomTetris();
  let rotated = rotatePoints(tetris)(360);
  expect(rotated.toString() === tetris.toString()).toBeTruthy();
});

// test("Returns falsy when rotated by an angle", () => {
//   let tetris = getRandomTetris();
//   let rotated = rotatePoints(tetris)("78");
//   console.log(rotated.toString() === tetris.toString());
//   expect(rotated.toString() === tetris.toString()).toBeFalsy();
// });
