const html = require('choo/html')

module.exports = function uploadModal (state, emit) {
  return !state.ui.sidepanel ? html`<div></div>` : html`
    <div id="sidepanel" class="absolute top-0 right-0 h-100 w5 bg-red z-5">
      <div>
        <div></div>
        <div>
          <button>x</button>
        </div>
      </div>
    </div>`
}
