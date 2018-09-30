

export const merge = obj1 => obj2 => Object.assign({}, obj1, obj2);

export const addCoords = point1 => point2 => merge()({
  x: point1.x + point2.x,
  y: point1.y + point2.y
})

export const arePointsEqual = p1 => p2 => p1.x === p2.x && p1.y === p2.y;
