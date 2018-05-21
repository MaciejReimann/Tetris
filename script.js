

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

view.canvasConfig = (function(mod, width, height) { // takes in modular unit value and canvas dimensions expressed in this value
  const largeWidth = width * mod;
  const largeHeight = height * mod;
  const smallWidth = largeWidth;
  const smallHeight = largeHeight / 9;
  function getOffsetPoints(start, amount, offsetX) { // global units 
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
      startPoints: [{  // global units 
        x: largeWidth / 2, 
        y: 5
      }]
    },
    smallCanvas: {
      width: smallWidth,
      height: smallHeight,
      parentElement: view.main,
      className: 'small-canvas',
      startPoints: getOffsetPoints({  // global units 
        x: smallWidth / 2, 
        y: smallHeight / 2
      }, 3, 70)
    },
  };
})(10, 40, 45);

const Canvas = function(config) {
  this.config = config;
  this.canvas = document.createElement('canvas');
  this.canvas.className = config.className;
  this.canvas.width = config.width;
  this.canvas.height = config.height;  
  config.parentElement.appendChild(this.canvas);
  this.ctx = this.canvas.getContext('2d');
  this.shapes = [];
};
Canvas.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
};
// Canvas.prototype.render = function(shape) {
//   console.log("canvas constructor render")
// }
// Canvas.prototype.addContent = function(shape) {
//   this.shapes.push(shape);
// }
// Canvas.prototype.addContent = function(shape) {
//   this.shapes.push(shape);
// }

view.largeCanvas = new Canvas(view.canvasConfig.largeCanvas);
view.smallCanvas = new Canvas(view.canvasConfig.smallCanvas);
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

// ----- HELPER FUNCTIONS ------

function getRandomItem(array) {
  return array[ Math.floor(Math.random() * array.length) ];
};

function translateToGlobal(localZero, localVertices, mod) { // localZero in global units, localVertices in local units, mod - the size of the local unit
  if(localVertices instanceof Array) {
    return localVertices.map( (localVertex) => translateToGlobal(localZero, localVertex, mod) );
   } else {
    let localVertex = localVertices;
    return { // vertex in global units
      x: localZero.x + localVertex.x * mod,
      y: localZero.y + localVertex.y * mod 
    };
  };
};

function translateToCartesian(vertices) {
if(vertices instanceof Array) {
    return vertices.map( (vertex) => translateToPolar(vertex) );
  } else { // TODO: Add argument validation - check if vertices has r and angle property and their value is number, else throw an Error;  
    let vertex = vertices;
    let n = 0; // optional angle parameter    
    return {
      x: vertex.r * Math.cos( (vertex.angle - n) * (Math.PI / 180) ),
      y: vertex.r * Math.sin( (vertex.angle - n) * (Math.PI / 180) ),
    };
  };
};

function translateToPolar(vertices) {
  if(vertices instanceof Array) {
    return vertices.map( (vertex) => translateToPolar(vertex) );
  } else { // TODO: Add argument validation - check if vertices has x and y property and their value is number, else throw an Error;  
    let vertex = vertices;
    return {
      r: Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y),
      angle: Math.atan2(vertex.x, vertex.y) * (180 / Math.PI),
    };
  };
};

function mirrorByY_Axis(vertices) {
  if(vertices instanceof Array) {
    return vertices.map( (vertex) => mirrorByY_Axis(vertex) );
  } else {
    let vertex = vertices;
    return {
      x: vertex.x * -1, 
      y: vertex.y
    };
  };
};






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





// --------------------------------------------------------
// --------------------------------------------------------
// ----------------- TETRIS FACTORY  ----------------------
// --------------------------------------------------------
// --------------------------------------------------------

