var path = require('path')
var copyAssets = require('./cp-assets')
var buildCSS = require('./build-css')
var buildJS = require('./build-js')
var parallel = require('run-parallel')

var { version } = require('../package.json')

parallel([
  done => copyAssets(done),
  done => buildCSS(done),
  done => buildJS(done)
], onDone)

function onDone (err) {
  if (err) {
    console.log('\u0007')
    console.error(err)
  }
  console.log(`Successfully built version ${version}.`)
}
