import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { moveTetris } from "../actions/index";
import Canvas from "../components/Canvas";

class LargeCanvas extends Component {
  componentDidMount() {}
  render() {
    return (
      <div className="large-canvas">
        <Canvas w={300} h={500} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    game: state.game
  };
}

// Anythng this functions returns becomes the props of the LargeCanvas,
// i.e. if action has a payload, for example game state, it is available through
// props.tetris = action.payload

function mapDispatchToProps(dispatch) {
  // if moveTetris action creator is being called INSIDE THIS container
  // , the result,
  // i.e. the action, flows through all reducers
  return bindActionCreators({ moveTetris: moveTetris }, dispatch);
}

// propotes LargeCanvas to the container, that has to know about dispatch,
// as it updates its props
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LargeCanvas);
