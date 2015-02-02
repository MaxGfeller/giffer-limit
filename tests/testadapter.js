var inherits = require('util').inherits
var EventEmitter = require('events').EventEmitter

inherits(TestAdapter, EventEmitter)

function TestAdapter() {}

TestAdapter.prototype.start = function() {
    setTimeout(this.emit.bind(this, 'gif', 'http://localhost:9876/1.gif', { origin: 'test' }), 2000)
    setTimeout(this.emit.bind(this, 'gif', 'http://localhost:9876/2.gif', { origin: 'test2' }), 2100)
    setTimeout(this.emit.bind(this, 'gif', 'http://localhost:9876/3.gif', { origin: 'test3' }), 2300)
    setTimeout(this.emit.bind(this, 'gif', 'http://localhost:9876/4.gif', { origin: 'test4' }), 2500)
    setTimeout(this.emit.bind(this, 'gif', 'http://localhost:9876/5.gif', { origin: 'test5' }), 2700)
    setTimeout(this.emit.bind(this, 'gif', 'http://localhost:9876/6.gif', { origin: 'test6' }), 2900)
}

TestAdapter.prototype.stop = function() {}

module.exports = TestAdapter
