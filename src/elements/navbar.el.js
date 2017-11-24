const html = require('choo/html')
const accountDropdown = require('./account-dropdown.el')

module.exports = function navbar (state, emit) {
  return html`
    <nav id="navbar" class="flex w-100 justify-between content-between bg-black">

      <div class="flex1 flex justify-center items-center">

          <a href="/tracks">
            <img src="images/logo.svg" class="ma2"/>
          </a>

      </div>

      <div class="flex1 flex justify-end items-center pr3 pv2 f6">
        <a class="pointer" onclick=${e => emit('ui:toggle-account-dropdown')}>
          <img class="button-icon" src="/icons/ic_account_circle_white_48px.svg" title="${state.user.email}" />
        </a>
      </div>

      ${accountDropdown(state, emit)}
      
    </nav>`
}
