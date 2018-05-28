  


function TetrisFactory (modularUnit, colorPalette) {
  this.modularUnit = modularUnit;
  this.colorPalette = modularUnit;
  this.possibleShapes = ['square-type', 's-type', 'z-type'];  
  this.defaultColor = 'blue';
  // const possibleShapes = ['square-type', 's-type', 'z-type', 'i-type', 'l-type', 'l-type-mirrored'];
};

TetrisFactory.prototype.produce = function(type, point, eventCallback) { // type(string), startPoint - all obligatory
    if (type === 'square-type') {
        return new Tetris_Square(this.modularUnit, point, eventCallback);
    } else if (type === 's-type') {
        return new Tetris_S(this.modularUnit, point, eventCallback);
    } else if (type === 'z-type') {
        return new Tetris_Z(this.modularUnit, point, eventCallback);
    }  
};

TetrisFactory.prototype.getRandomName = function() {
  return getRandomItem(this.possibleShapes);
}; 