const tetrisFactory = (function() {
  const modularUnit = view.canvasConfig.modularUnit;
  const possibleShapes = ['square-type', 's-type', 'z-type'];  
  const defaultColor = 'blue';
  let ctx;
  // const possibleShapes = ['square-type', 's-type', 'z-type', 'i-type', 'l-type', 'l-type-mirrored'];
  
  // --=-- BASIC MODULAR UNIT CONSTRUCTOR -----

  function Square(point) { // point = {x: x, y: y}; in global units
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
    this.squareCenters = [ // position of the Square.center in relation to Tetris.pivot in local units
      {x: -1, y: 0.5}, {x: 0, y: 0.5}, {x: 0, y: -0.5}, {x: 1, y: -0.5}
    ]
  }
  Tetris_S.prototype = Object.create(Tetris.prototype);
  Tetris_S.prototype.constructor = Tetris_S;

  function Tetris_Z(pivot) {
    Tetris.call(this, pivot);
    Tetris_S.call(this, pivot);
    this.name = 'z-type';
    this.squareCenters = mirrorByY_Axis(this.squareCenters);
  }
  Tetris_Z.prototype = Object.create(Tetris.prototype);
  Tetris_Z.prototype.constructor = Tetris_Z;


  // --------- MAIN TETRIS CONSTRUCTOR ---------

  function Tetris(pivot) { // pivot = { x: x, y: y} in global units
    this.mod = modularUnit;
    this.pivot = pivot; 
    this.angle = 0;
    this.squares = []; // to be populated by the Square instances
  };
  Tetris.prototype.getGlobalCenters = function() {
    return translateToGlobal(this.pivot, this.squareCenters, this.mod);
  };
  Tetris.prototype.createSquares = function() { // creates Square instances for each squareCenter in the squares array;
    if (this.squares.length === 0 ) { // if already created do nothing
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
    this.pivot.x += this.mod;
    this.squares.forEach((square) => square.moveRight());
    this.drawFill();
  }
  Tetris.prototype.moveDown = function() {
    this.pivot.y += this.mod;
    this.squares.forEach((square) => square.moveDown());
    this.drawFill();
  }
  Tetris.prototype.moveLeft = function() {
    this.pivot.x -= this.mod;
    this.squares.forEach((square) => square.moveLeft());
    this.drawFill();
  }

  // -------- FACTORY INTERFACE ---------

	const produce = function(type, canvas, point) { // type(string), canvas(DOMElement), startPoint - all obligatory
    ctx = canvas.ctx; // Tetris method use this closure; ctx is not defined in tetris constructor;
    
    if (type === 'square-type') {
        return new Tetris_Square( point );
    } else if (type === 's-type') {
        return new Tetris_S( point );
    } else if (type === 'z-type') {
        return new Tetris_Z( point );
    }  
	};
  const getRandomName = function() {
     return getRandomItem(possibleShapes);
  }; 
	return {
    produce: produce,
    getRandomName: getRandomName
	};
})();


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
    const names = []; // populated by 3 possible Tetris types names; first from the array is assigned to fallingTetris;   
    const startPoints = canvas.config.startPoints;

    const generateNames = function() {
      startPoints.forEach((point) => names.push(tetrisFactory.getRandomName()))
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
    function render() {
      canvas.clear();
      createTetris().forEach(tetris => tetris.drawFill());
    };
    return {
      render: render,
      getFirstName: getFirstName
    };

  })();

  const fallingTetris = (function() {
    const canvas = largeCanvas;
    const nameOfFirst = nextTetris.getFirstName();
    const startPoint = canvas.config.startPoints[0];
    let currentInstance;

    const placeOnStart = function() {
      currentInstance = tetrisFactory.produce(nameOfFirst, canvas, startPoint);
      currentInstance.drawFill('grey');
    };
    const getInstance = function() {
      return currentInstance;
    };
    return {
      placeOnStart: placeOnStart,
      getInstance: getInstance,
    };
  })();

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
    largeCanvas.clear();
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
    largeCanvas.clear();
    targetObject.drawFill();
  };
  function addKeyControls(obj) {
    window.addEventListener('keydown', keydownHandler.bind(obj))
  };

  // game object has only one method which is called with an IIFE
  return {
    welcome: welcome,
  }
})().welcome();