import { MOVE } from "../actions/types";
import { merge } from "../helpers/pointsManipulation";

import { initialState } from "../logic/initialState";

export default function(state = initialState, action) {
  switch (action.type) {
    case MOVE:
      let nextState = {
        test: "of data flow"
      };

      return merge(state)(nextState);
    default:
      return state;
  }
}
