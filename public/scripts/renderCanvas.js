


const MAIN = document.querySelector('main');
const currentGame = store.getState;
const LARGE_CANVAS = appendTo(createCanvasWithClass('canvas'))(MAIN);
resize(LARGE_CANVAS)(currentGame().board.width)(currentGame().board.height)

const renderCanvas = (state) => {
  const vertices = state.tetris.vertices
  const largeCtx = LARGE_CANVAS.getContext('2d');
  const tetris = currentGame().tetris.vertices;

  vertices.map( v => drawSquare(largeCtx)( v ).fill() )
  console.log(state.tetris)
  // drawSquare(largeCtx)( vertices ).fill()
  console.log('CANVAS RENDERED')
}
