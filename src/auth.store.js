const xhr = require('xhr')

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

