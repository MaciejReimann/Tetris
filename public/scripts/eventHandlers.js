

const handle = (() => {

  const start = direction => store.dispatch({
    type: START
  })
  const pause = direction => store.dispatch({
    type: PAUSE
  })
  const rotate = direction => store.dispatch({
    type: ROTATE,
    direction
  })
  const move = direction => store.dispatch({
    type: MOVE,
    direction
  })
  return { move, rotate, start, pause }

})()

window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowLeft':   handle.move('LEFT');  break
    case 'ArrowDown':   handle.move('DOWN'); break
    case 'ArrowRight':  handle.move('RIGHT');  break
    case 'a': case 'A': handle.rotate('RIGHT');  break
    case 'z': case 'Z': handle.rotate('LEFT');  break
    case 'Enter':       handle.start();  break
    case ' ':           handle.pause();  break // spacebar
  }
})

store.subscribe(() => renderCanvas(store.getState()));
