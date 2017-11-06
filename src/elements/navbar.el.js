const html = require('choo/html')
const accountDropdown = require('./account-dropdown.el')

module.exports = function navbar (state, emit) {
  return html`
    <nav id="navbar" class="flex w-100 justify-between content-between bg-near-black" style="height: 4rem">
      <div class="flex1 flex justify-start items-center pl3 pv2">
      </div>

      <div class="flex1 flex justify-center items-center pv2">
        <p class=""><a class="white-90" href="/tracks">Vibedrive</a></p>
      </div>

      <div class="flex1 flex justify-end items-center pr3 pv2 f6">
        <a class="pointer" onclick=${e => emit('ui:toggle-account-dropdown')}>
          <img class="button-icon" src="/icons/ic_account_circle_white_48px.svg" title="${state.user.email}" />
        </a>
      </div>

      ${accountDropdown(state, emit)}
      
    </nav>`
}
