const html = require('choo/html')

const toolbarButton = 'lh-none bg-none ph3 pv1 flex items-center h2 btn-hover br1 black-80'
const buttonIcon = 'w1 h1 bw1 bt bb br bl mr2 b--moon-gray bg-moon-gray'

module.exports = function toolbar (state, emit) {
  return html`
    <nav id="toolbar" class="bg-white h3 black-80 flex justify-between">
      <div id="view-dropdown" class="flex items-center ph3 pointer lh-none ">
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
      <div class="flex items-center pr3">
        <button id="export-dropdown" class="hidden flex bg-none w2 h2 items-center justify-center btn-hover">
          <span><img src="#" class="w1 h1 b--moon-gray bg-moon-gray"></span>
        </button>
      </div>
    </nav>
  `
}

      