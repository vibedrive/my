const html = require('choo/html')
const login = require('./pages/login.page')
const navbar = require('./elements/navbar.el')
const uploadModal = require('./elements/upload-modal.el')

module.exports = function (view) {
  return function (state, emit) {
    return state.initializing 
      ? initializing()
      : state.user
        ? layout(view, state, emit)
        : login(state, emit)
  }
}

function initializing () {
  return html`
    <body class="flex">
      <div class="hidden flex-auto flex justify-center items-center">
        <div class="spinner mh3"> </div>
        <div class="">Loading... </div>
      </div>
    </body>` 
}

function layout (view, state, emit) {
  return html`
    <body class="flex flex-column">
      ${uploadModal(state, emit)}
      ${navbar(state, emit)}
      ${view(state, emit)}
    </body>`
}
