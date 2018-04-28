
view = {};
view.main = document.querySelector('.main');

function setup(modValue, x, y) {
  const mod = modValue;
  const width = x*mod;
  const height = y*mod;
  const entryX = width/2;
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

function Module(posX, posY, color) {
  this.mod = config.mod;
  this.posX = posX * this.mod;
  this.posY = posY * this.mod;
  this.color = color;
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




function I_Shape(){
  this.shape = [
    new Module(1, 1), new Module(1, 2), new Module(1, 3), new Module(1, 4)
  ]; 
}
I_Shape.prototype = new Shape();

function Shape(){
  this.shape = [];
  this.entryX = config.entryX;
  this.entryY = config.entryY;
}
Shape.prototype.setColor = function(color) {
 this.shape.forEach( (square) => {square.setColor(color)} );
}
Shape.prototype.place = function() {
  this.shape.forEach( (square) => {square.place()} );
}




const activeShape = new I_Shape();
activeShape.setColor('#618fce');
activeShape.place();
console.log(activeShape)

const square2 = new Module(3, 3);
square2.setColor('black');
square2.place();

view.activeItem = activeShape;

const keydownHandler = function() {
  const activeItem = view.activeItem;
  const listenedKeys = {
    Enter: (function() { activeItem.ship() }),
    ArrowRight: (function() { activeItem.moveRight() }),
    ArrowLeft: (function() { activeItem.moveLeft() }),
    ArrowDown: (function() { activeItem.rotateCounterClockwise() }),
    ArrowUp: (function() { activeItem.rotateClockwise() }),    
  }
  Object.keys(listenedKeys).forEach((name) => {if(event.key === name) { listenedKeys[name]() } });
}

window.addEventListener('keydown', keydownHandler);



