process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
global.localStorage = { getItem: () => {}, setItem: () => {} }

var crypto = require('crypto')
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var test = require('tape')
var vibedrive = require('../src/api')
const { TEST_PASSWORD } = require('../.env')
const filepath = path.join(__dirname, '../assets/audio/hal.mp3')

main()

async function main () {
  await setup()

  test('upload small file', async function (t) {
    var data = fs.readFileSync(filepath)
    var file = {
      name: 'small-file.mp3',
      data: data,
      size: data.length,
      hash: 'TEST-' + crypto.randomBytes(16).toString('hex')
    }

    try {
      await vibedrive.upload.upload(file)
      t.pass('finished uploading')
      t.end()
    } catch (err) {
      t.fail()
    }
  })

  test('upload large file', async function (t) {
    var data = multiplyBuffer(fs.readFileSync(filepath), 300) // >5 MB
    var file = {
      name: 'large-file.mp3',
      data: data, 
      size: data.length,
      hash: 'TEST-' + crypto.randomBytes(16).toString('hex')
    }

    try {
      await vibedrive.upload.upload(file)
      t.pass('finished uploading')
      t.end()
    } catch (err) {
      t.fail()
    }
  })
}

async function setup () {
  var res = await vibedrive.auth.login('hello@jonathandupre.com', TEST_PASSWORD)
  assert.ok(vibedrive.loggedIn())
}

function multiplyBuffer (buf1, n) {
  var parts = []
  for (let i = 0; i < 320; i++) {
    var buf2 = new Buffer(buf1.length)
    buf1.copy(buf2)
    parts.push(buf2)
  }
  return Buffer.concat(parts)
}
