var mysql = require('mysql');
var sys = require('sys');
var util = require('../util/util.js');
var async = require('async');
var Wind = require('wind')

var db_config = {
  host: '192.168.20.83',
  user: 'root',
  password: 'root',
  database: 'jira'
};

var connection = null;
var query = null;

var status="";


function AsyncCheckDBstatus(response,callback){  // 顺序执行select
//function AsyncCheckDBstatus(){  

//var AsyncCheckDBstatus = function (queryDBStatus,callback){  // 顺序执行select

  console.log('1-1 async.series start');

  connection = mysql.createConnection(db_config);

var sqls = {
    'insertSQL': 'select 2',
    'selectSQL': 'select 1 ',
    'deleteSQL': 'select 3',
    'updateSQL': 'select 3 '
};

var insertSQL = 'select 1 ';
var selectSQL = 'select 2 ';

var tasks = ['deleteSQL', 'insertSQL', 'selectSQL', 'updateSQL', 'selectSQL'];

/*


async.eachSeries(tasks, function (item, callback) {
    console.log(item + " ==> " + sqls[item]);
    connection.query(sqls[item], function (err, res) {
    	if(!err){
    		console.log(res);
    	}
        callback(err, res);
    });
}, function (err,res) {

    if(err == null){
      global.queryDBStatus = 'ok';
      
    }
    else
    {
      global.queryDBStatus = 'err';
      console.log("async.eachSeries err  = "+ err);
      
    }

    console.log('async.eachSeries end');
    return callback(err, res);

});
*/


async.series([
    function(callback){
      console.log('2-1' + insertSQL);

      connection.query(insertSQL, function(err,res){
                if(!err){
                          console.log(res);
                        }
                        callback(err, res);
                  }
        );

    },
    function (callback){
      console.log('2-3' + selectSQL);

      //connection.query(selectSQL, callback);  //没有正确callback，返回的是object对象
      connection.query(selectSQL, function(err,res){
                if(!err){
                          console.log(res);
                        }
                        callback(err, res);
                  }
        );

    }

  ],function(err,res){

    if(err == null){
      global.queryDBStatus = 'ok';
      console.log('async.eachSeries end;');

      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(JSON.stringify(res));      
      response.end();
    }
    else
    {

      global.queryDBStatus = 'err';
      console.log("async.eachSeries err  = "+ err);
      console.log('async.eachSeries end');

      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(JSON.stringify(err));   //JSON.parse(str)  反向 JSON.stringify(err) 
      response.end();

      
      
    }
    console.log('response complete;');


    
  }

  


  );
  console.log('global.queryDBStatus = ' + global.queryDBStatus);
  //return global.queryDBStatus;
  //emitter.emit('dbstatusdone');


}

function ReturnResult(){  

return res="resr";
}


exports.AsyncCheckDBstatus = AsyncCheckDBstatus;
exports.ReturnResult = ReturnResult;
