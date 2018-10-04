import React, { Component } from "react";
import { clear, drawSquare } from "../helpers/canvasContent";

class Canvas extends Component {
  componentWillReceiveProps(nextProps) {
    this.updateCanvas(nextProps);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  updateCanvas(gameProps) {
    clear(this.canvas);
    gameProps.vertices.map(v => drawSquare(this.ctx)(v).fill());
    // console.log(gameProps.squareVertices);
    gameProps.squareVertices.map(v => drawSquare(this.ctx)(v).fill());
  }

  setCanvasContext(elem) {
    if (elem) {
      this.canvas = elem;
      this.ctx = elem.getContext("2d");
    }
  }

  render() {
    console.log("rendered");
    return (
      <div className="canvas-container">
        <canvas
          ref={this.setCanvasContext.bind(this)}
          className="canvas"
          width={this.props.w}
          height={this.props.h}
        />
      </div>
    );
  }
}

export default Canvas;
