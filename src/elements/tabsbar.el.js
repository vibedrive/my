const html = require('choo/html')

const tabs = [
  { name: 'Tracks' },
  { name: 'Artists' },
  { name: 'Labels' },
  { name: 'Audio Stream' },
  { name: 'Tag' },
  { name: 'Cover Art' }
]

module.exports = function tabsbar (state, emit) {
  return html`
    <nav id="tabsbar">
      <div>
        ${tabs.map(tab => html`<a href="#"><span>${tab.name}</span></a>`)}
      </div>
      <div id="history-dropdown">
        <img src="#" />
      </div>
    </nav>
  `
}
