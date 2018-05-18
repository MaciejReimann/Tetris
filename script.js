

view = {};
view.main = document.querySelector('.main');
view.footer = document.querySelector('.footer');
view.timer = document.querySelector('.timer');

view.showMessage = function(shortMessage) {
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
};

// --- CANVAS SETUP ----

view.config = (function(mod, width, height) {
  const largeWidth = width * mod;
  const largeHeight = height * mod;
  const smallWidth = largeWidth;
  const smallHeight = largeHeight / 9;
  function getOffsetPoints(start, amount, offsetX) {
    let arrayOfPoints = [start];
    for (let i = 1; i < amount; i++) {
      let nextPoint = {
        x: arrayOfPoints[i - 1].x + offsetX,
        y: arrayOfPoints[i - 1].y
      }
      arrayOfPoints.push(nextPoint);
    }
    return arrayOfPoints;
  };
  return {
    modularUnit: mod,
    largeCanvas: {
      width: largeWidth,
      height: largeHeight,
      parentElement: view.main,
      className: 'large-canvas',
      startPoints: [{
        x: largeWidth / 2, 
        y: 5
      }]
    },
    smallCanvas: {    
      width: smallWidth,
      height: smallHeight,
      parentElement: view.main,
      className: 'small-canvas',
      startPoints: getOffsetPoints({
        x: smallWidth / 2, 
        y: smallHeight / 2
      }, 3, 70)
    },
  };
})(10, 40, 45);

const Canvas = function(config) {
  this.canvas = document.createElement('canvas');
  this.canvas.className = config.className;
  this.canvas.width = config.width;
  this.canvas.height = config.height;  
  config.parentElement.appendChild(this.canvas);
  this.ctx = this.canvas.getContext('2d');
};
Canvas.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
};

view.largeCanvas = new Canvas(view.config.largeCanvas);
view.smallCanvas = new Canvas(view.config.smallCanvas);
view.main.insertBefore(view.smallCanvas.canvas, view.largeCanvas.canvas);

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
  };
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

function getRandomItem(array) {
  const length = array.length;
  const randomNumber = Math.floor(Math.random() * length);
  return array[randomNumber];
}

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


// --------------------------------------------------------
// --------------------------------------------------------
// ----------------- TETRIS FACTORY  ----------------------
// --------------------------------------------------------
// --------------------------------------------------------

