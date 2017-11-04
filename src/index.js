const choo = require('choo')

const layout = require('./layout')
const home = require('./pages/home.page')
const account = require('./pages/account.page')

const app = choo()

app.use(require('./stores/auth.store'))
app.use(require('./stores/file.store'))
app.use(require('./stores/ui.store'))

app.route('/', layout(home))
app.route('/account', layout(account))

app.mount('body')
