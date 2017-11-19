var xhr = require('xhr')

module.exports = {
  get: promisify(xhr.get),
  post: promisify(xhr.post)
}

function promisify (fn) {
  return function (opts) {
    return new Promise(function (resolve, reject) {
      fn(opts, function (err, res, body) {
        if (err) return reject(err)
        if (res.statusCode !== 200) return reject(res)
        return resolve(body)
      })
    })
  }
}