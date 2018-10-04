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
