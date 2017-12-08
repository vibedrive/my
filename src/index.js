require('babel-polyfill')

var choo = require('choo')

var layout = require('./layout')
var tabs = require('./tabs')

var tracks = require('./pages/tracks.page')
var artists = require('./pages/artists.page')
var labels = require('./pages/labels.page')
var tags = require('./pages/tags.page')
var playlists = require('./pages/playlists.page')

var account = require('./pages/account.page')

var app = choo()

app.use(require('./stores/auth.store'))
app.use(require('./stores/file.store'))
app.use(require('./stores/player.store'))
app.use(require('./stores/track.store'))
app.use(require('./stores/ui.store'))

app.route('*', layout(tracks))
app.route('/', layout(tracks))
app.route('/tracks', layout(tracks))

app.route('/artists', layout(tracks))
app.route('/labels', layout(tracks))
app.route('/tags', layout(tracks))
app.route('/playlists', layout(playlists))

app.route('/account', layout(account))

app.mount('body')
