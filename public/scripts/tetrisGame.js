
const { createStore } = Redux;

const gameReducer = (state = initialState, action) => {
  const { board, pixel, angle, direction, pivot, tetris, vertices, squares } = state;
  switch (action.type) {
    case START:
    console.log(`Game ${action.type}`)
      return {
        ... state,
        isStarted: true
      }
    case PAUSE:
      console.log(`Game ${action.type}`)
        return {
          ... state,
          isPaused: !state.isPaused
        }
    case MOVE:
      const nextDirection = DIRECTIONS[action.direction]
      const move = multiplyCoords(nextDirection)(pixel);
      const centers = globalCenters(angle)(tetris)(pivot)(pixel)
      const vertices = drawTetris(angle)(tetris)(pivot)(pixel);
      const nextVertices = vertices.map(square => addCoordsToArrayOfPoints(square)(move));
      const nextPivot = addCoords(pivot)(move);

      const tetrisCanMove = canMove(centers)(move)(Y)(board)

      console.log( tetrisCanMove
      )
      return {
        ... state,
        angle: 0,
        direction: nextDirection,
        pivot: nextPivot,
        tetris: tetris,
        vertices: nextVertices,
        squaresDown: []
      }
    case ROTATE:
    console.log(`Rotated ${action.direction}`)
      return {
        ... state,
        direction: []
      }
    default:
      return state
  }
}

const store = createStore(gameReducer)


// GAME LOGIC

const squareVertices = angle => center => dim => regularPolygon
  (angle + 45)(center)(4)(dim)

const globalCenters = angle => tetris => pivot => pixel => tetris
  .map(point => multiplyCoords(point)(pixel)) // scale square centers; pivot(0,0)
  .map(point => translateToPolar(point)(angle)) // rotates them if angle != 0; pivot(0,0)
  .map(point => translateToCartesian(point)) // returns cartesian coords; pivot(0,0)
  .map(point => addCoords(pivot)(point)) // returns an array of 4 centers;

const drawTetris = angle => tetris => pivot => pixel => tetris
  .map(point => multiplyCoords(point)(pixel)) // scale square centers; pivot(0,0)
  .map(point => translateToPolar(point)(angle)) // rotates them if angle != 0; pivot(0,0)
  .map(point => translateToCartesian(point)) // returns cartesian coords; pivot(0,0)
  .map(point => squareVertices(angle)
    (addCoords(pivot)(point)) // returns 4 arrays of vertices;
    (pixel))

const canMove = points => move => axis => maximum => points.some(
  point => point[axis] + point[axis] < maximum[axis]
)
