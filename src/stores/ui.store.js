var sleep = require('hypno')
var initialState = {
  leftPanel: true,
  accountDropdown: false,
  navigating: false,
  sidepanel: false
}

module.exports = function (globalState, emitter) {
  var state = Object.assign({}, initialState)

  globalState.ui = state

  emitter.on('DOMContentLoaded', function () {
    emitter.on('ui:toggle-left-panel', toggleLeftPanel)
    emitter.on('ui:toggle-account-dropdown', toggleAccountDropdown)
    emitter.on('ui:open-sidepanel', openSidepanel)
    emitter.on('ui:close-sidepanel', closeSidepanel)
    emitter.on('auth:logout', reset)
    emitter.on('app:navigate', onNavigate)
  })

  function toggleLeftPanel () {
    state.leftPanel = !state.leftPanel
    emitter.emit('render')
  }

  async function openSidepanel () {
    var el = document.querySelector('#sidepanel')
    el.classList.add('will-open')
    await sleep(300)
    state.sidepanel = true
    emitter.emit('render')
  }

  async function closeSidepanel () {
    var el = document.querySelector('#sidepanel')
    el.classList.add('will-close')
    await sleep(300)
    state.sidepanel = false
    emitter.emit('render')
  }

  function toggleAccountDropdown () {
    state.accountDropdown = !state.accountDropdown
    emitter.emit('render')
  }

  function reset () {
    for (let prop in initialState) {
      if (state.hasOwnProperty(prop)) state[prop] = initialState[prop]
    }
  }

  async function onNavigate (route) {
    emitter.emit('render')
  }
}
