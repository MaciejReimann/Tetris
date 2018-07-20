

const Score = function (parentElement, defaultValue, incrementCallback) {
  this.div = document.createElement('div');
  this.parentElement = parentElement;
  this.defaulValue = defaultValue;
  this.currentValue = this.defaulValue;
  // this.displayValue = this.defaulValue || this.currentValue;
  this.incrementCallback = incrementCallback;
};

Score.prototype.append = function() {
  this.div.textContent = this.currentValue;
  this.parentElement.appendChild(this.div);
};

Score.prototype.render = function() {
  clear(this.parentElement);
  this.append();
};

Score.prototype.increment = function(n) {
  this.currentValue += this.incrementCallback(n);
};





