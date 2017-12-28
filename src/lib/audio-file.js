var Nanobus = require('nanobus')
var fileReaderStream = require('filereader-stream')
var mm = require('musicmetadata')
var concat = require('concat-stream')
var multihash = require('../lib/multihash')
var crypto = require('crypto')
var multihashes = require('multihashes')

module.exports = AudioFile

function AudioFile (file) {
  if (!(this instanceof AudioFile)) return new AudioFile(file)
  Nanobus.call(this)
  
  this._file = file

  this.name = file.name
  this.size = file.size

  this.hash = null
  this.data = null
  this.metadata = null
  this.ready = false
}

AudioFile.prototype = Object.create(Nanobus.prototype)

AudioFile.prototype.load = function () {
  var read = fileReaderStream(this._file)
  var opts = { duration: true, fileSize: this._file.size }
  var self = this

  if (this._file.type !== 'audio/mp3') {
    self.emit('error', 'Sorry, Vibedrive only supports the mp3 format.')
    return
  }

  mm(read, opts, function (err, metadata) {
    if (err) throw err
    self.metadata = metadata
  })

  read.pipe(concat(function (data) {
    self.hash = multihash(data)
    self.data = data
    self.ready = true
    self.emit('loaded')
  }))
}

// generate self-describing hash from striped mp3, return that hash
function getMultihash (buf) {
  var hash = crypto.createHash('sha256').update(buf).digest()
  var multihash = multihashes.encode(hash, 'sha2-256')

  return multihashes.toB58String(multihash)
}
