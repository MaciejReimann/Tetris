const RegularPolygon = function(n, r, center, angle) {
  if(!n || !r) { throw new Error("Number of sides and radius must be specified") };
  if(!angle) { angle = 0 };
  if(!center) { center = {x: 0, y: 0} };
  this.numberOfSides = n;
  this.radius = r;
  this.center = center;
  this.angle = angle;
  // this.cartesianVertices = this.getVertices();
}
RegularPolygon.prototype.getCartesianVertices = function() {
  let verticesArray = [];
  for (let i = 0; i < this.numberOfSides; i ++ ) {    
    let vertex = translateToCartesian(
      {
        r: this.radius,
        angle: 360 / this.numberOfSides * i + this.angle
      }
    )
    vertex.x += this.center.x;
    vertex.y += this.center.y;
    verticesArray.push(vertex)
  };
  return verticesArray;
};
RegularPolygon.prototype.move = function(n, m) {
  if(!n) {
    n = 0;
  };
  if(!m) {
    m = 0;
  };
  this.center.x += n;
  this.center.y += m;
};
RegularPolygon.prototype.rotate = function(angle) {
  if(!angle) {
    angle = 0;
  };
  this.angle += angle;
};

RegularPolygon.prototype.drawOutline = function(context, color) {
  if(context) {
    this.ctx = context;
  } else if (!this.ctx) {
    throw new Error("No context defined!")
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

const Square = function(sideLength, center, angle) {
  this.sideLength = sideLength;
  let r = Math.sqrt(2 * Math.pow(this.sideLength / 2, 2))
  RegularPolygon.call(this, 4, r, center, angle);
};

Square.prototype = Object.create(RegularPolygon.prototype); 
Square.prototype.constructor = RegularPolygon;