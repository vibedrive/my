var html = require('choo/html')

module.exports = function toolbar (state, emit) {
  return html`
    <nav id="toolbar" class="h3 flex justify-between ph4 bg-near-black items-center">
      <div class="flex flex-row items-center">
        <span class="fw6 f6 mr2">Playlist:</span>
        <input 
          type="text"
          placeholder="Playlist name"
          class="fw6 bg-black white pv2 ph3 f6 br2 mh2"
          value="My First Radio Show" />
        <button class="relative ph3 pv1 bg-none ba bw1 b--white white fw6 f6 flex flex-row  mh2">
          3 Filters
          ${caret()}
          <div class="shadow1 bw1 ba b--black mt4 z-2 absolute top-0 left-0 pa1 bg-near-black flex items-start flex-column" style="width: 25rem">
            <div class="mb2 flex flex-column">
              <div class="flex flex-row mv2">
                <button class="scale bg-none white fw6">×</button>
                <div class="flex flex-row">
                  <div class="h2 fw6 bg-black white pv1 ph3 f7 br2 mh2 flex flex-row justify-start items-center dim">Genre${caret()}</div>
                  <div class="h2 fw6 bg-black white pv1 ph3 f7 br2 mh2 flex flex-row justify-start items-center dim">contains${caret()}</div>
                  <input class="h2 fw6 bg-black white pv1 ph3 f7 br2 mh2 w-100" type="text" value="future bass">
                </div>
              </div>
            </div>
            <button class="bg-none blue fw6 mv2 pointer">+ Add Filter</button>
          </div>
        </button>
      </div>

      <div>
      </div>

      <div class="flex items-center">
        <p class="fw6 f6">1 tracks</p>
      </div>
    </nav>
  `
}

function caret () {
  return html`
    <svg class="ic-white w1 h1 ml2" style="width: 0.5rem">
      <use xlink:href="icons/openiconic.svg#si-open-caret-bottom" />
    </svg>`
}
