
view = {};
view.main = document.querySelector('.main');
view.angle = 0;

function setup(modValue, x, y) {
  const mod = modValue;
  const width = x*mod;
  const height = y*mod;
  const entryX = x/2;
  const entryY = 0;
  return {
    mod: mod,
    entryX: entryX,
    entryY: entryY,
    width: width,
    height: height
  }
}
config = setup(10, 40, 50);

function createCanvas(width, height, parent, className) {
	const canvas = document.createElement('canvas');
  canvas.className = className;
  canvas.width = width;
  canvas.height = height;  
  parent.appendChild(canvas);
  return canvas;
}
view.canvas = createCanvas(config.width, config.height, view.main, 'canvas');
const ctx = view.canvas.getContext('2d');

function clearCanvas() {
  ctx.clearRect(0, 0, config.width, config.height);
}


function Square(x,y) {
  this.mod = config.mod;
  this.anchorPoint = {
    x: x,
    y: y
  }
}
Square.prototype.draw = function(color) {
  this.color = color;
  ctx.fillRect(this.anchorPoint.x, this.anchorPoint.y, this.mod, this.mod);
  ctx.fillStyle = color;
};

function L_ShapeLeft(x,y) {
  Tetris.call(this, x, y);
  this.getAnchorPoints = function () {
    let anchorPoints = [
      {
        x: this.pivot.x - this.mod * 1.5,
        y: this.pivot.y - this.mod
      },
      {
        x: this.pivot.x - this.mod * 1.5,
        y: this.pivot.y
      },
      {
        x: this.pivot.x - this.mod * 0.5,
        y: this.pivot.y
      },
      {
        x: this.pivot.x + this.mod * 0.5,
        y: this.pivot.y
      },
    ];
  return anchorPoints;
  }
}
L_ShapeLeft.prototype = Object.create(Tetris.prototype);

function L_ShapeRight(x,y) {
  Tetris.call(this, x, y);
  this.getAnchorPoints = function () {
    let anchorPoints = [
      {
        x: this.pivot.x - this.mod * 1.5,
        y: this.pivot.y
      },
      {
        x: this.pivot.x - this.mod * 0.5,
        y: this.pivot.y
      },
      {
        x: this.pivot.x + this.mod * 0.5,
        y: this.pivot.y
      },
      {
        x: this.pivot.x + this.mod * 0.5,
        y: this.pivot.y - this.mod
      },
    ];
    return anchorPoints;
  }
}
L_ShapeRight.prototype = Object.create(Tetris.prototype);

function Tetris(x,y) {
  this.mod = config.mod;
  this.pivot = {
    x: x, 
    y: y
  };
}
Tetris.prototype.draw = function() {
  clearCanvas();
  this.squares = [];
  this.getAnchorPoints().forEach((point) => this.squares.push(new Square(point.x, point.y)));
  this.squares.forEach((square) => square.draw() )
}
Tetris.prototype.moveUp = function() {
  this.pivot.y = this.pivot.y - this.mod;
  this.draw();
}
Tetris.prototype.moveRight = function() {
  this.pivot.x = this.pivot.x + this.mod;
  this.draw();
}
Tetris.prototype.moveDown = function() {
  this.pivot.y = this.pivot.y + this.mod;
  this.draw();
}
Tetris.prototype.moveLeft = function() {
  this.pivot.x = this.pivot.x - this.mod;
  this.draw();
}



// const lShape = new L_ShapeRight(config.entryX, config.entryY)
// lShape.draw();


// Shape.prototype.rotate = function(angle) {
//   this.paint(this.color);
//   view.angle = view.angle + angle;
//   updateCoordinates();
//   let centreX = this.pivotPoint.x;
//   let centreY = this.pivotPoint.y;
//   this.shape.forEach( (square) => {square.clear()} )
//   ctx.translate(centreX, centreY);
//   ctx.rotate(angle * Math.PI / 180);
//   this.shape.forEach( (square) => {
//     square.posX = square.posX-centreX;
//     square.posY = square.posY-centreY;
//     square.place();      
//   });
// }


function checkIfHitTheBottom() {
  checkIfFullLine()
}
function checkIfFullLine() {
  return true;
}

const activeShape = {};




activeShape.set = function(tetris) {
  this.instance = tetris;
  this.instance.draw()
  view.activeShape = this.instance;
};
activeShape.rotation = []; // first callback in the array moving tetris up, i.e. north first;
activeShape.move = function() {
  let tetris = this.instance;
  let rotation = this.rotation;
  const up = function() {tetris.moveUp()};
  const right = function() {tetris.moveRight()};
  const down = function() {tetris.moveDown()};
  const left = function() {tetris.moveLeft()};
  let angle = view.angle%360;
  console.log(angle)
  if(angle===90 || angle === -270) {
    rotation = [left, up, right, down];
  } else if(angle===180 || angle===-180) {
    rotation = [down, left, up, right];
  } else if (angle===270 || angle===-90) {
    rotation = [right, down, left, up];
  } else {
    rotation = [up, right, down, left]
  }
  return {
    right: function() {rotation[1]()},
    down: function() {rotation[2]()},
    left: function() {rotation[3]()}
  }
}

activeShape.set(new L_ShapeRight(config.entryX, config.entryY));


const keydownHandler = function() {
  const activeItem = view.activeItem;
  const listenedKeys = {
    ArrowDown: activeShape.move().down,
    ArrowRight: activeShape.move().right,
    ArrowLeft: activeShape.move().left,
    z: (function() { activeItem.rotate(-90) }),
    a: (function() { activeItem.rotate(90) }),
  }
  Object.keys(listenedKeys).forEach((name) => {if(event.key === name) { listenedKeys[name]() } });
  console.log(event.key)
}

window.addEventListener('keydown', keydownHandler);



