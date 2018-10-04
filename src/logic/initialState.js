import { getRandomTetris } from "./tetrisDefinition";

export const initialState = {
  counter: 0,
  board: { x: 200, y: 400 },
  pixel: 10,
  angle: 0,
  tetris: getRandomTetris(),
  vertices: [],
  squareCenters: [],
  squareVertices: [],
  score: 0
};
