var test = require('tape')
var levelup = require('levelup')
var Giffer = require('giffer')
var TestAdapter = require('./testadapter')
var spawn = require('child_process').spawn
var fs = require('fs')
var rimraf = require('rimraf')
var concat = require('concat-stream')

// start testserver
var ls = spawn('node', ['server/server.js'], {
  cwd: __dirname
})

var db = levelup('whatever', { db: require('memdown'), valueEncoding: 'json' })

test('Test functionality of giffer-limit', function (t) {
  setUp()
  var giffer = new Giffer({
    db: db,
    adapters: [ new TestAdapter({}) ],
    outputDir: __dirname + '/tmp'
  })
  giffer.plugin(require('../'), { limit: 5 })
  giffer.start()
  var i = 0
  giffer.on('gif', function () {
    if (++i < 6) return

    var files = fs.readdirSync(giffer.outDir)
    t.equals(files.length, 5, 'one gif should have been deleted')
    t.end()
    ls.kill()
  })
})

test('Maximum number reached at start', function (t) {
  var giffer = new Giffer({
    db: db,
    adapters: [],
    outputDir: __dirname + '/tmp'
  })
  giffer.plugin(require('../'), { limit: 2 })
  giffer.start()
  setTimeout(function () {
    var files = fs.readdirSync(giffer.outDir)
    t.equals(files.length, 2, 'only two gifs must be left')
    giffer.createSeqReadStream().pipe(concat(function (data) {
      t.equals(data.length, 2, 'only two entries left in db')
      t.end()
    }))
  }, 1000)
})

function setUp () {
  rimraf.sync(__dirname + '/tmp')
  fs.mkdirSync(__dirname + '/tmp')
}
