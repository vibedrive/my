var html = require('choo/html')
var PlaylistFiltersPopover = require('../components/playlist-filter-popover.component')
var caret = require('./caret.el')
var popover = PlaylistFiltersPopover()

module.exports = function toolbarEl (state, emit) {
  var buttonEl = html`
    <button onclick=${e => popover.toggleVisibility(e)} 
      class="hover-b--blue ph3 pv2 bg-none ba bw1 b--white white fw6 f6 flex flex-row  mh2">
      ${popover.filters.length} Filters
      ${caret()}
    </button>
  `

  return html`
    <nav id="toolbar" class="h3 flex justify-between ph4 bg-near-black items-center">
      <div class="flex flex-row items-center">
        <span class="fw6 f6">Playlist:</span>
        <p class="fw4 white pv2 ph3 f6 mr2"/>
          My First Radio Show
        </p>
        ${buttonEl}
        ${popover.render({}, emit)}
      </div>

      <div>
      </div>

      <div class="flex items-center">
        <p class="fw6 f6">1 tracks</p>
      </div>
    </nav>
  `
}