const tetrisFactory = (function(unit) {
  const modularUnit = unit;
  const defaultColor = 'blue';
  let ctx;
  // const possibleShapes = ['square-type', 's-type', 'z-type', 'i-type', 'l-type', 'l-type-mirrored'];
  const possibleShapes = ['square-type', 's-type', 'z-type'];
  
  // --=-- BASIC MODULAR UNIT CONSTRUCTOR -----

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
  Square.prototype.moveRight = function() { // moves the center right
    this.center.x += this.mod;
  };
  Square.prototype.moveDown = function() { // moves the center left
    this.center.y += this.mod;
  };
  Square.prototype.moveLeft = function() { // moves the center down
    this.center.x -= this.mod;
  };
  // --- POSSIBLE TETRIS SHAPES CONSTRUCTORS ---

  function Tetris_Square(pivot) {
    Tetris.call(this, pivot);
    this.name = 'square-type';
    this.squareCenters = [ // position of the Square.center in relation to Tetris.pivot
      {x: -0.5, y: 0.5}, {x: -0.5, y: -0.5}, {x: 0.5, y: -0.5}, {x: 0.5, y: 0.5}
    ];
  };
  Tetris_Square.prototype = Object.create(Tetris.prototype);
  Tetris_Square.prototype.constructor = Tetris_Square;
    
  function Tetris_S(pivot) {
    Tetris.call(this, pivot);
    this.name = 's-type';
    this.squareCenters = [ // position of the Square.center in relation to Tetris.pivot
      {x: -1, y: 0.5}, {x: 0, y: 0.5}, {x: 0, y: -0.5}, {x: 1, y: -0.5}
    ]
  }
  Tetris_S.prototype = Object.create(Tetris.prototype);
  Tetris_S.prototype.constructor = Tetris_S;

  function Tetris_Z(pivot) {
    Tetris.call(this, pivot);
    Tetris_S.call(this, pivot);
    this.name = 'z-type';
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

  // --------- TETRIS TRANSFORMATIONS ----------

  Tetris.prototype.moveRight = function() {
    this.squares.forEach((square) => square.moveRight());
    this.drawFill();
    // this.pivot.x += this.mod;
  }
  Tetris.prototype.moveDown = function() {      
    this.squares.forEach((square) => square.moveDown());
    this.drawFill();
  }
  Tetris.prototype.moveLeft = function() {
    this.squares.forEach((square) => square.moveLeft());
    this.drawFill();
  }

  // -------- FACTORY INTERFACE ---------

	const produce = function(type, canvas, start) {
    ctx = canvas.ctx; // Tetris method use this closure; ctx is not defined in tetris constructor;
		// console.log(type, ctx, start.x, start.y);
    if (type === 'square-type') {
        return new Tetris_Square(start);
    } else if (type === 's-type') {
        return new Tetris_S(start);
    } else if (type === 'z-type') {
        return new Tetris_Z(start);
    }  
	};
  const getRandomName = function() {
     return getRandomItem(possibleShapes);
  }; 
	return {
    produce: produce,
    getRandomName: getRandomName
	};
})(view.config.modularUnit);


// --------------------------------------------------------
// --------------------------------------------------------
// ------------------- GAME OBJECT  -----------------------
// --------------------------------------------------------
// --------------------------------------------------------


const game = (function() {
  const showMessage = view.showMessage;
  const smallCanvas = view.smallCanvas;
  const largeCanvas = view.largeCanvas;

  // closures; to be assigned/udated by the below functions
  let gameStatus;
  let clockInterval;
  let fallingInterval;
  let fallingRate = 1000;

  const nextTetris = (function() {
    const canvas = view.smallCanvas;
    const ctx = view.smallCanvas.ctx;
    const names = []; // populated by 3 possible Tetris types names; first from the array is assigned to fallingTetris;   
    const startPoints = view.config.smallCanvas.startPoints;

    const generateNames = function() {
      startPoints.forEach((point) => names.push(tetrisFactory.getRandomName()))
      // console.log(names);
    }();
    function createTetris() {
      let tetrisArray = []; 
      startPoints.forEach((point, index) => {
        tetrisArray.push(tetrisFactory.produce(names[ index ], canvas, point));
      });
      return tetrisArray;
    };
    function getFirstName() {
      const firstName = names.shift();
      names.push(tetrisFactory.getRandomName());
      render();
      return firstName;
    };
    function clear() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    };
    function render() {
      clear();
      createTetris().forEach((tetris) => tetris.drawFill("pink"));
      console.log("Small canvas rendered")
    };
    return {
      render: render,
      getFirstName: getFirstName
    };

  })();

  const fallingTetris = (function(canvas, startPoint) {
    const getName = nextTetris.getFirstName;
    let currentInstance;

    const getInstance = function() {
      return currentInstance;
    };
    const placeOnStart = function() {
      currentInstance = tetrisFactory.produce(getName(), canvas, startPoint);
      currentInstance.drawFill('grey');
    };
    return {
      placeOnStart: placeOnStart,
      getInstance: getInstance,
    };
  })(view.largeCanvas, view.config.largeCanvas.startPoints[0]);

  function addIntervals() {
    clockInterval = setInterval(clockTicking, 1000);
    fallingInterval = setInterval(fallDown, fallingRate);  
  };
  function removeIntervals() {
    clearInterval(clockInterval);
    clearInterval(fallingInterval); 
  };
  function clockTicking() {
    timer.renderIncremented();
    console.log("tetris wil be falling");
  };
  function fallDown() {
    fallingTetris.getInstance().moveDown();
  };

  // ---- GAME CONTROLS ----  

  function start() {
    if (gameStatus !== 'playing') {
      showMessage('pause');
    };
    gameStatus = 'playing';

    addIntervals();
    fallingTetris.placeOnStart();
    addKeyControls(fallingTetris.getInstance());
  };
  function pause() {
    if (gameStatus !== 'paused') {
      showMessage('resume');
    };
    gameStatus = 'paused';

    removeIntervals();
  };
  function resume() {
    if (gameStatus !== 'playing') {
      showMessage('pause');
    };
    gameStatus = 'playing';

    addIntervals()
  };
  function welcome() {
    showMessage('start');
    nextTetris.render();
    //largeCanvas.render()
    timer.place();
    window.addEventListener('keydown', gameStatusHandler);
    return "Game loaded";
  };

  // -------------------------------------------
  // ------------- USER INTERFACE --------------

  function gameStatusHandler(event) {
    if (event.code === "Space" && gameStatus === 'playing') {
      pause();
    } else if (event.code === "Space" && gameStatus === 'paused') {
      resume();
    } else if (gameStatus === undefined) {
      start();
    }
  };  
  const keydownHandler = function() {
    let targetObject = this;
    if (!targetObject) {
      throw new Error('No keydown target set!')   
    };
    const listenedKeys = {
      ArrowDown: targetObject.moveDown.bind(targetObject),
      ArrowRight: targetObject.moveRight.bind(targetObject),
      ArrowLeft: targetObject.moveLeft.bind(targetObject),
  //   z: (function() { activeShape.rotate(-90) }),
  //   a: (function() { activeShape.rotate(90) }),
    }
    Object.keys(listenedKeys).forEach((name) => {if(event.key === name) { listenedKeys[name]() } });
  };
  function addKeyControls(obj) {
    window.addEventListener('keydown', keydownHandler.bind(obj))
  };

  // game object has only one method which is called with an IIFE
  return {
    welcome: welcome,
  }
})().welcome();