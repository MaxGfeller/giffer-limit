var test = require('tape')
var levelup = require('levelup')
var Giffer = require('giffer')
var TestAdapter = require('./testadapter')
var spawn = require('child_process').spawn

// start testserver
var ls = spawn('node', ['server/server.js'], {
  cwd: __dirname
})

var db = levelup('whatever', { db: require('memdown'), valueEncoding: 'json' })

test('Test functionality of giffer-limit', function(t) {
  var giffer = new Giffer({
    db: db,
    adapters: [ new TestAdapter({}) ],
    outputDir: __dirname + '/tmp'
  })
  giffer.plugin(require('../'), { limit: 5 })
  giffer.start()
  var i = 0
  giffer.on('gif', function() {
    i++

    if (i < 6) return

    console.log(giffer.seqDb)
  })
  t.end()
  ls.kill()
})

// test('Maximum number reached at start', function(t) {
//   var fullDb = levelup('full', { db: require('memdown') })
//   var giffer = new Giffer({
//     db: fullDb,
//     adapters: [],
//     outputDir: __dirname + '/tmp'
//   })
// })
