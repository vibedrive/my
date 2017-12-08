var http = require('../lib/http')

var VibedriveResource = require('../vibedrive-resource')

function Download (vibedrive) {
  if (!(this instanceof Download)) return new Download(vibedrive)
  VibedriveResource.call(this, vibedrive)
}

Download.prototype = Object.create(VibedriveResource.prototype)

Download.prototype.getDownloadAuthorization = async function (multihash) {
  var opts = {
    method: 'get',
    url: `${API_URL}/download/${multihash}/authorize`,
    headers: this.headers,
    json: true
  }

  var response = await http.get(opts)

  return response.Authorization
}

Download.prototype.streamAudio = function (multihash, storageAuthorization, range) {
  var opts = {
    method: 'get',
    url: `${API_URL}/download/${multihash}`,
    headers: Object.assign(this.headers, { storageAuthorization })
  }

  if (range) opts.headers.range = range

  return http.get(opts)
}

module.exports = Download