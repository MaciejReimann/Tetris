import { MOVE } from "../actions/types";
import {
  merge,
  addPoints,
  multiplyPoint,
  arePointsWithinRange
} from "../helpers/pointsManipulation";
import { X, Y, DIRECTIONS } from "../logic/directionConstants";
import { initialState } from "../logic/initialState";
import { getSquareCenters, getTetrisVertices } from "../logic/tetrisCreation";

export default function(state = initialState, action) {
  const { counter, board, pixel, angle, tetris } = state;
  const startPoint = { x: board.x / 2, y: -10 };
  let collides = () => false;

  // get where square centers are in relation to pivot
  const nextCenters = pivot => getSquareCenters(tetris)(pivot)(angle)(pixel);
  // define conditions in which pivot moves
  const canMoveOnX = pivot =>
    arePointsWithinRange(nextCenters(pivot))(X)(0)(board.x) && !collides();
  const canMoveOnY = pivot =>
    arePointsWithinRange(nextCenters(pivot))(Y)(-10)(board.y) && !collides();

  const isGameOver = canMoveOnY(startPoint) ? false : true;

  switch (action.type) {
    case MOVE:
      const scaledMove = multiplyPoint(DIRECTIONS[action.payload])(pixel);
      const movedPivot =
        state.pivot && !isGameOver
          ? addPoints(state.pivot)(scaledMove)
          : addPoints(startPoint)(scaledMove);

      const nextPivot = canMoveOnY(movedPivot)
        ? canMoveOnX(movedPivot)
          ? movedPivot
          : state.pivot
        : startPoint;

      const nextVertices = getTetrisVertices(tetris)(nextPivot)(angle)(pixel);
      const nextCounter = counter + 1;
      // console.log(nextCenters);

      let nextState = {
        pivot: nextPivot,
        vertices: nextVertices,
        counter: nextCounter,

        isOver: isGameOver
      };
      // console.log(nextState);
      return merge(state)(nextState);
    default:
      return state;
  }
}
