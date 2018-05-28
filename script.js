

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
    shape.drawFill(this); // passes canvas object reference to Tetris
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

const size = view.canvasConfig.modularUnit;
const centerOfCanvas = {x:200, y: 225}
const sqr = new Square(size, centerOfCanvas, 45)
const poly = new RegularPolygon(4, 20, centerOfCanvas, 45);
poly.drawOutline(view.largeCanvas.ctx);
sqr.drawOutline(view.largeCanvas.ctx);


const tetrisFactory = new TetrisFactory(view.canvasConfig.modularUnit);

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
  

  

  const nextTetris = (function() { 
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
    let currentInstance;
    let _fallingRate = 200;
    let _interval;
    const eventsHandler = gameEventsHandler;

    function _nameOfFirst() {
      return nextTetris.getFirstName();
    };
    function _getStartPoint() {
      return Object.assign({}, largeCanvas.config.startPoints[0])
    };
    function placeOnStart() {   
      currentInstance = tetrisFactory.produce(_nameOfFirst(), _getStartPoint(), eventsHandler);
    };
    function getInstance() {
      return currentInstance;            
    };
    function _fallDown() {
      positionHandler("Move Down");
    }
    function addInterval() {
      _interval = setInterval(_fallDown, _fallingRate);
    }
    function removeInterval() {
      clearInterval(_interval);
    }
    function positionHandler(event) {
      let tetris = getInstance();

      if(event.key === 'ArrowDown' || event === "Move Down") {
        if( tetris.canMove().down() ) {
          tetris.moveDown();
        } else {
          gameEventsHandler("Cannot move down")
        }
      } else if(event.key === 'ArrowRight') {
        tetris.moveRight();
      } else if(event.key === 'ArrowLeft') {
        tetris.moveLeft();
      } else if(event.key === 'z') {
        tetris.rotateLeft();
      } else if(event.key === 'a') {
        tetris.rotateRight();
      }
      gameEventsHandler("position changed");
    };
    
    return {
      addInterval:addInterval,
      removeInterval:removeInterval,
      positionHandler: positionHandler,
      placeOnStart: placeOnStart,
      getInstance: getInstance,
    };
  })();

  function gameEventsHandler (gameEvent) {
    console.log(gameEvent);
    if(gameEvent === "position changed") {
      largeCanvas.render();
    }

    if(gameEvent === "Cannot move down") {
      console.log("cant move Down")
      next();
    }
  };

  function addIntervals() {
    clockInterval = setInterval(clockTicking, 1000);
    fallingInterval = fallingTetris.addInterval();
  };
  function removeIntervals() {
    clearInterval(clockInterval);
    fallingTetris.removeInterval() 
  };
  function clockTicking() {
    timer.renderIncremented();
  };

  // ----------- GAME FLOW ----------  

  function smallCanvasUpdate() {
    nextTetris.placeOnStart();
    smallCanvas.updateContent(nextTetris.getInstances());
    smallCanvas.render();
  };

  function largeCanvasUpdate() {
    fallingTetris.placeOnStart();
    largeCanvas.addContent(fallingTetris.getInstance());
    largeCanvas.render()
  };

  function next() {
    nextTetris.shiftNames();
    smallCanvasUpdate();    
    largeCanvasUpdate();
  };
  function start() {
    if (gameStatus !== 'playing') {
      showMessage('pause');
    };
    gameStatus = 'playing';
    
    largeCanvasUpdate();
    nextTetris.shiftNames();
    smallCanvasUpdate();
    addIntervals();
    window.addEventListener('keydown', fallingTetris.positionHandler);    
  };
  function pause() {
    if (gameStatus !== 'paused') {
      showMessage('resume');
    };
    gameStatus = 'paused';
    removeIntervals();
    window.removeEventListener('keydown', fallingTetris.positionHandler);
  };
  function resume() {
    if (gameStatus !== 'playing') {
      showMessage('pause');
    };
    gameStatus = 'playing';
    addIntervals();
    window.addEventListener('keydown', fallingTetris.positionHandler);
  };
  function welcome() {
    showMessage('start');
    smallCanvasUpdate();
    timer.place();
    window.addEventListener('keydown', gameStatusHandler);
  };

  function gameStatusHandler(event) {
    if (event.code === "Space" && gameStatus === 'playing') {
      pause();
    } else if (event.code === "Space" && gameStatus === 'paused') {
      resume();
    } else if (gameStatus === undefined) {
      start();
    }
  };  
  // game object has only one method which is called with an IIFE
  return {
    welcome: welcome,
  }
})().welcome();