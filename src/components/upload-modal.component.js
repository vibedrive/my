var html = require('choo/html')
var Component = require('nanocomponent')
var Uploader = require('../lib/uploader')
var AudioFile = require('../lib/audio-file')

class UploadModal extends Component {
  constructor () {
    super()
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.visibility = 'hidden'
  }

  createElement (state, emit) {
    this.emit = emit
    this.items = state.files.uploading

    var doneLabel = this.items.every(item => item.progress === 100) ? 'Done' : 'Hide'

    this.el = html`
      <div 
        id="upload-modal-container" 
        class="flex z-999 fixed w-100 h-100 justify-center items-center ${this.visibility}">

        <div class="w-100 h-100 fixed bg-black-80" onclick=${this.close}></div>

        <div id="upload-modal" class="fixed bg-black d-b br1">
          <div class="pv4 ph4 f3 fw5">Upload to Vibedrive</div>

          <div>
            <div class="mh4 mv4 bw1 b--white ba">
              <div class="flex flex-column overflow-y-auto" style="width: 512px; min-height: 206px; max-height: 206px;">
                ${fileUploadEl({ progress: 25, file: { name: 'music.mp3', size: 1234567 } })}
                ${Uploader.uploads.map(fileUpload => fileUploadEl(fileUpload))}
              </div>
            </div>

            <div class="ph4 pv3 pt3 flex justify-between">
              <input id="file-input" 
                class="hidden" 
                type="file" 
                multiple 
                onchange=${this.handleChange}/>
              <label for="file-input" class="ph4 pv2 bg-white black ba dim pointer">
                <span class="">Add more files</span>
              </label>
              <a class="ph4 pv2 ba b--white bg-none white black-70 dim pointer"
                onclick=${this.close}>
                ${doneLabel}
              </a>
            </div>
          </div>
        </div>
      </div>`

    return this.el
  }

  async handleChange (e) {
    var { files } = e.target

    for (var i = 0; i < files.length; i++) {
      var file = files[i]

      loadAudioFile(file, async (err, audioFile) => {
        if (err) {
          this.emit('notification:error', err)
          return console.error(err)
        }

        var fileUpload = Uploader.upload(audioFile)

        this.rerender()

        var uploaded = await fileUpload.result

        this.emit('track:create', uploaded)
      })
    }
  }

  update (state, emit) {
    this.emit = emit

    return state.files.uploading !== this.items
  }

  async open () {
    this.visibility = ''
    this.rerender()
  }

  async close () {
    this.visibility = 'hidden'
    this.rerender()
  }
}

function loadAudioFile (file, callback) {
  var audioFile = new AudioFile(file)

  audioFile.on('loaded', function () { callback(null, audioFile) })
  audioFile.on('error', callback)
  audioFile.load()
}

function fileUploadEl (fileUpload) {
  var done = fileUpload.progress === 100
  return html`
    <div class="bw1 bb b--gray pa3">
      <div class="flex h-100">

        <div class="justify-center items-center">
          ${mp3Icon(done)}
        </div>

        <div class="${done ? 'gray' : ''} h-100 ph3 flex flex-auto flex-column justify-center">
          <div class="flex justify-between">
            <span class="td f6">${fileUpload.file.name}</span>
            <div class="f6">${(fileUpload.file.size / 1000000).toFixed(1)} MB</div>
          </div>
          <div class="flex justify-start w-100 h1 mv1">
            <div class="meter"></div>
          </div>
        </div>

        <div class="${done ? 'gray' : ''} justify-end items-center flex tr">
          <button
            onclick=${cancel}
            class="bg-white black w1 h1 f7 flex align-center justify-center dim pointer fw6">
            ×
          </button>
        </div>

      </div>

    </div>
  `
  function cancel (e) {
    e.preventDefault()
    // TODO
  }
}

function mp3Icon (done) {
  return html`
    <div class="w2 h2 bw1 b--gray bt bl br bb flex justify-center items-center ${!done ? 'uploading' : ''} ">
      <div class="white f7 ${done ? 'gray' : ''}">MP3</div>
    </div>`
}

module.exports = new UploadModal()
