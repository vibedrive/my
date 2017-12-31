var concat = require('concat-stream')
var fileReaderStream = require('filereader-stream')
var mm = require('musicmetadata')
var vibedrive = require('vibedrive-sdk')
var Notifications = require('../components/notifications')

const { LARGE_FILE_PART_SIZE } = require('../constants')

module.exports = function (globalState, emitter) {
  var state = {
    uploading: []
  }

  globalState.files = state

  emitter.on('DOMContentLoaded', () => {
    emitter.on('upload', upload)
  })

  async function upload (files) {
    for (let i = 0; i < files.length; i++) {
      var file = files[i]
      var { type, size } = file

      if (type !== 'audio/mp3') {
        Notifications.error('Sorry, Vibedrive only supports the mp3 format.')
        return
      }

      var len = state.uploading.push(Object.assign(file, { 
        fileName: file.name,
        progress: 0  
      }))

      emitter.emit('render')

      var fileData = await loadFile(file)

      var uploaded = vibedrive.upload.upload(fileData, getOnUploadProgress(i))

      emitter.emit('track:create', uploaded)
      state.uploading[len - 1].progress = 100
      emitter.emit('render')
    }
  }
}