const html = require('choo/html')

module.exports = function navbar (state, emit) {
  return html`
    <nav id="navbar">
      <h1>Vibedrive</h1>
      <a onclick=${e => emit('navbar:toggle-account-dropdown')}>
        <img src="#" title="${state.user.email}" />
      </a>
    </nav>
  `
}

function acccountDropdown () {
  return html`
    <div class="">
      <a href="/" onclick=${e => emit('logout')}>Logout</a>
    </div>
  `
}
      