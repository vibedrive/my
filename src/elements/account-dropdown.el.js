const html = require('choo/html')

module.exports = function accountDropdown (state, emit) {
  return !state.ui.accountDropdown 
    ? html`<div class="hidden"></div>`
    : html`
        <div class="block fixed left-0 right-0 top-0 bottom-0">

          <div id="account-dropdown"
            class="absolute right-0 z-3 shadow-1 br1 mt4 mh3 bg-white black-70 pv2 ph2">
            <div>
              <div class="f6 fw5">Account</div>
              <hr class="mv2 b--moon-gray" />
              <div class="pv2 ph2 f6 fw5 gray">${state.user.email}</div>
              <div class="pv2 ph2 pointer btn-hover" 
                  onclick=${e => navigate('/account')}>
                <a class="f6 black-70" >
                  Account
                </a>
              </div>      
              <div class="pv2 ph2 pointer btn-hover" 
                  onclick=${e => emit('auth:logout')}>
                <a class="f6 black-70" >
                  Logout
                </a>
              </div>      
            </div> 
          </div>

          <div 
            class="fixed left-0 right-0 top-0 bottom-0 bg-black-20 z-2"
            onclick=${e => emit('ui:toggle-account-dropdown')}>
          </div>

        </div>`

  function navigate (route) {
    emit('ui:toggle-account-dropdown')
    emit(state.events.PUSHSTATE, route)
  }
}