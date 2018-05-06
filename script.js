
view = {};
view.main = document.querySelector('.main');
view.angle = 0;
view.tetrisFalling;

function setup(modValue, x, y) {
  const mod = modValue;
  const width = x*mod;
  const height = y*mod;
  const entryX = x/2*modValue;
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

// -------------------------------------------
// --- POSSIBLE TETRIS SHAPES CONSTRUCTORS ---

function translateVerticesToGlobal(objVert, mod, parX, parY) {
  return [ objVert.x + parX * mod, objVert.y + parY * mod ];
}
function mirrorVertices(verticesArray) {
  let mirrored = [];
  verticesArray.forEach((vertex) => {
    mirrored.push([vertex[0]*-1, vertex[1]])
  })
  return mirrored;
}

function translateToCartesian(polarVerticesArray) {
  let cartesianVertices = [];
  polarVerticesArray.forEach((vertex) => {
    let n = 0
   let x = vertex[0] * Math.cos( (vertex[1] - n) * (Math.PI / 180) ) // x = r * cos(angle - in radians)
   let y = vertex[0] * Math.sin( (vertex[1] - n) * (Math.PI / 180) ) // y = r * sin(angle - in radians)
    cartesianVertices.push([x, y]);
  })
  return cartesianVertices;
}

function translateToPolar(verticesArray) {
  let polarVertices = [];
  verticesArray.forEach((vertex) => {
    let r = Math.sqrt(vertex[0] * vertex[0] + vertex[1] * vertex[1]);
    let angle = Math.atan2(vertex[1], vertex[0]) * (180 / Math.PI);
    polarVertices.push([r, angle]);
  })
  return polarVertices;
}
function rotatePolar(polarVerticesArray, angle) {
  let rotated = [];
  polarVerticesArray.forEach((vertex) => {
    vertex[1] = vertex[1] + angle;
    rotated.push([vertex[0], vertex[1]]);
  })
  return rotated;
}


function S_Tetris(x,y) {
  Tetris.call(this, x, y);
  this.vertices = [[-1.5, 1], [-1.5, 0], [-0.5, 0], [-0.5, -1], [1.5, -1], [1.5, 0], [0.5, 0], [0.5, 1]];
}
S_Tetris.prototype = Object.create(Tetris.prototype);

function S_TetrisMirrored(x,y) {
  S_Tetris.call(this, x, y);
  this.vertices = mirrorVertices(this.vertices);
}
S_TetrisMirrored.prototype = Object.create(Tetris.prototype);

function L_Tetris(x,y) {
  Tetris.call(this, x, y);
  this.vertices = [[-1.5, 1], [-1.5, -1], [-0.5, -1], [-0.5, 0], [1.5, 0], [1.5, 1]];
}
L_Tetris.prototype = Object.create(Tetris.prototype);

function L_TetrisMirrored(x,y) {
  L_Tetris.call(this, x, y);
  this.vertices = mirrorVertices(this.vertices);
}
L_TetrisMirrored.prototype = Object.create(Tetris.prototype);

function SquareTetris(x,y) {
  Tetris.call(this, x, y);
  this.vertices = [[-1, 1], [-1, -1], [1, -1], [1, 1]];
}
SquareTetris.prototype = Object.create(Tetris.prototype);

function I_Tetris(x,y) {
  Tetris.call(this, x, y);
  this.vertices = [[-2, 0.5], [-2, -0.5], [2, -0.5], [2, 0.5]];
}
I_Tetris.prototype = Object.create(Tetris.prototype);

// -------------------------------------------
// ----- TETRIS DEFINITION & RENDERING -------

function Tetris(x,y) {
  this.mod = config.mod;
  this.pivot = {
    x: x, 
    y: y
  }
  this.angle = 0;
}
Tetris.prototype.getGlobalVertices = function() {
  let globalVertices = []
  this.vertices.forEach(function(vertex) {
    globalVertices.push(translateVerticesToGlobal(this.pivot, this.mod, vertex[0], vertex[1]));
  }.bind(this) );
  return globalVertices;
}
Tetris.prototype.getPolarVertices = function() {
  return translateToPolar(this.vertices);
}
Tetris.prototype.drawOutline = function() {
  clearCanvas();
  const globalVertices = this.getGlobalVertices();
  const start = {
    x: globalVertices[0][0],
    y: globalVertices[0][1]
  }
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  for (let i = 1; i < globalVertices.length; i ++) {
    let next = {
      x: globalVertices[i][0],
      y: globalVertices[i][1]
    }
    ctx.lineTo(next.x, next.y);
  }
  ctx.closePath();
  ctx.stroke();
}
Tetris.prototype.drawFilled = function() {
  this.drawOutline();
  ctx.fill();
}

// -------------------------------------------
// ------------- TETRIS BEHAVIOR -------------

Tetris.prototype.moveUp = function() {
  this.pivot.y = this.pivot.y - this.mod;
  this.drawFilled();
}
Tetris.prototype.moveRight = function() {
  this.pivot.x = this.pivot.x + this.mod;
  this.drawFilled();
}
Tetris.prototype.moveDown = function() {
  this.pivot.y = this.pivot.y + this.mod;
  this.drawFilled();
}
Tetris.prototype.moveLeft = function() {
  this.pivot.x = this.pivot.x - this.mod;
  this.drawFilled();
}
Tetris.prototype.rotate = function(angle) {
  this.angle += angle;
  let rotated = rotatePolar(this.getPolarVertices(), this.angle);
  this.vertices = translateToCartesian(rotated);
  this.angle = 0;
  this.drawFilled();
}

function checkIfHitTheBottom(tetris) {
  // (function drawGrid() {
  //   const width = config.width;
  //   const height = config.height;
  //   const mod = config.mod
  //   for (let i = 0; i < width; i ++) {
  //     ctx.beginPath();
  //     ctx.moveTo(0, i * config.mod);
  //     ctx.lineTo(width, i * config.mod);
  //     ctx.stroke();
  //   }    
  // })()
  // (function drawBottomLine() {
  //   ctx.beginPath();
  //   ctx.moveTo(0, config.height-10);
  //   ctx.lineTo(config.width, config.height-10);
  //   ctx.stroke();
  // })()
  // const tetrisCoords = tetris.squares.forEach((square) => square.anchorPoint)
  const tetrisCoords = [];



  checkIfFullLine()
}
function checkIfFullLine() {
  return true;
}


const activeShape = {
  instance:{},
  rotation: [], // first callback in the array moving tetris up, i.e. north first;
  welcome: function(tetris) {
    this.instance = tetris;
    this.instance.drawFilled()
    view.tetrisFalling = this.instance;
  },
  move: function() {
    let tetris = this.instance;
    let rotation = this.rotation;
    const up = function() {tetris.moveUp()};
    const right = function() {tetris.moveRight()};
    const down = function() {tetris.moveDown()};
    const left = function() {tetris.moveLeft()};
    let angle = view.angle%360;
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
  },
  rotate: function(angle) {this.instance.rotate(angle)}
};

activeShape.welcome(new S_Tetris(config.entryX, config.entryY));




// let g = new S_TetrisMirrored(200, 200)
// let l = new L_Tetris(300, 400);
// l.drawFilled();

// let lm = new L_TetrisMirrored(100, 400);
// lm.drawFilled()

// let sq = new SquareTetris(50, 50);
// sq.drawFilled()

// let i = new I_Tetris(150, 50);
// i.drawFilled()




// -------------------------------------------
// ------------- USER INTERFACE --------------

const keydownHandler = function() {
  const listenedKeys = {
    ArrowDown: activeShape.move().down,
    ArrowRight: activeShape.move().right,
    ArrowLeft: activeShape.move().left,
    z: (function() { activeShape.rotate(-90) }),
    a: (function() { activeShape.rotate(90) }),
  }
  Object.keys(listenedKeys).forEach((name) => {if(event.key === name) { listenedKeys[name]() } });
  checkIfHitTheBottom()
}

window.addEventListener('keydown', keydownHandler);



