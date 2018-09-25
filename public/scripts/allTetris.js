

const T_tetris = [
  {x: -1, y: -.5}, {x: 0, y: -.5}, {x: 1, y: -.5}, {x: 0, y: .5}
]
const I_tetris = [
  {x: -1.5, y: 0}, {x: -.5, y: 0}, {x: .5, y: 0}, {x: 1.5, y: 0}
]
const C_tetris = [
  {x: -.5, y: -.5}, {x: .5, y: -.5}, {x: .5, y: .5}, {x: -.5, y: .5}
]
const allTetris = [T_tetris, I_tetris, C_tetris]

const getRandomArrayItem = array => array[Math.floor( (Math.random() * array.length ))]
