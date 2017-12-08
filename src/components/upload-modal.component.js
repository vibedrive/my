var html = require('choo/html')
var animation = require('nanoanimation')
var nanostate = require('nanostate')
var sleep = require('../lib/sleep')
var Component = require('nanocomponent')

const IN_OUT_TIMING = { duration: 200 }

class UploadModal extends Component {
  constructor () {
    super()

    this.open = this.open.bind(this)
    this.close = this.close.bind(this)

    this.visibility = nanostate('initial', {
      initial: { show: 'showing' },
      showing: { finishShow: 'visible' },
      visible: { hide: 'hiding'},
      hiding: { finishHide: 'hidden' },
      hidden: { show: 'showing' }
    })

    this.visibility.on('show', () => {
      // showing

      var keyFrames = [{ opacity: 0 }, { opacity: 1 }]
      var animate = animation(keyFrames, IN_OUT_TIMING)

      // start animating
      var showing = animate(this.el, () => {
        console.log('done')
        // signal the end of the animation
        this.visibility.emit('finishShow')
        // update classes
        this.rerender()
      })

    })

    this.visibility.on('hide', () => {
      // hiding

      var keyFrames = [{ opacity: 1 }, { opacity: 0 }]
      var animate = animation(keyFrames, IN_OUT_TIMING)

      // start animating
      var hiding = animate(this.el, () => { 
        console.log('done')
        // signal the end of the animation
        this.visibility.emit('finishHide')
        // update classes
        this.rerender()
      })
    })
  }

  createElement (state, emit) {
    this.emit = emit
    this.items = state.files.uploading

    var doneLabel = this.items.every(i => i.progress === 100) ? 'Done' : 'Hide'

    var c = ['hidden', 'initial'].includes(this.visibility.state) ? 'hidden' : ''

    var s = ''

    // if (this.visibility.state === 'hiding') s = 'visibility: visible; opacity: 1'
    // if (this.visibility.state === 'showing') s = 'visibility: hidden; opacity: 0'

    this.el = html`
      <div 
        id="upload-modal-container" 
        class="flex z-999 fixed w-100 h-100 justify-center items-center ${c}"
        style=${s}>

        <div class="w-100 h-100 fixed bg-black-80" onclick=${this.close}></div>

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
                onclick=${this.close}>
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

    if (state.files.uploading !== this.items) {
      return true
    }

    return  false
  }

  async open () {
    this.rerender()
    await sleep(500)
    this.visibility.emit('show')
  }

  async close () {
    this.rerender()
    await sleep(500)
    this.visibility.emit('hide')
  }

}

function uploadItem (file) {
  var done = file.progress === 100
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

