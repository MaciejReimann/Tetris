import { getRandomTetris } from "./tetrisDefinition";

export const initialState = {
  board: { x: 200, y: 500 },
  pixel: 10,
  angle: 0,
  tetris: getRandomTetris(),
  vertices: [],
  squares: [],
  score: 0
};
