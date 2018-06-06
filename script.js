

// --- DOM ELEMENTS ----

view = {};
view.main = document.querySelector('.main');
view.footer = document.querySelector('.footer');
view.timer = document.querySelector('.timer');
view.score = document.querySelector('.score');

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
  return {
    largeCanvas: {
      modularUnit: mod,
      width: largeWidth,
      height: largeHeight,
      parentElement: view.main,
      className: 'large-canvas',
    },
    smallCanvas: {
      modularUnit: mod,
      width: largeWidth,
      height: largeHeight / 9,
      parentElement: view.main,
      className: 'small-canvas',
    },
  };
})(10, 12, 35);

view.largeCanvas = new Canvas(view.canvasConfig.largeCanvas);
view.smallCanvas = new Canvas(view.canvasConfig.smallCanvas);
view.main.insertBefore(view.smallCanvas.canvas, view.largeCanvas.canvas);




const size = view.canvasConfig.largeCanvas.modularUnit;
const centerOfCanvas = {x:200, y: 225}
const sqr = new Square(size, centerOfCanvas, 45)
const poly = new RegularPolygon(4, 20, centerOfCanvas, 45);
poly.drawOutline(view.largeCanvas.ctx);
sqr.drawOutline(view.largeCanvas.ctx);

const sqr2 = new Square(size, {x: centerOfCanvas.x+10, y: centerOfCanvas.y}, 45);
sqr2.drawOutline(view.largeCanvas.ctx);


const tetrisFactory = new TetrisFactory(view.canvasConfig.largeCanvas.modularUnit);
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
    let currentInstances; // populated by Tetris instances with the canters generated by generateStartPoints();
    const names = []; // populated by 3 possible Tetris types names; first name from the array is passed  to fallingTetris;
    const center = new CartesianVertex(smallCanvas.config.width / 2, smallCanvas.config.height / 2)
    const startPoints = (function(start, amount, offsetX) {
      let arrayOfPoints = [start];
      for (let i = 1; i < amount; i++) {
        arrayOfPoints.push(new CartesianVertex(start.x + offsetX, start.y));
      };
      return arrayOfPoints;
    })(center, 3, 70);

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
    const _startPoint = new CartesianVertex(largeCanvas.config.width / 2, 0);
    const _fallingRate = 500;
    let _interval;
    let currentInstance;

    function _tetrisOnCanvas() {
      return largeCanvas.getSquares();
    };
    function _nameOfFirst() {
      return nextTetris.getFirstName();
    };
    function _fallDown() {
      positionHandler("Move Down");
    }
    function placeOnStart() {   
      currentInstance = tetrisFactory.produce(_nameOfFirst(), _startPoint);
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
        if(tetris.staysOnCanvasWhen().movedDown()  
          && !tetris.collidesWith(_tetrisOnCanvas, "down")
          ) {
          tetris.moveDown();
        } else {
          gameEventsHandler("Cannot move down")
        }
      } else if(event.key === 'ArrowRight') {
        if (tetris.staysOnCanvasWhen().movedRight()
          && !tetris.collidesWith(_tetrisOnCanvas, "right")
          ) {
          tetris.moveRight();
        }
      } else if(event.key === 'ArrowLeft') {
        if (tetris.staysOnCanvasWhen().movedLeft()
          && !tetris.collidesWith(_tetrisOnCanvas, "left")
          ) {
          tetris.moveLeft();
        }
      } else if(event.key === 'z'|| event.key === 'Z') {
        if(tetris.staysOnCanvasWhen().rotated('rotateLeft', 'rotateRight')
          && !tetris.collidesWith(_tetrisOnCanvas, "any")
          ) {
          tetris.rotateLeft();
        }
      } else if(event.key === 'a'|| event.key === 'A') {
        if(tetris.staysOnCanvasWhen().rotated('rotateRight', 'rotateLeft')
          && !tetris.collidesWith(_tetrisOnCanvas, "any")
          ) {
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

  function gameEventsHandler (gameEvent) {// all events managed here!!!!! <  tetris = fallingTetris.getInstance().moveRight() >
    // console.log(gameEvent);
    if(gameEvent === "position changed") {
      largeCanvas.render();
    }

    if(gameEvent === "Cannot move down") {
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
    largeCanvas.deleteFullRowsAndDrop(largeCanvas.checkWhichRowIsFull());
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