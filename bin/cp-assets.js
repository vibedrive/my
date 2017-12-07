var fs = require('fs')
var path = require('path')
var cp = require('node-cp')

module.exports = copyAssets

async function copyAssets (done) {
  var src = path.join(__dirname, '../assets')
  var dest = path.join(__dirname, '../dist')

  fs.writeFileSync(path.join(__dirname, '../dist/index.html'), fs.readFileSync(path.join(__dirname, '../src/index.html')))

  cp(src, dest, done)
}
