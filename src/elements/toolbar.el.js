const html = require('choo/html')

const toolbarButton = 'lh-none mh2 ph3 pv1 flex items-center h2 btn-hover br1 bg-black-05 black-70 f7 fw6'
const buttonIcon = 'w1 h1 mr2 mv0'

module.exports = function toolbar (state, emit) {
  return html`
    <nav id="toolbar" class="bg-white h3 black-80 flex justify-between">
      <div id="view-dropdown" class="flex items-center ph3 pointer">
        <div class="flex pv1 ph3 h2 br1 bw1 b--light-gray bt br bb bl justify-around items-center">
          <img class="button-icon" src="/icons/ic_featured_play_list_black_48px.svg" class="${buttonIcon}">
          <span class="f6 fw5 dim black-70">My dynamic playlist with...</span>
        </div>
      </div>
      <div id="tools" class="flex flex-auto items-center">
        <button id="filter-dropdown" class="${toolbarButton}"> 
          <span class="button-icon"><img src="/icons/ic_filter_list_black_48px.svg" class="${buttonIcon}"></span>
          Filter
        </button>

        <button id="group-by-dropdown" class="${toolbarButton}">
          <span><img class="button-icon" src="/icons/ic_select_all_black_48px.svg" class="${buttonIcon}"></span>
          Group By
        </button>

        <button id="sort-dropdown" class="${toolbarButton}">
          <span class="button-icon"><img src="/icons/ic_sort_black_48px.svg" class="${buttonIcon}"></span>
          Sort
        </button>
      </div>
      <div class="flex items-center pr3">
        <input id="file-input" 
          class="hidden" 
          type="file" 
          multiple 
          onchange=${e => emit('upload', e.target.files)}/>
        <label for="file-input" class="${toolbarButton} pointer">
          <img class="button-icon mr2" src="/icons/ic_cloud_upload_black_48px.svg" />
          <span class="fw6">Upload Files</span>
        </label>
      </div>
    </nav>
  `
}

      