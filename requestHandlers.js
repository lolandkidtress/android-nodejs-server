var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable"),
    mysql = require('./dbutil/mysqlconn.js');
    fshandle = require('./filesystem/fshandle.js');

var async = require('async');
var util = require('./util/util.js');
var Wind =require('wind');
var events = require('events');

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
function other(response, request){
  
  global.queryDBStatus = '';

  mysql.AsyncCheckDBstatus(response,callback);

}


function connect(response, request ){
        
    console.log("Request handler 'db connect' was called.");
      
    if(!mysql.dbconnect(function(err) {
                            if (err) {
                              console.log('error happen');
                              console.log(err);
                              }
                              else{
                              console.log('no error');
                              }
                            }

                     )
      )

    {
      console.log('db error');
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write("dbconnect error");  
     /*
      mysql.EndDbConnect(function(err) {
                            if (err) {
                              console.log('error happen');
                              console.log(err);
                              }
                              else{
                              console.log('no error');
                              }
                            }

                     );   
      */
    }
    else {
      console.log('db ok');
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write("dbconnect ok");
      mysql.EndDbConnect();
    }

    response.end();
 
}

function upload(response, callback){
    fshandle.uploadfile(response,realpath,callback);

}

function download(response, callback){
    var realpath = "./assets/1.txt";
    fshandle.downloadfile(response,realpath,callback);
  
}



exports.other = other;
exports.none = none;
exports.upload = upload;
exports.download = download;


