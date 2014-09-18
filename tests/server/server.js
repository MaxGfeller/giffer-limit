var st = require('st')
var http = require('http')

var mount = st({
  path: __dirname
})

var server = http.createServer(mount)
server.listen(9876)
