

view = {};
view.main = document.querySelector('.main');
view.footer = document.querySelector('.footer');
view.timer = document.querySelector('.timer');

// --- CANVAS SETUP ----

config = {
  modularUnit: 10,
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

view.largeCanvas = createCanvas(config.largeCanvas);
view.smallCanvas = createCanvas(config.smallCanvas);
view.main.insertBefore(view.smallCanvas, view.largeCanvas);

function createCanvas(config) { 	
	const canvas = document.createElement('canvas');
	canvas.className = config.className;
	canvas.width = config.width;
	canvas.height = config.height;  
	config.parentElement.appendChild(canvas);
	return canvas;
};
// --- DOM MANIPULATION ----

function clear(parentElement) {
  if(parentElement.firstElementChild !== null) {
    parentElement.removeChild(parentElement.firstElementChild);
  }
};

// --- TIMER SETUP ----

const timer = (function () {
  const parentElement = view.timer;
  const timerDiv = document.createElement('div');
  let timeInSeconds = 0;
  timerDiv.textContent = timeInSeconds;

  const renderIncremented = function() {
    timeInSeconds++;
    render();
  }
  const render = function() {
    clear(parentElement);
    place();
    // console.log("Timer rendered")
  };
  const place = function() {
    timerDiv.textContent = timeInSeconds;
    parentElement.appendChild(timerDiv);
  };
  return {
    place: place,
    renderIncremented: renderIncremented
  }
})();


 // const setInterval(start, 1000);

// --- GAME SETUP ----


// function generateBottomVertices(width, height, mod) {
//   const bottomVertices = [];
//   const y = height
//   for (let x = 0; x < width; x += mod) {
//     bottomVertices.push([x, y])
//   }
//   return bottomVertices;
// }

// // -------------------------------------------
// 

function translateToGlobal(localZero, vertex, mod) {
  return { 
    x: localZero.x + vertex.x * mod,
    y: localZero.y + vertex.y * mod 
  };
};
function mirror(vertices) {
  let mirrored = [];
  vertices.forEach((vertex) => {
    let mirroredVertex = {x: vertex.x * -1, y: vertex.y};
    mirrored.push(mirroredVertex);
  });
  return mirrored;
};

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


const tetrisFactory = (function(unit) {
  let ctx;
  const modularUnit = unit;
  const defaultColor = 'blue';

  function Square(point) { // point = {x: x, y: y}; in global coordinates
    this.mod = modularUnit;
    this.center = point;
    this.length = this.mod;
    this.color = defaultColor;
    this.vertices = []; // empty array to be populated with 4 vertices calculated on each tranformation;
  }
  Square.prototype.setNewCenter = function(point) { // takes point = {x: x, y: y}; in global coordinates
    this.center = point;
  };
  Square.prototype.getVertices = function() {
    return this.vertices = [
        {x: this.center.x - this.length / 2, y: this.center.y - this.length / 2},
        {x: this.center.x + this.length / 2, y: this.center.y - this.length / 2},
        {x: this.center.x + this.length / 2, y: this.center.y + this.length / 2},
        {x: this.center.x - this.length / 2, y: this.center.y + this.length / 2},
    ]
  };
  Square.prototype.drawOutline = function() {
    const vertices = this.getVertices(); // calculate the vertices for the path
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    ctx.lineTo(vertices[1].x, vertices[1].y);
    ctx.lineTo(vertices[2].x, vertices[2].y);
    ctx.lineTo(vertices[3].x, vertices[3].y);
    ctx.closePath();
    ctx.stroke(); // line width to be defined in the config object
  };
  Square.prototype.drawFill = function(color) {
    this.drawOutline();
    ctx.fillStyle = color || this.color;
    ctx.fill();
  };

  // --- POSSIBLE TETRIS SHAPES CONSTRUCTORS ---

  function Tetris_Square(pivot) {
    Tetris.call(this, pivot);
    this.squareCenters = [ // position of the Square.center in relation to Tetris.pivot
      {x: -0.5, y: 0.5}, {x: -0.5, y: -0.5}, {x: 0.5, y: -0.5}, {x: 0.5, y: 0.5}
    ];
  };
  Tetris_Square.prototype = Object.create(Tetris.prototype);
  Tetris_Square.prototype.constructor = Tetris_Square;
    
  function Tetris_S(pivot) {
    Tetris.call(this, pivot);
    this.squareCenters = [ // position of the Square.center in relation to Tetris.pivot
      {x: -1, y: 0.5}, {x: 0, y: 0.5}, {x: 0, y: -0.5}, {x: 1, y: -0.5}
    ]
  }
  Tetris_S.prototype = Object.create(Tetris.prototype);
  Tetris_S.prototype.constructor = Tetris_S;

  function Tetris_Z(pivot) {
    Tetris.call(this, pivot);
    Tetris_S.call(this, pivot);
    this.squareCenters = mirror(this.squareCenters);
  }
  Tetris_Z.prototype = Object.create(Tetris.prototype);
  Tetris_Z.prototype.constructor = Tetris_Z;


  // --------- MAIN TETRIS CONSTRUCTOR ---------

  function Tetris(pivot) {
    this.mod = modularUnit;
    this.pivot = pivot; 
    this.angle = 0;
    this.squares = []; // to be populated by the Square instances
  };
  Tetris.prototype.getGlobalCenters = function() {
    let globalCenters = [];
    this.squareCenters.forEach(function(center) {
      globalCenters.push(translateToGlobal(this.pivot, center, this.mod));
    }.bind(this) ); 
    return globalCenters;
  };
  Tetris.prototype.createSquares = function() { // creates Square instances for each squareCenter in the squares array
    if (this.squares.length === 0 ) {
      this.getGlobalCenters().forEach((point) => { // needs to get the list of center point in global units
        this.squares.push(new Square(point));
      });
    };
  };
  Tetris.prototype.drawOutline = function() {
    this.createSquares();
    this.squares.forEach((square) => {square.drawOutline()});
  };
  Tetris.prototype.drawFill = function(color) {
    this.createSquares();
    this.squares.forEach((square) => square.drawFill(color));
  };

// -------- FACTORY INTERFACE ---------

	const produce = function(type, contextCanvas, start) {
    ctx = contextCanvas.getContext('2d');
		// console.log(type, ctx, start.x, start.y);
    if (type === 'square-type') {
        return new Tetris_Square(start);
    } else if (type === 's-type') {
        return new Tetris_S(start);
    } else if (type === 'z-type') {
        return new Tetris_Z(start);
    }
  
	};
	return {
		produce: produce,
	};
})(config.modularUnit);


config.smallCanvas.startingPoints = [
  { 
    x: config.smallCanvas.width / 2, 
    y: config.smallCanvas.height / 2 
  },
  { 
    x: config.smallCanvas.width / 2 + 80, 
    y: config.smallCanvas.height / 2 
  },
  { 
    x: config.smallCanvas.width / 2 + 160, 
    y: config.smallCanvas.height / 2 
  },
];
config.largeCanvas.startingPoints = [
  {
    x: config.largeCanvas.width / 2, 
    y: config.modularUnit, 
  }
]

const tetrisExp1 = tetrisFactory.produce('s-type', view.smallCanvas, config.smallCanvas.startingPoints[0]);
const tetrisExp2 = tetrisFactory.produce('z-type', view.smallCanvas, config.smallCanvas.startingPoints[1]);
const tetrisExp3 = tetrisFactory.produce('square-type', view.smallCanvas, config.smallCanvas.startingPoints[2]);


tetrisExp1.drawFill('lightblue')
tetrisExp2.drawFill('orange')
tetrisExp3.drawFill('magenta')

const myTetris1 = tetrisFactory.produce('square-type', view.largeCanvas, config.largeCanvas.startingPoints[0]);
myTetris1.drawFill('pink');


const fallingTetris = (function() {
  let currentInstance;

  const setCurrent = function(tetrisInstance) {
    currentInstance = tetrisInstance;
  };

  const keepsFalling = function() {
    setTimeout(keepsFalling, fallingRate);
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

const game = (function() {
  let gameStatus;
  let interval;

  function onInterval() {
    timer.renderIncremented();
    console.log("tetris wil be falling");
  }

  function start() {
    interval = setInterval(onInterval, 1000);
    if (gameStatus !== 'playing') {
      showMessage('pause');
    };
    gameStatus = 'playing';    
  };
  function pause() {
    clearInterval(interval);
    if (gameStatus !== 'paused') {
      showMessage('resume');
    };
    gameStatus = 'paused';
  };
  function resume() {
    if (gameStatus !== 'playing') {
      showMessage('resume');
    };
    gameStatus = 'playing';
    start();
  };
  function getStatus() {
    return gameStatus;
  };
  return {
    getStatus: getStatus,
    start: start,
    pause: pause,
    resume: resume
  }
})()

const newGame = game;

const showMessage = function(shortMessage) {
  const parentElement = view.footer;
  clear(parentElement);
  const messageDiv = document.createElement("div");
  let message;
  if (shortMessage === 'start') {
    message = "Start game by pressing any key";
  } else if (shortMessage === 'pause') {
    message = "Pause game by pressing spacebar";
  } else if (shortMessage === 'resume') {
    message = "Resume game by pressing spacebar";
  }
  messageDiv.textContent = message;
  parentElement.appendChild(messageDiv);
}

const gameStatusHandler = function(event) {
  let game = newGame;
  if (event.code === "Space" && game.getStatus() === 'playing') {
    game.pause();
  } else if (event.code === "Space" && game.getStatus() === 'paused') {
    game.resume();
  } else if (game.getStatus() === undefined) {
    game.start();
  }
};

function welcome() {
  showMessage('start');
  timer.place();
}

window.addEventListener('keydown', gameStatusHandler);

welcome();




keydownHandler.setTarget(fallingTetris);
// addListeners()


