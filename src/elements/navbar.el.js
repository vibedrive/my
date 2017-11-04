const html = require('choo/html')

module.exports = function navbar (state, emit) {
  return html`
    <nav id="navbar" class="flex w-100 h3 justify-between content-between">
      <div class="flex1 flex items-center pl3">

        <input id="file-input" 
          class="hidden" 
          type="file" 
          multiple 
          onchange=${e => emit('upload', e.target.files)}/>
        <label for="file-input" class="pointer ph3 pv2 near-black br1 bg-white h2">
          Import Files
        </label>
        
      </div>
      <div class="flex1 flex justify-center items-center">
        <p class="">Vibedrive</p>
      </div>
      <div class="flex1 flex justify-end items-center pr3">
        <a onclick=${e => emit('ui:toggle-account-dropdown')}>
          <img src="#" title="${state.user.email}" />
        </a>
      </div>
      
    </nav>`
}

function acccountDropdown () {
  return html`
    <div class="">
      <a href="/" onclick=${e => emit('logout')}>Logout</a>
    </div>
  `
}
      