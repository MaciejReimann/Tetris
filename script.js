

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




view.largeCanvas = new Canvas(view.canvasConfig.largeCanvas);
view.smallCanvas = new Canvas(view.canvasConfig.smallCanvas);
view.main.insertBefore(view.smallCanvas.canvas, view.largeCanvas.canvas);




const size = view.canvasConfig.modularUnit;
const centerOfCanvas = {x:200, y: 225}
const sqr = new Square(size, centerOfCanvas, 45)
const poly = new RegularPolygon(4, 20, centerOfCanvas, 45);
poly.drawOutline(view.largeCanvas.ctx);
sqr.drawOutline(view.largeCanvas.ctx);


const tetrisFactory = new TetrisFactory(view.canvasConfig.modularUnit);
const timer = new Timer(view.timer);

// --------------------------------------------------------
// --------------------------------------------------------
// ------------------- GAME OBJECT  -----------------------
// --------------------------------------------------------
// --------------------------------------------------------

const game = (function() {
  let gameStatus;
  const showMessage = view.showMessage;
  const smallCanvas = view.smallCanvas;
  const largeCanvas = view.largeCanvas;

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

  const tetrisOnCanvas = (function() {

    return {

    }
  })();

  const fallingTetris = (function() {
    let _fallingRate = 500;
    let _interval;
    let currentInstance;

    function collide() {
      const allSquares = largeCanvas.getSquares();

      // console.log(tetrisOnCanvas);
    }

    function _nameOfFirst() {
      return nextTetris.getFirstName();
    };
    function _getStartPoint() {
      return Object.assign({}, largeCanvas.config.startPoints[0])
    };
    function _fallDown() {
      positionHandler("Move Down");
    }
    function placeOnStart() {   
      currentInstance = tetrisFactory.produce(_nameOfFirst(), _getStartPoint());
    };
    function getInstance() {
      return currentInstance;            
    };
    function getSquares() {
       return currentInstance.createSquares();            
    };   
    function addInterval() {
      _interval = setInterval(_fallDown, _fallingRate);
    }
    function removeInterval() {
      clearInterval(_interval);
    }
    function positionHandler(event) {
      let tetris = getInstance();

      if(event.key === 'ArrowDown' || event === "Move Down") {
        if(tetris.staysOnCanvasWhen().movedDown()) {
          collide()
          tetris.moveDown();
        } else {
          gameEventsHandler("Cannot move down")
        }
      } else if(event.key === 'ArrowRight') {
        if (tetris.staysOnCanvasWhen().movedRight()) {
          tetris.moveRight();
        }
      } else if(event.key === 'ArrowLeft') {
        if (tetris.staysOnCanvasWhen().movedLeft()) {
          tetris.moveLeft();
        }
      } else if(event.key === 'z'|| event.key === 'Z') {
        if(tetris.staysOnCanvasWhen().rotated('rotateLeft', 'rotateRight')) {
          tetris.rotateLeft();
        }
      } else if(event.key === 'a'|| event.key === 'A') {
        if(tetris.staysOnCanvasWhen().rotated('rotateRight', 'rotateLeft')) {
          tetris.rotateRight();
        }
      }
      gameEventsHandler("position changed");
    };

    return {
      addInterval:addInterval,
      removeInterval:removeInterval,
      positionHandler: positionHandler,
      placeOnStart: placeOnStart,
      getSquares: getSquares,
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
    timer.addInterval();
    fallingTetris.addInterval();
  };
  function removeIntervals() {
    timer.removeInterval();
    fallingTetris.removeInterval();
  };

  // ----------- GAME FLOW ----------  

  function smallCanvasUpdate() {
    nextTetris.placeOnStart();
    smallCanvas.updateTetris(nextTetris.getInstances());
    smallCanvas.render();
  };

  function largeCanvasUpdate() {
    fallingTetris.placeOnStart();
    largeCanvas.updateTetris(fallingTetris.getInstance());
    largeCanvas.render();
  };

  function next() {
    nextTetris.shiftNames();
    largeCanvas.addSquares(fallingTetris.getSquares());
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
    timer.append();
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