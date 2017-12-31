var html = require('choo/html')
var Table = require('../components/table.component')
var toolbar = require('../elements/toolbar.el')
var leftPanel = require('../elements/left-panel.el')
var sidepanel = require('../elements/sidepanel.el')

var cols = [
  { name: '', key: 'cover', type: 'cover', width: 4 },
  { name: 'Title', key: 'metadata.title', type: 'text' },
  { name: 'Artist', key: 'metadata.artist', type: 'text' },
  { name: 'Label', key: 'metadata.label', type: 'text' },
  { name: 'Genre', key: 'metadata.genre', type: 'text' },
  { name: 'Length', key: 'metadata.duration', type: 'time' }
]

var table = Table(cols)

module.exports = function tracksPage (state, emit) {
  var classes = state.ui.leftPanel ? 'left-panel-visible' : ''

  return html`
    <div id="page" class="flex flex-column flex-auto h-100 ${classes}">
      ${toolbar(state, emit)}
      ${leftPanel(state, emit)}
      ${sidepanel(state, emit)}
      <div id="main-view" class="flex flex-column flex-auto w-100 h-100 bg-dark-grey">
        ${table.render(state, emit)}
      </div>
    </div>
  `
}
