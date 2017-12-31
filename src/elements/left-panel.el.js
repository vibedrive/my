var html = require('choo/html')
var PlaylistGroup = require('../components/playlist-group.component')

var playlistGroup = PlaylistGroup()
var groups = {
  name: null,
  subgroups: [{
    name: 'Radio Shows',
    subgroups: [{
      name: 'Headphone Groove',
      subgroups: [],
      playlists: [{ name: 'January 2017' }, { name: 'February 2017' }]
    }, {
      name: 'Chill',
      subgroups: []
    }]
  }, {
    name: 'Gigs',
    subgroups: []
  }, {
    name: 'Other',
    subgroups: []
  }]
}

module.exports = function leftPanel (state, emit) {
  var c = state.ui.leftPanel ? '' : 'hidden'

  return html`
    <div id="left-panel" class="${c} mv5 fixed top-0 left-0 h-100 bg-black z-2 pv3">

      <div class="flex justify-between h2 items-center">

      </div>

      <div class="flex flex-column mv4">

        ${playlistGroup.render(groups, emit)}
        <div class="block" style="height: 500px;">

      </div>

    </div>`
}
