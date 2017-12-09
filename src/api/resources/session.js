const { REFRESH_TOKEN_KEY, ACCESS_TOKEN_KEY } = require('../../constants')

var VibedriveResource = require('../vibedrive-resource')
var http = require('../../lib/http')

function Session (vibedrive) {
  if (!(this instanceof Session)) return new Session(vibedrive)
  VibedriveResource.call(this, vibedrive)
}

Session.prototype = Object.create(VibedriveResource.prototype)

Session.prototype.get = async function () {
  var refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

  if (!refreshToken) {
    state.initializing = false
    emitter.emit('render')
    return
  }

  var opts = {
    url: this._vibedrive.apiURL + '/session',
    body: { refreshToken },
    json: true
  }

  var { accessToken } = await http.post(opts)
  console.log('access!')
  this.save(refreshToken, accessToken)
}

Session.prototype.save = function (refreshToken, accessToken) {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  this._vibedrive.tokens.sessionToken = refreshToken
  this._vibedrive.tokens.accessToken = accessToken
  this._vibedrive.headers['Authorization'] = accessToken
}

Session.prototype.clear = function () {
  localStorage.setItem(ACCESS_TOKEN_KEY, '')
  localStorage.setItem(REFRESH_TOKEN_KEY, '')
}

module.exports = Session
