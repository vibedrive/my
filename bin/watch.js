var fs = require('fs')
var URL = require('url')
var path = require('path')
var budo = require('budo')
var mkdirp = require('mkdirp')
var cp = require('node-cp')
var compileCSS = require('./compile-css')

mkdirp(path.join(__dirname, '../dist'))

fs.writeFileSync('dist/index.html', fs.readFileSync('src/index.html'))

compileCSS(function (err) {
  if (err) {
    console.log('\u0007')
    console.log(err)
    return
  }

  var b = budo('src/index.js:bundle.js', {
    dir: ['dist', 'assets'],
    port: 1111,
    live: true,
    ssl: true,
    pushstate: true,
    stream: process.stdout,
    watchGlob: 'src/**/*.{sss,js}',
    staticOptions: {
      extensions: [ 'html' ]
    }
  })

  b.on('watch', (e, file) => {

    switch(path.extname(file)) {
      case '.sss': {
        console.log('compiling css')
        compileCSS(done)
        return
      }
      default:
        return
    }
  })

  function done (err) {
    if (err) {
      console.log('\u0007')
      console.log(err)
      return 
    }

    b.reload()
  }

  
})