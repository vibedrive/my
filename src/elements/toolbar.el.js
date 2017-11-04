const html = require('choo/html')

const toolbarButton = 'bg-none ph3 pv1 flex items-center h2 btn-hover br1'
const buttonIcon = 'w1 h1 bw1 bt bb br bl mr2 b--moon-gray bg-moon-gray'

module.exports = function toolbar (state, emit) {
  return html`
    <nav id="toolbar" class="bg-white h3 black flex justify-between">
      <div id="view-dropdown" class="flex items-center ph3 pointer">
        <span><img src="#" class="${buttonIcon}"></span>
        <div>My dynamic playlist with...</div>
      </div>
      <div id="tools" class="flex flex-auto items-center">
        <button id="filter-dropdown" class="${toolbarButton}"> 
          <span><img src="#" class="${buttonIcon}"></span>
          Filter
        </button>

        <button id="group-by-dropdown" class="${toolbarButton}">
          <span><img src="#" class="${buttonIcon}"></span>
          Group By
        </button>

        <button id="sort-dropdown" class="${toolbarButton}">
          <span><img src="#" class="${buttonIcon}"></span>
          Sort
        </button>
      </div>
      <div class="flex">
        <button id="export-dropdown" class="${toolbarButton}">
          <span><img src="#" class="${buttonIcon}"></span>
        </button>
      </div>
    </nav>
  `
}

      