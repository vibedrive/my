var path = require('path')
var os = require('os')
var Folder = require('managed-folder')
var mv = require('mv')
var subfolders = getSubfolders()
const FOLDER_PATH = path.join(os.homedir(), 'VibedriveTEST')
const SUPPORTED_FORMATS = ['.mp3']

var folder = Folder({ appdir: FOLDER_PATH, subfolders })

folder.on('ready', function () {
  folder.on('inbox:add', handleIncoming)
  folder.on('processing:add', importTrack)
})

function handleIncoming (filepath) {
  var basename = path.basename(filepath)
  var extname = path.extname()

  if (SUPPORTED_FORMATS.includes(extname)) {
    switch (extname) {
      case '.mp3':
        var newpath = path.join(FOLDER_PATH, subfolders.processing, basename)
        mv(filepath, newpath, function (err) {
          console.log(err, 'done')
        })
        break
      default:
        break
    }
  } else {
    var newpath = path.join(FOLDER_PATH, subfolders.unsupported, basename)
    mv(filepath, newpath, function (err) {
      console.log(err, 'done')
    })
  }
}

function importTrack (filepath) {

}

function getSubfolders () {
  return {
    inbox: 'Inbox',
    unsupported: 'Unsupported',
    archives: 'Archives',
    duplicates: 'Duplicates',
    processing: 'Processing',
    processed: 'Processed'
  }
}
