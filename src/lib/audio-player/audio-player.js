var Nanobus = require('nanobus')
var Clock = require('./clock')
var vibedrive = require('../../api')

var { timeString } = require('./utils')

const TWENTY_FOUR_FPS = 41.67

function AudioPlayer () {
  if (!(this instanceof AudioPlayer)) return new AudioPlayer()
  Nanobus.call(this)
  this.el = new Audio()
  this.playing = false
  this.track = null
  this.playlist = []

  this.progress = 0
  this.currentTime = '0:00'

  this.clock = Clock(TWENTY_FOUR_FPS)
  this.clock.on('tick', () => {
    if (this.progress >= 100) return this.stop()
    this.currentTime = timeString(this.el.currentTime)
    this.progress = (this.el.currentTime / this.el.duration) * 100
    window.requestAnimationFrame(() => {
      this.emit('timeupdate', this.currentTime)
    })
  })
}

AudioPlayer.prototype = Object.create(Nanobus.prototype)

AudioPlayer.prototype.play = function () {
  this.playing = true
  this.el.play()
  this.clock.start()
  this.emit('play')
}

AudioPlayer.prototype.pause = function () {
  this.playing = false
  this.el.pause()
  this.clock.stop()
  this.emit('pause')
}

AudioPlayer.prototype.stop = function () {
  this.playing = false
  this.el.pause()
  this.clock.stop()
  this.progress = 0
  this.currentTime = '0:00'
  this.emit('stop')
}

AudioPlayer.prototype.prev = function () {
  var idx = this.playlist.findIndex(item => item._id === this.track._id)
  if (idx - 1 >= 0) this.load(this.playlist[idx - 1])
  this.emit('prev')
}

AudioPlayer.prototype.next = function () {
  var idx = this.playlist.findIndex(item => item._id === this.track._id)
  if (idx + 1 <= this.playlist.length) this.load(this.playlist[idx + 1])
  this.emit('next')
}

AudioPlayer.prototype.load = async function (track) {
  if (track === this.track) return this.playing ? this.pause() : this.play()

  var idx = this.playlist.findIndex(item => item._id === track._id)
  if (idx > -1) this.playlist.splice(idx, 1)

  this.playlist.push(track)
  this.track = track
  this.el.src = await vibedrive.download.streamURL(track.audio.hash)
  this.duration = timeString(track.metadata.duration)

  this.play()
}

module.exports = AudioPlayer
