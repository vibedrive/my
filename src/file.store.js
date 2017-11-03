const tracks = require('./lib/tracks')
const { uploadSmallFile, uploadLargeFile } = require('./lib/upload')

var concat = require('concat-stream')
var fileReaderStream = require('filereader-stream')
var mm = require('musicmetadata')
var multihash = require('./lib/multihash')

const LOCAL_URL = 'https://localhost:5823'
const FIVE_MB = 5 * 1000 * 1000
const PART_SIZE = FIVE_MB

module.exports = function (state, emitter) {
  emitter.on('DOMContentLoaded', () => {
    emitter.on('upload', upload)
  })

  async function upload (files) {
    for (let i = 0; i < files.length; i++) {
      var file = files[i]
      var { type, size } = file

      if (type !== 'audio/mp3') return

      file = await loadFile(file)

      var uploaded = size < PART_SIZE
        ? await uploadSmallFile(file, getOnUploadProgress(i))
        : await uploadLargeFile(file, getOnUploadProgress(i))
    
      var track = await tracks.create(uploaded)
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
        metadata
      }

      console.log(loaded)

      resolve(loaded)
    }))
  })

  function onDone (err, data) {
    if (err) throw err
    metadata = data
  }
}


