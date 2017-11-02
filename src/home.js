const html = require('choo/html')

const tabs = [
  { name: 'Files' },
  { name: 'Tracks' },
  { name: 'Artists' },
  { name: 'Labels' }
]

const cols = [
  { name: 'Cover', key: 'cover', type: 'img' },
  { name: 'Title', key: 'title', type: 'str' },
  { name: 'Artist', key: 'artist', type: 'str' },
  { name: 'Label', key: 'label', type: 'str' },
  { name: 'BPM', key: 'bpm', type: 'int' },
  { name: 'Key', key: 'key', type: 'str' },
  { name: 'Energy', key: 'energy', type: 'star' },
  { name: 'Tags', key: 'tags', type: 'tags' }
]

const rows = [{ 
  cover: { url: '#' }, 
  title: { value: 'My Doo' }, 
  artist: { value: 'Doodle-doo' }, 
  label: { value: 'Doodelirium' }, 
  bpm: { value: 140 }, 
  key: { value: 'C#m' }, 
  energy: { value: 3 }, 
  tags: { items: [{ name: 'Chill' }] } 
}]

module.exports = function home (state, emit) {
  return html`
    <body>
      <nav id="navbar">
        <h1>Vibedrive</h1>
        <a>
          <img src="#"/>
        </a>
      </nav>

      <nav id="tabsbar">
        <div>
          ${tabs.map(tab => html`
            <div>
              <span>${tab.name}</span>
            </div>
          `)}
        </div>
        <div id="history-dropdown">
          <img src="#">
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

    </body>
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
    <td>${state.value}</td>`
}

function starEl (state) {
  return html`
    <td>${Array(state.value).fill(html`<span>⋆</span>`)}</td>`
}

function tagsEl (state) {
  return html`
    <td>${state.items.map(item => html`<span>${item.name}</span>`)}</td>`
}