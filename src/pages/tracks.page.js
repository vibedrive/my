const html = require('choo/html')
const toolbar = require('../elements/toolbar.el')
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
  { name: 'Audio', key: 'audio.hash', type: 'str' }
]

module.exports = function tracksPage (state, emit) {
  var rows = state.tracks

  return html`
    <div>
      ${toolbar(state, emit)}
      <div id="table-container" class="flex flex-column">

        <div class="flex bg-light-gray black-80 b--silver h2" style="border-top: 2px solid #aaa; border-bottom: 1px solid #aaa">
          <div class="ph3 pv1"><input type="checkbox" /></div>
          ${cols.map(col => html`
              <div class="flex" style="position: relative;">
                <div class="ph3 pv1">
                  <span class="has-caret">${col.name}</span>
                </div>
                <div class="sep"><div></div></div>
              </div>
          `)}
        </div>

      ${rows.map((row, i) => html`
        <div class="flex bg-white black">
          <div class="ph3 pv1">${i + 1}</div>
        ${cols.map(col => html`
          <div class="flex">
            <div class="ph1 pv1">
              ${getCellEl(col.type, fromRecursiveKey(row, col.key))}
            </div>
            <div></div>
          </div>
        `)}
        </div>
      `)}
      </div>
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
    int: strEl,
    star: starEl,
    tags: tagsEl
  }[columnType](value)
}


function imgEl (url = '#') {
  return html`
    <div><img src="${url}"/></div>`
}

function strEl (value = '') {
  return html`
    <div>${value}</div>`
}

function starEl (value = 0) {
  return html`
    <div>${Array(value).fill(html`<span>⋆</span>`)}</div>`
}

function tagsEl (tags = []) {
  return html`
    <div>${tags.map(tag => html`<span>${tag.name}</span>`)}</div>`
}