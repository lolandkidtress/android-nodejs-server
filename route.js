function route(handle, pathname, response, request) {
  console.log("About to route a request for " + pathname);

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
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write(JSON.stringify(err));
    response.end();
  }
}

exports.route = route;