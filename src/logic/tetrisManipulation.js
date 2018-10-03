import { getRandomTetris } from "./tetrisDefinition";

import { scalePoints, rotatePoints, movePoints } from "../helpers/pointsArrays";
import { getSquareVertices } from "../helpers/regularPolygon";

const tetris = getRandomTetris();

export const getSquareCenters = tetris => pivot => angle => scale =>
  movePoints(rotatePoints(scalePoints(tetris)(scale))(angle))(pivot);

export const getTetrisVertices = tetris => pivot => angle => scale =>
  rotatePoints(scalePoints(tetris)(scale))(angle).map(center =>
    movePoints(getSquareVertices(angle)(center)(scale))(pivot)
  );
