var html = require('choo/html')
var login = require('./pages/login.page')
var navbar = require('./elements/navbar.el')
var Notifications = require('./components/notifications')
var player = require('./elements/player.el')
var UploadModal = require('./components/upload-modal.component')

module.exports = function (view) {
  // return function (state, emit) {
  //   return state.initializing
  //     ? initializing()
  //     : state.user
  //       ? layout(view, state, emit)
  //       : login(state, emit)
  // }
  return function (state, emit) {
    return state.initializing
      ? initializing()
      : layout(view, state, emit)
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
