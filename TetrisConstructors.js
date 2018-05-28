 

 // --- POSSIBLE TETRIS SHAPES CONSTRUCTORS ---
  
function Tetris_Square(pivot, eventCallback) {
  Tetris.call(this, pivot, eventCallback);
  this.name = 'square-type';
  this.squareCenters = [ // position of the Square.center in relation to Tetris.pivot
    {x: -0.5, y: 0.5}, {x: -0.5, y: -0.5}, {x: 0.5, y: -0.5}, {x: 0.5, y: 0.5}
  ];
};
Tetris_Square.prototype = Object.create(Tetris.prototype);
Tetris_Square.prototype.constructor = Tetris_Square;


function Tetris_S(pivot, eventCallback) {
  Tetris.call(this, pivot, eventCallback);
  this.name = 's-type';
  this.squareCenters = [ // position of the Square.center in relation to Tetris.pivot in local units
    {x: -1, y: 0.5}, {x: 0, y: 0.5}, {x: 0, y: -0.5}, {x: 1, y: -0.5}
  ]
}
Tetris_S.prototype = Object.create(Tetris.prototype);
Tetris_S.prototype.constructor = Tetris_S;


function Tetris_Z(pivot, eventCallback) {
  Tetris.call(this, pivot, eventCallback);
  Tetris_S.call(this, pivot, eventCallback);
  this.name = 'z-type';
  this.squareCenters = mirrorByY_Axis(this.squareCenters);
}
Tetris_Z.prototype = Object.create(Tetris.prototype);
Tetris_Z.prototype.constructor = Tetris_Z;


// --------- MAIN TETRIS CONSTRUCTOR ---------

function Tetris(pivot, eventCallback) { // pivot = { x: x, y: y} in global units
  // this.start = 
  this.mod = modularUnit;
  this.pivot = pivot; 
  this.angle = 0;
  // this.status = [];
  this.eventCallback = eventCallback;
};

Tetris.prototype.fireEventCallback = function(tetrisEvent) {
  this.eventCallback(tetrisEvent);
};

Tetris.prototype.getGlobalSquareCenters = function() {
  return translateToGlobal(this.pivot, this.squareCenters, this.mod);
};
Tetris.prototype.createSquares = function() {
  return this.getGlobalSquareCenters().map( 
    (point) => new Square(this.mod, point, this.angle + 45) 
    );
};
Tetris.prototype.drawFill = function(canvas) { // this function is called as Canvas method, where canvas.ctx is passed;
  this.canvas = canvas;
  this.createSquares().forEach((square) => square.drawFill(this.canvas.ctx));
};
Tetris.prototype.setRectangularRange = function(range) {
  if(!range) {
    this.range = range || {
      left: 0,
      up: -10,
      right: 400, 
      down: 450
    }
  };
};
Tetris.prototype.canMove = function() {
  this.setRectangularRange();
  let xVertices = this.createSquares().map( (square)  => square.getCartesianVertices('x'));
  let yVertices = this.createSquares().map( (square)  => square.getCartesianVertices('y'));
  const down = function() {
    return isNotGreaterThen(yVertices, this.range.down - this.mod);
  }.bind(this);
  const left = function() {
    return isNotSmallerThen(xVertices, this.range.left + this.mod);
  }.bind(this);
  const right = function() {
    return isNotGreaterThen(xVertices, this.range.right - this.mod);
  }.bind(this);
  return {
    down: down,
    left:left,
    right: right
  };
};

// --------- TETRIS TRANSFORMATIONS ----------

Tetris.prototype.moveRight = function() {
  if( this.canMove().right() ) {
    this.pivot.x += this.mod;
  }
};
Tetris.prototype.moveDown = function() {
  if( this.canMove().down() ) {
    this.pivot.y += this.mod;
    this.fireEventCallback("moved down")
  } else {
    this.fireEventCallback("cannot move down");
  }
};
Tetris.prototype.moveLeft = function() {
  if( this.canMove().left() ) {
    this.pivot.x -= this.mod;
  }
};
Tetris.prototype.rotateLeft = function() {
  let rotation = -90;
  this.squareCenters = translateToCartesian( 
    rotatePolar( translateToPolar(this.squareCenters), rotation ) );
  this.angle = this.angle % 360 + rotation;

};
Tetris.prototype.rotateRight = function() {
  let rotation = 90;
  this.squareCenters = translateToCartesian( 
    rotatePolar( translateToPolar(this.squareCenters), rotation ) );
  this.angle = this.angle % 360 + rotation;
};

