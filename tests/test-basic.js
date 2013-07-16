var childport = require('../')
  , request = require('request')
  , cleanup = require('cleanup')
  , ok = require('okdone')
  , assert = require('assert')
  ;

var d = cleanup(function (error) {
  try { child.kill() }
  catch (e) {}
  if (error) process.exit(1)
  ok.done()
  process.exit()
})

function finish (e, p) {
  if (e) throw e
  assert.equal(p, 3001)
  test()
  ok('child port listen')
}

var child = childport.cp(3001, finish).spawn('node', [__dirname+'/subhttp.js'])
child.on('error', function (e) {throw e})
child.stderr.pipe(process.stderr)

function test () {
  request('http://localhost:3001', function (e, resp, body) {
    if (e) throw e
    if (resp.statusCode !== 200) throw new Error('status not 200, ', resp.statusCode)
    assert.equal(body, 'ok')
    ok('http server')
    d.cleanup()
  })
}