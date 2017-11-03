const html = require('choo/html')

const tabs = [
  { name: 'Tracks' },
  { name: 'Artists' },
  { name: 'Labels' },
  { name: 'Audio Stream' },
  { name: 'Tag' },
  { name: 'Cover Art' }
]

const cols = [
  { name: 'Cover', key: 'cover.id', type: 'img' },
  { name: 'Title', key: 'metadata.title', type: 'str' },
  { name: 'Artist', key: 'metadata.artist', type: 'str' },
  { name: 'Label', key: 'metadata.label', type: 'str' },
  { name: 'BPM', key: 'metadata.bpm', type: 'int' },
  { name: 'Key', key: 'metadata.key', type: 'str' },
  { name: 'Energy', key: 'metadata.energy', type: 'star' },
  { name: 'Tags', key: 'metadata.tags', type: 'tags' },
  { name: 'Album', key: 'metadata.album', type: 'str' },
  { name: 'Track', key: 'metadata.track', type: 'int' },
  { name: 'Year', key: 'metadata.year', type: 'int' },
  { name: 'Genre', key: 'metadata.genre', type: 'str' },
  { name: 'Comment', key: 'metadata.comment', type: 'str' },
  { name: 'Length', key: 'audio.length', type: 'int' },
  { name: 'Audio', key: 'audio.hash', type: 'str' } // audio stream -> size, codec, bitrate, frequency
]

const rows = [{ 
  cover: { url: '#' }, 
  title: { value: 'My Doo' }, 
  artist: { value: 'Doodle-doo' }, 
  label: { value: 'Doodelirium' }, 
  bpm: { value: 140 }, 
  key: { value: 'C#m' }, 
  energy: { value: 3 }, 
  tags: { items: [{ name: 'Chill' }] },
  album: { value: '' },
  track: { value: null },
  year: { value: 2017 },
  genre: { value: 'Hip Hop' },
  comment: { value: '...' },
  length: { value: 223 },
  audio: { value: '0x2f2d0f3313a2' }
}]

module.exports = function home (state, emit) {
  var rows = state.tracks
  console.log(rows)

  return html`
    <div class="">
      <input type="file" multiple onchange=${e => emit('upload', e.target.files)}/>
      <nav id="navbar">
        <h1>Vibedrive</h1>
        <a>
          <img src="#" title="${state.user.email}" />
        </a>
      </nav>

      <nav id="tabsbar">
        <div>
          ${tabs.map(tab => html`<a href="#"><span>${tab.name}</span></a>`)}
        </div>
        <div id="history-dropdown">
          <img src="#" />
        </div>
      </nav>

      <nav id="toolbar">
        <div id="view-dropdown"></div>
        <div id="tools">
          <div id="filter-dropdown"></div>
          <div id="group-by-dropdown"></div>
          <div id="sort-dropdown"></div>
        </div>
        <div id="export-dropdown"></div>
      </nav>

      <div id="table-container">
        <table>
          <thead>
              <tr>
                <th><input type="checkbox" /></th>
                ${cols.map(col => html`
                    <th>
                      <span>${col.name}</span>
                      <button>▼</button>
                    </th>
                `)}
              </tr>
          </thead>
          <tbody>
            ${rows.map((row, i) => html`
              <tr>
                <td>${i + 1}</td>
                ${cols.map(col => getCellEl(col.type, fromRecursiveKey(row, col.key)))}
              </tr>
            `)}
          </tbody>
        </table>
      </div>

      <footer class="">
        <a href="/" onclick=${e => emit('logout')}>Logout</a>
      </footer>

    </div>
  `
}

function fromRecursiveKey (row, key) {
  var keys = key.split('.')
  var key = keys[0]

  if (keys.length > 1) {
    var object = row[key]

    if (!object) return null
    var nextKey = keys.slice(1).join('.')
    return fromRecursiveKey(object, nextKey)
  } else {
    var value = row[key]

    return value
  }
}

function getCellEl (columnType, value) {
  
  return {
    img: imgEl,
    str: strEl,
    int: intEl,
    star: starEl,
    tags: tagsEl
  }[columnType](value)
}


function imgEl (url = '#') {
  return html`
    <td><img src="${url}"/></td>`
}

function strEl (value = '') {
  return html`
    <td>${value}</td>`
}

function intEl (value = 0) {
  return html`
    <td>${value}</td>`
}

function starEl (value = 0) {
  return html`
    <td>${Array(value).fill(html`<span>⋆</span>`)}</td>`
}

function tagsEl (tags = []) {
  return html`
    <td>${tags.map(tag => html`<span>${tag.name}</span>`)}</td>`
}