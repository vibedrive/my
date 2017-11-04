const html = require('choo/html')
const tabsbar = require('./elements/tabsbar.el')

module.exports = function (view) {
  return function (state, emit) {
    return html`
      <div>
        ${tabsbar(state, emit)}
        ${view(state, emit)}
      </div>
    `
  }
}