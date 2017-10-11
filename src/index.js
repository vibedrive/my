const xhr = require('xhr')
const choo = require('choo')
const html = require('choo/html')
const app = choo()
const ACCESS_TOKEN_KEY = 'vibedrive::access_token'
const REFRESH_TOKEN_KEY = 'vibedrive::refresh_token'
const SESSION_URL = 'http://localhost:5823/session'
const CURRENT_USER_URL = 'http://localhost:5823/user'
const LOGIN_URL = 'http://localhost:5823/login'
const LOGOUT_URL = 'http://localhost:5823/logout'

app.use((state, emitter) => {
  state.initializing = true
  state.loggingIn = false
  state.tokens = {
    refreshToken: null,
    accessToken: null
  }

  state.user = null

  emitter.on('DOMContentLoaded', () => {
    getSession()

    emitter.on('login', login)
    emitter.on('logout', logout)
  })

  function login (e) {
    e.preventDefault()
    
    state.loggingIn = true
    emitter.emit('render')

    const { email, password } = e.target.form.elements
    const opts = {
      url: LOGIN_URL,
      body: { email: email.value, password: password.value },
      json: true
    }

    xhr.post(opts, (err, res, body) => {
      state.loggingIn = false
      emitter.emit('render')

      if (err) return console.error(err)

      if (res.statusCode === 200 && body) {
        saveSession(body.refreshToken, body.accessToken)
      }
    })
  }

  function saveSession (refreshToken, accessToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    state.tokens.refreshToken = refreshToken
    state.tokens.accessToken = accessToken

    const opts = {
      url: CURRENT_USER_URL,
      headers: { authorization: accessToken },
      json: true
    }

    xhr.get(opts, (err, res, body) => {
      if (res.statusCode === 200 && body) {
        console.log(body)
        state.user = body
        emitter.emit('render')
      }
     })
  }

  function logout () {
    const opts = {
      url: LOGOUT_URL,
      headers: { authorization: state.tokens.accessToken },
      body: { refreshToken: state.tokens.refreshToken },
      json: true
    }

    xhr.post(opts, (err, res, body) => {
      if (err) return console.error(err)

      localStorage.setItem(ACCESS_TOKEN_KEY, null)
      localStorage.setItem(REFRESH_TOKEN_KEY, null)
      state.user = null
      state.tokens = {}

      emitter.emit('render')
    })
  }

  function getSession () {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

    if (!refreshToken) {
      state.initializing = false
      emitter.emit('render')
      return
    }

    const opts = {
      url: SESSION_URL,
      body: { refreshToken },
      json: true
    }

    xhr.post(opts, (err, res, body) => {
      if (res.statusCode === 200 && body.accessToken) {
        saveSession(refreshToken, body.accessToken)
      } else {
        state.initializing = false
        emitter.emit('render')
        return
      }
    })
  }
})


app.route('/', layout(home))
app.mount('body')

function layout (view) {
  return (state, emit) => 
    state.initializing ? '<body></body>' :
    state.user
      ? html`
        <body>
          <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">

            </div>
            <div class="navbar-menu">
              <div class="navbar-end">
                <div class="navbar-item">
                  <p>${state.user.email}</p>
                </div>
              </div>
            </div>
          </nav>

          ${view(state, emit)}

          <footer class="footer has-text-centered">
            <a class="has-text-dark" onclick=${e => emit('logout')}>Logout</a>
          </footer>
        </body>`
    : html`
        <body>
          <section class="hero is-fullheight">
            <div class="hero-body">
              <div class="container has-text-centered">
                <div class="column is-4 is-offset-4">
                <form>
                  <div class="field">
                    <label class="label">Email</label>
                    <div class="control has-icons-left"> 
                      <input name="email" class="input" type="text" />
                      <span class="icon is-small is-left">
                        <i class="fa fa-envelope"></i>
                      </span>
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">Password</label>
                    <div class="control has-icons-left"> 
                      <input name="password" class="input" type="password" />
                      <span class="icon is-small is-left">
                        <i class="fa fa-key"></i>
                      </span>
                    </div>
                  </div>
                  <button 
                    onclick=${e => emit('login', e)} 
                    class="button is-dark is-medium ${state.loggingIn ? 'is-loading' : ''}">
                    Login
                  </button>
                </form>
                </div>
              </div>
            </div>
          </section>
        </body>`
}

function home (state, emit) {
  return html`
    <section class="section">
      <div class="container">
        <div class="content  has-text-centered">
          <p>Download Vibedrive to get started</p>
          <p>
            <a href="" class="button is-dark is-large">
              Download Vibedrive
            </a>
          </p>
        </div>
      </div>
    </section>`
}