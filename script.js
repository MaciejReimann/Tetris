

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
Canvas.prototype.render = function(shape) {
  this.clear();
  this.renderContent();
};
Canvas.prototype.addContent = function(shapes) {
  if(shapes instanceof Array) {
    shapes.forEach((shape) => this.shapes.push(shape));
  } else {
    this.shapes.push(shapes);
  }
};
Canvas.prototype.updateContent = function(shapes) {
  this.shapes = [];
  this.addContent(shapes)
};
Canvas.prototype.renderContent = function(shape) {
  this.shapes.forEach((shape) => {
    shape.drawFill(this.ctx);
  });
}


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

// ----- VERTEX TRANSFORMATION FUNCTIONS ------

const size = view.canvasConfig.modularUnit;
const centerOfCanvas = {x:200, y: 225}
const sqr = new Square(size, centerOfCanvas, 45)
const poly = new RegularPolygon(4, 20, centerOfCanvas, 45);
poly.drawOutline(view.largeCanvas.ctx);
sqr.drawOutline(view.largeCanvas.ctx);



function getRandomItem(array) {
  return array[ Math.floor(Math.random() * array.length) ];
};

function translateToGlobal(localZero, localVertices, mod) { // localZero in global units, localVertices in local units, mod - the size of the local unit
  if(!mod) { mod = 1 }; // mod will not affect the return values;
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

function translateToLocal(localZero, globalVertices) {
  if(globalVertices instanceof Array) {
    return globalVertices.map( (globalVertex) => translateToLocal(localZero, globalVertex) );
  } else {
    let globalVertex = globalVertices;
    return {
      x: globalVertex.x - localZero.x,
      y: globalVertex.y - localZero.y
    };
  };
};

function translateToCartesian(vertices) {
if(vertices instanceof Array) {
    return vertices.map( (vertex) => translateToCartesian(vertex) );
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
      angle: Math.atan2(vertex.y, vertex.x) * (180 / Math.PI),
    };
  };
};

function rotatePolar(polarVertices, angle) {
  if(polarVertices instanceof Array) {
    return polarVertices.map( (polarVertex) => rotatePolar(polarVertex, angle) );
  } else {
    let polarVertex = polarVertices;
    return {
      r: polarVertex.r,
      angle: polarVertex.angle + angle
    };
  };
};

