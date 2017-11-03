const choo = require('choo')

const layout = require('./layout')
const home = require('./home.page')

const app = choo()

app.use(require('./auth.store'))
app.use(require('./file.store'))

app.route('/', layout(home))

app.mount('body')
