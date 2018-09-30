

const gameOver = () => console.log('game over')

// const findStartPivot = tetris => pixel => merge({})({
//   x: (mod(1)(tetris[0].x) === 0) ? pixel / 2 : 0,
//   y: (mod(1)(tetris[0].y) === 0) ? pixel / 2 : 0
// })
//
// const correctPivot = pivot => tetris => pixel => addCoords(
//   pivot)( findStartPivot(tetris)(pixel) )

const isWithinRange = points => axis => minimum => maximum =>
  points.every(
    point => point[axis] < maximum &&
             point[axis] > minimum
)
const collides = () => false
const willCollide = points => move => otherPoints => points.some(
  point => otherPoints.some(
    p => ! pointsAreEqual (addCoords(point)(move)) (p)
  )
)

const getGlobalSquareCenters = move => angle => tetris => pivot => pixel =>
    // scale square centers; pivot(0,0)
  tetris.map(point => multiplyCoords(point)(pixel))
    // add current angle; pivot(0,0)
    .map(point => translateToPolar(point)(angle))
    // returns cartesian coords; pivot(0,0)
    .map(point => translateToCartesian(point))
    // returns an array of global 4 centers before move;
    .map(point => addCoords(pivot)(point))
    // returns an array of global 4 centers after move;
    .map(point => addCoords(move)(point))

const squareVertices = angle => center => dim => regularPolygon
      (angle + 45)(center)(4)(dim)


const drawTetris = angle => tetris => pivot => pixel => tetris
  .map(point => multiplyCoords(point)(pixel)) // scale square centers; pivot(0,0)
  .map(point => translateToPolar(point)(angle)) // rotates them if angle != 0; pivot(0,0)
  .map(point => translateToCartesian(point)) // returns cartesian coords; pivot(0,0)
  .map(point => squareVertices(angle)
    (addCoords(pivot)(point)) // returns 4 arrays of vertices;
    (pixel))
