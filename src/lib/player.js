var Nanobus = require('nanobus')

class AudioPlayer extends Nanobus {
  constructor (el) {
    super()
    this.el = el
    this.playing = false
  }

  play () {
    this.emit('play')
    this.el.play()
  }

  pause () {
    this.emit('pause')
    this.el.pause()
  }

  prev () {
    this.emit('prev')
  }

  next () {
    this.emit('next')
  }

  load (src) {
    console.log(src)
  }
}

module.exports = AudioPlayer