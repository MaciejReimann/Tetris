import { MOVE, START, PAUSE, INCREMENT } from "./types";

export const moveTetris = direction => {
  console.log(direction);
  let nextState = {};
  // dispatch(incrementScore());
  return {
    type: MOVE,
    payload: nextState
  };
};

export const incrementScore = () => {
  return {
    type: INCREMENT
  };
};

export const startGame = () => {
  return {
    type: START
  };
};

export const pauseGame = () => {
  return {
    type: PAUSE
  };
};
