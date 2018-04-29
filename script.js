
view = {};
view.main = document.querySelector('.main');

function setup(modValue, x, y) {
  const mod = modValue;
  const width = x*mod;
  const height = y*mod;
  const entryX = x/2;
  const entryY = 0;
  return {
    mod: 10,
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

function Module([posX, posY]) {
  this.mod = config.mod;
  this.posX = posX * this.mod;
  this.posY = posY * this.mod;
  this.color;
  this.ctx = view.canvas.getContext('2d');
  // this.ctx.fillStyle = this.color;
}

Module.prototype.clear = function() {
  this.ctx.clearRect(this.posX, this.posY, this.mod, this.mod);
};
Module.prototype.place = function() {  
  this.ctx.fillRect(this.posX, this.posY, this.mod, this.mod);
};
Module.prototype.setColor = function(color) {  
  this.ctx.fillStyle = color;
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
Module.prototype.rotateCounterClockwise = function() {
  this.clear();  
  console.log('rotateCounterClockwise')
  this.place();
}
Module.prototype.rotateClockwise = function() {
  this.clear();  
  console.log('rotateClockwise')
  this.place();
}


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
  this._1;
  this._2;
  this._3;
  this._4;
}
Shape.prototype.create = function(color) {
  this.color = color;
  this.shape = [
    new Module(this._4), new Module(this._3), new Module(this._2), new Module(this._1)
  ];
}
Shape.prototype.setColor = function() {
 this.shape.forEach( (square) => {square.setColor(this.color)} );
}
Shape.prototype.modify = function() {
  this.setColor();
  this.copy = this.shape.slice();  
  this.place = function() {this.shape.forEach( (square) => {square.place()} )}.bind(this);
  this.moveLeft = function() {this.copy.reverse().forEach( (square) => {square.moveLeft()} )}.bind(this);
  this.moveRight = function() {this.shape.forEach( (square) => {square.moveRight()} )}.bind(this);
  this.moveDown = function() {this.shape.forEach( (square) => {square.moveDown()} )}.bind(this)
  return {
    place: this.place,
    moveLeft: this.moveLeft,
    moveRight: this.moveRight,
    moveDown: this.moveDown,
  }
}

const line = new I_Shape();
line.create('#6d92c4');
line.modify().place();

const activeShape = new Square_Shape();
activeShape.create('pink');
activeShape.modify().place();
console.log(activeShape)

const square2 = new Module([3, 3]);
square2.setColor('black');
square2.place();

view.activeItem = activeShape;

const keydownHandler = function() {
  const activeItem = view.activeItem;
  const listenedKeys = {
    b: (function() { activeItem.modify().moveDown() }),
    Enter: (function() { activeItem.moveDown() }), // !!! omits setColor() and takes the function as private variable
    ArrowRight: (function() { activeItem.modify().moveRight() }),
    ArrowLeft: (function() { activeItem.modify().moveLeft() }),
    ArrowDown: (function() { activeItem.rotateCounterClockwise() }),
    ArrowUp: (function() { activeItem.rotateClockwise() }),    
  }
  Object.keys(listenedKeys).forEach((name) => {if(event.key === name) { listenedKeys[name]() } });
  console.log(event.key)
}

window.addEventListener('keydown', keydownHandler);



