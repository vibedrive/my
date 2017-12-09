var Nanobus = require('nanobus')

function Clock (freq) {
  if (!(this instanceof Clock)) return new Clock(freq)
  Nanobus.call(this)
  this._interval = null
  this.freq = freq
}

Clock.prototype = Object.create(Nanobus.prototype)

Clock.prototype.start = function () {
  this._interval = setInterval(() => {
    this.emit('tick')
  }, this.freq)
}

Clock.prototype.stop = function () {
  clearInterval(this._interval)
  this._interval = null
}

module.exports = Clock
