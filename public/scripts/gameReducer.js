
const { createStore } = Redux;

const game = (state = initialState, action) => {
  const { board, pixel, angle, direction, tetris, vertices, squares, isOver } = state;
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
      const nextAngle = DIRECTIONS[action.direction].angle + angle;
      console.log(nextAngle)
      const direction = DIRECTIONS[action.direction];

      const move = multiplyCoords(direction)(pixel);
      const startPoint = merge({})({ x: board.x / 2, y: 0})

      //get square centers after that move
      const nextCenters = pivot => getGlobalSquareCenters(
        move)(nextAngle)(tetris)(pivot)(pixel);


      const tetrisCanMoveOnX = pivot => isWithinRange(
        nextCenters(pivot))(X)(0)(board.x) && !collides();
      const tetrisCanMoveOnY = pivot => isWithinRange(
        nextCenters(pivot))(Y)(-pixel)(board.y) && !collides();

console.log(tetrisCanMoveOnY(startPoint))

      let nextTetris = state.pivot
        ? tetrisCanMoveOnY(state.pivot)
          ? tetris
          : getRandomArrayItem(allTetris)
        : tetris

      let nextPivot = tetrisCanMoveOnY(startPoint)
        ? state.pivot // if it isn't the very first move
          ? tetrisCanMoveOnY(state.pivot) // if it hasn't hit the bottom
            ? tetrisCanMoveOnX(state.pivot) // then check if hits the border
              ? addCoords(state.pivot)(move) // if not, move it
              : state.pivot // then don't move it
            : startPoint // if not, go back to start
          : addCoords(startPoint)(move) // or move it from start
        : gameOver() // if it can't move down from start, the game is over

      const nextVertices = drawTetris(nextAngle)(nextTetris)(nextPivot)(pixel);

      return {
        ... state,
        angle: 90,
        pivot: nextPivot,
        tetris: nextTetris,
        vertices: nextVertices,
        squaresDown: []
      }
    default:
      return state
  }
}

const store = createStore(game);
