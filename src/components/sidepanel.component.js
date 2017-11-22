const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

function Sidepanel () {
  if (!(this instanceof Sidepanel)) return new Sidepanel()
  Nanocomponent.call(this)
}

Sidepanel.prototype = Object.create(Nanocomponent.prototype)

Sidepanel.prototype.createElement = function (state) {
  this.el = html`
    <div id="sidepanel" class="absolute top-0 right-0 h-100 w5 bg-red z-5">
      <div>
        <div></div>
        <div>
          <button>x</button>
        </div>
      </div>
    </div>` 

  return this.el
}

Sidepanel.prototype.update = function (state) {
  return false
}

module.exports = Sidepanel()
