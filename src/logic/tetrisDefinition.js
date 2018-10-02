// Tetris defined as its squares' center point
// in relation to pivot, its local zero;
export const T_tetris = [
  { x: -0.5, y: 0.5 },
  { x: 0.5, y: 0.5 },
  { x: 0.5, y: 1.5 },
  { x: 1.5, y: 0.5 }
];
export const I_tetris = [
  { x: -1.5, y: 0.5 },
  { x: -0.5, y: 0.5 },
  { x: 0.5, y: 0.5 },
  { x: 1.5, y: 0.5 }
];
export const C_tetris = [
  { x: -0.5, y: -0.5 },
  { x: 0.5, y: -0.5 },
  { x: 0.5, y: 0.5 },
  { x: -0.5, y: 0.5 }
];

export const allTetris = [T_tetris, I_tetris, C_tetris];

const getRandomItem = array => array[Math.floor(Math.random() * array.length)];

export const getRandomTetris = () => getRandomItem(allTetris);
