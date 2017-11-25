var html = require('choo/html')
var Table = require('../components/table.component')
var toolbar = require('../elements/toolbar.el')

const cols = [
  { name: 'Cover', key: 'cover.id', type: 'img', width: 4 },
  { name: 'Title', key: 'metadata.title', type: 'str' },
  { name: 'Artist', key: 'metadata.artist', type: 'str' },
  { name: 'Label', key: 'metadata.label', type: 'str' },
  { name: 'Genre', key: 'metadata.genre', type: 'str' },
  { name: 'Length', key: 'audio.length', type: 'int' },
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
      <main class="flex flex-column flex-auto ph3 w-100 h-100 bg-dark-grey">
        ${table.render(state.tracks)}
      </main>
    </div>
  `
}
