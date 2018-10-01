import { arePoints } from "../../helpers/pointsHelpers";
import {
  T_tetris,
  I_tetris,
  C_tetris,
  allTetris,
  getRandomTetris
} from "../../logic/tetrisDefinition";

// allTetris
test("Returns truthy if length 4", () => {
  expect(allTetris.every(tetris => tetris.length === 4)).toBeTruthy();
});

test("Returns truthy if all are points", () => {
  expect(allTetris.every(arePoints)).toBeTruthy();
});

// getRandomTetris
test("Returns truthy if get all types are present", () => {
  let arrayOfTetrisStringified = Array(100).fill(
    getRandomTetris(allTetris).toString()
  );
  expect(arrayOfTetrisStringified).toContain(T_tetris.toString());
  expect(arrayOfTetrisStringified).toContain(I_tetris.toString());
  expect(arrayOfTetrisStringified).toContain(C_tetris.toString());
});
