var html = require('choo/html')
var Nanocomponent = require('nanocomponent')
var TableCell = require('./table-cell.component')

function TableRow (cols) {
  if (!(this instanceof TableRow)) return new TableRow(cols)
  Nanocomponent.call(this)
  this._cols = cols
}

TableRow.prototype = Object.create(Nanocomponent.prototype)

TableRow.prototype.createElement = function (row, emit) {
  var selected = this.selectedTrack && this.selectedTrack._id === row._id
  var classes = selected ? 'selected' : ''

  this.cells = this._cols.map(col => TableCell(col, row))

  return html`
    <div class="${classes} flex table-row" onclick=${e => handleClick.call(this, e)}>
      <div class="flex td tc f7 pl3 pr4 pv1 tc items-center h3" style="width: 2rem;" >
        
      </div>
      ${this.cells.map(cell => cell.render(cell.data, emit))}
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

TableRow.prototype.update = function (state, emit) {
  return false
}


module.exports = TableRow
