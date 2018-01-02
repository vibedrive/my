var html = require('choo/html')
var player = require('../lib/audio-player')

module.exports = function playerElement (state, emit) {
  if (!player.track) return html`<div></div>`

  var { metadata } = player.track

  return html`
    <nav id="player" class="z-1 flex items-center w-100 h3 justify-between fixed bottom-0 bg-near-black ph3">

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
            onclick=${e => player.prev()}>
            <svg class="ic-white w1 h1">
              <use xlink:href="icons/openiconic.svg#si-open-media-step-backward" />
            </svg>
          </button>
          <button class="flex items-center w2 h2 mh3 bg-none scale"
            onclick=${e => player.playing ? player.pause() : player.play()}>
            <svg class="ic-white w1 h1">
              <use xlink:href="icons/openiconic.svg#si-open-media-${player.playing ? 'pause' : 'play'}"/>
            </svg>
          </button>
          <button class=" flex items-center w2 h2 mh3 bg-none scale"
            onclick=${e => player.next()}>
            <svg class="ic-white w1 h1">
              <use xlink:href="icons/openiconic.svg#si-open-media-step-forward" />
            </svg>
          </button>
     
      </div>

      <div class="flex items-center w-50 h-100 us-none">
        <div class="f7 mh3">${player.currentTime}</div>
        <div class="flex-auto flex items-center mh3 relative  h-25">
          <div class="absolute left-0 bg-light-grey w-100" style="height: 2px"></div>
          <div class="absolute left-0 bg-blue" style="height: 2px; width: ${player.progress}%"></div>
        </div>
        <div class="f7 mh3">${player.duration}</div>  
      </div>

    </nav>`
}
