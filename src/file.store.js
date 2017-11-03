const { uploadSmallFile, uploadLargeFile } = require('./lib/upload')
const LOCAL_URL = 'https://localhost:5823'
const FIVE_MB = 5 * 1000 * 1000
const PART_SIZE = FIVE_MB

module.exports = function (state, emitter) {
  emitter.on('DOMContentLoaded', () => {
    emitter.on('upload', upload)
  })

  async function upload (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const { type, size } = file

      if (type !== 'audio/mp3') return

      if (size < PART_SIZE) {
        await uploadSmallFile(file, getOnUploadProgress(i))
      } else {
        await uploadLargeFile(file, getOnUploadProgress(i))
      }

      // done
    }

    // all done
  }

  function getOnUploadProgress (i) {
    return function onUploadProgress (e) {

    }
  }
}


