var browserChannelRpc = require('./server').server;
var connect = require('connect');

var server = connect(
  connect.static(__dirname + "/public"),
  browserChannelRpc({
    greet : function(session,data,cb){
      cb(null,'Hello '+data);
    }
  })
);

server.listen(4444);

console.log('Echo server listening on localhost:4444');