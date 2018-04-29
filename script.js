
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

function Module([posX, posY]) {
  this.mod = config.mod;
  this.posX = posX * this.mod;
  this.posY = posY * this.mod;
  this.color;
  ctx = view.canvas.getContext('2d');
  // this.ctx.fillStyle = this.color;
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
  view.angle = view.angle + angle;
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
  console.log(view.angle)
}
Shape.prototype.move = function() {
  this.paint(this.color);
  this.copy = this.shape.slice();
  ctx.rotate(-view.angle * Math.PI / 180);
  view.angle = 0;
  this.left = function() {this.copy.reverse().forEach( (square) => {square.moveLeft()} )}.bind(this);
  this.right = function() {this.shape.forEach( (square) => {square.moveRight()} )}.bind(this);
  this.down = function() {this.shape.forEach( (square) => {square.moveDown()} )}.bind(this)
  return {
    left: this.left,
    right: this.right,
    down: this.down,
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

const square2 = new Module([3, 3]);
square2.setColor('black');
square2.place();

view.activeItem = activeShape;

const keydownHandler = function() {
  const activeItem = view.activeItem;
  const listenedKeys = {
    b: (function() { activeItem.move().down() }),
    Enter: (function() { activeItem.down() }), // !!! omits setColor() and takes the function as private variable
    ArrowRight: (function() { activeItem.move().right() }),
    ArrowLeft: (function() { activeItem.move().left() }),
    ArrowDown: (function() { activeItem.rotate(-90) }),
    ArrowUp: (function() { activeItem.rotate(90) }),    
  }
  Object.keys(listenedKeys).forEach((name) => {if(event.key === name) { listenedKeys[name]() } });
  console.log(event.key)
}

window.addEventListener('keydown', keydownHandler);



