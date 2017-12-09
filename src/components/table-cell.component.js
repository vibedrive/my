var html = require('choo/html')
var Nanocomponent = require('nanocomponent')
var assert = require('assert')
var player = require('../lib/audio-player')
var { timeString } = require('../lib/audio-player/utils')

const { CELL_WIDTH_IN_REM } = require('../constants')

var elements = {
  text: textElement,
  cover: coverElement,
  time: timeElement
}

function TableCell (col, row) {
  if (!(this instanceof TableCell)) return new TableCell(col, row)
  Nanocomponent.call(this)
  this._col = col
  this._row = row
  this.data = fromRecursiveKey(this._row, this._col.key)
}

TableCell.prototype = Object.create(Nanocomponent.prototype)

TableCell.prototype.createElement = function (state, emit) {
  this.cellElement = elements[this._col.type]
  this.el = html`
    <div class="flex f6 items-center ph2" style="width: ${this._col.width || CELL_WIDTH_IN_REM}rem">
      ${this.cellElement(this.data, emit)}
    </div>`

  return this.el 
}

TableCell.prototype.update = function (state, emit) {
  return false
}

module.exports = TableCell

function textElement (value) {
  return html`
    <div>${value}</div>`
}

function timeElement (value) {
  return html`
    <div>${timeString(value)}</div>`
}

function coverElement (state, emit) {
  var url = state ? state.coverImageURL : null
  var urlProp = url ? `src="${url}"` : ''

  return html`
    <div class="cover w-100 h-100 flex items-center justify-start pl1">
      <a class="absolute play-button" onclick=${e => play.call(this, e)}>
        <svg class="ic-white" style="width:1rem; height: 1rem;">
          <use xlink:href="icons/openiconic.svg#si-open-play-circle" />
        </svg>
      </a>
      <img ${urlProp} class="w2 h2 bg-black"/>
    </div>`

  function play (e) {
    e.preventDefault()
    console.log('play!')
    player.load(this._row)
    emit('render')
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
