const html = require('choo/html')

const tabs = [
  { name: 'Tracks' },
  { name: 'Artists' },
  { name: 'Labels' },
  { name: 'Audio Stream' },
  { name: 'Tag' },
  { name: 'Cover Art' }
]

var active = 'bg-white black'

module.exports = function tabsbar (state, emit) {
  return html`
    <nav id="tabsbar" class="h2 flex justify-center">
      <div class="flex flex-auto"></div>
      <div class="flex justify-between">
        ${tabs.map((tab, i) => html`
          <a class="flex1 w4 tc mh1" href="#">
            <div class="w-100 b--white bw1 bt bl br br1 pv2 ${i === 0 ? active : ''}">
              ${tab.name}
            </div>
          </a>
        `)}
      </div>
      <div id="history-dropdown" class="tr pr3 flex-auto">
        <img src="#" class="w2 h2" />
      </div>
    </nav>
  `
}
