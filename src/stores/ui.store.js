module.exports = function (globalState, emitter) {
  var state = {
    accountDropdown: false,
    uploadModal: true
  }

  globalState.ui = state

  emitter.on('DOMContentLoaded', function () {
    emitter.on('ui:toggle-account-dropdown', toggleAccountDropdown)
    emitter.on('ui:toggle-upload-modal', toggleUploadModal)
  })

  function toggleAccountDropdown () {
    state.accountDropdown = !state.accountDropdown
    emitter.emit('render')
  }

  function toggleUploadModal () {
    state.uploadModal = !state.uploadModal 
    emitter.emit('render')
  }
}