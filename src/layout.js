const html = require('choo/html')
const login = require('./login.page')

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
  return html`<body> Loading... </body>` 
}

function layout (view, state, emit) {
  return html`
    <body>
      ${view(state, emit)}
    </body>`
}
