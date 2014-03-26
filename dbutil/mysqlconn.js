var mysql = require('mysql');
var sys = require('sys');
var util = require('../util/util.js');
var async = require('async');
var Wind = require('wind')
var config = require('../config/config.js');
var url = require("url");
var connection = null;
var query = null;

var status="";


function AsyncCheckDBstatus(response,callback){  // 顺序执行select

  var dbconfig = config.getDBConfig();
  connection = mysql.createConnection(dbconfig);



var sqls = {
    'insertSQL': 'select 2',
    'selectSQL': 'select 1 ',
    'deleteSQL': 'select 3',
    'updateSQL': 'select 3 '
};

var insertSQL = 'select 1 ';
var selectSQL = 'select 2 ';

var tasks = ['deleteSQL', 'insertSQL', 'selectSQL', 'updateSQL', 'selectSQL'];

async.series([
    function(callback){

      connection.query(insertSQL, function(err,res){
                if(!err){
                          console.log(res);
                        }
                        callback(err, res);
                  }
        );

    },
    function (callback){

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
       util.log('info', 'async.eachSeries end;');

      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(JSON.stringify(res));      
      response.end();
    }
    else
    {

      global.queryDBStatus = 'err';
       util.log('error', err);
       util.log('info', 'async.eachSeries end');

      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(JSON.stringify(err));   //JSON.parse(str)  反向 JSON.stringify(err) 
      response.end();

    }    
  }
  );
}

exports.AsyncCheckDBstatus = AsyncCheckDBstatus;

