module.exports = function (globalState, emitter) {
  var state = {
    accountDropdown: false
  }

  globalState.ui = state

  emitter.on('DOMContentLoaded', function () {
    emitter.on('ui:toggle-account-dropdown', toggleAccountDropdown)
  })

  function toggleAccountDropdown () {
    state.accountDropdown = !state.accountDropdown
  }
}