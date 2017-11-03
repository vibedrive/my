const PouchDB = require('pouchdb')
const DB_PREFIX = 'vibedrive::'

function Database () {
  this.pouch = null
  this.init = this.init.bind(this)
  this.empty = this.empty.bind(this)
}

Database.prototype.init = function (email) {
  this.pouch = new PouchDB(DB_PREFIX + email)
}

Database.prototype.empty = function () {
  this.pouch.allDocs({include_docs: true})
    .then(res => {
      res.rows.forEach(r => this.pouch.remove(r.doc))
      return this.pouch.info()
  }).then(info => {
    console.log(info)
  })
}

var database = new Database()

window.emptyDB = database.empty.bind(database)
module.exports = database

