export const merge = obj1 => obj2 => Object.assign({}, obj1, obj2);

export const arePoints = array =>
  array.every(point => point.hasOwnProperty("x") && point.hasOwnProperty("y"));

export const addPoints = point1 => point2 =>
  arePoints([point1, point2])
    ? merge({})({
        x: point1.x + point2.x,
        y: point1.y + point2.y
      })
    : null;

export const multiplyPoint = point => mult =>
  arePoints([point]) && !isNaN(mult)
    ? merge({})({
        x: point.x * mult,
        y: point.y * mult
      })
    : null;

export const arePointsEqual = point1 => point2 =>
  point1.x === point2.x && point1.y === point2.y;

export const arePointsWithinRange = arrayOfPoints => axis => minimum => maximum =>
  arePoints(arrayOfPoints) &&
  (axis === "x" || axis === "y") &&
  !isNaN(minimum) &&
  !isNaN(maximum) &&
  arrayOfPoints.every(
    point => point[axis] >= minimum && point[axis] <= maximum
  );

export const roundValue = n => Math.round(n * 1000) / 1000;

export const translateToPolar = point => angle =>
  merge({})({
    r: Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2)),
    angle: Math.atan2(point.y, point.x) * (180 / Math.PI) + angle
  });

export const translateToCartesian = point =>
  merge({})({
    x: roundValue(point.r * Math.cos(point.angle * (Math.PI / 180))),
    y: roundValue(point.r * Math.sin(point.angle * (Math.PI / 180)))
  });

export const rotateOnGlobalZero = point => angle =>
  translateToCartesian(translateToPolar(point)(angle));
