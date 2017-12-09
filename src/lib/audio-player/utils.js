var leftPad = require('left-pad')

module.exports.timeString = function timeString (totalSeconds = 0) {
  var minutes = Math.floor(totalSeconds/60)
  var seconds = leftPad(Math.floor(totalSeconds - (minutes * 60)), 2, 0)
  return `${minutes}:${seconds}`
}
