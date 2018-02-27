var html = require('choo/html')
var Tree = require('../components/tree.component')

var defaultPlaylistTree = Tree()
var userPlaylistTree = Tree()

var defaultPlaylists = {
  playlists: [
    { name: 'All Tracks' }
  ],
  subgroups: []
}

var userPlaylists = {
  subgroups: [],
  playlists: [{ name: 'My First Radio Show' }]
}

module.exports = function leftPanel (state, emit) {
  var c = state.ui.leftPanel ? '' : 'hidden'

  return html`
    <div id="left-panel" class="${c} mv5 fixed top-0 left-0 h-100 bg-black z-2 pv3">

      <div class="flex justify-between h2 items-center">

      </div>

      <div class="flex flex-column mv4">

        <button 
          onclick=${createPlaylist} 
          tabindex="0" 
          class="hover-b--blue flex flex-row ph1 pv2 w-100 bg-none">
          <div class="w-100 tl mh1 blue">New Playlist</div>
          <span class="blue mh2">+</span>
        </button>

        ${defaultPlaylistTree.render(defaultPlaylists, emit)}
        ${userPlaylistTree.render(userPlaylists, emit)}
        <div class="block" style="height: 500px;">

      </div>

    </div>`

  function createPlaylist () {
    var playlist = {
      name: 'Untitled'
    }

    userPlaylistTree.addLeaf(playlist)
  }
}
