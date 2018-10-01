import React from "react";

const Canvas = props => {
  return (
    <div className="canvas-container">
      <canvas className="canvas" width={props.w} height={props.h} />
    </div>
  );
};

export default Canvas;
