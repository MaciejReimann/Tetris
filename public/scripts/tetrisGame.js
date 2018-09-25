
const { createStore } = Redux;

const gameReducer = (state = initialState, action) => {
  const { board, pixel, angle, direction, tetris, vertices, squares } = state;
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
      const direction = DIRECTIONS[action.direction];
      const move = multiplyCoords(direction)(pixel);
      const startPivot = merge({})({x: board.x / 2, y: 10});
      startPivot.x = staysHalfwayOnX(tetris)(pixel) ? (startPivot.x + pixel / 2) : startPivot.x;
      startPivot.y = staysHalfwayOnY(tetris)(pixel) ? (startPivot.y + pixel / 2) : startPivot.y;

      const centers = p => globalCenters(angle)(tetris)(p)(pixel);
      const willNotHitVerticalBorder = p => willNotHitBorder(centers(p))(move)(X)(board);
      const willNotHitHorizontalBorder = p => willNotHitBorder(centers(p))(move)(Y)(board);
      const tetrisWillNotHitBorders = p => willNotHitVerticalBorder(p) && willNotHitHorizontalBorder(p);

      let nextPivot;
      // checks if runs for the very first time
      ! state.pivot ? (nextPivot = startPivot) :
      // checks if does not hit borders
          (tetrisWillNotHitBorders(state.pivot)
        ? (nextPivot = addCoords(state.pivot)(move))
        : (nextPivot = state.pivot))





      // checks if can move


      // const tetrisWillCollide = willCollide(centers)(move)(squares)
      const nextTetris = getRandomArrayItem(allTetris);


      const nextVertices = drawTetris(angle)(tetris)(nextPivot)(pixel);



      console.log( startPivot
      )
      return {
        ... state,
        angle: 0,
        pivot: nextPivot,
        tetris: willNotHitVerticalBorder ? tetris : nextTetris,
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

const willNotHitBorder = points => move => axis => maximum => points.every(
  point => point[axis] + move[axis] < maximum[axis] &&
           point[axis] + move[axis] > 0
)

const staysHalfwayOnX = points => pixel => points.some(
  point => mod(pixel)(point.x) === 0
)
const staysHalfwayOnY = points => pixel => points.some(
  point => mod(pixel)(point.y) === 0
)

const willCollide = points => move => otherPoints => points.some(
  point => otherPoints.some(
    p => ! pointsAreEqual (addCoords(point)(move)) (p)
  )
)
