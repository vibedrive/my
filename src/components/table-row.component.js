var html = require('choo/html')
var Nanocomponent = require('nanocomponent')
var TableCell = require('./table-cell.component')

function TableRow (table, index) {
  if (!(this instanceof TableRow)) return new TableRow(table, index)
  Nanocomponent.call(this)
  this.table = table
  this.index = index
}

TableRow.prototype = Object.create(Nanocomponent.prototype)

TableRow.prototype.createElement = function (row, emit) {
  if (!this.emit) this.emit = emit
  var selected = this.table.selectedRow && this.table.selectedRow._id === row._id
  var classes = selected ? 'selected' : ''

  this.cells = this.table.cols.map(col => TableCell(col, row))

  return html`
    <div class="${classes} flex table-row" 
      oncontextmenu=${e => handleRightClick.call(this, e)} 
      onclick=${e => handleClick.call(this, e)}>
      <div class="flex td tc f7 pl3 pr4 pv1 tc items-center h3" style="width: 2rem;" >
        ${this.index + 1}
      </div>
      ${this.cells.map(cell => cell.render(cell.data, emit))}
    </div>`

  function handleRightClick (e) {
    e.preventDefault()
    var ok = window.confirm('delete?')
    if (ok) return emit('track:delete', row)
  }
 
  function handleClick (e) {
    var self = this

    if (!this.table.selectedRow || this.table.selectedRow._id !== row._id) {
      this.table.selectRow(row)
    }

    e.target.addEventListener('click', onSecondClick)

    var timer = setTimeout(function () {
      e.target.removeEventListener('click', onSecondClick)
      clearTimeout(timer)
    }, 300)

    function onSecondClick () {
      self.emit('ui:open-sidepanel')  
    }
  }
}

TableRow.prototype.update = function (row, emit) {
  this.emit = emit
  return false
}


module.exports = TableRow
