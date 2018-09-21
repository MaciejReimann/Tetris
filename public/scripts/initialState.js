

const UP = { x: 0, y:-1 };
const RIGHT = { x: 1, y: 0 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x:-1, y: 0 };

const initialState = {
  width: 200,
  height: 500,
  pixel: 10,
  pivot: { x: 100, y: 10 },
  angle: 0,
  centers: allTetris[0],
  move: DOWN
}
