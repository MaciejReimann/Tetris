  


function TetrisFactory (modularUnit, colorPalette) {
  this.modularUnit = modularUnit;
  this.colorPalette = modularUnit;
  this.possibleShapes = ['square-type', 's-type', 'z-type','i-type','l-type','l-type-mirrored','m-type'];  
  this.defaultColor = 'blue';
};

TetrisFactory.prototype.produce = function(type, point) { // type(string), startPoint - all obligatory
    if (type === 'square-type') {
      return new Tetris_Square(this.modularUnit, point);
    } else if (type === 's-type') {
      return new Tetris_S(this.modularUnit, point);
    } else if (type === 'z-type') {
      return new Tetris_Z(this.modularUnit, point);
    } else if (type === 'i-type') {
      return new Tetris_I(this.modularUnit, point);
    } else if (type === 'l-type') {
      return new Tetris_L(this.modularUnit, point);
    } else if (type === 'l-type-mirrored') {
      return new Tetris_L_Mirrored(this.modularUnit, point);
    } else if (type === 'm-type') {
      return new Tetris_M(this.modularUnit, point);
    };
};

TetrisFactory.prototype.getRandomName = function() {
  return getRandomItem(this.possibleShapes);
}; 