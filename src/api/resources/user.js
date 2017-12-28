var VibedriveResource = require('../vibedrive-resource')
var http = require('request-promise-native')

function User (vibedrive) {
  if (!(this instanceof User)) return new User(vibedrive)
  VibedriveResource.call(this, vibedrive)
}

User.prototype = Object.create(VibedriveResource.prototype)

User.prototype.get = function () {
  var opts = {
    url: this._vibedrive.apiURL + '/user',
    headers: this._vibedrive.headers,
    json: true
  }

  return http.get(opts)
}

module.exports = User