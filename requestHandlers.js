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
var notice = require('./bussi/notice.js');
var whList = require('./bussi/whList.js');
var pj = require('./bussi/PJInfo.js');

function feedback(questquery,response, request){
          util.log('debug','feedback get');
          util.log('debug',JSON.stringify(questquery));

          //response.writeHead(util.jsonget(questquery,'/errno'), {"Content-Type": "text/html"});
          response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
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


function getWHSettingHandle(questquery,response,request,callback){

async.series([
    function(cb) {
      login.getWHSetting(questquery,response,cb);
    },
], function(results) {

    if(!results){
      feedback(results,response,request);
    }else
    {
      feedback(results,response,request);
    }
    

});
}

function getWHEmptyDateHandle(questquery,response,request,callback){

async.waterfall([
    function(cb) {
      notice.getWHEmptyDate(questquery,response,cb); 
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

function getCalendarHandle(questquery,response,request,callback){

async.waterfall([
    function(cb) {
      login.getCalendar(questquery,response,cb); 
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

function getAccessRecordHandle(questquery,response,request,callback){

async.waterfall([
    function(cb) {
      whList.getAccessRecord(questquery,response,cb); 
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

function insertAccessRecordHandle(questquery,response,request,callback){

async.waterfall([
    function(cb) {
      whList.insertAccessRecord(questquery,response,cb); 
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




//
function getWHDetailListHandle(questquery,response,request,callback){

//顺序取得考勤设定规则和每天的工时明细

async.auto({
    WHSetting: function (callback) {
            login.getWHSetting(questquery,response,
            	function(cb){
            		callback(null,cb);
            	});
    },
    WHDetailList: function (callback) {
            whList.getWHDetailList(questquery,response,
            	function(cb){
            		callback(null,cb);
            	});
    },

    reultsDetailList: ['WHSetting', 'WHDetailList', function(callback) {

            callback();
    }]

}, function(err, results) {
	if(err == null||err == '' ){
		util.log('log','getWHDetailListHandle returns is ' +JSON.stringify(results) );

					  if(results.WHSetting[0].errno=='200' 
					  	&& results.WHDetailList[0].errno=='200')
					  {
					  		util.jsonadd(results,'/errno','200');

                      		util.jsonadd(results,'/errmsg','getWHDetailListHandle complete');
                      //util.jsonadd(results,'/rowcount',i);
                      		util.jsonadd(results,'/module','getWHDetailListHandle');
					  }
					  else
					  	{
					  		util.jsonadd(results,'/errno','300');
                      		util.jsonadd(results,'/errmsg','getWHDetailListHandle error');
                      		//util.jsonadd(results,'/rowcount',i);
                      		util.jsonadd(results,'/module','getWHDetailListHandle');
					  	}

	}
	else
	{
				      util.jsonadd(results,'/errno','400');
                      util.jsonadd(results,'/errmsg','getWHDetailListHandle Exception error');
                      //util.jsonadd(results,'/rowcount',i);
                      util.jsonadd(results,'/module','getWHDetailListHandle');
	}

    feedback(results,response,request);
});

}



function getTotalPJTimeHandle(questquery,response,request,callback){

//取得项目时间实绩合计，项目时间预计合计

async.auto({
	 TotalFctPJTime: function (callback) {
            pj.getTotalFctPJTime(questquery,response,
            	function(cb){
            		callback(null,cb);
            	});
    },
    TotalEstPJTime: function (callback) {
            pj.getTotalEstPJTime(questquery,response,
            	function(cb){
            		callback(null,cb);
            	});
    },

    reultsDetailList: ['TotalFctPJTime', 'TotalEstPJTime',  function(callback) {

            callback();

    }]


}, function(err, results) {
	if(err == null||err == '' ){
    util.log('log','getTotalPJTimeHandle returns is ' +JSON.stringify(results) );

            if(results.TotalFctPJTime[0].errno=='200' 
              && results.TotalEstPJTime[0].errno,"/errno"=='200')
            {
                util.jsonadd(results,'/errno','200');

                          util.jsonadd(results,'/errmsg','getTotalPJTimeHandle complete');
                      //util.jsonadd(results,'/rowcount',i);
                          util.jsonadd(results,'/module','getTotalPJTimeHandle');
            }
            else
              {
                util.jsonadd(results,'/errno','400');
                          util.jsonadd(results,'/errmsg','getTotalPJTimeHandle Data error');
                          //util.jsonadd(results,'/rowcount',i);
                          util.jsonadd(results,'/module','getTotalPJTimeHandle');
              }

  }
  else
  {
              util.jsonadd(results,'/errno','400');
                      util.jsonadd(results,'/errmsg','getTotalPJTimeHandle Exception error');
                      //util.jsonadd(results,'/rowcount',i);
                      util.jsonadd(results,'/module','getTotalPJTimeHandle');
  }

    feedback(results,response,request);
});
}

function getTotalOVTimeHandle(questquery,response,request,callback){

async.waterfall([
    function(cb) {
      whList.getTotalOVTime(questquery,response,cb);
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

function getTotalVCTimeHandle(questquery,response,request,callback){
//取得休假合计，休假明细和有薪假明细
//
async.auto({
   TotalVCTime: function (callback) {
            whList.getTotalVCTime(questquery,response,
              function(cb){
                callback(null,cb);
              });
    },
    PaidVCTime: function (callback) {
            whList.getPaidVCTime(questquery,response,
              function(cb){
                callback(null,cb);
              });
    },
    VCTimeDtail: function (callback) {
            whList.getVCTimeDtail(questquery,response,
              function(cb){
                callback(null,cb);
              });
    },
    reultsDetailList: ['TotalVCTime', 'PaidVCTime','VCTimeDtail',  function(callback) {
            callback();
    }]
}, function(err, results) {
  if(err == null||err == '' ){
    util.log('log','getTotalVCTimeHandle returns is ' +JSON.stringify(results) );

            if(results.TotalVCTime[0].errno=='200' 
              && results.PaidVCTime[0].errno,"/errno"=='200'
              && results.VCTimeDtail[0].errno,"/errno"=='200')
            {
                util.jsonadd(results,'/errno','200');

                          util.jsonadd(results,'/errmsg','getTotalVCTimeHandle complete');
                      //util.jsonadd(results,'/rowcount',i);
                          util.jsonadd(results,'/module','getTotalVCTimeHandle');
            }
            else
              {
                util.jsonadd(results,'/errno','400');
                          util.jsonadd(results,'/errmsg','getTotalVCTimeHandle Data error');
                          //util.jsonadd(results,'/rowcount',i);
                          util.jsonadd(results,'/module','getTotalVCTimeHandle');
              }
  }
  else
  {
              util.jsonadd(results,'/errno','400');
                      util.jsonadd(results,'/errmsg','getTotalVCTimeHandle Exception error');
                      //util.jsonadd(results,'/rowcount',i);
                      util.jsonadd(results,'/module','getTotalVCTimeHandle');
  }

    feedback(results,response,request);
});
}

exports.dologin = dologin;
exports.errhandle = errhandle;
exports.getWHSettingHandle = getWHSettingHandle;
exports.getWHEmptyDateHandle = getWHEmptyDateHandle;
exports.getCalendarHandle = getCalendarHandle;
exports.getWHDetailListHandle = getWHDetailListHandle;
exports.getAccessRecordHandle = getAccessRecordHandle;
exports.insertAccessRecordHandle = insertAccessRecordHandle;
exports.getTotalOVTimeHandle = getTotalOVTimeHandle;
exports.getTotalVCTimeHandle = getTotalVCTimeHandle;
exports.getTotalPJTimeHandle = getTotalPJTimeHandle;