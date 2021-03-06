var html = require('choo/html')
var tabsbar = require('./elements/tabsbar.el')

module.exports = function (view) {
  return function (state, emit) {
    return html`
      <div class="flex flex-column flex-auto">
        ${tabsbar(state, emit)}
        ${view(state, emit)}
      </div>
    `
  }
}