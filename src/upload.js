var xhr = require('xhr')
const sha1 = require('./lib/sha1') 
const getHeaders = () => ({ 'Authorization': localStorage.getItem(TOKEN_KEY) })
const API_URL = 'https://localhost:5823'
const TOKEN_KEY = 'vibedrive::access_token'
const SIZE = 5000

module.exports = { uploadSmallFile, uploadLargeFile }

// --- smol file. ---

async function uploadSmallFile (file, onUploadProgress) {
  var response = await getUploadUrl()
  var { uploadUrl, authorizationToken } = response.data
  var opts = {
    filename: file.name,
    data: await loadFile(file),
    size: file.size
    uploadUrl,
    authorizationToken
  }
    
  await uploadFile(opts, onUploadProgress) 
}

function getUploadUrl () {
  var url = API_URL + '/upload/fileURL'
  return xhr.get({ url, headers: getHeaders() })
}

async function loadFile (file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader()

    reader.onload = function (onSmallFileLoad) { resolve(this.result) }
    reader.readAsText(file)
  })
}

function uploadFile (opts, onUploadProgress) {
  var { uploadUrl, authorizationToken, filename, data, size } = opts

  return xhr.post({
    url: uploadUrl,
    headers: {
      'Authorization': authorizationToken
      'Content-Type': 'b2/x-auto',
      'X-Bz-File-Name': filename,
      'Content-Length': size,
      'X-Bz-Content-Sha1': sha1(data)
    },
    body: data,
    json: true
  })
}

// --- LARGE FILE ---

async function uploadLargeFile (file, onUploadProgress) { 
  var fileData = await loadFile(file)
  var response = await startLargeFile({ fileName: file.name })
  var fileID = response.data.fileId
  var parts = splitFile(fileData)
  var partSha1Array = []

  for (let i = 0; i < parts.length; i++) {
    response = await getUploadPartUrl({ fileId })

    var part = {
      data: parts[i],
      partSha1: sha1(data)
      size: file.size,
      partNumber: i,
      uploadUrl: response.data.uploadUrl,
      authorizationToken: response.data.authorizationToken,
    }

    response = await uploadPart(part, onUploadProgress)
    
    partSha1Array.push(part.partSha1)
  }

  response = await finishLargeFile(fileId, partSha1Array)
}

function splitFile (fileData) {
  var parts = []
  var n = Math.ceil( fileData.length / SIZE )

  for (let i = 0; i < n; i++) {
    var a = i * SIZE
    var b = a + SIZE
    parts.push(fileData.slice(a, b))
  }

  return parts
}

function startLargeFile (fileName) {
  var url = API_URL + '/upload/large' + fileName

  return xhr.get({ url, headers: getHeaders() })
}

function getUploadPartUrl (fileId) {
  var url = API_URL + '/upload/large' + fileName

  return xhr.get({ url, headers: getHeaders() })
}
  
function uploadPart (part, onUploadProgress) {
  return xhr.post({ 
    url: part.uploadUrl,
    headers: {
      'Authorization': part.authorizationToken,
      'X-Bz-Part-Number': part.partNumber,
      'Content-Length': part.size,
      'X-Bz-Content-Sha1': part.partSha1
    } 
    body: part.data
  })
}

function finishLargeFile (fileId, partSha1Array) {
  return xhr.post({
    url: API_URL + '/upload/large/' + fileId,
    headers: getHeaders(),
    body: partSha1Array,
    json: true
  })
}
