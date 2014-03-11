var mysql = require('mysql');
var sys = require('sys');
var util = require('./util.js');
var async = require('async');

var t = require('./t');

var db_config = {
  host: '192.168.20.83',
  user: 'root',
  password: 'root',
  database: 'jira'
};

var connection = null;
var query = null;
var queryDBStatus = "select 1";
var status="";

function AsyncCheckDBstatus(queryDBStatus,callback){  // 顺序执行select

 console.log('async.series start');
/*
  async.series([
      function(cb) { 
        var v1='1'; 
      },
      function(cb) { 
        var v2='2'; 
      },
      function(cb) { 
        var v3='3';
      }
  ], function(err, results) {
      console.log('err',err); // -> undefined
      console.log('results',results); // -> [ 4, 9, 3 ]
  });
*/

async.series([
    function(cb) { t.inc(3, cb); },
    function(cb) { t.inc(8, cb); },
    function(cb) { t.inc(2, cb); }
], function(err, results) {
    console.log('1.1 err: ', err); // -> undefined
    console.log('1.1 results: ', results); // -> [ 4, 9, 3 ]
});
 console.log('async.series end');
 return true;
}






exports.AsyncCheckDBstatus = AsyncCheckDBstatus;
