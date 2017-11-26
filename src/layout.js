const html = require('choo/html')
const login = require('./pages/login.page')
const navbar = require('./elements/navbar.el')
const Notifications = require('./components/Notifications')
const player = require('./elements/player.el')
const UploadModal = require('./components/upload-modal.component')

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
    <body class="flex bg-black">
      <div class="hidden flex-auto flex justify-center items-center">
        <div class="spinner mh3"> </div>
        <div class="">Loading... </div>
      </div>
    </body>` 
}

function layout (view, state, emit) {
  return html`
    <body class="flex flex-column anim-fadein">
      ${Notifications.render()}
      ${UploadModal.render(state, emit)}
      ${navbar(state, emit)}
      <main>
        ${view(state, emit)}
      </main>
      ${player(state, emit)}
    </body>`
}
