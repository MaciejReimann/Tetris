import { combineReducers } from "redux";

import GameReducer from "./gameboard-reducer";

export default combineReducers({
  game: GameReducer
});