function rotateCartesian(localVertices, angle) { // if rotate localVertices, pivot is in 0,0; if rotateGlobal pivot needs to be set; pivot = localZero
  if(localVertices instanceof Array) {
    return localVertices.map( (localVertex) => rotateCartesian(localVertex, angle));
  } else {
    console.log(angle)
    let localVertex = localVertices;
    let cartesian = translateToCartesian( 
      rotatePolar( 
        translateToPolar(localVertex), 
      angle) 
    );
    return cartesian  
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

// --------------------------------------------------------
// --------------------------------------------------------
// ----------------- TETRIS FACTORY  ----------------------
// --------------------------------------------------------
// --------------------------------------------------------

const tetrisFactory = (function() {
  const modularUnit = view.canvasConfig.modularUnit;
  const possibleShapes = ['square-type', 's-type', 'z-type'];  
  const defaultColor = 'blue';
  // const possibleShapes = ['square-type', 's-type', 'z-type', 'i-type', 'l-type', 'l-type-mirrored'];
  
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
  };
  Tetris.prototype.getGlobalSquareCenters = function() {
    return translateToGlobal(this.pivot, this.squareCenters, this.mod);
  };
  Tetris.prototype.createSquares = function() {
    return this.getGlobalSquareCenters().map( 
      (point) => new Square(this.mod, point, this.angle + 45) 
      );
  };
  Tetris.prototype.drawFill = function(canvas, color) { // this function is called as Canvas method, where canvas.ctx is passed;
    this.canvas = canvas;
    this.createSquares().forEach((square) => square.drawFill(this.canvas));
  };
  Tetris.prototype.setRectangularRange = function(range) {
    // console.log(this.canvas)
    // if(!range) {
    //   this.range = {
    //     left: 0,
    //     right: this.ctx.canvas.width, HOW IS THE CANVAS PASSED TO TETRIS???? THERE IS A MESS
    //     down: this.canvas.height
    //   }
    // };
  };
  Tetris.prototype.isWithinRange = function() {
    this.setRectangularRange();

    return true;
  };

  // --------- TETRIS TRANSFORMATIONS ----------

  Tetris.prototype.moveRight = function() {
    if(this.isWithinRange()) {
      this.pivot.x += this.mod;
    }
  };
  Tetris.prototype.moveDown = function() {
    if(this.isWithinRange()) {
      this.pivot.y += this.mod;
    }
  };
  Tetris.prototype.moveLeft = function() {
    if(this.isWithinRange()) {
      this.pivot.x -= this.mod;
    }
  };
  Tetris.prototype.rotateLeft = function() {
    let rotation = -90;
    this.squareCenters = translateToCartesian( 
      rotatePolar( translateToPolar(this.squareCenters), rotation ) );
    this.angle = this.angle % 360 + rotation;

  };
  Tetris.prototype.rotateRight = function() {
    let rotation = 90;
    this.squareCenters = translateToCartesian( 
      rotatePolar( translateToPolar(this.squareCenters), rotation ) );
    this.angle = this.angle % 360 + rotation;
  };

  // -------- FACTORY INTERFACE ---------

	const produce = function(type, point) { // type(string), startPoint - all obligatory
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
    // const canvas = view.smallCanvas;  
    const names = []; // populated by 3 possible Tetris types names; first from the array is assigned to fallingTetris;   
    const startPoints = smallCanvas.config.startPoints;
    let currentInstances;

    const generateNames = function() {
      startPoints.forEach((point) => names.push(tetrisFactory.getRandomName()))
    }();

    const placeOnStart = function() {
      currentInstances = startPoints.map( 
        (point, i = point[index] ) => tetrisFactory.produce(names[ i ], point) 
      );
      return currentInstances;
    };
    function getInstances() {
      return currentInstances;
    };
    function shiftNames() {
      names.push(tetrisFactory.getRandomName());
      names.shift();
    };

    function getFirstName() {
      return names[0]    
    };
    return {
      shiftNames: shiftNames,
      placeOnStart: placeOnStart,
      getInstances: getInstances,
      getFirstName: getFirstName,
    };

  })();

  const fallingTetris = (function() {
    const nameOfFirst = nextTetris.getFirstName;
    const startPoint = largeCanvas.config.startPoints[0];
    let currentInstance;

    const placeOnStart = function() {
      currentInstance = tetrisFactory.produce(nameOfFirst(), startPoint);
      return currentInstance;
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
  };
  function fallDown() {
    fallingTetris.getInstance().moveDown();
    largeCanvas.render();
  };

  // ---- GAME CONTROLS ----  

  function start() {
    if (gameStatus !== 'playing') {
      showMessage('pause');
    };
    gameStatus = 'playing';

    addIntervals();
    
    fallingTetris.placeOnStart();
    largeCanvas.addContent(fallingTetris.getInstance());
    largeCanvas.render();

    nextTetris.shiftNames();
    nextTetris.placeOnStart();
    smallCanvas.updateContent(nextTetris.getInstances());
    smallCanvas.render();

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

    nextTetris.placeOnStart();
    smallCanvas.updateContent(nextTetris.getInstances());
    smallCanvas.render();

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
  const keydownHandler = function(event) {
    let targetObject = this;
    if (!targetObject) {
      throw new Error('No keydown target set!')   
    };
    const listenedKeys = {
      ArrowDown: "moveDown",
      ArrowRight: "moveRight",
      ArrowLeft: "moveLeft",
      z: "rotateLeft",
      a: "rotateRight",
    }
    Object.keys(listenedKeys).forEach( (name) => {
      if(event.key === name) {
        targetObject[ listenedKeys[name] ] ();
      };
    });
    largeCanvas.render();
  };
  function addKeyControls(obj) {
    window.addEventListener('keydown', keydownHandler.bind(obj))
  };

  // game object has only one method which is called with an IIFE
  return {
    welcome: welcome,
  }
})().welcome();