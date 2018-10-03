import { MOVE } from "../actions/types";
import {
  merge,
  addPoints,
  multiplyPoint,
  arePointsWithinRange
} from "../helpers/pointsManipulation";
import { X, Y, DIRECTIONS } from "../logic/directionConstants";
import { initialState } from "../logic/initialState";
import {
  getSquareCenters,
  getTetrisVertices
} from "../logic/tetrisManipulation";

export default function(state = initialState, action) {
  const { board, pixel, angle, tetris } = state;
  let isGameOver: false;
  let collides = () => true;

  switch (action.type) {
    case MOVE:
      const scaledMove = multiplyPoint(DIRECTIONS[action.payload])(pixel);
      const startPoint = { x: board.x / 2, y: 10 };

      // get where square centers are in relation to pivot
      const nextCenters = pivot =>
        getSquareCenters(tetris)(pivot)(angle)(pixel);
      // define conditions in which pivot moves
      const canMoveOnY = pivot =>
        arePointsWithinRange(nextCenters(pivot))(Y)(0)(board.y) && !collides();

      const nextPivot = state.pivot
        ? addPoints(state.pivot)(scaledMove)
        : startPoint;

      const nextVertices = getTetrisVertices(tetris)(nextPivot)(angle)(pixel);

      // console.log(nextCenters);

      let nextState = {
        pivot: nextPivot,
        vertices: nextVertices,

        isOver: isGameOver
      };

      return merge(state)(nextState);
    default:
      return state;
  }
}
