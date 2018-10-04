import {
  scalePoints,
  rotatePoints,
  movePoints,
  getPointsInLine
} from "../helpers/pointsArrays";
import { arePointsEqual } from "../helpers/pointsManipulation";
import { getSquareVertices } from "../helpers/regularPolygon";

export const getSquareCenters = tetris => pivot => angle => scale =>
  movePoints(rotatePoints(scalePoints(tetris)(scale))(angle))(pivot);

export const getTetrisVertices = tetris => pivot => angle => scale =>
  rotatePoints(scalePoints(tetris)(scale))(angle).map(center =>
    movePoints(getSquareVertices(angle)(center)(scale))(pivot)
  );

export const isColliding = squares => tetris => pivot => angle => scale =>
  getSquareCenters(tetris)(pivot)(angle)(scale).some(tetrisCenter =>
    squares.some(squareCenter => arePointsEqual(tetrisCenter)(squareCenter))
  );

export const getRows = width => height => squareCenters =>
  getPointsInLine(squareCenters)("y")(height);
