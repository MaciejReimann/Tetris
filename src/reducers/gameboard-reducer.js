import { MOVE, ROTATE } from "../actions/types";
import {
  merge,
  addPoints,
  multiplyPoint,
  arePointsWithinRange
} from "../helpers/pointsManipulation";
import { X, Y, DIRECTIONS } from "../logic/directionConstants";
import { initialState } from "../logic/initialState";
import { getSquareCenters, getTetrisVertices } from "../logic/tetrisCreation";
import { getRandomTetris } from "../logic/tetrisDefinition";

export default function(state = initialState, action) {
  const { counter, board, pixel, angle, tetris } = state;
  const startPoint = { x: board.x / 2, y: -10 };
  let collides = () => false;

  // get where square centers are in relation to pivot
  const nextCenters = pivot => a => getSquareCenters(tetris)(pivot)(a)(pixel);
  // define conditions in which pivot moves
  const canMoveOnX = pivot => a =>
    arePointsWithinRange(nextCenters(pivot)(a))(X)(0)(board.x) && !collides();
  const canMoveOnY = pivot => a =>
    arePointsWithinRange(nextCenters(pivot)(a))(Y)(-20)(board.y) && !collides();

  const isGameOver = canMoveOnY(startPoint) ? false : true;

  switch (action.type) {
    case MOVE:
      const scaledMove = DIRECTIONS[action.payload].angle // if rotated
        ? { x: 0, y: 0 } // don't move
        : multiplyPoint(DIRECTIONS[action.payload])(pixel); // else move by pixel

      const turnedAngle = DIRECTIONS[action.payload].angle // if rotated
        ? DIRECTIONS[action.payload].angle + angle // update the angle
        : angle; // else return unchanged angle

      const movedPivot =
        state.pivot && !isGameOver
          ? addPoints(state.pivot)(scaledMove) // move from last position
          : addPoints(startPoint)(scaledMove); // move from the start

      const nextAngle = canMoveOnY(movedPivot)(turnedAngle) // if stays on gameboard after rotation
        ? canMoveOnX(movedPivot)(turnedAngle) // if stays on gameboard after rotation
          ? turnedAngle // can rotate
          : angle // else leave previous angle
        : angle; // else leave previous angle

      const nextPivot = canMoveOnY(movedPivot)(nextAngle) // if stays on gameboard
        ? canMoveOnX(movedPivot)(nextAngle) // after move
          ? movedPivot // move it
          : state.pivot // else don't
        : startPoint; // if can't be dropped down, start again from the top

      const nextTetris = state.pivot
        ? canMoveOnY(movedPivot)(nextAngle) // if can be dropped down
          ? tetris
          : getRandomTetris() // if not, give another tetris
        : tetris;

      const nextVertices = getTetrisVertices(nextTetris)(nextPivot)(nextAngle)(
        pixel
      ); // get vertices to pass down to the canvas

      const nextCounter = counter + 1;

      let nextState = {
        isOver: isGameOver,
        pivot: nextPivot,
        angle: nextAngle,
        tetris: nextTetris,
        vertices: nextVertices,
        counter: nextCounter
      };

      return merge(state)(nextState);
    default:
      return state;
  }
}
