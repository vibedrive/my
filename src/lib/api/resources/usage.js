var VibedriveResource = require('../vibedrive-resource')
var http = require('../../http')

function Usage (vibedrive) {
  if (!(this instanceof Usage)) return new Usage(vibedrive)
  VibedriveResource.call(this, vibedrive)
}

Usage.prototype = Object.create(VibedriveResource.prototype)

Usage.prototype.get = function () {
  const opts = {
    url: this._vibedrive.apiURL + '/account/usage',
    headers: this._vibedrive.headers,
    body: { refreshToken },
    json: true
  }
  console.log(opts)

  return http.get(opts)
}

module.exports = Usage