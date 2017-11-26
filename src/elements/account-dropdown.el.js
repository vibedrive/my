const html = require('choo/html')

module.exports = function accountDropdown (state, emit) {
  return !state.ui.accountDropdown 
    ? html`<div class="hidden"></div>`
    : html`
        <div class="block fixed left-0 right-0 top-0 bottom-0">

          <div id="account-dropdown" class="absolute right-0 z-3 br1 mt5 bg-black pv3 ph3">
            <div class="pv2 ph2 f6 fw5 gray">${state.user.email}</div>

            <div class="menu mv3">
              <div class="pv2 ph2 pointer menu-item" 
                  onclick=${e => navigate('/account')}>
                <a class="f6 white" >
                  Account
                </a>
              </div>      
              <div class="pv2 ph2 pointer menu-item" 
                  onclick=${e => emit('auth:logout')}>
                <a class="f6 white" >
                  Logout
                </a>
              </div>      
            </div> 
          </div>

          <div 
            class="fixed left-0 right-0 top-0 bottom-0 bg-none z-2"
            onclick=${e => emit('ui:toggle-account-dropdown')}>
          </div>

        </div>`

  function navigate (route) {
    emit('ui:toggle-account-dropdown')
    emit(state.events.PUSHSTATE, route)
  }
}