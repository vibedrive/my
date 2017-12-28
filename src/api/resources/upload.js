var http = require('request-promise-native')
var VibedriveResource = require('../vibedrive-resource')
var crypto = require('crypto')

const { LARGE_FILE_PART_SIZE } = require('../../constants')

function Upload (vibedrive) {
  if (!(this instanceof Upload)) return new Upload(vibedrive)
  VibedriveResource.call(this, vibedrive)
}

Upload.prototype = Object.create(VibedriveResource.prototype)

Upload.prototype.upload = async function (audioFile, onUploadProgress) {
  return audioFile.size < LARGE_FILE_PART_SIZE
    ? this.uploadSmallFile(audioFile, onUploadProgress)
    : this.uploadLargeFile(audioFile, onUploadProgress)
}

Upload.prototype.uploadSmallFile = async function (file, onUploadProgress) {
  try {
    var { uploadUrl, authorizationToken } = await getUploadUrl.call(this, file.size)
    var opts = {
      filename: file.name,
      data: file.data,
      size: file.size,
      uploadUrl,
      authorizationToken
    }

    var { fileId } = await uploadFile.call(this, opts, onUploadProgress)

    await finishSmallFile.call(this, fileId, file.hash, file.name, file.size)

    return Object.assign(file, { fileId })

  } catch (err) {
    console.error(err)
  }
}

Upload.prototype.uploadLargeFile = async function (file, onUploadProgress) { 
  var { fileId } = await startLargeFile.call(this, file.name, file.hash, file.size)
  var parts = splitFile(file.data)
  var partSha1Array = []

  for (var i = 0; i < parts.length; i++) {
    var part = parts[i]

    try {
      var { uploadUrl, authorizationToken } = await getUploadPartUrl.call(this, fileId)

      part = {
        data: part,
        partSha1: sha1(part),
        size: file.size,
        partNumber: i + 1,
        uploadUrl,
        authorizationToken,
      }

      await uploadPart.call(this, part, onUploadProgress)

      partSha1Array.push(part.partSha1)
    } catch (err) {
      console.error(err)
    }
  }

  await finishLargeFile.call(this, fileId, file.hash, file.name, partSha1Array)

  return Object.assign(file, { fileId })
}

module.exports = Upload


// --- PRIVATE ---

// <--- Upload small files 

function getUploadUrl (size) {
  var url = this._vibedrive.apiURL + '/upload/fileURL' + '?size=' + size
  return http.get({ url, headers: this._vibedrive.headers, json: true })
}

function uploadFile (opts, onUploadProgress) {
  var { uploadUrl, authorizationToken, filename, data, size } = opts

  var opts = {
    url: uploadUrl,
    headers: {
      'Authorization': authorizationToken,
      'Content-Type': 'b2/x-auto',
      'X-Bz-File-Name': filename,
      'X-Bz-Content-Sha1': sha1(data)
    },
    body: data,
    json: true
  }

  if (process.env.NODE_ENV === 'dev') headers['X-Bz-Test-Mode'] = 'fail_some_uploads'

  // b2 does not have cors support for now.
  // proxy the call
  return proxyCall.call(this, uploadUrl, opts.headers, opts.body)

  // return http.post(opts)
}

function finishSmallFile (fileId, multihash, filename, size) {
  var opts = {
    url: this._vibedrive.apiURL + '/upload/file/' + fileId,
    headers: this._vibedrive.headers,
    body: {
      multihash, fileName: filename, size
    },
    json: true
  }

  return http.post(opts)
}

//        ...upload small files ---> 

// <--- Upload LARGE files 

function splitFile (fileData) {
  var parts = []
  var n = Math.ceil( fileData.length / LARGE_FILE_PART_SIZE )

  for (let i = 0; i < n; i++) {
    var a = i * LARGE_FILE_PART_SIZE
    var b = a + LARGE_FILE_PART_SIZE
    parts.push(fileData.slice(a, b))
  }

  return parts
}

function startLargeFile (fileName, multihash, size) {
  var url = this._vibedrive.apiURL + '/upload/large'

  return http.post({ 
    url, 
    headers: this._vibedrive.headers, 
    body: {
      fileName,
      multihash, 
      size
    },
    json: true 
  })
}

function getUploadPartUrl (fileId) {
  var url = this._vibedrive.apiURL + '/upload/partURL/' + fileId

  return http.get({ url, headers: this._vibedrive.headers, json: true })
}
  
function uploadPart (part, onUploadProgress) {
  var opts = { 
    url: part.uploadUrl,
    headers: {
      'Authorization': part.authorizationToken,
      'X-Bz-Part-Number': part.partNumber,
      'X-Bz-Content-Sha1': part.partSha1
    },
    body: part.data
  }

  if (process.env.NODE_ENV === 'dev') headers['X-Bz-Test-Mode'] = 'fail_some_uploads'

  // b2 does not have cors support for now.
  // proxy the call
  return proxyCall.call(this, part.uploadUrl, opts.headers, opts.body)

  // return http.post(opts)
}

function finishLargeFile (fileId, multihash, fileName, partSha1Array) {
  return http.post({
    url: this._vibedrive.apiURL + '/upload/large/' + fileId,
    headers: this._vibedrive.headers,
    body: { multihash, fileName, partSha1Array },
    json: true
  })
}

//        ...upload LARGE files ---> 


//  <-- temporary solution until b2 has cors support 

async function proxyCall (b2URL, b2Headers, body) {
  b2Headers = JSON.stringify(b2Headers)
  var opts = {
    url: this._vibedrive.apiURL + '/upload/proxy',
    headers: Object.assign(this._vibedrive.headers, { b2URL, b2Headers }),
    body
  }
  return http.post(opts)
    .then(res => {
      return JSON.parse(res)
    })
}

//     ... temporary solution until b2 has cors support -->

function sha1 (data) {
  var hash = crypto.createHash('sha1')
  hash.update(data)
  return hash.digest('hex')
}
