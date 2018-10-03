export const resize = canvas => width => height => {
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

export const clear = canvas => {
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
};

export const drawSquare = context => vertices => {
  context.beginPath();
  context.moveTo(vertices[0].x, vertices[0].y);
  context.lineTo(vertices[1].x, vertices[1].y);
  context.lineTo(vertices[2].x, vertices[2].y);
  context.lineTo(vertices[3].x, vertices[3].y);
  context.closePath();
  return context;
};
