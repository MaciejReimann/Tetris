

const Timer = function (parentElement) {
  this.parentElement = parentElement;
  this.timerDiv = document.createElement('div');
  this.timeInSeconds = 0;
  this.timerDiv.textContent = this.timeInSeconds;
}

Timer.prototype.render = function() {
  clear(this.parentElement);
  this.append();
};

Timer.prototype.renderIncremented = function() {
  this.timeInSeconds++;
  this.render();
};

Timer.prototype.append = function() {
  this.timerDiv.textContent = this.timeInSeconds;
  this.parentElement.appendChild(this.timerDiv);
};