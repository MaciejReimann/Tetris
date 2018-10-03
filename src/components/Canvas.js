import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { clear, drawSquare } from "../helpers/canvasContent";

class Canvas extends Component {
  componentWillReceiveProps() {
    const canvas = findDOMNode(this.refs["canvas"]);
    const ctx = canvas.getContext("2d");
    clear(canvas);
    this.props.vertices.map(v => drawSquare(ctx)(v).fill());
    console.log(this.props.vertices);
    console.log("new props");
  }

  render() {
    console.log("rendering");
    return (
      <div className="canvas-container">
        <canvas
          ref="canvas"
          className="canvas"
          width={this.props.w}
          height={this.props.h}
        />
      </div>
    );
  }
}

export default Canvas;
