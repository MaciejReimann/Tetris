export const sqr = n => Math.pow(n, 2);

export const merge = obj1 => obj2 => Object.assign({}, obj1, obj2);

export const arePoints = array =>
  array.every(point => point.hasOwnProperty("x") && point.hasOwnProperty("y"));

export const addPoints = p1 => p2 =>
  arePoints([p1, p2])
    ? merge({})({
        x: p1.x + p2.x,
        y: p1.y + p2.y
      })
    : null;

export const arePointsEqual = p1 => p2 => p1.x === p2.x && p1.y === p2.y;

export const translateToPolar = vertex => angle =>
  merge({})({
    r: Math.sqrt(sqr(vertex.x) + sqr(vertex.y)),
    angle: Math.atan2(vertex.y, vertex.x) * (180 / Math.PI) + angle
  });

export const translateToCartesian = vertex =>
  merge({})({
    x: Math.round(vertex.r * Math.cos(vertex.angle * (Math.PI / 180))),
    y: Math.round(vertex.r * Math.sin(vertex.angle * (Math.PI / 180)))
  });
