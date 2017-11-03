const db = require('./db')

module.exports = {
  get: getTracks,
  create: createTrack,
}

async function getTracks (ids) {
  var docs = await db.pouch.allDocs({ include_docs: true })
    .then(docs => 
      docs.rows
        .map(r => r.doc)
        .filter(doc => doc.type === 'track' && (!ids || ids.includes(doc._id)))
    )

  return docs
}

async function createTrack (file) {
  var empty = { value: null }

  var { metadata } = file

  const doc = {
    _id: file.hash,
    type: 'track',

    metadata: {

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

  var { id } = await db.pouch.put(doc, { includeDocs: true })

  return db.pouch.get(id)
}

