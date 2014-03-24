var cluster = require('cluster');
var server = require("./server");
var router = require("./route");
var requestHandlers = require("./requestHandlers");

var numCPUs = require('os').cpus().length;

var result = null;

if (cluster.isMaster) {
　　// Fork workers.
　　for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
		//console.log(cluster.workers.length);
　　}

	cluster.on('exit', function(worker,code, signal) {
	  if( signal ) {
	    console.log("worker was killed by signal: "+signal);
	  } else if( code !== 0 ) {
	    console.log("worker exited with error code: "+code);
	  } else {
	    console.log("worker success!");
	  }

	  cluster.fork();

	});
	cluster.on('fork', function(worker) {
	  	console.log(worker.id + "@" + worker.process.pid);
	  });

}else if(cluster.isWorker){

var handle = {}
handle["/"] = requestHandlers.none;

handle["/other"] = requestHandlers.other;
handle["/upload"] = requestHandlers.upload;
handle["/download"] = requestHandlers.download;
//handle["/login"] = requestHandlers.login;
//handle["/connect"] = requestHandlers.connect;
//handle["/update"] = requestHandlers.update;
//handle["/select"] = requestHandlers.select;
//handle["/asyncselect"] = requestHandlers.asyncselect;

console.log("httpd start port:8000 ");
console.log('I am worker #'+ cluster.worker.id + "@" + cluster.worker.process.pid);

server.dohandle(router.route, handle);

}