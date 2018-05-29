

const Canvas = function(config) {
  this.config = config;
  this.canvas = document.createElement('canvas');
  this.canvas.className = config.className;
  this.canvas.width = config.width;
  this.canvas.height = config.height;  
  config.parentElement.appendChild(this.canvas);
  this.ctx = this.canvas.getContext('2d');
  this.tetris = [];
  this.squares = [];
};

Canvas.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
};

Canvas.prototype.render = function(shape) {
  this.clear();
  this.renderTetris();
  this.renderSquares();
};

Canvas.prototype.addTetris = function(tetris) {
  if(tetris instanceof Array) {
    tetris.forEach((tetris) => this.tetris.push(tetris));
  } else {
    this.tetris.push(tetris);
  }
};

Canvas.prototype.updateTetris = function(tetris) {
  this.tetris = [];
  this.addTetris(tetris);
};

Canvas.prototype.renderTetris = function() {
  this.tetris.forEach((tetris) => {
    tetris.drawFill(this); // passes canvas object reference to Tetris
  });
};

Canvas.prototype.addSquares = function(squares) {
  this.squares.push(squares);
};

Canvas.prototype.getSquares = function() {
  this.squares = flatten(this.squares);
  return this.squares;
};

Canvas.prototype.renderSquares = function() {
  this.getSquares().forEach(square => square.drawFill(this.ctx))
};
