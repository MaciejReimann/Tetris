
const { createStore } = Redux;

// ACTIPON TYPES
const START = 'START';
const PAUSE = 'PAUSE';
const MOVE = 'MOVE';
const ROTATE = 'ROTATE';


const gameReducer = (state = initialState, action) => {
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
      return {
        ... state,
        direction: action.direction
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







// gameboard setup

// tetris transformations
// const getCartesianSquareVertices = center => pixel => [].concat(
//   {
//     x: center.x - (pixel / 2),
//     y: center.y - (pixel / 2)
//   },
//   {
//     x: center.x + (pixel / 2),
//     y: center.y - (pixel / 2)
//   },
//   {
//     x: center.x + (pixel / 2),
//     y: center.y + (pixel / 2)
//   },
//   {
//     x: center.x - (pixel / 2),
//     y: center.y + (pixel / 2)
//   },
// );
// const firstOne = getCartesianSquareVertices(state.pivot)(state.pixel)
//
// const getPolarVertices = center => pixel => vertices => angle => vertices
//   .map(vertex => translateToPolar(diffCoords(center)(vertex)) (angle))
//
// const getCartesianVertices = center => pixel => vertices => vertices
//   .map(vertex => addCoords (translateToCartesian(vertex) ) (center) )
//
// const moveTetris = tetris => direction => tetris.map(
//   center => addCoords(center)(direction)
// )
//
//
//
// // const translateSquareVerticesToPolar = center => pixel => angle => {
// //   return getCartesianSquareVertices(center)(pixel)
// //     .map(vertex => translateToPolar(diffCoords(center)(vertex)) (angle) )
// //     .map(vertex => translateToCartesian(
// //       addCoords(center) ( multiplyCoords(vertex)(pixel) )
// //     ))
// // }
//
//
// const SHAPE_POLAR = getPolarVertices(state.pivot)(state.pixel)(firstOne)(0)
// const SHAPE_CARTESIAN = getCartesianVertices(state.pivot)(state.pixel)(SHAPE_POLAR)
//
// console.log(
// addCoords(state.pivot)(state.pivot)
// )
//
//
//
//
// const nextPivot = state => addCoords(state.pivot)(state.move)
// const nextVertices = state => tetris => tetris.map(vertex => addCoords(state.pivot)(vertex))
//
// const polarTetris = tetris => tetris.map( center => translateToPolar(center))
// const cartesianTetris = tetris => tetris.map( center => translateToCartesian(center))
//
// const movedTetris = nextVertices(state)(currentTetris)
//
// const polar = polarTetris(currentTetris)
//
// const backToCart = cartesianTetris(polar)
//
// const tetrisInPolar = tetris => angle => tetris.map(center => translateToPolar(center))
