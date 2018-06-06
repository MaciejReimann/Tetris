

const Score = function (parentElement, defaultValue, incrementCallback) {
  this.div = document.createElement('div');
  this.parentElement = parentElement;
  this.defaulValue = defaultValue;
  this.currentValue = this.defaulValue;
  this.displayValue = this.currentValue || this.defaulValue;
  this.strike = 0;
  this.incrementCallback = incrementCallback;
};

Score.prototype.append = function() {
  this.div.textContent = this.displayValue;
  this.parentElement.appendChild(this.div);
};

Score.prototype.render = function() {
  clear(this.parentElement);
  this.append();
};

Score.prototype.increment = function(callback) {
  this.currentValue = this.incrementCallback(this.currentValue, this.strike)
  this.render();
};





