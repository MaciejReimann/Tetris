import { MOVE, START, PAUSE, INCREMENT } from "./types";

export const moveTetris = direction => {
  return {
    type: MOVE,
    payload: direction
  };
};

export const incrementScore = () => {
  return {
    type: INCREMENT
  };
};
