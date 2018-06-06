 

 // --- POSSIBLE TETRIS SHAPES CONSTRUCTORS ---
  
function Tetris_Square(mod, pivot) {
  Tetris.call(this, mod, pivot);
  this.name = 'square-type';
  this.squareCenters = [ // position of the Square.center in relation to Tetris.pivot
    {x: -.5, y: .5}, {x: -.5, y: -.5}, {x: .5, y: -.5}, {x: .5, y: .5}
  ];
};
Tetris_Square.prototype = Object.create(Tetris.prototype);
Tetris_Square.prototype.constructor = Tetris_Square;

function Tetris_I(mod, pivot) {
  Tetris.call(this, mod, pivot);
  this.name = 'i-type';
  this.squareCenters = [ // position of the Square.center in relation to Tetris.pivot
    {x: -1.5, y: .5}, {x: -.5, y: .5}, {x: .5, y: .5}, {x: 1.5, y: .5}
  ];
};
Tetris_I.prototype = Object.create(Tetris.prototype);
Tetris_I.prototype.constructor = Tetris_I;

function Tetris_L(mod, pivot) {
  Tetris.call(this, mod, pivot);
  this.name = 'l-type';
  this.squareCenters = [ // position of the Square.center in relation to Tetris.pivot
    {x: -.5, y: .5}, {x: -.5, y: -.5}, {x: .5, y: .5}, {x: 1.5, y: .5}
  ];
};
Tetris_L.prototype = Object.create(Tetris.prototype);
Tetris_L.prototype.constructor = Tetris_L;

function Tetris_L_Mirrored(mod, pivot) {
  Tetris.call(this, mod, pivot);
  Tetris_L.call(this, mod, pivot);
  this.name = 'l-type-mirrored';
  this.squareCenters = mirrorByY_Axis(this.squareCenters);
};
Tetris_L_Mirrored.prototype = Object.create(Tetris.prototype);
Tetris_L_Mirrored.prototype.constructor = Tetris_L_Mirrored;

function Tetris_M(mod, pivot) {
  Tetris.call(this, mod, pivot);
  this.name = 'm-type';
  this.squareCenters = [
    {x: -.5, y: .5}, {x: .5, y: .5}, {x: .5, y: -.5}, {x: 1.5, y: .5}
  ];
};
Tetris_M.prototype = Object.create(Tetris.prototype);
Tetris_M.prototype.constructor = Tetris_M;

function Tetris_S(mod, pivot) {
  Tetris.call(this, mod, pivot);
  this.name = 's-type';
  this.squareCenters = [ // position of the Square.center in relation to Tetris.pivot in local units
    {x: -1.5, y: .5}, {x: -.5, y: .5}, {x: -.5, y: -.5}, {x:.5, y: -.5}
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
Tetris.prototype.setRectangularRange = function(canvas) { // to be defined in tetris factory
  this.range = {
    left: 0,
    up: -10,
    right: canvas.config.width, 
    down: canvas.config.height
  };
};
Tetris.prototype.staysOnCanvasWhen = function() {
  this.setRectangularRange(this.canvas);
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
Tetris.prototype.collidesWith = function(callback, direction) {
  const staticSquares = callback();
  if(staticSquares.length === 0) {
    return false;
  };
  function collides(items) {
   return items.some(d_square => 
         staticSquares.some(s_square => s_square.overlapsOn(d_square) === 4 )
      );
  };

  if(direction === "down") {
    this.moveDown();
    if(collides( this.createSquares() )) {
      this.moveUp();
      return true;
    } else {
      this.moveUp();
    };
  } else if (direction === "right") {
    this.moveRight();
    if(collides( this.createSquares() )) {
      this.moveLeft();
      return true;
    } else {
      this.moveLeft();
    };
  } else if (direction === "left") {
    this.moveLeft();
    if(collides( this.createSquares() )) {
      this.moveRight();
      return true;
    } else {
      this.moveRight();
    };
  } else if (direction === "any") {
    this.collidesWith(callback, "down");
    this.collidesWith(callback, "right");
    this.collidesWith(callback, "left");
  };
  return false;
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

