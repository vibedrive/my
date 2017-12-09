var player = require('../lib/audio-player')

module.exports = function (state, emitter) {
  emitter.on('DOMContentLoaded', function (state, emit) {
    emitter.on('player:load-selected', loadSelected)

    player.on('*', () => emitter.emit('render'))
  })

  function loadSelected () {
    player.loadTrack(state.selectedTrack)
  }
}