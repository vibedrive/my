const html = require('choo/html')

module.exports = function toolbar (state, emit) {
  return html`
    <nav class="z-1 flex items-center w-100 h3 justify-between fixed bottom-0 bg-black ph3">

      <div class="flex items-center w-30 ">

        <div class="flex flex-row">
          <div class="us-none">
            <img class="w2 h2 mh2 mv0" />
          </div>

          <div class="flex flex-column  flex-auto">
            <div class="f7">Sugoi!</div>
            <div class="f7">64 & Bimyo</div>
          </div>
        </div>

      </div>

      <div class="flex-auto flex items-center h-100 us-none">
        
          <a class=" flex items-center w2 h2 mh3 bg-none pointer">
            <svg class="ic-white w1 h1">
              <use xlink:href="icons/openiconic.svg#si-open-media-step-backward" />
            </svg>
          </a>
          <a class=" flex items-center w2 h2 mh3 bg-none pointer">
            <svg class="ic-white w1 h1">
              <use xlink:href="icons/openiconic.svg#si-open-media-play" />
            </svg>
          </a>
          <a class=" flex items-center w2 h2 mh3 bg-none pointer">
            <svg class="ic-white w1 h1">
              <use xlink:href="icons/openiconic.svg#si-open-media-step-forward" />
            </svg>
          </a>
     
      </div>

      <div class="flex items-center w-50 h-100 us-none">
        <div class="f7 mh3">0:21</div>
        <div class="flex-auto flex items-center mh3 relative pointer h-25">
          <div class="absolute left-0 bg-light-grey w-100" style="height: 2px"></div>
          <div class="absolute left-0 bg-blue w-30" style="height: 2px"></div>
        </div>
        <div class="f7 mh3">3:21</div>  
      </div>

    </nav>
  `
}

      