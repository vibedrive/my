const choo = require('choo')

const layout = require('./layout')
const tabs = require('./tabs')

const tracks = require('./pages/tracks.page')
const artists = require('./pages/artists.page')
const labels = require('./pages/labels.page')
const tags = require('./pages/tags.page')

const account = require('./pages/account.page')

const app = choo()

app.use(require('./stores/auth.store'))
app.use(require('./stores/file.store'))
app.use(require('./stores/ui.store'))


app.route('*', layout(tabs(tracks)))

app.route('/', layout(tabs(tracks)))

app.route('/tracks', layout(tabs(tracks)))
app.route('/artists', layout(tabs(artists)))
app.route('/labels', layout(tabs(labels)))
app.route('/tags', layout(tabs(tags)))

app.route('/account', layout(account))

app.mount('body')
