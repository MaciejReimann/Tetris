
// DIRECTIONS
const RIGHT = { x: 1, y: 0, angle: 0};
const DOWN = { x: 0, y: 1, angle: 0};
const LEFT = { x:-1, y: 0, angle: 0};
const ROTATE_RIGHT = { x: 0, y: 0, angle: 90};
const ROTATE_LEFT = { x: 0, y: 0, angle: -90};

const DIRECTIONS = { RIGHT, DOWN, LEFT, ROTATE_RIGHT, ROTATE_LEFT }
const X = "x";
const Y = "y";
const AXES = { X, Y }

// ACTION TYPES
const START = 'START';
const PAUSE = 'PAUSE';
const MOVE = 'MOVE';
// const ROTATE = 'ROTATE';

const initialState = {
  board: { x: 200, y: 500 },
  pixel: 10,
  angle: 0,
  tetris: allTetris[0],
  vertices: [],
  squares: []
}
