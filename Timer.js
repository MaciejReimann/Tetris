

const Timer = function (parentElement) {
  this.div = document.createElement('div');
  this.parentElement = parentElement;
  this.defaultRate = 1000;
  this.currentRate = this.defaultRate;
  this.interval;
  this.timeInSeconds = 0;
};

Timer.prototype.append = function() {
  this.div.textContent = this.timeInSeconds;
  this.parentElement.appendChild(this.div);
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
  this.interval = setInterval(this.renderIncremented.bind(this), this.currentRate);
};

Timer.prototype.removeInterval = function() {
  clearInterval(this.interval);
};

