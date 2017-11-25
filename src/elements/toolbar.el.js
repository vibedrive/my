const html = require('choo/html')

const toolbarButton = 'lh-none mh2 ph3 pv1 flex items-center h2 btn-hover br1 f7 fw6'
const buttonIcon = 'w1 h1 mr2 mv0'

module.exports = function toolbar (state, emit) {
  return html`
    <nav id="toolbar" class="h3 flex justify-between mh3">
      <div>

      </div>

      <div>
      </div>

      <div class="flex items-center">
        <button class="${toolbarButton}" onclick=${e => emit('ui:toggle-upload-modal')}>
          <svg class="ic-black w1 h1 mr2"  title="${state.user.email}">
            <use xlink:href="icons/openiconic.svg#si-open-cloud-upload" />
          </svg>
          <span class="fw6">Upload Files</span>
        </button>
      </div>
    </nav>
  `
}

      