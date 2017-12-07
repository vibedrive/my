var resources = {
  download: require('./download'),
  upload: require('./upload')
}

function VibedriveAPI (token, apiURL) {
  if (!(this instanceof VibedriveAPI)) return new VibedriveAPI(token)
  if (!token) throw new Error('missing token')

  this.headers = { 'Authorization': token }
  this.apiURL = apiURL || 'https://localhost:5823'

  this._prepResources()
}

VibedriveAPI.prototype._prepResources () {
  for (var key in resources) {
    if (resources.hasOwnProperty(key)) {
      var resource = resources[key]
      this[key] = resource(this)
    }
  }
}

module.exports = VibedriveAPI