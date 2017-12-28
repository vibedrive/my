var html = require('choo/html')
var Nanocomponent = require('nanocomponent')
var sleep = require('hypno')
var TableRow = require('./table-row.component')

const { CELL_WIDTH_IN_REM } = require('../constants')

function Table (cols) {
  if (!(this instanceof Table)) return new Table(cols)
  Nanocomponent.call(this)
  this.cols = cols
  this.rows = []
  this.selectedRow = null
  this.emit = null
}

Table.prototype = Object.create(Nanocomponent.prototype)

Table.prototype.createElement = function (state, emit) {
  const { tracks, selectedTrack } = state
  
  this.selectedRow = selectedTrack
  this.rows = tracks.map((track, i) => TableRow(this, i))
  this.emit = emit

  this.el = html`
    <div id="table-container" class="flex flex-column mv3">

      <div class="flex us-none h3 w-100 items-end pv3">
        <div class="th pl3 pr4 " style="width: 2rem;"></div>
        ${this.cols.map(col => columnElement.call(this, col))}
      </div>

      <div class=" flex flex-auto flex-column">      
        ${this.rows.map((row, i) => row.render(tracks[i], emit))}
      </div>
    </div>`

  return this.el
}

Table.prototype.update = function (state, emit) {
  if (!this.emit) { this.emit = emit }
  if (!this.rows || state.tracks.length !== this.rows.length) { 
    this.rows = state.tracks.map((track, i) => TableRow(this, i))
    return true
  }

  return (this.selectedRow !== state.selectedTrack)
}

Table.prototype.selectRow = function (row) {
  this.emit('track:select-track', row)
}

module.exports = Table

function columnElement (col) {
  return html`
    <div 
      class="th flex relative pure-white ph2 fw7" 
      style="width: ${col.width || CELL_WIDTH_IN_REM}rem">
      <span>${col.name}</span>
    </div>`
}
