
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
      const firstSquare = squareVertices(angle)(tetris[0])(pixel)
      const middle = merge({})({ x: board.x / 2, y: 0})
      const startPivot = tetris => addCoords(findStartPivot(tetris)(pixel))(middle)
      // console.log(startPivot)
      // console.log(missesGrid(X)(firstSquare), missesGrid(Y)(firstSquare) )
      // if (missesGrid(X)(firstSquare)) {console.log(startPivot.x)}
      // if (missesGrid(Y)(firstSquare)) {console.log(startPivot.y)}
      //
      // if (missesGrid(X)(firstSquare)) {startPivot.x = startPivot.x + pixel / 2}
      // if (missesGrid(Y)(firstSquare)) {startPivot.y = startPivot.y + pixel / 2}
      // console.log(startPivot)
      // console.log(fitsToGridX(firstSquare))

      // startPivot.x = ! missesGrid(X)(firstSquare) ? (startPivot.x + pixel / 2) : startPivot.x;
      // startPivot.y = missesGrid(Y)(firstSquare) ? (startPivot.y + pixel / 2) : startPivot.y;

      const centers = p => globalCenters(angle)(tetris)(p)(pixel);
      const tetrisCanMoveSideways = p => willNotHitBorder(centers(p))(move)(X)(board.x)(0)
        && !collides();
      const tetrisCanMoveDown = p => willNotHitBorder(centers(p))(move)(Y)(board.y)(-pixel)
        && !collides();
      const tetrisCanMove = p => tetrisCanMoveSideways(p) && tetrisCanMoveDown(p);

      let nextPivot;
      let nextTetris = tetris;
      // if game is not over move pivot
      !tetrisCanMoveDown(startPivot(nextTetris))
       ? gameOver()
       : !state.pivot
         ? (nextPivot = addCoords(startPivot(nextTetris))(move))
         : (nextPivot = addCoords(state.pivot)(move));

      !state.pivot
        ? (nextTetris = tetris)
        : !tetrisCanMoveSideways(state.pivot)
          ? (nextPivot = state.pivot)
          : tetrisCanMoveDown(state.pivot)
            ? (nextPivot = nextPivot)
            : (
                (nextTetris = getRandomArrayItem(allTetris)) &&
                (nextPivot = startPivot(nextTetris))
              )


      const nextVertices = drawTetris(angle)(nextTetris)(nextPivot)(pixel);

      console.log(nextPivot
      )
      return {
        ... state,
        angle: 0,
        pivot: nextPivot,
        tetris: nextTetris,
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

const willNotHitBorder = points => move => axis => maximum => minimum => points.every(
  point => point[axis] + move[axis] < maximum &&
           point[axis] + move[axis] > minimum
)

const findStartPivot = tetris => pixel => merge({})({
  x: (mod(1)(tetris[0].x) === 0) ? pixel / 2 : 0,
  y: (mod(1)(tetris[0].y) === 0) ? pixel / 2 : 0
})

console.log(
  findStartPivot(T_tetris)(10),
  findStartPivot(I_tetris)(10),
  findStartPivot(C_tetris)(10)
)


const missesGrid = axis => points => points.every(
  point => (mod(1)(point[axis]) === 0)
)

const collides = () => false;

const gameOver = () => console.log('game over')

const willCollide = points => move => otherPoints => points.some(
  point => otherPoints.some(
    p => ! pointsAreEqual (addCoords(point)(move)) (p)
  )
)
