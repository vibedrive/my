var html = require('choo/html')
var Component = require('nanocomponent')
var AudioPlayer = require('../lib/player')
var AudioContext = window.AudioContext || window.webkitAudioContext

class PlayerComponent extends Component {
  constructor () {
    super()
    this.audioEl = html`<audio src="audio/hal.mp3" style="display: none;"></audio>`
    this.player = new AudioPlayer(this.audioEl)
    this.player.on('play', () => this.rerender(this.playing = true))
    this.player.on('pause', () => this.rerender(this.playing = false))
    this.loadTrack = track => {
      if (track) {
        this.track = track 
        this.player.load()
        this.rerender()  
      }
    }
  }

  createElement (state, emit) {
    console.log(this.track)
    if (!this.track) return html`<nav></nav>`
    var { metadata } = this.track
    return html`
      <nav class="z-1 flex items-center w-100 h3 justify-between fixed bottom-0 bg-black ph3">

        <div class="flex items-center w-30 ">

          <div class="flex flex-row">
            <div class="us-none">
              <img class="w2 h2 mh2 mv0" />
            </div>

            <div class="flex flex-column  flex-auto">
              <div class="f7">${metadata.title}</div>
              <div class="f7">${metadata.artist.join(', ')}</div>
            </div>
          </div>

        </div>

        <div class="flex-auto flex items-center h-100 us-none">
          
            <button class=" flex items-center w2 h2 mh3 bg-none scale"
              onclick=${e => this.player.prev() }>
              <svg class="ic-white w1 h1">
                <use xlink:href="icons/openiconic.svg#si-open-media-step-backward" />
              </svg>
            </button>
            <button class="flex items-center w2 h2 mh3 bg-none scale"
              onclick=${e => this.playing ? this.player.pause() : this.player.play() }>
              <svg class="ic-white w1 h1">
                <use xlink:href="icons/openiconic.svg#si-open-media-${this.playing ? 'pause' : 'play'}"/>
              </svg>
            </button>
            <button class=" flex items-center w2 h2 mh3 bg-none scale"
              onclick=${e => this.player.next() }>
              <svg class="ic-white w1 h1">
                <use xlink:href="icons/openiconic.svg#si-open-media-step-forward" />
              </svg>
            </button>
       
        </div>

        <div class="flex items-center w-50 h-100 us-none">
          <div class="f7 mh3">0:21</div>
          <div class="flex-auto flex items-center mh3 relative  h-25">
            <div class="absolute left-0 bg-light-grey w-100" style="height: 2px"></div>
            <div class="absolute left-0 bg-blue w-30" style="height: 2px"></div>
          </div>
          <div class="f7 mh3">3:21</div>  
        </div>

      </nav>`

  }

  update (state, emit) {
    return false
  }
}

module.exports = new PlayerComponent()

      