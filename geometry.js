
const Shape = function() {

}


const RegularPolygon = function(n, r, center, angle) {
  if(!n || !r) { throw new Error("Number of sides and radius must be specified") };
  if(!angle) { angle = 0 };
  if(!center) { center = {x: 0, y: 0} };
  this.numberOfSides = n;
  this.radius = r;
  this.center = center;
  this.angle = angle;
  this.defaultColor = 'darkgrey';
}
RegularPolygon.prototype.getCartesianVertices = function(axis) {
  let verticesArray = [];
  let xVertices = [];
  let yVertices = [];
  for (let i = 0; i < this.numberOfSides; i ++ ) {    
    let vertex = translateToCartesian(
      {
        r: this.radius,
        angle: 360 / this.numberOfSides * i + this.angle
      }
    );
    vertex.x = Math.round(vertex.x + this.center.x);
    vertex.y = Math.round(vertex.y + this.center.y);
    verticesArray.push(vertex);
    xVertices.push(vertex.x);
    yVertices.push(vertex.y);
  };
  if(axis === 'x') {
    return xVertices;
  } else if (axis === 'y') {
    return yVertices;
  };
  return verticesArray;
};

RegularPolygon.prototype.drawOutline = function(context, outlineColor) {
  this.outlineColor = outlineColor;
  if(context) {
    this.ctx = context;
  } else {
    throw new Error("No context defined!");
  }
  let vertices = this.getCartesianVertices();
  this.ctx.beginPath();
  this.ctx.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < this.numberOfSides; i ++ ) {
    this.ctx.lineTo(vertices[i].x, vertices[i].y);
  };
  this.ctx.closePath();
  this.ctx.stroke(); // line width to be defined in the config object
};
RegularPolygon.prototype.drawFill = function(context, fillColor, outlineColor) {
  this.fillColor = fillColor;
  if(context) {
    this.ctx = context;
  } else {
    throw new Error("No context defined!")
  }
  this.drawOutline(context, outlineColor);
  this.ctx.fillStyle = this.fillColor || this.defaultColor;
  this.ctx.fill();
};

const Square = function(sideLength, center, angle) {
  this.sideLength = sideLength;
  let r = Math.sqrt(2 * Math.pow(this.sideLength / 2, 2))
  RegularPolygon.call(this, 4, r, center, angle);
};

Square.prototype = Object.create(RegularPolygon.prototype); 
Square.prototype.constructor = RegularPolygon;