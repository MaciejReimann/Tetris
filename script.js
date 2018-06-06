

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
    message = "Start game by pressing Enter";
  } else if (shortMessage === 'pause') {
    message = "Pause game by pressing Spacebar";
  } else if (shortMessage === 'resume') {
    message = "Resume game by pressing Spacebar";
  }
  messageDiv.textContent = message;
  parentElement.appendChild(messageDiv);
};

// --- CANVAS SETUP ----

view.canvasConfig = (function(mod, width, height) { 
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
})(15, 20, 30);

view.largeCanvas = new Canvas(view.canvasConfig.largeCanvas);
view.smallCanvas = new Canvas(view.canvasConfig.smallCanvas);
view.main.insertBefore(view.smallCanvas.canvas, view.largeCanvas.canvas);


const tetrisFactory = new TetrisFactory(view.canvasConfig.largeCanvas.modularUnit);
const timer = new Timer(view.timer);

const score = new Score(view.score, 0, calculateScore);
function calculateScore(currentValue, strike) {

}

// --------------------------------------------------------
// --------------------------------------------------------
// ------------------- GAME OBJECT  -----------------------
// --------------------------------------------------------
// --------------------------------------------------------

const game = (function() {
  let gameStatus = 'welcome';
  const showMessage = view.showMessage;
  const smallCanvas = view.smallCanvas;
  const largeCanvas = view.largeCanvas;
  function generateStartPoints(start, amount, offsetX) {
    let arrayOfPoints = [start];
    for (let i = 1; i <= amount; i++) {
      arrayOfPoints.push(new CartesianVertex(arrayOfPoints[i-1].x + offsetX, start.y));
    };
    return arrayOfPoints;
  };

  // const startTetris = (function() {
  //   const center = new CartesianVertex(largeCanvas.config.width / 2, largeCanvas.config.height / 2)
  //   const _startPoints = generateStartPoints(center, 3, 70);

  //   function placeOnStart() {

  //   };
  //   return {
  //     placeOnStart: placeOnStart,
  //   };
  // })(); 

  const nextTetris = (function() { 
    let _currentInstances; // populated by Tetris instances with the canters stored in _startPoints;
    const _center = new CartesianVertex(smallCanvas.config.width / 2, smallCanvas.config.height / 2)
    const _points = generateStartPoints(_center, 3, 70);
    const _names = _points.map(point => tetrisFactory.getRandomName());

    function _shiftNames() {
      _names.push(tetrisFactory.getRandomName());
      _names.shift();
    };
    function placeOnStart() {
      _shiftNames();
      _currentInstances = 
          _points.map( (point, i = point[index] ) => tetrisFactory.produce(_names[ i ], point) );
    };
    function getInstances() {
      return _currentInstances;
    };  
    function getFirstName() {
      return _names[0];
    };
    return {
      getInstances: getInstances,
      placeOnStart: placeOnStart,      
      getFirstName: getFirstName,
    };
  })();

  const fallingTetris = (function() {
    const _fallingRate = 500;
    let _interval;
    let _currentInstance;

    function _getStartPoint() {
      return new CartesianVertex(largeCanvas.config.width / 2, 0)
    };
    function _fallDown() {
      gameEventsHandler("Fall Down");
    };
    function placeOnStart(name) {   
      _currentInstance = tetrisFactory.produce(name, _getStartPoint());
    };
    function getInstance() {
      return _currentInstance;            
    };   
    function addInterval() {
      _interval = setInterval(_fallDown, _fallingRate);
    };
    function removeInterval() {
      clearInterval(_interval);
    };
    return {
      getInstance: getInstance,
      placeOnStart: placeOnStart,
      addInterval:addInterval,
      removeInterval:removeInterval,     
    };
  })();

  function gameEventsHandler (event) {
    const tetrisFalling = fallingTetris.getInstance();
    function _tetrisOnCanvas() {
      return largeCanvas.getSquares();
    };

    if(event === 'Position Changed') {
      largeCanvas.render();
      return;
    } else if(event === 'Cannot Move Down') {
      next();
    } else if (gameStatus === 'welcome' && event.code === "Enter") { // START!
      largeCanvasUpdate(); // has to be updated before smallCanvas to get the first next before it switches
      smallCanvasUpdate();
      play();
      return;
    } else if (gameStatus === 'playing' && event.code === "Space") { // PAUSE!
      gameStatus = 'paused';
      showMessage('resume');
      removeIntervals();
      return;
    } else if (gameStatus === 'paused' && event.code === "Space") { // RESUME!
      play();
      return;
    } else if(event.code === 'ArrowDown' || event === "Fall Down") {
        if(tetrisFalling.staysOnCanvasWhen().movedDown()  
          && !tetrisFalling.collidesWith(_tetrisOnCanvas, "down")
        ) {
          tetrisFalling.moveDown();
        } else {
          gameEventsHandler("Cannot Move Down")
        }
    } else if(event.code === 'ArrowRight') {
      if (tetrisFalling.staysOnCanvasWhen().movedRight()
        && !tetrisFalling.collidesWith(_tetrisOnCanvas, "right")
      ) {
        tetrisFalling.moveRight();
      }
    } else if(event.code === 'ArrowLeft') {
      if (tetrisFalling.staysOnCanvasWhen().movedLeft()
        && !tetrisFalling.collidesWith(_tetrisOnCanvas, "left")
      ) {
        tetrisFalling.moveLeft();
      }
    } else if(event.code === 'KeyZ') {
      if(tetrisFalling.staysOnCanvasWhen().rotated('rotateLeft', 'rotateRight')
        && !tetrisFalling.collidesWith(_tetrisOnCanvas, "any")
      ) {
        tetrisFalling.rotateLeft();
      }
    } else if(event.code === 'KeyA'|| event.code === 'A') {
      if(tetrisFalling.staysOnCanvasWhen().rotated('rotateRight', 'rotateLeft')
        && !tetrisFalling.collidesWith(_tetrisOnCanvas, "any")
        ) {
        tetrisFalling.rotateRight();
      }
    };
    gameEventsHandler('Position Changed')    
  };

  function addIntervals() {
    timer.addInterval();
    fallingTetris.addInterval();
  };
  function removeIntervals() {
    timer.removeInterval();
    fallingTetris.removeInterval();
  };
  function smallCanvasUpdate() {
    nextTetris.placeOnStart();
    smallCanvas.updateTetris(nextTetris.getInstances());
    smallCanvas.render();
  };
  function largeCanvasUpdate() {
    fallingTetris.placeOnStart(nextTetris.getFirstName());
    largeCanvas.updateTetris(fallingTetris.getInstance());
    largeCanvas.render();
  };
  function next() {
    largeCanvas.addSquares(fallingTetris.getInstance().createSquares());
    largeCanvas.deleteFullRowsAndDrop(largeCanvas.checkWhichRowIsFull());       
    largeCanvasUpdate();
    smallCanvasUpdate(); 
  };
  function play() {
    gameStatus = 'playing';
    showMessage('pause');
    addIntervals();
  };
  function welcome() {
    showMessage('start');
    timer.append();
    score.append();
    smallCanvasUpdate();
    window.addEventListener('keydown', gameEventsHandler);
  };
  // game object has only one method which is called with an IIFE
  return {
    welcome: welcome,
  }
})().welcome();