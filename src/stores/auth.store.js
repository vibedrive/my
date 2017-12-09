var sleep = require('../lib/sleep')
var Notifications = require('../components/notifications')
var vibedrive = require('../api')

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

  state.user = null

  emitter.on('DOMContentLoaded', () => {
    vibedrive.session.get()
      .then(initialize)
      .then(finishInitializing)
      .catch(finishInitializing)

    emitter.on('login', login)
    emitter.on('auth:logout', logout)
    emitter.on('auth:input-email', inputEmail)
    emitter.on('auth:input-password', inputPassword)
  })

  function finishInitializing () {
    state.initializing = false
    emitter.emit('render')
  }

  async function initialize () {
    state.user = await vibedrive.user.get() 
    state.user.usage = await vibedrive.usage.get()
    var payload = { email: state.user.email, accessToken: vibedrive.tokens.accessToken }
    emitter.emit('track:init-store', payload)
  }

  function inputEmail (value) {
    state.auth.email = value
  }

  function inputPassword (value) {
    state.auth.password = value 
  }

  async function login (e) {
    e.preventDefault()

    try {
      state.loggingIn = true
      emitter.emit('render')

      await sleep(300)

      var email = e.target.form.elements.email.value
      var password = e.target.form.elements.password.value

      var { refreshToken, accessToken } = await vibedrive.auth.login(email, password)

      await initialize(email, password)

      state.loggingIn = false

      document.body.classList.remove('anim-fadein')
      document.body.classList.add('anim-fadeout')

      await sleep(500)
      emitter.emit(state.events.REPLACESTATE, '/tracks')
    } catch (err) {
      Notifications.error(err.message)
      state.loggingIn = false
      emitter.emit('render')   
    }
  }

  async function logout () {
    var promise =  vibedrive.auth.logout()

    document.body.classList.remove('anim-fadein')
    document.body.classList.add('anim-fadeout')

    await sleep(500)

    await promise

    state.user = null

    emitter.emit('render')
  }
}

