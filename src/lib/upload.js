var http = require('./http')
const sha1 = require('./sha1')
const getHeaders = () => ({ 'Authorization': localStorage.getItem(TOKEN_KEY) })
const API_URL = process.env.API_URL || 'https://localhost:5823'
const TOKEN_KEY = 'vibedrive::access_token'
const FIVE_MB = 5 * 1000 * 1000
const PART_SIZE = FIVE_MB

//  <-- temporary solution until b2 has cors support 

async function proxyCall (b2URL, b2Headers, body) {
  b2Headers = JSON.stringify(b2Headers)
  var opts = {
    url: API_URL + '/upload/proxy',
    headers: Object.assign(getHeaders(), { b2URL, b2Headers }),
    body
  }
  return http.post(opts).then(res => JSON.parse(res.body))
}

//     ... temporary solution until b2 has cors support -->



module.exports = { 
  uploadSmallFile, 
  uploadLargeFile 
}



// <--- Upload small files 


async function uploadSmallFile (file, onUploadProgress) {
  try {
    var { uploadUrl, authorizationToken } = await getUploadUrl(file.size)
    var opts = {
      filename: file.fileName,
      data: file.data,
      size: file.size,
      uploadUrl,
      authorizationToken
    }

    var { fileId } = await uploadFile(opts, onUploadProgress)

    await finishSmallFile(fileId, file.hash, file.fileName, file.size)

    return Object.assign(file, { fileId })

  } catch (err) {
    console.error(err)
  }
}

function getUploadUrl (size) {
  var url = API_URL + '/upload/fileURL' + '?size=' + size
  return http.get({ url, headers: getHeaders(), json: true })
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
  return proxyCall(uploadUrl, opts.headers, opts.body)

  // return http.post(opts)
}

function finishSmallFile (fileId, multihash, filename, size) {
  return http.post({
    url: API_URL + '/upload/file/' + fileId,
    headers: getHeaders(),
    body: {
      multihash, filename, size
    },
    json: true
  })
}

//        ...upload small files ---> 






// <--- Upload LARGE files 

async function uploadLargeFile (file, onUploadProgress) { 
  var { fileId } = await startLargeFile(file.fileName, file.hash, file.size)
  var parts = splitFile(file.data)
  var partSha1Array = []

  let i = 1

  for (let part of parts) {
    try {
      var { uploadUrl, authorizationToken } = await getUploadPartUrl(fileId)

      part = {
        data: part,
        partSha1: sha1(part),
        size: file.size,
        partNumber: i,
        uploadUrl,
        authorizationToken,
      }

      await uploadPart(part, onUploadProgress)

      partSha1Array.push(part.partSha1)

      i++

    } catch (err) {
      console.log(err)
    }
  }

  await finishLargeFile(fileId, file.hash, file.fileName, partSha1Array)

  return Object.assign(file, { fileId })
}

function splitFile (fileData) {
  var parts = []
  var n = Math.ceil( fileData.length / PART_SIZE )

  for (let i = 0; i < n; i++) {
    var a = i * PART_SIZE
    var b = a + PART_SIZE
    parts.push(fileData.slice(a, b))
  }

  return parts
}

function startLargeFile (fileName, multihash, size) {
  var url = API_URL + '/upload/large'

  return http.post({ 
    url, 
    headers: getHeaders(), 
    body: {
      fileName,
      multihash, 
      size
    },
    json: true 
  })
}

function getUploadPartUrl (fileId) {
  var url = API_URL + '/upload/partURL/' + fileId

  return http.get({ url, headers: getHeaders(), json: true })
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
  return proxyCall(part.uploadUrl, opts.headers, opts.body)

  // return http.post(opts)
}

function finishLargeFile (fileId, multihash, fileName, partSha1Array) {
  return http.post({
    url: API_URL + '/upload/large/' + fileId,
    headers: getHeaders(),
    body: { multihash, fileName, partSha1Array },
    json: true
  })
}

//        ...upload LARGE files ---> 



