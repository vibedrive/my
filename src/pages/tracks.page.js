const html = require('choo/html')
const toolbar = require('../elements/toolbar.el')
const cols = [
  { name: 'Cover', key: 'cover.id', type: 'img' },
  { name: 'Title', key: 'metadata.title', type: 'str' },
  { name: 'Artist', key: 'metadata.artist', type: 'str' },
  { name: 'Label', key: 'metadata.label', type: 'str' },
  { name: 'Added on', key: 'metadata.addedOn', type: 'str' },
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
    <div class="flex flex-column flex-auto">
      ${toolbar(state, emit)}
      <div id="table-container" class="flex flex-auto flex-column bg-light-gray" style="overflow-x: scroll">

        <div class="flex us-none b--silver h2 w-100 ">
          <div class="th pl3 pr4 pv1 " style="width: 2rem;"><input type="checkbox" /></div>
          ${cols.map(col => html`
              <div class="th flex bg-light-gray relative">
                <div class="f6 fw5 pa-05 flex items-center black-70 cursor-default" style="width: 150px;">
                  <span class="has-caret" style="">${col.name}</span>
                </div>
                <div class="sep"><div></div></div>
              </div>
          `)}
        </div>

        <div class="bg-light-gray flex flex-auto flex-column ">      
          ${rows.map((row, i) => html`
            <div class="flex">
              <div class="td tc f7 pl3 pr4 pv1 bb bw1 b--moon-gray bg-white black-70 tc" style="width: 2rem;" >
                ${i + 1}
              </div>
              ${cols.map(col => html`
                <div class="flex">
                  <div class="td pa-05 f7 fw5 bb br bw1 b--moon-gray bg-white black-70 cursor-default" style="width: 150px">
                    ${fromRecursiveKey(row, col.key)}
                  </div>
                  <div></div>
                </div>
              `)}
            </div>
          `)}
        </div>
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