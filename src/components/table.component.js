var html = require('choo/html')
var Nanocomponent = require('nanocomponent')
var sleep = require('../lib/sleep')
var TableRow = require('./table-row.component')

const { CELL_WIDTH_IN_REM } = require('../constants')


function Table (cols) {
  if (!(this instanceof Table)) return new Table(cols)
  Nanocomponent.call(this)
  this.cols = cols
}

Table.prototype = Object.create(Nanocomponent.prototype)

Table.prototype.createElement = function (state, emit) {
  const { tracks, selectedTrack } = state
  
  this.rows = tracks.map(track => TableRow(this.cols))
  this.selectedTrack = selectedTrack
  this.emit = emit

  this.el = html`
    <div id="table-container" class="flex flex-column mv3">

      <div class="flex us-none h3 w-100 items-end pv3">
        <div class="th pl3 pr4 " style="width: 2rem;"></div>
        ${this.cols.map(col => columnElement.call(this, col))}
      </div>

      <div class=" flex flex-auto flex-column">      
        ${this.rows.map((row, i) => row.render(tracks[i]))}
      </div>
    </div>`

  return this.el
}

Table.prototype.update = function (state, emit) {
  this.emit = emit 
  return (state.tracks !== this.tracks) || (state.selectedTrack !== this.selectedTrack)
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
