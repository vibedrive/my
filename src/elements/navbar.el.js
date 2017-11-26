const html = require('choo/html')
const accountDropdown = require('./account-dropdown.el')
var sleep = require('../lib/sleep')

module.exports = function navbar (state, emit) {
  return html`
    <nav id="navbar" class="fixed z-3 top-0 left-0 flex ph3 w-100 justify-between content-between bg-black">

      <div class="flex1 flex justify-start items-center">

        <a href="/tracks">
          <img src="images/logo.svg" class="ma2"/>
        </a>

      </div>

      <div class="flex1 flex justify-end items-center pr3 pv2 f6">

        <a class="mh2 pointer" onclick=${openUploadModal}>
          <svg class="ic-white w1 h1 mr2" title="Upload">
            <use xlink:href="icons/openiconic.svg#si-open-cloud-upload" />
          </svg>
        </a>

        <a class="mh2 pointer" onclick=${e => emit('ui:toggle-account-dropdown')}>
          <svg class="ic-white w1 h1"  title="${state.user.email}">
            <use xlink:href="icons/openiconic.svg#si-open-person" />
          </svg>
        </a>

      </div>

      ${accountDropdown(state, emit)}
      
    </nav>`

  async function openUploadModal (e) {
    var el = document.querySelector('#upload-modal-container')


    el.classList.add('will-open')

    console.log(el)
    await sleep(200)

    emit('ui:toggle-upload-modal')
  }
}
