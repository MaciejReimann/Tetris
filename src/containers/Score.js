import React from "react";
import { connect } from "react-redux";
// import { bindActionCreators } from "redux";

// import { checkScoreboard } from "../actions/index";

const Score = props => {
  return (
    <div
      className="score-counter"
      // onClick={() => props.checkScoreboard()}
    >
      {props.game.score}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    game: state.game
  };
}

// function mapDispatchToProps(dispatch) {
//   // if moveTetris action creator is being called INSIDE THIS container
//   // , the result,
//   // i.e. the action, flows through all reducers
//   return bindActionCreators({ checkScoreboard: checkScoreboard }, dispatch);
// }

export default connect(
  mapStateToProps
  // mapDispatchToProps
)(Score);
