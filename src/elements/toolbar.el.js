const html = require('choo/html')

const toolbarButton = 'lh-none mh2 ph3 pv1 flex items-center h2 btn-hover br1 f7 fw6'
const buttonIcon = 'w1 h1 mr2 mv0'

module.exports = function toolbar (state, emit) {
  return html`
    <nav id="toolbar" class="h3 flex justify-between">
      <div id="view-dropdown" class="flex items-center ph3 pointer">

      </div>

      <div id="tools" class="flex flex-auto items-center">
      </div>

      <div class="flex items-center pr3">
        <button class="${toolbarButton}" onclick=${e => emit('ui:toggle-upload-modal')}>
          <img class="${buttonIcon}" src="/icons/ic_cloud_upload_black_48px.svg" />
          <span class="fw6">Upload Files</span>
        </button>
      </div>
    </nav>
  `
}

      