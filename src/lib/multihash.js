const crypto = require('crypto')
const multihashes = require('multihashes')

// generate self-describing hash from striped mp3, return that hash
module.exports = function getMultihash (buf) {
  const hash = crypto.createHash('sha256').update(buf).digest()
  const multihash = multihashes.encode(hash, 'sha2-256')

  return multihashes.toB58String(multihash)
}