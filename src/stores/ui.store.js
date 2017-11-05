const initialState = {
  accountDropdown: false,
  uploadModal: false
}

module.exports = function (globalState, emitter) {
  var state = Object.assign({}, initialState)

  globalState.ui = state

  emitter.on('DOMContentLoaded', function () {
    emitter.on('ui:toggle-account-dropdown', toggleAccountDropdown)
    emitter.on('ui:toggle-upload-modal', toggleUploadModal)
    emitter.on('auth:logout', reset)
  })

  function toggleAccountDropdown () {
    state.accountDropdown = !state.accountDropdown
    emitter.emit('render')
  }

  function toggleUploadModal () {
    state.uploadModal = !state.uploadModal 
    emitter.emit('render')
  }

  function reset () {
    for (let prop in initialState) {
      if (state.hasOwnProperty(prop)) state[prop] = initialState[prop]
    }
  }
}