var child_process = require('child_process')
  , once = require('once')
  ;

function parse (buf, sep) {
  var start = buf.indexOf(sep+'childport=')
  if (start === -1) return
  start = start + (sep+'childport=').length
  var end = buf.indexOf(sep, start)
  if (end === -1) return
  return parseInt(buf.slice(start, end))
}

exports.port = parse(process.argv[process.argv.length - 1], '-')
exports.listen = function (server) {
  exports.attach(server)
  server.listen(exports.port)
  return server
}
exports.attach = function (server) {
  server.on('error', function (e) {console.error(e.stack)})
  server.on('listening', exports.listener)
  return server
}
exports.listener = function () {
  exports.listening()
}
exports.listening = function () {
  console.log(';childport='+exports.port+';')
}

exports.cp = function (port, cb) {
  var cparg = '--childport='+port+'-'
    , cb = once(cb)
    , wrap = function (child) {
         child.on('error', cb)
         var buf = ''
         function ondata (chunk) {
           buf += chunk
           var p = parse(buf, ';')
           if (p) {
             child.stdout.removeListener('data', ondata)
             cb(null, p)
           }
         }
         child.stdout.on('data', ondata)
         return child
      }
  var exp =
    { spawn: function () { arguments[1] = arguments[1] || []; arguments[1].push(cparg); return wrap(child_process.spawn.apply(child_process, arguments)) }
    , exec: function () { arguments[0] += ' '+cparg; return wrap(child_process.exec.apply(child_process, arguments)) }
    , execFile: function () { arguments[1].push(cparg); return wrap(child_process.execFile.apply(child_process, arguments)) }
    , fork: function () { arguments[1] = arguments[1] || []; arguments[1].push(cparg);
        return wrap(child_process.fork.apply(child_process, arguments))
      }
    }
  return exp
}
exports.child_process = exports.cp
