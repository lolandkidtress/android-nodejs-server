var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable"),
    mysql = require('./dbutil/mysqlconn.js');
    fshandle = require('./filesystem/fshandle.js');

var url = require("url");
var async = require('async');
var util = require('./util/util.js');
var Wind =require('wind');
var events = require('events');
var async = require('async');

var callback = function(){};
/*
var taskQueryDBStatus = eval(Wind.compile("async", function (text) {
     $await(mysql.AsyncCheckDBstatus());
}));
*/


function none(response, request){
  other(response,request);
}



//返回DB服务器是否正常
function other(response, request,flg){
  


async.waterfall([
    function(cb) {
      mysql.AsyncCheckDBstatus(response,cb); 
      //mysql.AsyncCheckDBstatus(response,callback); 
    },
    
    function(n,cb) {
      mysql.CallProcedure(n,cb); 
      //mysql.AsyncCheckDBstatus(response,callback); 
    },
    /*
    function(n,cb) {
      //mysql.CallProcedure(3,cb); 
      mysql.CallProcedure(n,cb); 
    },
    */

], function(err, results) {
    console.log('1.1 err: ', err); // -> undefined
    console.log('1.1 results: ', results); 
    //console.log('1.1 results: ', results); 
    response.writeHead(500, {"Content-Type": "text/plain"});
    response.write(JSON.stringify(results));   //JSON.parse(str)  反向 JSON.stringify(err) 
    response.end();

});
}


function connect(response, request,callback){
        
     console.log(JSON.stringify(url.parse(request.url)));
 
}

function selectsql(response, request,callback){
    console.log('1');
}
function insertsql(response, request,callback){
    console.log('1');
}
function updatesql(response, request,callback){
    console.log('1');
}
function deletesql(response, request,callback){
    console.log('1');
}

function upload(response, callback){
    fshandle.uploadfile(response,realpath,callback);

}

function download(response, callback){
    var realpath = "./assets/1.txt";
    //fshandle.downloadfile(response,realpath,callback);
    fshandle.downloadStream(response,realpath,callback);
  
}



exports.other = other;
exports.none = none;
exports.upload = upload;
exports.download = download;
exports.connect = connect;
exports.selectsql = selectsql;
exports.insertsql = insertsql;
exports.updatesql = updatesql;
exports.deletesql = deletesql;

