var html = require('choo/html')
var Table = require('../components/table.component')
var toolbar = require('../elements/toolbar.el')
var sidepanel = require('../elements/sidepanel.el')

var cols = [
  { name: '', key: 'cover', type: 'cover', width: 4 },
  { name: 'Title', key: 'metadata.title', type: 'text' },
  { name: 'Artist', key: 'metadata.artist', type: 'text' },
  { name: 'Label', key: 'metadata.label', type: 'text' },
  { name: 'Genre', key: 'metadata.genre', type: 'text' },
  { name: 'Length', key: 'audio.length', type: 'text' },
  // { name: 'Added on', key: 'metadata.addedOn', type: 'str' },
  // { name: 'BPM', key: 'metadata.bpm', type: 'int' },
  // { name: 'Key', key: 'metadata.key', type: 'str' },
  // { name: 'Energy', key: 'metadata.energy', type: 'star' },
  // { name: 'Tags', key: 'metadata.tags', type: 'tags' },
  // { name: 'Album', key: 'metadata.album', type: 'str' },
  // { name: 'Track', key: 'metadata.track', type: 'int' },
  // { name: 'Year', key: 'metadata.year', type: 'int' },
  // { name: 'Comment', key: 'metadata.comment', type: 'str' },
  // { name: 'Audio', key: 'audio.hash', type: 'str' }
]

var table = Table(cols)

module.exports = function tracksPage (state, emit) {
  return html`
    <div class="flex flex-column flex-auto h-100">
      ${toolbar(state, emit)}
      ${sidepanel(state, emit)}
      <div class="flex flex-column flex-auto ph3 w-100 h-100 bg-dark-grey">
        ${table.render(state, emit)}
      </div>
    </div>
  `
}
