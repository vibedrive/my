var http = require('request-promise-native')

var VibedriveResource = require('../vibedrive-resource')

function Download (vibedrive) {
  if (!(this instanceof Download)) return new Download(vibedrive)
  VibedriveResource.call(this, vibedrive)
}

Download.prototype = Object.create(VibedriveResource.prototype)

Download.prototype._getDownloadAuthorization = async function (multihash) {
  var opts = {
    method: 'get',
    url: `${this._vibedrive.apiURL}/download/${multihash}/authorize`,
    headers: this._vibedrive.headers,
    json: true
  }

  return http.get(opts)
}

Download.prototype.streamURL = async function (multihash, range) {
  var { authorizationToken, url } = await this._getDownloadAuthorization(multihash)

  return url + '?Authorization=' + authorizationToken
}

module.exports = Download