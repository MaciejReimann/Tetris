import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { incrementScore } from "../actions/index";

class Score extends Component {
  constructor(props) {
    super(props);
    this.state = { props };
  }

  render() {
    return (
      <div
        className="score-counter"
        onClick={() => this.props.incrementScore()}
      >
        {this.state.score}
      </div>
    );
  }
}

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
