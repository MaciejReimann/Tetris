

// ----- VERTEX TRANSFORMATION FUNCTIONS ------

function getRandomItem(array) {
  return array[ Math.floor(Math.random() * array.length) ];
};

function translateToGlobal(localZero, localVertices, mod) { // localZero in global units, localVertices in local units, mod - the size of the local unit
  if(!mod) { mod = 1 }; // mod will not affect the return values;
  if(localVertices instanceof Array) {
    return localVertices.map( (localVertex) => translateToGlobal(localZero, localVertex, mod) );
  } else {
    let localVertex = localVertices;
    return { // vertex in global units
      x: localZero.x + localVertex.x * mod,
      y: localZero.y + localVertex.y * mod 
    };
  };
};

function translateToLocal(localZero, globalVertices) {
  if(globalVertices instanceof Array) {
    return globalVertices.map( (globalVertex) => translateToLocal(localZero, globalVertex) );
  } else {
    let globalVertex = globalVertices;
    return {
      x: globalVertex.x - localZero.x,
      y: globalVertex.y - localZero.y
    };
  };
};

function translateToCartesian(vertices) {
if(vertices instanceof Array) {
    return vertices.map( (vertex) => translateToCartesian(vertex) );
  } else { // TODO: Add argument validation - check if vertices has r and angle property and their value is number, else throw an Error;  
    let vertex = vertices;
    let n = 0; // optional angle parameter    
    return {
      x: vertex.r * Math.cos( (vertex.angle - n) * (Math.PI / 180) ),
      y: vertex.r * Math.sin( (vertex.angle - n) * (Math.PI / 180) ),
    };
  };
};

function translateToPolar(vertices) {
  if(vertices instanceof Array) {
    return vertices.map( (vertex) => translateToPolar(vertex) );
  } else { // TODO: Add argument validation - check if vertices has x and y property and their value is number, else throw an Error;  
    let vertex = vertices;
    return {
      r: Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y),
      angle: Math.atan2(vertex.y, vertex.x) * (180 / Math.PI),
    };
  };
};

function rotatePolar(polarVertices, angle) {
  if(polarVertices instanceof Array) {
    return polarVertices.map( (polarVertex) => rotatePolar(polarVertex, angle) );
  } else {
    let polarVertex = polarVertices;
    return {
      r: polarVertex.r,
      angle: polarVertex.angle + angle
    };
  };
};

function rotateCartesian(localVertices, angle) { // if rotate localVertices, pivot is in 0,0; if rotateGlobal pivot needs to be set; pivot = localZero
  if(localVertices instanceof Array) {
    return localVertices.map( (localVertex) => rotateCartesian(localVertex, angle));
  } else {
    console.log(angle)
    let localVertex = localVertices;
    let cartesian = translateToCartesian( 
      rotatePolar( 
        translateToPolar(localVertex), 
      angle) 
    );
    return cartesian  
  };
};

function mirrorByY_Axis(vertices) {
  if(vertices instanceof Array) {
    return vertices.map( (vertex) => mirrorByY_Axis(vertex) );
  } else {
    let vertex = vertices;
    return {
      x: vertex.x * -1, 
      y: vertex.y
    };
  };
};

function missesModuleOn(vertices, module) {
  if(vertices instanceof Array) {
   return vertices.map( vertex => missesModuleOn(vertex, module)).find(item => item != false);
  } else {
    let vertex = vertices;
    if (vertex.x % module === 0 & vertex.y % module === 0) {
    	return;
    } else if(vertex.x % module != 0) {
    	return 'x';
    } else if(vertex.y % module != 0) {
    	return 'y';
    };
  };
};

function isNotGreaterThen(numbers, end) {
  if(numbers instanceof Array) {
   return numbers.every( (number) => isNotGreaterThen(number, end) );
  } else {
    let number = numbers;
    return number <= end;
  };
};

function isNotSmallerThen(numbers, start) {
  if(numbers instanceof Array) {
   return numbers.every( (number) => isNotSmallerThen(number, start) );
  } else {
    let number = numbers;
    return number >= start;
  };
};