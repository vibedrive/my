var html = require('choo/html')
var Nanocomponent = require('nanocomponent')
var sleep = require('../lib/sleep')

const DEFAULT_CELL_WIDTH = 15

function Table (cols) {
  if (!(this instanceof Table)) return new Table(cols)
  Nanocomponent.call(this)
  this.cols = cols
}

Table.prototype = Object.create(Nanocomponent.prototype)

Table.prototype.createElement = function (state, emit) {
  const { tracks, selectedTrack } = state
  
  this.tracks = tracks
  this.selectedTrack = selectedTrack
  this.emit = emit

  this.el = html`
    <div id="table-container" class="flex flex-column mv3">

      <div class="flex us-none h3 w-100 items-end pv3">
        <div class="th pl3 pr4 " style="width: 2rem;">

        </div>
        ${this.cols.map((col) => thEl(col))}
      </div>

      <div class=" flex flex-auto flex-column">      
        ${tracks.map((track, i) => {
          return trEl.call(this, track, i)
        })}
      </div>
    </div>`

  return this.el
}

Table.prototype.update = function (state, emit) {
  this.emit = emit 
  return (state.tracks !== this.tracks) || (state.selectedTrack !== this.selectedTrack)
}

function thEl (col) {
  return html`
    <div class="th flex relative pure-white ph2 fw7" style="width: ${col.width || DEFAULT_CELL_WIDTH}rem">

      <span>${col.name}</span>

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
  var selected = this.selectedTrack && this.selectedTrack._id === row._id
  var c = selected ? 'selected' : ''

  return html`
    <div class="${c} flex table-row" onclick=${e => handleClick.call(this, e)}>
      <div class="flex td tc f7 pl3 pr4 pv1 tc items-center h3" style="width: 2rem;" >
        ${i + 1}
      </div>
      ${this.cols.map(col => html`
        <div class="flex f6 items-center ph2" style="width: ${col.width || DEFAULT_CELL_WIDTH}rem">

          ${getCellEl(col.type, fromRecursiveKey(row, col.key))}

        </div>
      `)}
    </div>`

  function handleClick (e) {
    var self = this

    if (this.selectedTrack._id !== row._id) {
      this.emit('track:select-track', row)
    }

    e.target.addEventListener('click', onSecondClick)

    var timer = setTimeout(function () {
      e.target.removeEventListener('click', onSecondClick)
      clearTimeout(timer)
    }, 300)

    function onSecondClick () {
      self.emit('ui:open-sidepanel')  
      self.emit('player:load-selected')
    }
  }
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
    tags: tagsEl,
    cover: coverEl
  }[columnType](value)
}

function coverEl (url) {
  var self = this
  return html`
    <div class="cover w-100 h-100 flex items-center justify-start pl1">
      <a class="absolute play-button" onclick=${play}>
        <svg class="ic-white" style="width:1rem; height: 1rem;">
          <use xlink:href="icons/openiconic.svg#si-open-play-circle" />
        </svg>
      </a>
      <img ${url ? 'src=' + url : ''} class="w2 h2 bg-black"/>
    </div>`

  function play (e) {
    e.preventDefault()
    console.log('play!')
  }
}

function imgEl (url) {
  return url
    ? html`<div class="w-100 h-100 flex items-center justify-start pl1"><img src=${url} class="w2 h2 bg-black"/></div>`
    : html`<div class="w-100 h-100 flex items-center justify-start pl1"><img class="w2 h2 bg-black"/></div>`
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