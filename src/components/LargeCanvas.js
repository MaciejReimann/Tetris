import React, { Component } from "react";

import Canvas from "./Canvas";

class LargeCanvas extends Component {
  render() {
    return (
      <div className="large-canvas">
        <Canvas w={300} h={500} />
      </div>
    );
  }
}

export default LargeCanvas;
