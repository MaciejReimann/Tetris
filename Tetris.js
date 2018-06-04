 

 // --- POSSIBLE TETRIS SHAPES CONSTRUCTORS ---
  
function Tetris_Square(mod, pivot) {
  Tetris.call(this, mod, pivot);
  this.name = 'square-type';
  this.squareCenters = [ // position of the Square.center in relation to Tetris.pivot
    {x: -0.5, y: 0.5}, {x: -0.5, y: -0.5}, {x: 0.5, y: -0.5}, {x: 0.5, y: 0.5}
  ];
};
Tetris_Square.prototype = Object.create(Tetris.prototype);
Tetris_Square.prototype.constructor = Tetris_Square;


function Tetris_S(mod, pivot) {
  Tetris.call(this, mod, pivot);
  this.name = 's-type';
  this.squareCenters = [ // position of the Square.center in relation to Tetris.pivot in local units
    {x: -1, y: 0.5}, {x: 0, y: 0.5}, {x: 0, y: -0.5}, {x: 1, y: -0.5}
  ]
}
Tetris_S.prototype = Object.create(Tetris.prototype);
Tetris_S.prototype.constructor = Tetris_S;


function Tetris_Z(mod, pivot) {
  Tetris.call(this, mod, pivot);
  Tetris_S.call(this, mod, pivot);
  this.name = 'z-type';
  this.squareCenters = mirrorByY_Axis(this.squareCenters);
}
Tetris_Z.prototype = Object.create(Tetris.prototype);
Tetris_Z.prototype.constructor = Tetris_Z;


// --------- MAIN TETRIS CONSTRUCTOR ---------

function Tetris(mod, pivot) { // pivot = { x: x, y: y} in global units
  // this.start = 
  this.mod = mod;
  this.pivot = pivot; 
  this.angle = 0;
};

Tetris.prototype.getGlobalSquareCenters = function() {
  return translateToGlobal(this.pivot, this.squareCenters, this.mod);
};
Tetris.prototype.getCartesianVertices = function() {
  return this.createSquares().map( square => square.getCartesianVertices() );
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
Tetris.prototype.setRectangularRange = function(range) { // to be defined in tetris factory 
  if(!range) {
    this.range = range || {
      left: 0,
      up: -10,
      right: 400, 
      down: 450
    }
  };
};
Tetris.prototype.staysOnCanvasWhen = function() {
  this.setRectangularRange();
  const xVertices = function() {
    return this.createSquares().map( (square)  => square.getCartesianVertices('x'));
  }.bind(this);
  const yVertices = function() {
    return this.createSquares().map( (square)  => square.getCartesianVertices('y'));
  }.bind(this);
  const movedDown = function() {
    return isNotGreaterThen(yVertices(), this.range.down - this.mod);
  }.bind(this);
  const movedLeft = function() {
    return isNotSmallerThen(xVertices(), this.range.left + this.mod);
  }.bind(this);
  const movedRight = function() {
    return isNotGreaterThen(xVertices(), this.range.right - this.mod);
  }.bind(this);
  const rotated = function(rot1, rot2) {  
    this[rot1]();
    if( isNotGreaterThen(yVertices(), this.range.down) &&
        isNotSmallerThen(xVertices(), this.range.left) && 
        isNotGreaterThen(xVertices(), this.range.right)
      ) {
      this[rot2]();
      return true;
    } else {
      this[rot2]();
      return false;
    }
  }.bind(this);
  return {
    movedDown: movedDown,
    movedLeft: movedLeft,
    movedRight: movedRight,
    rotated: rotated,
  };
};
Tetris.prototype.collidesWith = function(callback) {
  const staticSquares = callback();
  const staticVertices = staticSquares.map(square => square.getCartesianVertices())

  const whenMovedDown = function() {
    this.moveDown();
    // const dynamicVertices = this.getCartesianVertices();
    // dynamicVertices.forEach(dynamicVertex => staticVertices.find(static => static === dynamic))


    // console.log(dynamicVertices)
    console.log(staticVertices);
    this.moveUp();
    return false;
  }.bind(this);

  return {
    whenMovedDown: whenMovedDown,

  };
};

// --------- TETRIS TRANSFORMATIONS ----------

Tetris.prototype.moveRight = function() {
    this.pivot.x += this.mod;
};
Tetris.prototype.moveDown = function() {
    this.pivot.y += this.mod;
};
Tetris.prototype.moveLeft = function() {
    this.pivot.x -= this.mod;
};
Tetris.prototype.moveUp = function() {
    this.pivot.y -= this.mod;
};
// Tetris.prototype.rotate = function(angle) {
//   let rotation = angle;
//   this.squareCenters = translateToCartesian( 
//     rotatePolar( translateToPolar(this.squareCenters), rotation ) );
//   this.angle = this.angle % 360 + rotation;
// };
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

