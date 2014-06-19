var mysql = require('mysql');
var sys = require('sys');
var util = require('../util/util.js');
var async = require('async');
var config = require('../config/config.js')


var connection = null;
var query = null;

var status="";
var _pool;

function AsyncCheckDBstatus(response,callback){  // 顺序执行select
//function AsyncCheckDBstatus(){  

//var AsyncCheckDBstatus = function (queryDBStatus,callback){  // 顺序执行select
  var results;
  connection = mysql.createConnection(config.getDBConfig());


var selectSQL1 = 'select database() as dbname union all select database() as dbname';
var selectSQL2 = 'select version()  as version';


var tasks = ['deleteSQL', 'insertSQL', 'selectSQL', 'updateSQL', 'selectSQL'];

async.series([
    function(callback){

var sqlerr;
var row;
var err;
var res;


var query = connection.query(selectSQL1);
query
  .on('error', function(sqlerr) {
    // Handle error, an 'end' event will be emitted after this as well
    console.log('on err');
    console.log(sqlerr);

  })
  /*
  .on('fields', function(fields) {
    // the field packets for the rows to follow
    console.log('fields');
    console.log(fields);
  })
*/
  .on('rows', function(rows) {
    // the field packets for the rows to follow
    console.log('rows');
    console.log(rows);
  })
  .on('result', function(row) {
    // Pausing the connnection is useful if your processing involves I/O
    connection.pause();
    console.log(row);
    connection.resume();
  
    

  })
  .on('end', function() {
    var err = sqlerr;
    var res = row;
    // all rows have been received
  });
   callback(sqlerr, res);
/*
      connection.query(selectSQL1, function(err,res){
                if(!err){
                          util.log('error',res);
                          console.log('error',res);
                        }
                        callback(err, res);
                  }
        );
*/
    },
    function (callback){
      //connection.query(selectSQL, callback);  //没有正确callback，返回的是object对象
      connection.query(selectSQL2, function(err,res){
                if(!err){
                          util.log('debug',res);
                        }
                        callback(err, res);
                  }
        );

    }

  ],function(err,res){

    if(err == null||err == '' ){
      //global.queryDBStatus = 'ok';
      util.log('debug','async.eachSeries end;');
      results = res;

    }
    else
    {

      //global.queryDBStatus = 'err';
      util.log('error',"AsyncCheckDBstatus err  = "+ err);
      util.log('debug','async.eachSeries end');
      results = err;

     
    }
    util.log('info','response complete;');

    if(util.jsonexist(results,'/errno') != true){
        util.jsonadd(results,'/errno','200');
    }
    callback(null,results);

  });

  


}


function CallProcedure(n,callback){  

callback(null,n);
}

function CallFunction(){  

return res="resr";
}


function poolConnection(callback){

   if(_pool==''||_pool == null){
      util.log('debug','create ConnectionPool');
      _pool = mysql.createPool(config.getDBConfig());
           //return callback(pool);
      return _pool;
   }else{
      util.log('debug','reuse ConnectionPool');
      return _pool;
   }
}

function getConnection(pool,callback){
  
    var conn ;

   pool.getConnection(function(err, connection) {
        console.log('sdsf');
        console.log(connection);
    });

   callback(connection);
}

exports.AsyncCheckDBstatus = AsyncCheckDBstatus;
exports.CallProcedure = CallProcedure;
exports.CallFunction = CallFunction;
exports.poolConnection = poolConnection;
exports.getConnection = getConnection;