import {
  multiplyPoint,
  translateToPolar,
  translateToCartesian,
  rotateOnGlobalZero
} from "../helpers/pointsManipulation";

// scale distance from tetris square centers to the pivot
export const scalePoints = arrayOfPoints => scale =>
  arrayOfPoints.map(p => multiplyPoint(p)(scale));

// rotates as if pivot were on global zero
export const rotatePoints = arrayOfPoints => angle =>
  arrayOfPoints.map(p => rotateOnGlobalZero(p)(angle));
