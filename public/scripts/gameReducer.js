
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
    console.log(action.direction)
      const direction = DIRECTIONS[action.direction];
      //scales the move according to predefined pixelsize, "one";
      const move = multiplyCoords(direction)(pixel);
      const startPoint = merge({})({ x: board.x / 2, y: 0})
      //moves the pivot from startPoint if necessary, i.e. if misses the grid
      const startPivot = tetris => addCoords(
        findStartPivot(tetris)(pixel))(startPoint)
      //get square centers after that move
      const nextCenters = pivot => getGlobalSquareCenters(
        move)(angle)(tetris)(pivot)(pixel);

      const tetrisCanMoveOnX = pivot => isWithinRange(
        nextCenters(pivot))(X)(0)(board.x) && !collides();
      const tetrisCanMoveOnY = pivot => isWithinRange(
        nextCenters(pivot))(Y)(-pixel)(board.y) && !collides();
      const tetrisCanMove = pivot => tetrisCanMoveOnX(pivot)
        && tetrisCanMoveOnY(pivot);

      let nextTetris = state.pivot
        ? tetrisCanMoveOnY(state.pivot)
          ? tetris
          : getRandomArrayItem(allTetris)
        : tetris

      let nextPivot = tetrisCanMoveOnY(startPivot(tetris))
        ? state.pivot // if it isn't the very first move
          ? tetrisCanMoveOnY(state.pivot) // if it hasn't hit the bottom
            ? tetrisCanMoveOnX(state.pivot) // then check if hits the border
              ? addCoords(state.pivot)(move) // if not, move it
              : state.pivot // then don't move it
            : startPivot(nextTetris) // if not, go back to start
          : addCoords(startPivot(tetris))(move) // or move it from start
        : gameOver() // if it can't move down from start, the game is over

      const nextVertices = drawTetris(angle)(nextTetris)(nextPivot)(pixel);

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

const store = createStore(game);
