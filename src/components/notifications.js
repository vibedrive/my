var html = require('choo/html')
var Nanocomponent = require('nanocomponent')
var sleep = require('hypno')

function Notifications () {
  if (!(this instanceof Notifications)) return new Notifications()
  Nanocomponent.call(this)
  this.error = this.error.bind(this)
}

Notifications.prototype = Object.create(Nanocomponent.prototype)

Notifications.prototype.createElement = function (state, emit) {
  this.el = html`
    <div id="notification-area">

    </div>
  ` 

  return this.el
}

Notifications.prototype.update = function (state, emit) {
  return false
}

Notifications.prototype.error = async function (props) {
  var _this = this
  
  if (typeof props === 'string') {
    var msg = props
    var el = getErrorEl(msg)
    el.addEventListener('click', onClick)
    this.el.appendChild(el)
    await sleep(3000)

    if (el) destroy()

    function onClick () {
      destroy()
    }

    async function destroy () {
      el.removeEventListener('click', onClick)
      el.classList.add('outfadeup')
      await sleep(1000)
      _this.el.removeChild(el)
      el = null
    }
  }
}

module.exports = Notifications()

function getErrorEl (msg) {
  return html`
    <div class="infadedown">
      <div class="bg-red pa3 ma4 w6 shadow-2 dim pointer pe-auto">
        ${msg}
      </div>
    </div>
  `
}