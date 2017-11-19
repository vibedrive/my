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
const USAGE_URL = LOCAL_URL + '/account/usage'
const SESSION_URL = LOCAL_URL + '/session'
const CURRENT_USER_URL = LOCAL_URL + '/user'
const LOGIN_URL = LOCAL_URL + '/login'
const LOGOUT_URL = LOCAL_URL + '/logout'

module.exports = function (state, emitter) {
  state.initializing = true
  state.loggingIn = false
  state.auth = {
    email: '',
    password: ''
  }
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
    emitter.on('auth:input-email', inputEmail)
    emitter.on('auth:input-password', inputPassword)
  })

  function inputEmail (value) {
    state.auth.email = value
  }

  function inputPassword (value) {
    state.auth.password = value 
  }

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

    await sleep(300)

    try {
      var { refreshToken, accessToken } = await http.post(opts)

      saveSession(refreshToken, accessToken)

      await initialize()

      state.loggingIn = false

      document.body.classList.remove('anim-fadein')
      document.body.classList.add('anim-fadeout')

      await sleep(500)

      emitter.emit(state.events.REPLACESTATE, '/tracks')

    } catch (err) {
      var errorMessage

      if (typeof err === 'object' && err.statusCode) {
        switch (err.statusCode) {
          case 401:
            errorMessage = 'Sorry, we don’t recognize that email or password.'
            break
          case 400:
            errorMessage = 'Please enter a valid email and a password.'
            break
          default:
            console.error(err)
            errorMessage = 'There was an unexpected error.'
            break
        }
      } else {
        errorMessage = 'Could not connect to the server.'
      }

      Notifications.error(errorMessage)
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
    state.user = await getUser() 
    state.user.usage = await getUsage()
    await database.init(state.user.email)
    state.tracks = await store.tracks.get()
  }

  async function getUser () {
    const opts = {
      url: CURRENT_USER_URL,
      headers: { authorization: state.tokens.accessToken },
      json: true
    }

    return http.get(opts)
  }

  async function getUsage () {
    const opts = {
      url: USAGE_URL,
      headers: { authorization: state.tokens.accessToken },
      json: true
    }

    return http.get(opts)
  }

  async function logout () {
    const opts = {
      url: LOGOUT_URL,
      headers: { authorization: state.tokens.accessToken },
      body: { refreshToken: state.tokens.refreshToken },
      json: true
    }

    var promise =  http.post(opts)

    document.body.classList.remove('anim-fadein')
    document.body.classList.add('anim-fadeout')
    await sleep(500)

    await promise

    clearSession()

    emitter.emit('render')
  }

  function clearSession () {
    localStorage.setItem(ACCESS_TOKEN_KEY, '')
    localStorage.setItem(REFRESH_TOKEN_KEY, '')
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

