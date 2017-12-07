var PlayerComponent = require('../components/player.component')

module.exports = function playerElement (state, emit) {
  return PlayerComponent.render(state, emit)
}
