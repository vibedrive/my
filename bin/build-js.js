var fs = require('fs')
var path = require('path')
var browserify = require('browserify')
var babelify = require('babelify')
var yoyoify = require('yo-yoify')
var uglifyify = require('uglifyify')

const { version } = require('../package.json')

const FROM = path.join(__dirname, '../src/index.js')
const TO = path.join(__dirname, `../dist/bundle.js`)

module.exports = function (done) {
  var babelifyOpts = {
    presets: ['env'],
    plugins: ['transform-async-to-generator'],
    extensions: ['.js']
  }

  var b = browserify(FROM)
    .transform(babelify, babelifyOpts)
    .transform('loose-envify')
    .transform(yoyoify)
    // .transform(uglifyify)

  b.bundle()
    .on('error', done)
    .on('end', done)
    .pipe(fs.createWriteStream(TO))
}
