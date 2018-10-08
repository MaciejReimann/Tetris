import {
  addPoints,
  multiplyPoint,
  // translateToPolar,
  // translateToCartesian,
  rotateOnGlobalZero
} from "../helpers/pointsManipulation";

// scale distance from tetris square centers to the pivot
export const scalePoints = arrayOfPoints => scale =>
  arrayOfPoints.map(p => multiplyPoint(p)(scale));

// rotates as if pivot were on global zero
export const rotatePoints = arrayOfPoints => angle =>
  arrayOfPoints.map(p => rotateOnGlobalZero(p)(angle));

// move from global zero to where the pivot is
export const movePoints = arrayOfPoints => move =>
  arrayOfPoints.map(p => addPoints(p)(move));

// move from global zero to where the pivot is
export const getPointsInLine = arrayOfPoints => axis => value =>
  arrayOfPoints.filter(p => p[axis] === value);

export const sortPoints = arrayOfPoints =>
  arrayOfPoints.sort((a, b) => a.x - b.x).sort((a, b) => a.y - b.y);

export const findHeightOfMatrix = arrayOfPoints => res =>
  Math.floor(
    sortPoints(arrayOfPoints).slice(-1)[0].y -
      sortPoints(arrayOfPoints)[0].y +
      1 / res
  );

export const sortPointsinMatrix = arrayOfPoints => res =>
  Array(findHeightOfMatrix(arrayOfPoints)(res))
    .fill()
    .map((_, i) =>
      arrayOfPoints.filter(p => p.y > p.y / res && p.y <= p.y / (2 * res))
    );
