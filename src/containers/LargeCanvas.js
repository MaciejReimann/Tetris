import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { moveTetris, startGame, pauseGame } from "../actions/index";
import Canvas from "../components/Canvas";

class LargeCanvas extends Component {
  componentDidMount() {
    window.addEventListener("keydown", e => {
      switch (e.key) {
        case "ArrowLeft":
          this.props.moveTetris("LEFT");
          break;
        case "ArrowDown":
          this.props.moveTetris("DOWN");
          break;
        case "ArrowRight":
          this.props.moveTetris("RIGHT");
          break;
        case "a":
        case "A":
          this.props.moveTetris("ROTATE_RIGHT");
          break;
        case "z":
        case "Z":
          this.props.moveTetris("ROTATE_LEFT");
          break;
        case "Enter":
          this.props.startGame();
          break;
        case " ":
          this.props.pauseGame();
          break; // spacebar
      }
    });
  }
  render() {
    console.log(this.props.game);
    return (
      <div className="large-canvas">
        <Canvas w={300} h={500} vertices={this.props.game} />
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
  return bindActionCreators(
    { moveTetris: moveTetris, startGame: startGame, pauseGame: pauseGame },
    dispatch
  );
}

// propotes LargeCanvas to the container, that has to know about dispatch,
// as it updates its props
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LargeCanvas);
