const PouchDB = require('pouchdb')
const DB_PREFIX = 'vibedrive::'
const REMOTE_URL = (process.env.API_URL || 'localhost:5823') + '/userdb'  

var pouch, remote

module.exports = function (state, emitter) {
  state.tracks = []
  state.selectedTrack = null

  emitter.on('DOMContentLoaded', function () {
    emitter.on('track:select-track', selectTrack)
    emitter.on('track:init-store', initStore)
    emitter.on('track:create', createTrack)
  })

  function selectTrack (track) {
    state.selectedTrack = track
    emitter.emit('render')
  }

  async function createTrack (file) {
    var track = await createTrackDocument(file) 
    state.tracks.push(track)
    emitter.emit('render')
  } 

  async function initStore (payload) {
    var { email, accessToken } = payload
    var localDBName = DB_PREFIX + email
    var remoteOpts = {
      ajax: { 
        timeout: 30 * 1000,
        cache: false,
        withCredentials: false,
        skip_setup: true,
        headers: { 'Authorization': accessToken } 
      } 
    }

    pouch = new PouchDB(localDBName)
    remote = new PouchDB(`https://${REMOTE_URL}/userdb-${hexEncode(email)}`, remoteOpts)
    pouch.sync(remote, { live: true, retry: true })
      .on('change', onChange)
      .on('paused', onPause)
      .on('active', onActive)
      .on('denied', onDenied)
      .on('complete', onComplete)
      .on('error', onError)

    state.tracks = await getTracks()
    state.selectedTrack = state.tracks[0]
    emitter.emit('render')
  }

  function onChange (info) {
    if (info.direction === 'pull') {
      console.log(info.change.docs)
    }
  }

  function onPause (err) {
    // replication paused (e.g. replication up to date, user went offline)
  }

  function onActive () {
    // replicate resumed (e.g. new changes replicating, user went back online)
  }

  function onDenied (err) {
    // a document failed to replicate (e.g. due to permissions)
  }

  function onComplete (info) {
    // handle complete
    console.log(info)
  }

  function onError (err) {
    // handle error
  }
}
  
async function getTracks (ids) {
  var docs = await pouch.allDocs({ include_docs: true })

  return docs.rows
    .map(r => {
      if (r.doc.metadata.picture) {
        r.doc.imageURL = createImageURL(r.doc.metadata.picture[0])
      }
      return r.doc
    })
    .filter(doc => doc.type === 'track' && (!ids || ids.includes(doc._id)))
}

async function createTrackDocument (file) {
  var empty = { value: null }
  var { metadata } = file
  var doc = {
    _id: file.hash,
    type: 'track',
    metadata: {
      picture: metadata.picture,
      title: metadata.title,
      label: metadata.label,
      BPM: metadata.bpm,
      key: metadata.key,
      tags: [],
      album: metadata.album,
      track: metadata.track,
      comment: metadata.comment,
      year: metadata.year,
      disk: metadata.disk,
      publisher: metadata.publisher,
      label: metadata.label,
      producer: metadata.producer,
      artist: metadata.artist,
      genre: metadata.genre,
      energy: metadata.energy,
    },
    audio: {
      name: file.fileName,
      hash: file.hash,
      size: file.size,

      length: file.duration, 

      codec: null, 
      bitrate: null,
      frequency: null
    }
  }

  var { id } = await pouch.put(doc, { includeDocs: true })

  return pouch.get(id)
}

function hexEncode (str) {
  var result = ''

  for (var i = 0; i < str.length; i++) {
    var hex = str.charCodeAt(i).toString(16)
    result += hex
  }

  return result
}

function createImageURL (picture) {
  if (!picture) return ''

  const buf = Buffer.from(picture.data)
  const type = picture.format
  const blob = new Blob([buf], { type })

  return URL.createObjectURL(blob)
}
