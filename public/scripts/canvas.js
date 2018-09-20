
const currentGame = state;
const MAIN = document.querySelector('main');
const LARGE_CANVAS = appendTo(createCanvasWithClass('canvas'))(MAIN);
const largeCtx = LARGE_CANVAS.getContext('2d');
resize(LARGE_CANVAS)(currentGame.width)(currentGame.height)
const unit = currentGame.pixel;



drawSquare(largeCtx)( SHAPE ).fill()
