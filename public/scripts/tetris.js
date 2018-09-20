

const currentTetris = allTetris[0]

const UP = { x: 0, y:-1 };
const RIGHT = { x: 1, y: 0 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x:-1, y: 0 };

const state = {
  width: 200,
  height: 500,
  pixel: 10,
  pivot: function(){ return merge({}) ({x: this.width / 2, y: this.pixel}) },
  angle: 0,
  centers: currentTetris,
  move: DOWN
}

// gameboard setup

const getCartesianSquareVertices = center => pixel => [].concat(
  {
    x: center.x - (pixel / 2),
    y: center.y - (pixel / 2)
  },
  {
    x: center.x + (pixel / 2),
    y: center.y - (pixel / 2)
  },
  {
    x: center.x + (pixel / 2),
    y: center.y + (pixel / 2)
  },
  {
    x: center.x - (pixel / 2),
    y: center.y + (pixel / 2)
  },
)



const firstOne = getCartesianSquareVertices(state.pivot)(state.pixel)

const tranlateSquareVerticesToPolar = center => pixel => angle => {
  return getCartesianSquareVertices(center)(pixel)
    .map(vertex => translateToPolar(vertex)(angle))
    .map(vertex => translateToCartesian(vertex))
}


const SHAPE = tranlateSquareVerticesToPolar(state.pivot())(state.pixel)(0)

console.log(

)




const nextPivot = state => addCoords(state.pivot)(state.move)
const nextVertices = state => tetris => tetris.map(vertex => addCoords(state.pivot)(vertex))

const polarTetris = tetris => tetris.map( center => translateToPolar(center))
const cartesianTetris = tetris => tetris.map( center => translateToCartesian(center))

const movedTetris = nextVertices(state)(currentTetris)

const polar = polarTetris(currentTetris)

const backToCart = cartesianTetris(polar)

const tetrisInPolar = tetris => angle => tetris.map(center => translateToPolar(center))
