var fs = require('fs')
var postcss = require('postcss')
var precss = require('precss')
var autoprefixer = require('autoprefixer')
var sugarss = require('sugarss')
var nested = require('postcss-nested-props')
var utils = require('postcss-utilities')

var plugins = [ nested, precss, utils, autoprefixer ]

module.exports = function (done) {

  fs.readFile('src/style.sss', (err, css) => {
    postcss(plugins)
        .process(css, { parser: sugarss, from: 'src/style.sss', to: 'dist/style.css' })
        .then(result => {
            fs.writeFileSync('dist/style.css', result.css)
            if ( result.map ) fs.writeFileSync('dist/style.css.map', result.map)
            done()
            console.log('done!')
        })
        .catch(err => {
          done(err)
        })
  })

}