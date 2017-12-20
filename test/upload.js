var fs = require('fs')
var path = require('path')
var test = require('tape')

var file = fs.readFileSync(path.join(__dirname, '../assets/audio/hal.mp3'))
