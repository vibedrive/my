var html = require('choo/html')
var Component = require('Nanocomponent')
var caret = require('../elements/caret.el')
var nanobus = require('nanobus')

function Dropdown () {
  if (!(this instanceof Dropdown)) return new Dropdown()
  Component.call(this)
  this.bus = nanobus()
  this.on = this.bus.on.bind(this.bus)
  this.visible = false
  this.selected = null
  this.dropdownEl = null

  this.open = this.open.bind(this)
  this.close = this.close.bind(this)
  this._handleClick = this._handleClick.bind(this)
}

Dropdown.prototype = Object.create(Component.prototype)

Dropdown.prototype.createElement = function dropdownElement (state, emit) {
  this.emit = emit

  var { options, selected } = state

  this.options = options
  this.selected = this.selected || selected

  if (!this.dropdownEl) {
    this.dropdownEl = dropdown.call(this, this.options)
  }

  return html`
    <div
      onclick=${e => this.visible ? this.close(e) : this.open(e.currentTarget)}
      class="us-none hover-b--black h2 fw6 bg-black white pv1 ph3 f7 br2 mh2 flex flex-row justify-start items-center">
      <span>${this.selected.label}</span> 
      ${caret()}
      ${this.dropdownEl}
    </div>`
}

function dropdown (options) {
  return html`
    <div
      id="dropdown"
      class="dropdown mt4 z-2 fixed top-0 left-0 pa1 black flex items-start flex-column">
      <div class="flex flex-column w-100">
        ${options.map(option => html`
          <div class="dropdown-item" onclick=${e => this.selectItem(option)}>
            ${option.label}
          </div>
        `)}
      </div>
    </div>
  `
}

Dropdown.prototype.selectItem = function (option) {
  this.selected = option
  this.rerender()
}

Dropdown.prototype.open = function (selectEl) {
  var rect = selectEl.getBoundingClientRect()

  this.width = selectEl.offsetWidth
  this.left = rect.left
  this.top = rect.top
  this.visible = true
  this.dropdownEl.style = `left: ${this.left}px; top: ${this.top}px; width: ${this.width}px;`

  if (this.dropdownEl.classList.contains('hidden')) {
    this.dropdownEl.classList.remove('hidden')
  }

  document.body.addEventListener('mousedown', this._handleClick)

  this.rerender()
}

Dropdown.prototype.close = function (e) {
  e.preventDefault()

  this.visible = false

  if (!this.dropdownEl.classList.contains('hidden')) {
    this.dropdownEl.classList.add('hidden')
  }

  document.body.removeEventListener('mousedown', this._handleClick)
  this.rerender()
}

Dropdown.prototype._handleClick = function (e) {
  if (!this.dropdownEl.contains(e.target)) {
    this.close(e)
    document.body.removeEventListener('click', this.handleClick)
  }
}

Dropdown.prototype.update = function () {
  return false
}

module.exports = Dropdown
