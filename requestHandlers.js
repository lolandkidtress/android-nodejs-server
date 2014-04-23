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
var login = require('./bussi/login.js');

function feedback(questquery,response, request){
          util.log('debug','feedback get');
          util.log('debug',questquery);

          //response.writeHead(util.jsonget(questquery,'/errno'), {"Content-Type": "text/html"});
          response.writeHead(200, {"Content-Type": "text/html"});
          response.write(JSON.stringify(questquery));
          response.end();
          util.log('info','end of response');
}


function none(response, request){
  other(response,request);
}

function errhandle(questquery,response, request){
  feedback(questquery,response,request);
}

//返回DB服务器是否正常
function other(questquery,response, request){
  
async.waterfall([
    function(cb) {
      mysql.AsyncCheckDBstatus(response,cb); 
    },
    
    /*
    function(n,cb) {
      mysql.CallProcedure(n,cb); 
    },
    */
], function(err, results) {
  
    feedback(results,response,request);

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

function dologin(questquery,response,request,callback){

async.waterfall([
    function(cb) {
      login.login(questquery,response,cb); 
    },
    
    /*
    function(n,cb) {
      mysql.CallProcedure(n,cb); 
    },
    */
], function(results) {

    if(!results){
      feedback(results,response,request);
    }else
    {
      feedback(results,response,request);
    }
    

});
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
exports.dologin = dologin;
exports.errhandle = errhandle;

