const html = require('choo/html')
var sleep = require('../lib/sleep')
var Component = require('nanocomponent')

class UploadModal extends Component {
  constructor () {
    super()
    this.closeModal = this.closeModal.bind(this)
  }

  createElement (state, emit) {
    this.emit = emit
    this.visible = state.ui.uploadModal
    this.items = state.files.uploading
    var doneLabel = this.items.every(i => i.progress === 100) ? 'Done' : 'Hide'
    var c = !this.visible ? 'is-hidden pe-none' : ''

    this.el = html`
      <div id="upload-modal-container" class="${c} flex z-999 fixed w-100 h-100 justify-center items-center ">

        <div class="w-100 h-100 fixed bg-black-80" onclick=${this.closeModal}></div>

        <div id="upload-modal" class="fixed bg-black d-b br1">
          <div class="pv4 ph4 f3 fw5">Upload to Vibedrive</div>

          <div>
            <div class="mh4 mv4 bw1 b--white ba">
              <div class="flex flex-column overflow-y-auto" style="width: 512px; min-height: 206px; max-height: 206px;">
                ${this.items.map(item => uploadItem(item))}
              </div>
            </div>

            <div class="ph4 pv3 pt3 flex justify-between">
              <input id="file-input" 
                class="hidden" 
                type="file" 
                multiple 
                onchange=${e => emit('upload', e.target.files)}/>
              <label for="file-input" class="ph4 pv2 bg-white black ba dim pointer">
                <span class="">Add more files</span>
              </label>
              <a class="ph4 pv2 ba b--white bg-none white black-70 dim pointer"
                onclick=${this.closeModal}>
                ${doneLabel}
              </a>
            </div>
          </div>
        </div>
      </div>`

    return this.el
  }

  update (state, emit) {
    this.emit = emit
    return state.ui.uploadModal !== this.visible || state.files.uploading !== this.items
  }

  async closeModal () {
    var el = document.querySelector('#upload-modal-container')

    el.classList.add('will-close')

    await sleep(200)

    this.emit('ui:toggle-upload-modal')
  }

}

function uploadItem (file) {
  const done = file.progress === 100
  return html`
    <div class="bw1 bb b--gray pa3 dim">
      <div class="flex h-100">

        <div class="justify-center items-center">
          ${mp3Icon(done)}
        </div>

        <div class="${done ? 'gray' : ''} items-center ph3 flex flex-auto">
          <span class="td">${file.fileName}</span>
        </div>

        <div class="${done ? 'gray' : ''} justify-end items-center flex tr w3">
          <div class="f6">${(file.size / 1000000).toFixed(1)} MB</div>
        </div>

      </div>

    </div>
  `
}

function mp3Icon (done) {
  return html`
    <div class="w2 h2 bw1 b--gray bt bl br bb flex justify-center items-center ${!done ? 'uploading' : ''} ">
      <div class="white f7 ${done ? 'gray' : ''}">MP3</div>
    </div>`
}

module.exports = new UploadModal()

