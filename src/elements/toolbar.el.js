const html = require('choo/html')

module.exports = function toolbar (state, emit) {
  return html`
    <nav id="toolbar">
      <div id="view-dropdown"></div>
      <div id="tools">
        <div id="filter-dropdown"></div>
        <div id="group-by-dropdown"></div>
        <div id="sort-dropdown"></div>
      </div>
      <div id="export-dropdown"></div>
    </nav>
  `
}

      