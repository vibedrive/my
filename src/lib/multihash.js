var crypto = require('crypto')
var multihashes = require('multihashes')

// generate self-describing hash from striped mp3, return that hash
module.exports = function getMultihash (buf) {
  var hash = crypto.createHash('sha256').update(buf).digest()
  var multihash = multihashes.encode(hash, 'sha2-256')

  return multihashes.toB58String(multihash)
}