const createElement = element => document.createElement(element);
const changeClass = element => className => {
  element.className = className;
  return element;
};

const createCanvas = () => createElement('canvas');
const createCanvasWithClass = className => changeClass(createCanvas())(className);


const appendTo = element => parent => parent.appendChild(element)
