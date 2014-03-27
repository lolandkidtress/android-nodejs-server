var cluster = require('cluster');
var server = require("./server");
//var router = require("./route");
var requestHandlers = require("./requestHandlers");
var util = require('./util/util.js');

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
	    util.log('info', "worker was killed by signal: "+signal);
	  } else if( code !== 0 ) {
	    util.log('info', "worker exited with error code: "+code);
	  } else {
	    util.log('info', "worker success!");
	  }

	  cluster.fork();

	});
	cluster.on('fork', function(worker) {
	  	//util.log('info', worker.id + "@" + worker.process.pid);
	  });

}else if(cluster.isWorker){


util.log('info', 'I am worker #'+ cluster.worker.id + "@" + cluster.worker.process.pid);

//server.dohandle(router.route);
server.dohandle();


}