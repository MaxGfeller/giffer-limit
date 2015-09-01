var through = require('through2')
var fs = require('fs')
var concat = require('concat-stream')

var n = 0
function prepare (giffer, limit) {
  n = 0
  var ops = []

  giffer.seqDb.createReadStream()
    .on('data', function (kv) {
      if (++n <= limit) return
      ops.push({ type: 'del', key: kv.value })
    })
    .on('end', function () {
      if (ops.length === 0) return
      n = n - ops.length
      giffer.urlDb.batch(ops, function (err) {
        if (err) throw err
      })
    })
}

module.exports = function (giffer, opts) {
  prepare(giffer, opts.limit)
  giffer.pre('download', function(next) {
    if (++n <= opts.limit) return next()

    giffer.seqDb.createReadStream({
      limit: 1,
      gt: 1,
      reverse: false
    })
    .on('data', function (kv) {
      --n
      giffer.urlDb.get(kv.value, function (err, o) {
        if (err) throw new Error('There was an error deleting an old GIF')
        // fs.unlink(giffer.outDir + '/' + o.filename, noop)
        giffer.urlDb.del(kv.value, noop)
      })
    })
    next()
  })
}

function noop () {}
