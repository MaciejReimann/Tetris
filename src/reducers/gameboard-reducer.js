import { MOVE } from "../actions/types";

export default function(state = {}, action) {
  switch (action.type) {
    case MOVE:
      return action.payload;
    default:
      return state;
  }
}
