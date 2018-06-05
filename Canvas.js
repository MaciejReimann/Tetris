

const Canvas = function(config) {
  this.config = config;
  this.modularUnit = this.config.modularUnit;
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
  squares.forEach(square => {
    let position_Y = (square.center.y + (this.modularUnit / 2)) / this.modularUnit;
    if(this.squares[position_Y] === undefined) {
      this.squares[position_Y] = [];
    };
    this.squares[position_Y].push(square);
  })
};
Canvas.prototype.updateArray = function() {
  let squaresNow = this.getSquares();
  this.squares = [];
  this.addSquares(squaresNow);
};

Canvas.prototype.getSquares = function() {
  this.allSquares = flatten(this.squares);
  return this.allSquares;
};

Canvas.prototype.deleteFullRowsAndDrop = function(arr) {
  if(arr.length > 0) {    
    for (let i = arr.length - 1; i >= 0; i --) {
      this.squares.splice( arr[i], 1);
    };
    this.updateArray();
    for (let i = 0; i < arr.length; i ++) {
      this.moveSquaresDown( 0, arr[i]);
    };
    this.updateArray();
  };
  return arr;
};

Canvas.prototype.checkWhichRowIsFull = function() {
  let widthInMod = this.canvas.width / this.modularUnit;
  let fullRows = [];
  this.squares.forEach((row, index) => {
    if(row.length === widthInMod) {
      fullRows.push(index)
    };
  });
  return fullRows;
};

Canvas.prototype.moveSquaresDown = function(start, end) {
  let toBeMoved = this.squares.splice(start, end);
  toBeMoved.forEach(row => row.forEach(
    square => {square.move('down', this.modularUnit)
    })
  );
  this.squares = toBeMoved.concat(this.squares);
};

Canvas.prototype.renderSquares = function() {
  this.getSquares().forEach(square => square.drawFill(this.ctx))
};
