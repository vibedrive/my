const xhr = require('xhr')
const database = require('../lib/db')
const store = {
  tracks: require('../lib/tracks')
}

const LOCAL_URL = 'https://localhost:5823'
const ACCESS_TOKEN_KEY = 'vibedrive::access_token'
const REFRESH_TOKEN_KEY = 'vibedrive::refresh_token'
const SESSION_URL = LOCAL_URL + '/session'
const CURRENT_USER_URL = LOCAL_URL + '/user'
const LOGIN_URL = LOCAL_URL + '/login'
const LOGOUT_URL = LOCAL_URL + '/logout'

module.exports = function (state, emitter) {
  state.initializing = true
  state.loggingIn = false
  state.tokens = {
    refreshToken: null,
    accessToken: null
  }

  state.tracks = []

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

    var email = e.target.form.elements.email.value
    var password = e.target.form.elements.password.value

    var opts = {
      url: LOGIN_URL,
      body: { email, password },
      json: true
    }

    xhr.post(opts, async function (err, res, body) {
      state.loggingIn = false
      emitter.emit('render')

      if (err) return console.error(err)

      if (res.statusCode === 200 && body) {
        await saveSession(body.refreshToken, body.accessToken)
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

    xhr.get(opts, async (err, res, body) => {
      if (res.statusCode === 200 && body) {
        state.user = body

        await database.init(state.user.email)

        var tracks = await store.tracks.get()
        state.tracks = tracks

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

    xhr.post(opts, async (err, res, body) => {
      if (res.statusCode === 200 && body.accessToken) {
        await saveSession(refreshToken, body.accessToken)
        state.initializing = false
        emitter.emit('render')
        return
      } else {
        state.initializing = false
        emitter.emit('render')
        return
      }
    })
  }
}

