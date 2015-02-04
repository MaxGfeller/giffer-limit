var through = require('through2')
var fs = require('fs')

var n = 0
function prepare(giffer, limit) {
  var toDelete = []

  giffer.seqDb.createReadStream({
    reverse: true,
    gt: 1
  }).pipe(through(function(k, v) {
    n++
    if (n > limit) toDelete.push(v)
  }))

  toDelete.forEach(function(k) {
  })
}

function noop() {}

module.exports = function(giffer, opts) {
  // prepare(giffer, opts.limit)
  giffer.pre('download', function(next) {
    n++
    if (n <= opts.limit) return next()

    giffer.seqDb.createReadStream({
      limit: 1,
      gt: 1,
      reverse: true
    })
    .on('data', function(kv) {
      console.log('got data')
      giffer.seqDb.del(kv.key, noop)
      giffer.urlDb.get(kv.value, function(err, o) {
        if (err) throw new Error('There was an error deleting an old GIF')
        console.log(o)
        fs.unlink(giffer.outDir + '/' + o.filename, noop)
        giffer.urlDb.del(kv.value, noop)
      })
    })
    next()
  })
}
