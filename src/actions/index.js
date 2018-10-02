import { MOVE, START, PAUSE } from "./types";

export const moveTetris = direction => {
  return {
    type: MOVE
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
