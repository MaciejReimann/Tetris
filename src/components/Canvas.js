import React, { Component } from "react";
import { findDOMNode } from "react-dom";

class Canvas extends Component {
  componentDidMount() {
    const canvas = findDOMNode(this.refs["canvas"]);
    console.log(this.props.vertices);
  }

  render() {
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
