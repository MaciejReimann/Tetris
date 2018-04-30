
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

function Module([posX, posY]) {
  this.mod = config.mod;
  this.posX = posX * this.mod;
  this.posY = posY * this.mod;
  this.color;  
}

Module.prototype.clear = function() {
  ctx.clearRect(this.posX, this.posY, this.mod, this.mod);
};
Module.prototype.place = function() {  
  ctx.fillRect(this.posX, this.posY, this.mod, this.mod);
};
Module.prototype.setColor = function(color) {  
  ctx.fillStyle = color;
};
Module.prototype.moveRight = function() {
  this.clear();  
  this.posX = this.posX + this.mod;
  this.place();
};
Module.prototype.moveLeft = function() {
  this.clear();  
  this.posX = this.posX - this.mod;
  this.place();
};
Module.prototype.moveDown = function() {
  this.clear();  
  this.posY = this.posY + this.mod;
  this.place();
};
Module.prototype.moveUp = function() {
  this.clear();  
  this.posY = this.posY - this.mod;
  this.place();
};


function Square_Shape(){
  this._1 = [this.entryX-1, this.entryY];
  this._2 = [this.entryX, this.entryY];
  this._3 = [this.entryX-1, this.entryY+1];
  this._4 = [this.entryX, this.entryY+1]; 
}
function I_Shape(){
  this._1 = [this.entryX-2, this.entryY];
  this._2 = [this.entryX-1, this.entryY];
  this._3 = [this.entryX, this.entryY];
  this._4 = [this.entryX+1, this.entryY]; 
}
I_Shape.prototype = new Shape();
Square_Shape.prototype = new Shape();

function Shape() {
  this.entryX = config.entryX;
  this.entryY = config.entryY;
}
Shape.prototype.getPivot = function() {
  return [this.shape[2].posX, this.shape[2].posY + config.mod];
}
Shape.prototype.create = function() {  
  this.shape = [
    new Module(this._4), new Module(this._3), new Module(this._2), new Module(this._1)
  ];
}
Shape.prototype.paint = function(color) {
 this.color = color;
 this.shape.forEach( (square) => {square.setColor(this.color)} );
}
Shape.prototype.place = function() {
 this.shape.forEach( (square) => {square.place()});
}
Shape.prototype.rotate = function(angle) {
  this.paint(this.color);
  view.angle = view.angle + angle;
  updateCoordinates();
  let centreX = this.getPivot()[0];
  let centreY = this.getPivot()[1]
  this.shape.forEach( (square) => {square.clear()} )
  ctx.translate(centreX, centreY);
  ctx.rotate(angle * Math.PI / 180);
  this.shape.forEach( (square) => {
    square.posX = square.posX-centreX;
    square.posY = square.posY-centreY;
    square.place();      
  });
}
Shape.prototype.move = function() {
  this.copy = this.shape.slice();  
  this.left = function() {this.copy.reverse().forEach( (square) => {square.moveLeft()} )}.bind(this);
  this.right = function() {this.shape.forEach( (square) => {square.moveRight()} )}.bind(this);
  this.down = function() {this.shape.forEach( (square) => {square.moveDown()} )}.bind(this);
  this.up = function() {this.shape.forEach( (square) => {square.moveUp()} )}.bind(this);
  return {
    left: this.left,
    right: this.right,
    down: this.down,
    up: this.up
  }
}

Shape.prototype.drawLineOnCanvas = function() {
  this.mod = config.mod;
  this.startMiddleAxisX = this.entryX*this.mod;
  this.startMiddleAxisY = this.entryY*this.mod;
  this.endMiddleAxisX = this.entryX*this.mod;
  this.endMiddleAxisY = this.entryY*this.mod + config.height;
  ctx.beginPath();
  ctx.moveTo(this.startMiddleAxisX, this.startMiddleAxisY);
  ctx.lineTo(this.endMiddleAxisX, this.endMiddleAxisY);
  ctx.stroke();
}

const activeShape = new I_Shape();

activeShape.create();
activeShape.paint('pink');
activeShape.place();
activeShape.drawLineOnCanvas();
view.activeItem = activeShape;


const up =  activeShape.move().up;
const right = activeShape.move().right;
const down = activeShape.move().down;
const left = activeShape.move().left;
let accordingToShape = [];
function updateCoordinates(){
  let angle = view.angle%360;
  console.log(angle)
  if(angle===90 || angle === -270) {
    accordingToShape = [left, up, right, down];
  } else if(angle===180 || angle===-180) {
    accordingToShape = [down, left, up, right];
  } else if (angle===270 || angle===-90) {
    accordingToShape = [right, down, left, up];
  } else {
    accordingToShape = [up, right, down, left]
  }
}
function moveRight() {accordingToShape[1]()};
function moveDown() {accordingToShape[2]()};
function moveLeft() {accordingToShape[3]()}


const keydownHandler = function() {
  const activeItem = view.activeItem;
  const listenedKeys = {
    ArrowDown: (function() { moveDown() }),
    ArrowRight: (function() { moveRight() }),
    ArrowLeft: (function() {  moveLeft() }),
    z: (function() { activeItem.rotate(-90) }),
    a: (function() { activeItem.rotate(90) }),
  }
  Object.keys(listenedKeys).forEach((name) => {if(event.key === name) { listenedKeys[name]() } });
  console.log(event.key)
}

window.addEventListener('keydown', keydownHandler);



