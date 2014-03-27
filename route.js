var util = require('./util/util.js');
var requestHandlers = require("./requestHandlers");

function route(pathname,questquery,response, request) {
  util.log('info',"About to route a request for " + pathname);

  var handle = {}
  handle["/"] = requestHandlers.none;

  handle["/other"] = requestHandlers.other;
  handle["/upload"] = requestHandlers.upload;
  handle["/download"] = requestHandlers.download;
  //handle["/login"] = requestHandlers.login;
  handle["/connect"] = requestHandlers.connect;
  //handle["/update"] = requestHandlers.update;
  //handle["/select"] = requestHandlers.select;
  //handle["/asyncselect"] = requestHandlers.asyncselect;

  //var querystr = 'select 1 as res,"a" as re2 union select 2 as res,"b" as res3';

  //var querystr = 'select * from changeitem ';

  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request,function(err) {
      if (err) {
        throw err;
      }
    }

    );
  } else {

    err = {
    'err': '404 not found'
    };
    util.log('info',"No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write(JSON.stringify(err));
    response.end();
    util.log('info','end of response');
  }
}

exports.route = route;