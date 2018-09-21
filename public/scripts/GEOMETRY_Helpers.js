

const sqr = n => Math.pow(n, 2);

const merge = obj1 => obj2 => Object.assign({}, obj1, obj2);

const addCoords = point1 => point2 => merge({})({
  x: point1.x + point2.x,
  y: point1.y + point2.y
})

const diffCoords = point1 => point2 => merge({})({
  x: point1.x - point2.x,
  y: point1.y - point2.y
})

const multiplyCoords = point => mult => merge({})({
  x: point.x * mult,
  y: point.y * mult
})

const reflectX = point => merge({})({
  x: point.x,
  y: point.y * (-1)
})

const reflectY = point => merge({})({
  x: point.x * (-1),
  y: point.y
})

const reflectXY = point => merge({})({
  x: point.x * (-1),
  y: point.y * (-1)
})

const translateToPolar = vertex => angle => merge({}) ({
  r: Math.sqrt( sqr(vertex.x) + sqr(vertex.y) ),
  angle: (Math.atan2(vertex.y, vertex.x) * (180 / Math.PI)) + angle
})

const translateToCartesian = vertex => merge({}) ({
  x: vertex.r * Math.cos( (vertex.angle) * (Math.PI / 180) ),
  y: vertex.r * Math.sin( (vertex.angle) * (Math.PI / 180) )
})
