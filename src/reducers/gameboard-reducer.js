import { MOVE, ROTATE } from "../actions/types";
import {
  merge,
  addPoints,
  multiplyPoint,
  arePointsWithinRange
} from "../helpers/pointsManipulation";
import { getSquareVertices } from "../helpers/regularPolygon";
import { X, Y, DIRECTIONS } from "../logic/directionConstants";
import { initialState } from "../logic/initialState";
import {
  getSquareCenters,
  getTetrisVertices,
  isColliding,
  getRows
} from "../logic/tetrisCreation";
import { getRandomTetris } from "../logic/tetrisDefinition";

export default function(state = initialState, action) {
  const {
    counter,
    board,
    pixel,
    angle,
    tetris,
    squareCenters,
    squareVertices
  } = state;
  const startPoint = { x: board.x / 2, y: -10 };
  let isMoveDown = true;

  // get where square centers are in relation to pivot
  const nextCenters = pivot => a => getSquareCenters(tetris)(pivot)(a)(pixel);

  const canMoveOnX = pivot => a => isMoveDown =>
    !isMoveDown
      ? arePointsWithinRange(nextCenters(pivot)(a))(X)(0)(board.x) &&
        !isColliding(squareCenters)(tetris)(pivot)(a)(pixel)
      : true;
  const canMoveOnY = pivot => a => isMoveDown =>
    isMoveDown
      ? arePointsWithinRange(nextCenters(pivot)(a))(Y)(-20)(board.y) &&
        !isColliding(squareCenters)(tetris)(pivot)(a)(pixel)
      : true;

  const isGameOver = canMoveOnY(startPoint) ? false : true;

  switch (action.type) {
    case MOVE:
      const scaledMove = DIRECTIONS[action.payload].angle // if rotated
        ? { x: 0, y: 0 } // don't move
        : multiplyPoint(DIRECTIONS[action.payload])(pixel); // else move by pixel

      isMoveDown = scaledMove.y !== 0;

      const turnedAngle = DIRECTIONS[action.payload].angle // if rotated
        ? DIRECTIONS[action.payload].angle + angle // update the angle
        : angle; // else return unchanged angle

      const movedPivot =
        state.pivot && !isGameOver
          ? addPoints(state.pivot)(scaledMove) // move from last position
          : addPoints(startPoint)(scaledMove); // move from the start

      const isNotOnBottom = canMoveOnY(movedPivot)(turnedAngle)(isMoveDown);

      const nextAngle = isNotOnBottom // if stays on gameboard after rotation
        ? canMoveOnX(movedPivot)(turnedAngle)(isMoveDown) // if stays on gameboard after rotation
          ? turnedAngle // can rotate
          : angle // else leave previous angle
        : angle; // else leave previous angle

      const isNotOnSide = canMoveOnX(movedPivot)(nextAngle)(isMoveDown);

      const nextPivot = isNotOnBottom // if doesn't collide moving down
        ? isNotOnSide // and doesn't collide moving aside
          ? movedPivot // move it
          : state.pivot // else don't
        : startPoint; // if can't be dropped down, start again from the top

      const nextTetris = state.pivot
        ? isNotOnBottom // if can be dropped down
          ? tetris
          : getRandomTetris() // if not, give another tetris
        : tetris;

      const nextVertices = getTetrisVertices(nextTetris)(nextPivot)(nextAngle)(
        pixel
      ); // get vertices to pass down to the canvas

      let nextSquareCenters = state.pivot
        ? isNotOnBottom
          ? squareCenters
          : squareCenters.concat(
              getSquareCenters(tetris)(state.pivot)(nextAngle)(pixel)
            )
        : squareCenters;

      const nextGameboard = Array(board.y / pixel)
        .fill()
        .map((n, index) =>
          nextSquareCenters.filter(p => (p.y - pixel / 2) / pixel === index)
        );

      const nextFullRows = nextGameboard.filter(
        row => row.length >= board.x / pixel
      );

      const nextFullRowsIndex = nextFullRows.length
        ? nextFullRows
            .map(row => (row[0].y - pixel / 2) / pixel)
            .map(index => nextGameboard.slice(index, nextGameboard.length))
        : null;

      nextSquareCenters = nextFullRowsIndex
        ? nextFullRowsIndex
            .map(i =>
              nextSquareCenters.filter(p => (p.y - pixel / 2) / pixel !== i)
            )
            .flat()
        : nextSquareCenters;

      console.log(nextSquareCenters);

      const nextSquareVertices = state.pivot
        ? nextSquareCenters.map(center =>
            getSquareVertices(nextAngle)(center)(pixel)
          )
        : [];

      const nextCounter = counter + 1;

      let nextState = {
        isOver: isGameOver,
        pivot: nextPivot,
        angle: nextAngle,
        tetris: nextTetris,
        vertices: nextVertices,
        squareCenters: nextSquareCenters,
        squareVertices: nextSquareVertices,
        counter: nextCounter
      };

      return merge(state)(nextState);
    default:
      return state;
  }
}
