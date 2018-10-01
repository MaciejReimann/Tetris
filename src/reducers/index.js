import { combineReducers } from "redux";

import GameReducer from "./gameboard-reducer";
import ScoreReducer from "./scorecounter-reducer";

export default combineReducers({
  game: GameReducer,
  score: ScoreReducer
});
