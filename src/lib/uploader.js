var Nanobus = require('nanobus')
var assert = require('assert')
var AudioFile = require('./audio-file')
var vibedrive = require('vibedrive-sdk')

module.exports = new Uploader()

function Uploader () {
  if (!(this instanceof Uploader)) return new Uploader()
  this.maxUploads = 20
  this.uploads = []
  this.transport = vibedrive.upload
}

Uploader.prototype.upload = function (audioFile) {
  assert.ok(audioFile instanceof AudioFile, 'upload expects an AudioFile')
  var fileUpload = FileUpload(audioFile)

  this.uploads.push(fileUpload)
  this._upload(fileUpload)

  return fileUpload
}

Uploader.prototype._upload = function (fileUpload) {
  fileUpload.on('error', function () {})
  fileUpload.on('progress', function () {})
  fileUpload.on('done', function () {})
  fileUpload.start(this.transport)
}

function FileUpload (audioFile) {
  if (!(this instanceof FileUpload)) return new FileUpload(audioFile)
  Nanobus.call(this)
  this.file = audioFile
  this.progress = 0
  this.result = null
}

FileUpload.prototype = Object.create(Nanobus.prototype)

FileUpload.prototype.start = function (transport) {
  this.result = transport.upload(this.file, (err, progress) => {
    if (err) return this.emit('error', err)
    if (progress === 100) return this.emit('done', this)

    this.progress = progress
    this.emit('progress', progress)
  })
}
