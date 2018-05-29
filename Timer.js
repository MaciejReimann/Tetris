

const Timer = function (parentElement) {
  this.interval;
  this.rate = 1000;
  this.parentElement = parentElement;
  this.timerDiv = document.createElement('div');
  this.timeInSeconds = 0;
  this.timerDiv.textContent = this.timeInSeconds;
};

Timer.prototype.append = function() {
  this.timerDiv.textContent = this.timeInSeconds;
  this.parentElement.appendChild(this.timerDiv);
};

Timer.prototype.render = function() {
  clear(this.parentElement);
  this.append();
};

Timer.prototype.renderIncremented = function() {
  this.timeInSeconds++;
  this.render();
};

Timer.prototype.addInterval = function() {
  this.interval = setInterval(this.renderIncremented.bind(this), this.rate);
};

Timer.prototype.removeInterval = function() {
  clearInterval(this.interval);;
};

