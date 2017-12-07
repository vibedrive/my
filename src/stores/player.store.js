var player = require('../components/player.component')

module.exports = function (state, emitter) {
  emitter.on('DOMContentLoaded', function (state, emit) {
    emitter.on('player:load-selected', loadSelected)
  })

  function loadSelected () {
    player.loadTrack(state.selectedTrack)
  }
}