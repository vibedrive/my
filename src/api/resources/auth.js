var VibedriveResource = require('../vibedrive-resource')
var http = require('request-promise-native')

function Download (vibedrive) {
  if (!(this instanceof Download)) return new Download(vibedrive)
  VibedriveResource.call(this, vibedrive)
}

Download.prototype = Object.create(VibedriveResource.prototype)

Download.prototype.login = async function login (email, password) {
  var opts = {
    url: this._vibedrive.apiURL + '/login',
    body: { email, password },
    json: true
  }

  try {
    var { refreshToken, accessToken } = await http.post(opts)

    this._vibedrive.session.save(refreshToken, accessToken)

    return true
  } catch (err) {
    console.log(err)
    var errorMessage

    if (typeof err === 'object' && err.statusCode) {
      switch (err.statusCode) {
        case 401:
          errorMessage = 'Sorry, we don’t recognize that email or password.'
          break
        case 400:
          errorMessage = 'Please enter a valid email and a password.'
          break
        default:
          console.error(err)
          errorMessage = 'There was an unexpected error.'
          break
      }
    } else {
      errorMessage = 'Could not connect to the server.'
    }

    throw new Error(errorMessage)
  }
}

Download.prototype.logout = function logout () {
  var { accessToken, refreshToken } = this._vibedrive.tokens
  var opts = {
    url: this._vibedrive.apiURL + '/logout',
    headers: { authorization: accessToken },
    body: { refreshToken: refreshToken },
    json: true
  }

  return http.post(opts).then(this._vibedrive.session.clear())
}

module.exports = Download
