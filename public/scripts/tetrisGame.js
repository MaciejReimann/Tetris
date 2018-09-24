
const { createStore } = Redux;

const gameReducer = (state = initialState, action) => {
  const { pixel, pivot, centers, vertices, angle, direction } = state.tetris;
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
    console.log(`Moved ${action.direction}`)

    // const nextVertices = rotateGlobalPoints(angle)
    //   (centers)(pivot)(pixel)(direction)
    const nextVertices = drawTetris(angle)(centers)(pivot)(pixel)(direction)
    console.log(
    )
      return {
        ... state,
        direction: action.direction,
        tetris: {
          ...state.tetris,
          vertices: nextVertices
        }
      }
    case ROTATE:
    console.log(`Rotated ${action.direction}`)
      return {
        ... state,
        direction: action.direction
      }
    default:
      return state
  }
}

const store = createStore(gameReducer)


// GAME LOGIC

const squareVertices = angle => center => dim => regularPolygon
  (angle + 45)(center)(4)(dim)

const drawTetris = angle => centers => pivot => pixel => direction => centers
  .map(point => multiplyCoords(point)(pixel)) // scale square centers; pivot(0,0)
  .map(point => translateToPolar(point)(angle)) // rotates them if angle != 0; pivot(0,0)
  .map(point => translateToCartesian(point)) // returns cartesian coords; pivot(0,0)
  .map(point => squareVertices(angle)
    (addCoords(pivot)(point)) // returns 4 arrays of vertices; pivot(0,0)
    (pixel))
