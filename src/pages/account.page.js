const html = require('choo/html')

module.exports = function accountPage (state, emit) {
  var used = state.user.usage.used
  var total = 30 * 1000 * 1000 * 1000
  var percent = (used/total * 100)

  return html`
    <div class="flex flex-row  flex-auto justify-center">
      <div class="flex flex-column" style="min-width: 380px; width: 80vw;">
        <div class="flex justify-center items-between">
          <h2 class="ma0">Account</h2>
        </div>

        <div class="flex-auto">
          <div class="w-40 flex flex-column flex justify-center">
            <p class="fw6">Total Storage</p>

            <div class="w-100 flex justify-center">
              <div class="flex flex-column">
                
                <div class="mv4">
                  <div class="bg-none" style="width: 256px; height: 256px">
                    ${waffleChart(percent)}
                    <br>
                    <p class="tc ma0">${state.tracks.length} tracks</p>
                  </div>
                
                </div>
                
                <div class="flex flex-row">
                  <div class="flex-auto tc">
                    <p class="f3 fw6 ma0">${bytesToGB(used).toFixed(2)} GB</p>
                    <p class="ma0">${percent.toFixed(2)}% used</p>
                  </div>
                  <div class="mh3 bw1 b--white br"></div>
                  <div class="flex-auto tc">
                    <p class="f3 fw6 ma0">${bytesToGB(total).toFixed(0)} GB</p>
                    <p class="ma0">total storage</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>`
}

function waffleChart (percent) {
  console.log(percent)

  var rows = Array(10).fill(0)
  var cols = Array(10).fill(0)
  var filled = 'bg-white'
  var empty = 'bw1 b--white bt br bb bl'
  var half = empty + ' half-waffle-square'

  return html`
    <div class="flex  items-center flex-column">
      ${rows.map((r, ri) => html`
        <div class="flex">
          ${cols.map((c, ci) => {
            var n = ((ri*10)+(ci)) + 1
            var classes = n < percent 
              ? filled 
              : percent % 1 > 0.5 
                ? half 
                : empty 

            return html`
              <div class="flex w1 h1 mr1 mb1 ${classes}"></div>
            `})
          }
        </div>
      `)}
    </div>
  `
}

5.5

function bytesToGB (b) {
  return b / (1 * 1000 * 1000 * 1000)
}