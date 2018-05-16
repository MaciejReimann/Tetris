

view = {};
view.main = document.querySelector('.main');

// --- CANVAS SETUP ----

config = {
	largeCanvas: {		
		width: 400,
		height: 450,
		parentElement: view.main,
		className: 'large-canvas'
	},
	smallCanvas: {		
		width: 400,
		height: 100,
		parentElement: view.main,
		className: 'small-canvas'
	},
};

view.largeCanvas = canvas(config.largeCanvas).create();
view.smallCanvas = canvas(config.smallCanvas).create();
view.main.insertBefore(view.smallCanvas, view.largeCanvas);

function canvas(config) {
 	const canvas = document.createElement('canvas');
 	const ctx = canvas.getContext('2d');
  canvas.className = config.className;
  canvas.width = config.width;
  canvas.height = config.height;  
  config.parentElement.appendChild(canvas);

  function create() {
  	return canvas;
  }
	function getContext() {
  	return ctx;
  };
	function clear() {
  	ctx.clearRect(0, 0, canvas.width, canvas.height)
 	};
  return {
  	create: create,
  	getContext: getContext,
  	clear: clear
  };
}

// function generateBottomVertices(width, height, mod) {
//   const bottomVertices = [];
//   const y = height
//   for (let x = 0; x < width; x += mod) {
//     bottomVertices.push([x, y])
//   }
//   return bottomVertices;
// }

// // -------------------------------------------
// // --- POSSIBLE TETRIS SHAPES CONSTRUCTORS ---

// function translateVerticesToGlobal(referencePoint, mod, parX, parY) {
//   return { 
//     x: referencePoint.x + parX * mod,
//     y: referencePoint.y + parY * mod };
// }
// function mirrorVertices(verticesArray) {
//   let mirrored = [];
//   verticesArray.forEach((vertex) => {
//     mirrored.push([vertex[0]*-1, vertex[1]])
//   })
//   return mirrored;
// }

// function translateToCartesian(polarVerticesArray) {
//   let cartesianVertices = [];
//   polarVerticesArray.forEach((vertex) => {
//     let n = 0 // optional angle parameter
//     let x = vertex.r * Math.cos( (vertex.angle - n) * (Math.PI / 180) ) // x = r * cos(angle - in radians)
//     let y = vertex.r * Math.sin( (vertex.angle - n) * (Math.PI / 180) ) // y = r * sin(angle - in radians)
//     vertex = {
//       x: x,
//       y: y
//     }
//     cartesianVertices.push(vertex);
//   })
//   return cartesianVertices;
// }

// function translateToPolar(verticesArray) {
//   let polarVertices = [];
//   verticesArray.forEach((vertex) => {
//     let r = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y);
//     let angle = Math.atan2(vertex.x, vertex.y) * (180 / Math.PI);
//     vertex = {
//       r: r,
//       angle: angle
//     }
//     polarVertices.push(vertex);
//   })
//   return polarVertices;
// }
// function rotatePolar(polarVerticesArray, angle) {
//   let rotatedCenters = [];
//   polarVerticesArray.forEach((vertex) => {
//     let rotatedCenter = {};
//     vertex.angle = vertex.angle + angle;
//     vertex = {
//       r: vertex.r,
//       angle: vertex.angle
//     }
//     rotatedCenters.push(vertex);
//   })
//   return rotatedCenters;
// }

// //------------------------------------------------------

// // const tetrisFactory = (function(context, configuration) { //defines the context for tetris creation; TODO: config should be a part of particular canvas, i.e. factory needs onle one argument
//   //closures go here
//   // const ctx = context;
//   const start = {x: config.entryX, y: config.entryY}; //defines the "0" point;
//   const mod = config.mod; // the modular unit for object transformation
            
//           // --- SQUARE: BASIC UNIT --- 

//   function Square(x, y) { // takes the center point of the square, 
//     this.mod = mod;
//     this.center = {x: x, y: y};
//     this.length = this.mod;
//     this.vertices = []; // empty array to be populated with 4 vertices calculated on each tranformation;
//   }
//   Square.prototype.setNewCenter = function(obj) { // takes obj = {x: x, y: y}
//     this.center = {
//       x: obj.x,
//       y: obj.y
//     }
//   }
//   Square.prototype.getVertices = function() {
//     return this.vertices = [
//         {x: this.center.x - this.length / 2, y: this.center.y - this.length / 2},
//         {x: this.center.x + this.length / 2, y: this.center.y - this.length / 2},
//         {x: this.center.x + this.length / 2, y: this.center.y + this.length / 2},
//         {x: this.center.x - this.length / 2, y: this.center.y + this.length / 2},
//     ]
//   }
//   Square.prototype.drawOutline = function() {
//     const vertices = this.getVertices(); // calculate the vertices for the path
//     ctx.beginPath();
//     ctx.moveTo(vertices[0].x, vertices[0].y);
//     ctx.lineTo(vertices[1].x, vertices[1].y);
//     ctx.lineTo(vertices[2].x, vertices[2].y);
//     ctx.lineTo(vertices[3].x, vertices[3].y);
//     ctx.closePath();
//     ctx.stroke(); // line width to be defined in the config object
//   }
//   Square.prototype.drawFill = function() {
//     this.drawOutline();
//     ctx.fill();
//   }
//   Square.prototype.moveRight = function() { // moves the center right
//     this.center.x += this.mod;
//   }
//   Square.prototype.moveDown = function() { // moves the center left
//     this.center.y += this.mod;
//   }
//   Square.prototype.moveLeft = function() { // moves the center down
//     this.center.x -= this.mod;
//   }

