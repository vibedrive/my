var html = require('choo/html')
var Nanocomponent = require('nanocomponent')
var sleep = require('../lib/sleep')
var Sidepanel = require('./sidepanel.component')

const DEFAULT_CELL_WIDTH = 160

function Table (cols) {
  if (!(this instanceof Table)) return new Table(cols)
  Nanocomponent.call(this)
  this.cols = cols
}

Table.prototype = Object.create(Nanocomponent.prototype)

Table.prototype.createElement = function (tracks) {

  this.el = html`
    <div id="table-container" class="flex flex-column overflow-scroll">

      <div class="flex us-none b--silver h2 w-100 ">
        <div class="th pl3 pr4 pv1 " style="width: 2rem;"><input type="checkbox" /></div>
        ${this.cols.map((col) => thEl(col))}
      </div>

      <div class="bg-near-black flex flex-auto flex-column ">      
        ${tracks.map((track, i) => trEl.call(this, track, i))}
      </div>
    </div>`

  return this.el
}

Table.prototype.update = function (tracks) {
  return this.tracks !== tracks
}

function thEl (col) {
  return html`
    <div class="th flex relative" style="width: ${col.width || DEFAULT_CELL_WIDTH}px">
      <div class="f6 fw5 pa-05 flex items-center cursor-default" style="width: 150px;">
        <span class="has-caret" style="">${col.name}</span>
      </div>
      <div class="sep" onmousedown=${onMouseDown}>
        <div></div>
      </div>
    </div>`

  async function onMouseDown (e) {
    var wait = setTimeout(function () {
      clearTimeout(wait)
      document.addEventListener('mousemove', onMouseMove)
    }, 300)

    document.addEventListener('mouseup', onMouseup)

    function onMouseup (e) {
      clearTimeout(wait)
      document.removeEventListener('mouseup', onMouseup)
      document.removeEventListener('mousemove', onMouseMove)
    }

    function onMouseMove (e) {
      console.log('move')
    }
  }
}

function trEl (row, i) {
  return html`
    <div class="flex">
      <div class="td tc f7 pl3 pr4 pv1 tc" style="width: 2rem;" >
        ${i + 1}
      </div>
      ${this.cols.map(col => html`
        <div class="flex" style="width: ${col.width || DEFAULT_CELL_WIDTH}px">
          <div class="td pa-05 f7 fw5 cursor-default" style="width: 150px">
            ${fromRecursiveKey(row, col.key)}
          </div>
          <div></div>
        </div>
      `)}
    </div>`
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

function linkEl (value = '') {
  return html`
    <a>${value}</a>`
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

module.exports = Table