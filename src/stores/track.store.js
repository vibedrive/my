var vibedrive = require('vibedrive-sdk')

module.exports = function (state, emitter) {
  state.tracks = []
  state.selectedTrack = null

  emitter.on('DOMContentLoaded', function () {
    emitter.on('track:get-all', getAll)
    emitter.on('track:select-track', selectTrack)
    emitter.on('track:create', createTrack)
    emitter.on('track:delete', deleteTrack)
  })

  async function getAll () {
    var tracks = await vibedrive.track.getAll()
    state.tracks = tracks
    emitter.emit('render')
  }

  async function createTrack (audioFile) {
    var track = await vibedrive.track.create(audioFile)
    state.tracks.push(track)
    emitter.emit('render')
  } 

  function selectTrack (track) {
    state.selectedTrack = track
    emitter.emit('render')
  }

  async function deleteTrack (track) {
    await vibedrive.track.remove(track)
    var index = state.tracks.findIndex(t => t._id === track._id)
    state.tracks.splice(index, 1)
    emitter.emit('render')
  } 
}
