const html = require('choo/html')
const filled = 'bg-white'
const empty = 'bw1 b--white bt br bb bl'
const half = empty + ' half-waffle-square'
const wrows = Array(10).fill(0)
const wcols = Array(10).fill(0)

module.exports = function accountPage (state, emit) {
  var used = state.user.usage.used
  var total = 30 * 1000 * 1000 * 1000
  var percent = (used/total * 100)

  return html`
    <div class="flex flex-row  flex-auto justify-center bg-dark-grey">
      <div class="flex flex-column" style="min-width: 380px; width: 80ex;">


        <div class="flex flex-column mb2">

          <div class="flex flex-row mv3">

            <div class="w-30 flex justify-end ph3">
              <p class="fw6">Account</p>
            </div>


            <div class="w-70 flex justify-start pt3  ph3">
              <div>
                <p class="mt0 fw7">${state.user.email}</p>

                <p>Joined on: ${new Date(state.user.joined_on).toDateString()}</p>
              </div>
            </div>

          </div>

          <div class="flex flex-row mb2">

            <div class="w-30 flex justify-end  ph3">
              <p class="fw6">Usage</p>
            </div>


            <div class="w-70 flex justify-start pt3  ph3" >
              <div class="flex flex-column">
                
                <div class="">
                  <div class="bg-none">
                    ${waffleChart(percent)}
                  </div>
                </div>
                
                <div class="flex flex-row mv3 ">
                  <div class="flex-auto">
                    <p class="f3 fw6 ma0">${bytesToGB(used).toFixed(2)} GB</p>
                    <p class="ma0">${percent.toFixed(2)}% used</p>
                  </div>
                  <div class="mh3 bw1 b--white br"></div>
                  <div class="flex-auto">
                    <p class="f3 fw6 ma0">${bytesToGB(total).toFixed(0)} GB</p>
                    <p class="ma0">total storage</p>
                  </div>
                </div>
              </div>

          </div>


        </div>

      </div>
    </div>`
}

function waffleChart (percent) {
  var rounded = Math.round(percent)

  return html`
    <div class="flex items-start flex-column-reverse">
      ${wrows.map((row, rowIndex) => html`
        <div class="flex">
          ${wcols.map((col, columnIndex) => {
            var n = ((rowIndex * 10) + (columnIndex)) + 1
            var c = rounded >= n ? filled : empty

            return html`<div class="relative flex w1 h1 mr1 mb1 ${c}"></div>`
          })}
        </div>
      `)}
    </div>`
}

function bytesToGB (b) {
  return b / (1 * 1000 * 1000 * 1000)
}