


const MAIN = document.querySelector('main');
const currentGame = store.getState;
const LARGE_CANVAS = appendTo(createCanvasWithClass('canvas'))(MAIN);
resize(LARGE_CANVAS)(currentGame().board.x)(currentGame().board.y)

const renderCanvas = (state) => {
  const vertices = state.vertices;
  const largeCtx = LARGE_CANVAS.getContext('2d');
  clear(LARGE_CANVAS);
  vertices.map( v => drawSquare(largeCtx)( v ).fill() )
  // console.log(state.tetris)
  // drawSquare(largeCtx)( vertices ).fill()
  // console.log('CANVAS RENDERED')
}
