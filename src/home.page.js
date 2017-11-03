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
  { name: 'Cover', key: 'cover', type: 'img' },
  { name: 'Title', key: 'title', type: 'str' },
  { name: 'Artist', key: 'artist', type: 'str' },
  { name: 'Label', key: 'label', type: 'str' },
  { name: 'BPM', key: 'bpm', type: 'int' },
  { name: 'Key', key: 'key', type: 'str' },
  { name: 'Energy', key: 'energy', type: 'star' },
  { name: 'Tags', key: 'tags', type: 'tags' },
  { name: 'Album', key: 'album', type: 'str' },
  { name: 'Track', key: 'track', type: 'int' },
  { name: 'Year', key: 'year', type: 'int' },
  { name: 'Genre', key: 'genre', type: 'str' },
  { name: 'Comment', key: 'comment', type: 'str' },
  { name: 'Length', key: 'length', type: 'int' },
  { name: 'Audio', key: 'audio', type: 'str' } // audio stream -> size, codec, bitrate, frequency
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
          ${tabs.map(tab => html`
            <a href="#">
              <span>${tab.name}</span>
            </a>
          `)}
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
                ${cols.map(col => getCellEl(col.type, row[col.key]))}
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

function getCellEl (columnType, state) {
  return {
    img: imgEl,
    str: strEl,
    int: intEl,
    star: starEl,
    tags: tagsEl
  }[columnType](state)
}


function imgEl (state) {
  return html`
    <td><img src="${state.url}"/></td>`
}

function strEl (state) {
  return html`
    <td>${state.value}</td>`
}

function intEl (state) {
  return html`
    <td>${parseInt(state.value)}</td>`
}

function starEl (state) {
  return html`
    <td>${Array(state.value).fill(html`<span>⋆</span>`)}</td>`
}

function tagsEl (state) {
  return html`
    <td>${state.items.map(item => html`<span>${item.name}</span>`)}</td>`
}