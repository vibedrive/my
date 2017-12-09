var concat = require('concat-stream')
var fileReaderStream = require('filereader-stream')
var mm = require('musicmetadata')
var vibedrive = require('../api')
var multihash = require('../lib/multihash')
var Notifications = require('../components/notifications')
var { uploadSmallFile, uploadLargeFile } = vibedrive.upload

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
      var uploaded = size < LARGE_FILE_PART_SIZE
        ? await uploadSmallFile(fileData, getOnUploadProgress(i))
        : await uploadLargeFile(fileData, getOnUploadProgress(i))

      emitter.emit('track:create', uploaded)
      state.uploading[len - 1].progress = 100
      emitter.emit('render')
    }
  }

  function getOnUploadProgress (i) {
    return function onUploadProgress (e) {

    }
  }
}

async function loadFile (file) {
  var metadata 
  return new Promise((resolve, reject) => {
    var stream = fileReaderStream(file)
    
    mm(stream, { duration: true, fileSize: file.size }, onDone)

    stream.pipe(concat(function (contents) {
      // contents is the contents of the entire file
      var data = new TextDecoder("utf-8").decode(contents)
      var loaded = {
        data,
        size: file.size,
        fileName: file.name,
        hash: multihash(data),
        metadata,
        progress: 0
      }

      resolve(loaded)
    }))
  })

  function onDone (err, data) {
    if (err) throw err
    metadata = data
  }
}


