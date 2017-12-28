var Nanobus = require('nanobus')
var AudioFile = require('./audio-file')
var vibedrive = require('../api')

module.exports = new Uploader()

function Uploader () {
  if (!(this instanceof Uploader)) return new Uploader(name, size, data)
  this.maxUploads = 20
  this.uploads = []
  this.transport = vibedrive.upload
}

Uploader.prototype.upload = function (name, size, data) {
  var fileUpload = FileUpload(name, size, data)

  this.uploads.push(fileUpload)
  this._upload(fileUpload)
}

Uploader.prototype._upload = function (fileUpload) {
  fileUpload.on('error', function () {})
  fileUpload.on('progress', function () {})
  fileUpload.on('done', function () {})
  fileUpload.start(this.transport)
}

function FileUpload (name, size, data) {
  if (!(this instanceof FileUpload)) return new FileUpload(name, size, data)
  Nanobus.call(this)
  this.file = { name, size, data }
  this.progress = 0
}

FileUpload.prototype = Object.create(Nanobus.prototype)

FileUpload.prototype.start = function (transport) {
  transport.upload(this.file, (err, progress) => {
    if (err) return this.emit('error', err)
    if (progress === 100) return this.emit('done', this)

    this.progress = progress
    this.emit('progress', progress)
  })
}
