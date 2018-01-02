module.exports = function nanoclass (obj) {
  var list = []
  for (var key in obj) {
    if (obj.hasOwnProperty(key) && obj[key]) {
      list.push(key)
    }
  }
  return list.join(' ')
}
