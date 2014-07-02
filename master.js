var cluster = require('cluster');
var server = require("./server");
//var router = require("./route");
var requestHandlers = require("./requestHandlers");
var util = require('./util/util.js');
var comm = require('./util/comm.js');
var config = require("./config/config.js");

var numCPUs = require('os').cpus().length;

var result = null;

  function messageHandler(msg) {

      util.log("debug","messageHandler get msg: " + JSON.stringify(msg));
          setTimeout(function () {
        eachWorker(function (worker) {
            worker.send(msg);
        });
    }, 30);

  }

  function eachWorker(callback) {
        for (var id in cluster.workers) {
            callback(cluster.workers[id]);
        }
    }

if (cluster.isMaster) {
/*
	log4js.configure({
        appenders: [
            {
                type: "multiprocess",
                mode: "master",
                appender: {
                    type: "console"
                }
            }
        ]
    });
*/
	 util.log('debug','全局TraceLevel: ' + config.getTraceLevel());
     util.log('debug','数据库连接信息: ' + JSON.stringify(config.getDBConfig()));
　　// Fork workers.
　　for (var i = 0; i < numCPUs; i++) {
	//for (var i = 0; i < 2; i++) {
			cluster.fork();
		//console.log(cluster.workers.length);
　　}

	cluster.on('exit', function(worker,code, signal) {
	  if( signal ) {
	    util.log('info', "worker was killed by signal: "+signal);
	  } else if( code !== 0 ) {
	    util.log('info', "worker exited with error code: "+code);
	  } else {
	    util.log('info', "worker exit success!");
	  }

	  cluster.fork();

	});
	cluster.on('fork', function(worker) {
	  	util.log('info', 'New Worker forked ' + worker.id + '@' + worker.process.pid);
	  	//worker.send(UserValidatedList);
	  });
	cluster.on('err',function(worker) {
		util.log('info', 'Worker err ' + worker.id + '@' + worker.process.pid);
	});
	cluster.on('disconnect',function(worker) {
		util.log('info', 'Worker disconnect ' + worker.id + '@' + worker.process.pid);
	});
	//子进程间通讯
 	/*cluster.on('message',function(msg) {
		util.log('debug', 'msg get ' + msg);
	});
	*/
	//master进程获得子进程的通知后，分发给所有的子进程
	Object.keys(cluster.workers).forEach(function(id) {
    cluster.workers[id].on('message', messageHandler);
  	});

}
else if(cluster.isWorker){

	util.wait(1000);
	server.dohandle();

	process.on('message', function(msg) {
			//子进程获得master的通知
	        util.log('debug', cluster.worker.id + ' get msg:' + JSON.stringify(msg));
	        if(util.jsonexist(msg,'/UserValidatedList') == true){
	        	//util.log('debug', cluster.worker.id + ' UserValidatedList :' + JSON.stringify(UserValidatedList));
	        	comm.syncUserValidatedList(msg,function(callback){
	        		util.log('debug',callback);
	        	});
	        }
	    });



}