//   // --- SHAPES --- 

//   function Tetris_S(x,y) {
//     Tetris.call(this, x, y);
//     this.squareCenters = [ // position of the Square.center in relation to Tetris.pivot
//       {x: -1, y: 0.5}, {x: 0, y: 0.5}, {x: 0, y: -0.5}, {x: 1, y: -0.5}
//     ]
//   }
//   Tetris_S.prototype = Object.create(Tetris.prototype); //??????????????
//   Tetris_S.prototype.constructor = Tetris_S;

//   // --- MAIN CONSTRUCTOR --- 

//   function Tetris(x,y) {
//     this.mod = mod;
//     this.pivot = {x: x, y: y}; 
//     this.angle = 0;
//     this.squares = []; // to be populated by the Square instances
//   }
//   Tetris.prototype.createSquares = function() { // creates Square instances for each squareCenter in the squares array
//     this.getGlobalCenters().forEach((point) => { // needs to get the list of center point in global units
//       this.squares.push(new Square(point.x, point.y));
//     })
//   }
//   Tetris.prototype.drawOutline = function() {
//     this.squares.forEach((square) => {square.drawOutline()});
//   }
//   Tetris.prototype.drawFill = function() {
//     clearCanvas(); // TIGHTLY COUPLED!!! TODO: should be put elsewhere
//     this.squares.forEach((square) => square.drawFill());
//   }


//   Tetris.prototype.setGlobalCenters = function(arrayOfGlobalVertices) {
//     this.squares.forEach((square, index) => {
//       let newCenter = arrayOfGlobalVertices[index];
//       square.setNewCenter(newCenter);
//     })
//     return this.squares;
//   }
//   Tetris.prototype.getLocalCenters = function() {
//     return this.squareCenters;
//   }
//   Tetris.prototype.getGlobalCenters = function() {
//     let globalCenters = []
//     this.squareCenters.forEach(function(center) {
//       globalCenters.push(translateVerticesToGlobal(this.pivot, this.mod, center.x, center.y));
//     }.bind(this) ); 
//     return globalCenters;
//   }
//   Tetris.prototype.getPolarCenters = function() {
//     return translateToPolar(this.getLocalCenters());
//   }


//   // -------------------------------------------
//   // --------- TETRIS TRANSFORMATIONS ----------

//   Tetris.prototype.moveRight = function() {
//     console.log(this)
//     // this.pivot.x += this.mod;
//   }
//   Tetris.prototype.moveDown = function() {
//     this.squares.forEach((square) => square.moveDown());
//     this.drawFill();
//   }
//   Tetris.prototype.moveLeft = function() {
//     this.squares.forEach((square) => square.moveLeft());
//     this.drawFill();
//   }
//   Tetris.prototype.rotate = function(angle) {
//   this.angle += angle;
//   let centersPolarToPivot = this.getPolarCenters();
//   let rotatedCentersPolar = rotatePolar(centersPolarToPivot, this.angle);
//   let rotatedCentersCartesian = translateToCartesian(rotatedCentersPolar);
//   this.squareCenters = rotatedCentersCartesian;
//   let rotatedCentersGlobal = this.getGlobalCenters();
//   let newCenters = this.setGlobalCenters(rotatedCentersGlobal);
//   console.log( newCenters )

//   // this.vertices = translateToCartesian(rotated);
//   this.angle = 0;
//   this.drawFill();
//   }



// const activeShape = function() {
//   const tetris = new Tetris_S(start.x, start.y);
//   return {
//     moveRight: tetris.moveRight
//     };
  

// }

// console.log(activeShape().moveRight())


const tetrisFactory = (function() {

	return {

	};
	this.produce = function(type) {
		console.log(type);
	}
})();




const fallingTetris = (function() {
  let currentInstance;
  const Fallingrate = 1000;

  const setCurrent = function(tetrisInstance) {
    currentInstance = tetrisInstance;
  };

  const keepsFalling = function() {
    setTimeout(keepsFalling, Fallingrate);
    moveDown();
  };
  const moveLeft = function() {
    console.log("I moved left!");
  }
  const moveRight = function() {
    console.log("I moved right!");
  }
  const moveDown = function() {
    console.log("I moved down!");
  }
  return {
    setCurrent: setCurrent,
    keepsFalling: keepsFalling,
    moveLeft: moveLeft,
    moveRight: moveRight,
    moveDown: moveDown
  }
})();

// fallingTetris.keepsFalling()


// -------------------------------------------
// ------------- USER INTERFACE --------------

const keydownHandler = (function() {
  let targetObject;
  const setTarget = function(target) {
    targetObject = target;
  };
  const fire = function() {
    if (!targetObject) {
        throw new Error('No keydown target set!')   
    }  
    const listenedKeys = {
      ArrowDown: targetObject.moveDown,
      ArrowRight: targetObject.moveRight,
      ArrowLeft: targetObject.moveLeft,
  //   z: (function() { activeShape.rotate(-90) }),
  //   a: (function() { activeShape.rotate(90) }),
    }
      Object.keys(listenedKeys).forEach((name) => {if(event.key === name) { listenedKeys[name]() } });
  }

  return {
    setTarget: setTarget,
    fire: fire
  };

})();

function addListeners() {
  window.addEventListener('keydown', keydownHandler.fire)
}

keydownHandler.setTarget(fallingTetris);
addListeners()


