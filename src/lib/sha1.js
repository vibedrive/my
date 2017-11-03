var crypto = require('crypto')

module.exports = function (data) {
  var hash = crypto.createHash('sha1')
  hash.update(data)
  return hash.digest('hex')
}
