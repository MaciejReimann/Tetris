import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { incrementScore } from "../actions/index";

const Score = props => {
  return (
    <div className="score-counter" onClick={() => props.incrementScore()}>
      {props.score}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    score: state.score
  };
}

function mapDispatchToProps(dispatch) {
  // if moveTetris action creator is being called INSIDE THIS container
  // , the result,
  // i.e. the action, flows through all reducers
  return bindActionCreators({ incrementScore: incrementScore }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Score);
