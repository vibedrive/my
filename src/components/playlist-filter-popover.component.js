var html = require('choo/html')
var assert = require('assert')
var Component = require('Nanocomponent')
var Dropdown = require('./dropdown.component')
var nanoclass = require('../lib/nanoclass')

var fieldTypes = [{
  name: 'text',
  operators: [ 'is empty', 'is not empty' ]
}]

var fields = [{
  label: 'Genre',
  name: 'genre',
  type: 'text'
}, {
  label: 'Artist',
  name: 'artist',
  type: 'text'
}, {
  label: 'Title',
  name: 'title',
  type: 'text'
}, {
  label: 'BPM',
  name: 'bpm',
  type: 'number'
}]

var operators = [{
  label: 'contains',
  name: 'contains'
}, {
  label: 'does not contain',
  name: 'doesNotContain'
}, {
  label: 'is empty',
  name: 'isEmpty'
}, {
  label: 'is not empty',
  name: 'isNotEmpty'
}]

function PlaylistFiltersPopover () {
  if (!(this instanceof PlaylistFiltersPopover)) return new PlaylistFiltersPopover()
  Component.call(this)

  this.visible = false
  this.left = 0
  this.top = 0
  this.filters = [PlaylistFilterItem()]
  this.toggleVisibility = this.toggleVisibility.bind(this)
  this.addFilter = this.addFilter.bind(this)
  this.removeFilter = this.removeFilter.bind(this)
  this.close = this.close.bind(this)
}

PlaylistFiltersPopover.prototype = Object.create(Component.prototype)

PlaylistFiltersPopover.prototype.createElement = function (state, emit) {
  this.emit = emit

  var nc = nanoclass({
    'hidden': !this.visible
  })

  var style = `left: ${this.left}px; top: ${this.top}px;`

  return html`
    <div style=${style} class="${nc} shadow1 bw1 ba b--black mt4 z-2 fixed top-0 left-0 pa1 bg-near-black flex items-start flex-column" 
      style="min-width: 25rem">
      <div class="mb2 flex flex-column">
        ${this.filters.map(playlistFilterItem => playlistFilterItem.render())}
      </div>
      <button class="hover-b--blue bg-none blue f6 fw6 mv2 mh1 ph3 pv2"
        onclick=${this.addFilter}>
        + Add Filter
      </button>
    </div>`
}

PlaylistFiltersPopover.prototype.update = function () {
  return false
}

PlaylistFiltersPopover.prototype.toggleVisibility = function (e) {
  assert.ok(e && e instanceof window.Event, 'toggleVisibility expects an Event as an argument')
  this.visible = !this.visible

  if (this.visible) {
    var rect = e.currentTarget.getBoundingClientRect()

    this.left = rect.left
    this.top = rect.top
  }

  this.rerender()
}

PlaylistFiltersPopover.prototype.addFilter = function () {
  var playlistFilter = PlaylistFilterItem()

  playlistFilter.remove = () => this.removeFilter(playlistFilter)

  this.filters.push(playlistFilter)
  this.rerender()

  // REPLACE emit render with an emit that changes the current playlist, which
  // will then emit a render
  this.emit('render')
}

PlaylistFiltersPopover.prototype.removeFilter = function (filter) {
  var idx = this.filters.findIndex(f => f === filter)
  this.filters.splice(idx, 1)
  this.rerender()

  // REPLACE emit render with an emit that changes the current playlist, which
  // will then emit a render
  this.emit('render')
}

PlaylistFiltersPopover.prototype.close = function () {
  this.visible = false
  this.rerender()
}

module.exports = PlaylistFiltersPopover

function PlaylistFilterItem () {
  if (!(this instanceof PlaylistFilterItem)) return new PlaylistFilterItem()
  Component.call(this)

  this.remove = function () {}

  this.field = {
    label: 'Genre',
    name: 'genre',
    type: 'text'
  }
  this.operator = 'contains'
  this.value = ''
}

PlaylistFilterItem.prototype = Object.create(Component.prototype)

PlaylistFilterItem.prototype.createElement = function playlistFilterItemElement () {
  this.fieldEl = Dropdown()
  this.operatorEl = Dropdown()
  this.valueEl = Dropdown()

  return html`
    <div class="flex flex-row mv2">
      <button class="scale bg-none white fw6" onclick=${e => this.remove()}>
        ×
      </button>
      <div class="flex flex-row">
        ${this.fieldEl.render({ options: fields, selected: this.field })}
        ${this.operatorEl.render({ options: operators, selected: this.operator })}
        <input class="h2 fw6 bg-black white pv1 ph3 f7 br2 mh2" type="text" 
          value=${this.value}>
      </div>
    </div>`
}

PlaylistFilterItem.prototype.update = function () {
  return false
}
