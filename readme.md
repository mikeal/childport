### childport

[![Greenkeeper badge](https://badges.greenkeeper.io/mikeal/childport.svg)](https://greenkeeper.io/)

Launch child processes for services that bind to a specified port.

`npm install childport`

```javascript
// parent.js
var request = require('request')
  , childport = require('childport')
  ;

function finish (e, p) {
  request('http://localhost:3001', function (e, resp, body) {
    if (e) throw e
    if (resp.statusCode !== 200) throw new Error('status not 200, ', resp.statusCode)
  })
}

var child = childport.cp(3001, finish).spawn('node', [__dirname+'/child.js'])
child.on('error', function (e) {throw e})
child.stderr.pipe(process.stderr)
```
```javascript
// child.js
var http = require('http')
  , childport = require('../')
  ;

childport.listen(http.createServer(function (req, resp) {
  resp.statusCode = 200
  resp.end('ok')
}))
```

#### `childport.listen(server)`

This method is to be used in child process scripts. It will parse the specified port and call listen on the server it sent and, on success, let the parent process know it has finish so that it can resolve the specified callback.

Returns the server it was passed for easy chaining.

#### `childport.child_process(port, cb)` && `childport.cp(port, cb)`

Returns a mocked `child_process` module that will launch the process with identifying information about the port to bind to.

#### `childport.cp(port, cb).spawn`

Identical to core's [`child_process.spawn`](http://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).

#### `childport.cp(port, cb).fork`

Identical to core's [`child_process.fork`](http://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options).

#### `childport.cp(port, cb).exec`

Identical to core's [`child_process.exec`](http://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback).

#### `childport.cp(port, cb).execFile`

Identical to core's [`child_process.execFile`](http://nodejs.org/api/child_process.html#child_process_child_process_execfile_file_args_options_callback).