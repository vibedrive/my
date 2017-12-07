const choo = require('choo')

const layout = require('./layout')
const tabs = require('./tabs')

const tracks = require('./pages/tracks.page')
const artists = require('./pages/artists.page')
const labels = require('./pages/labels.page')
const tags = require('./pages/tags.page')
const playlists = require('./pages/playlists.page')

const account = require('./pages/account.page')

const app = choo()

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
