var html = require('choo/html')

module.exports = function caret () {
  return html`
    <svg class="ic-white w1 h1 ml2" style="width: 0.5rem">
      <use xlink:href="icons/openiconic.svg#si-open-caret-bottom" />
    </svg>`
}
