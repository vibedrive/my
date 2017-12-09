var html = require('choo/html')

module.exports = function sidepanel (state, emit) {
  var c = !state.tracks.length ? 'hidden' :
    (state.ui.sidepanel && state.selectedTrack) 
      ? '' 
      : 'is-hidden'

  return html`
    <div id="sidepanel" class=" ${c} mv5 fixed top-0 right-0 h-100 w-40 bg-near-black z-2 pa3">

      <div class="flex justify-between h2 items-center">
        <div>
          <a onclick=${hide} class="bg-none white pa0 pointer">
            <svg class="ic-white" style="width:1rem; height: 1rem;">
              <use xlink:href="icons/openiconic.svg#si-open-x" />
            </svg>
          </a>
        </div>
        <div class="f5">
          ${state.selectedTrack ? state.selectedTrack.metadata.title : ''}
        </div>
        <div>
          
        </div>
      </div>

      <div class="flex flex-column mv4">

        <div class="flex flex-column mv2">
          <div class="mv1 fw6">Title</div>
          <input class="mv2 bg-black white pv2 ph3 f6 w5" 
            type="text" value=${state.selectedTrack ? state.selectedTrack.metadata.title : ''}/>
        </div>

        <div class="flex flex-column mv2">
          <div class="mv1 fw6">Cover</div>
          <a>
            <img class="mv2 bg-black w5 h5" />
          </a>
        </div>

        <div class="block" style="height: 500px;">

      </div>

    </div>`

  function hide (e) {
    emit('ui:close-sidepanel')
  }
}
