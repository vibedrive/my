const html = require('choo/html')
const login = require('./pages/login.page')
const navbar = require('./elements/navbar.el')

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
    <body class="">  
      ${navbar(state, emit)}
      ${view(state, emit)}
    </body>`
}
