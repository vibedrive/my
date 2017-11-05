const http = require('../lib/http')
const sleep = require('../lib/sleep')
const Notifications = require('../components/notifications')
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
    emitter.on('auth:logout', logout)
  })

  async function login (e) {
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

    var promise = http.post(opts)

    await sleep(1000)

    try {
      var body = await promise
      var { refreshToken, accessToken } = body

      saveSession(refreshToken, accessToken)
      await initialize()

      state.loggingIn = false
      emitter.emit('render')
    } catch (err) {
      console.error(err)
      Notifications.error('Sorry, we don’t recognize that email or password.')
      state.loggingIn = false
      emitter.emit('render')  
    }
  }

  function saveSession (refreshToken, accessToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    state.tokens.refreshToken = refreshToken
    state.tokens.accessToken = accessToken
  }

  async function initialize () {
    const opts = {
      url: CURRENT_USER_URL,
      headers: { authorization: state.tokens.accessToken },
      json: true
    }

    state.user = await http.get(opts)
    await database.init(state.user.email)
    state.tracks = await store.tracks.get()
    emitter.emit(state.events.REPLACESTATE, '/tracks')
  }

  async function logout () {
    const opts = {
      url: LOGOUT_URL,
      headers: { authorization: state.tokens.accessToken },
      body: { refreshToken: state.tokens.refreshToken },
      json: true
    }

    await http.post(opts)
    clearSession()

    emitter.emit('render')
  }

  function clearSession () {
    localStorage.setItem(ACCESS_TOKEN_KEY, null)
    localStorage.setItem(REFRESH_TOKEN_KEY, null)
    state.user = null
    state.tokens = {}
  }

  async function getSession () {
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

    try {
      var { accessToken } = await http.post(opts)
      saveSession(refreshToken, accessToken)
      await initialize()
      state.initializing = false
      emitter.emit('render')
    } catch (err) {
      state.initializing = false
      emitter.emit('render')
    }
  }
}

