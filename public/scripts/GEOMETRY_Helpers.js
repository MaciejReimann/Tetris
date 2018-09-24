

const sqr = n => Math.pow(n, 2);

const merge = obj1 => obj2 => Object.assign({}, obj1, obj2);

const addCoords = point1 => point2 => merge({})({
  x: point1.x + point2.x,
  y: point1.y + point2.y
})

const addCoordsToArrayOfPoints = array => point => array.map(
  p => addCoords(point)(p)
)

const moveCoordsXY = point => dim => merge({})({
  x: point.x + dim,
  y: point.y + dim
})

const multiplyCoords = point => mult => merge({})({
  x: point.x * mult,
  y: point.y * mult
})

const flip = point => x => y => merge({})({
  x: point.x + 2 * (x-point.x),
  y: point.y + 2 * (y-point.y)
})

const translateToPolar = vertex => angle => merge({}) ({
  r: Math.sqrt( sqr(vertex.x) + sqr(vertex.y) ),
  angle: (Math.atan2(vertex.y, vertex.x) * (180 / Math.PI)) + angle
})

const translateToCartesian = vertex => merge({}) ({
  x: vertex.r * Math.cos( (vertex.angle) * (Math.PI / 180) ),
  y: vertex.r * Math.sin( (vertex.angle) * (Math.PI / 180) )
})

// Returns vertices' cartesian local coordinates
const regularPolygon = angle => center => sides => dim => Array(sides).fill()
  .map((_, i) => addCoords(
    translateToCartesian(merge({})({
      r: dim / Math.sqrt(2) ,
      angle: 360 / sides * i + angle
    }))
  )(center)
)
