
// DIRECTIONS
const RIGHT = { x: 1, y: 0 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x:-1, y: 0 };

// ACTION TYPES
const START = 'START';
const PAUSE = 'PAUSE';
const MOVE = 'MOVE';
const ROTATE = 'ROTATE';

const initialState = {
  board: {
    width: 200,
    height: 500,
  },
  tetris: {
    pixel: 10,
    pivot: { x: 100, y: 20 },
    centers: allTetris[0],
    vertices: [],
    angle: 80,
    direction: DOWN
  },
}
