/*1.login 模块 
   包含 1.用户名密码的校验

认证失败返回的   
json 格式为：
{ errno : '400',
  errmsg: 'User Invalid',
  module: 'login'
  user_name:'',
  credential:''
}

认证成功返回
json 格式为：
{ errno : '200',
  errmsg: 'setting get',
  module: 'login',
  queryresult{
  userid:'',
  username:'',
  credential:''
  }
}


2.用户校验成功后，取得该用户当月使用的考勤规则

传入参数：
employeeID
startdt
enddt

考勤规则返回json格式：

取得规则后返回
json 格式为：
{ errno : '200',
  errmsg: 'setting get',
  module: 'getWHSetting',
  rowcount :'', //该月有多少条规则
  queryresult0{
  FromDT:'',  开始有效日
  ToDT:'',    结束有效期
  AMFrom:'',
  AMTo:'',
  MiddleFrom:'',
  MiddleTo:'',
  PMFrom:'',
  PMTo:'',
  AlarmWH:'',
  OvertimeWHUnit :'',  加班申请最小时间单位 
  OvertimeStartTime :'',  加班起算时间 
  OvertimeStartWH :'' ,加班起始单位 
  OvertimeDuration  :'' 加班转调休的有效期（月） 
  }
  queryresult1{
    .....
  }
}

3.取得需要出勤的日历
取得规则后返回
json 格式为：
{ errno : '200',
  errmsg: 'Calendar get',
  module: 'getCalendar',
  rowcount :'', //该月有多少条规则
  queryresult0{
  ymd:'',  日期
  weekdate:'',    周几
  dtdaytype:'',  01： 出勤日；02：休日；03：国定假日；04：IV特别休日
  AMTo:'',
  MiddleFrom:'',
  MiddleTo:''
  }
   queryresult1{
  .....
  }
}
*/

var mysql = require('mysql');
var mysqlconn = require('../dbutil/mysqlconn.js');
var sys = require('sys');
var util = require('../util/util.js');
var async = require('async');
var Wind = require('wind')
var config = require('../config/config.js')

/*
//使用直接连接方法 现在不使用
function login2(questquery,response,callback){ 
  var i = 0;
  var results ={
    errno:'',
    errmsg:''
  };

//console.log(questquery);

  connection = mysql.createConnection(config.getDBConfig());


var selectSQL1 = 'select uuid_,password_,emailAddress from lportal.user_ where emailAddress = ';
selectSQL1 = selectSQL1 + connection.escape(util.jsonget(questquery,'/user_name'));
selectSQL1 = selectSQL1 + ' and password_ = ' + connection.escape(util.jsonget(questquery,'/credential'));

//util.jsonadd(parameter,'/user_name',util.jsonget(questquery,'/user_name'));
//util.jsonadd(parameter,'/credential',util.jsonget(questquery,'/credential'));

util.log('debug',selectSQL1);

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
    util.log('DB connect error');
    util.log(sqlerr);
    results = sqlerr;
    util.jsonadd(results,'/sqlstmt',selectSQL1);
  })
  .on('result', function(rows) {
    // Pausing the connnection is useful if your processing involves I/O
    //connection.pause();
    util.jsonadd(results,'/queryresult'+i+'/username',rows.user_name);
    util.jsonadd(results,'/queryresult'+i+'/credential',rows.credential);
    i=i+1;

    //console.log(results);
  
  })
  .on('end', function(rows) {
        if(i==1){
        	util.jsonadd(results,'/errno','200');
        	util.jsonadd(results,'/errmsg','User Valid');
        }else
        {
        	util.jsonadd(results,'/errno','400');
        	util.jsonadd(results,'/errmsg','User InValid');
        }
      connection.destroy();
      callback(sqlerr, results);
 });
    }

  ],function(sqlerr,results){

    if(sqlerr == null||sqlerr == '' ){

   	 if(util.jsonexist(results,'/errno') != true){
        util.jsonadd(results,'/errno','200');
    	}
      callback(sqlerr,results);
    }
    else
    {
      //global.queryDBStatus = 'err';
      util.log('error',"err  = "+ sqlerr);
      results = sqlerr;
    }
    //return callback(null,results);
  });
}

*/

//使用连接池方式
/*
输入参数 员工的邮箱，密码
*/
function login(questquery,response,callback){ 
  var i = 0;
  var results ={
    errno:'',
    errmsg:''
  };
  var pool;
  var Connection;
  var selectSQL1;

	async.series([

    	function(callback){
			var sqlerr;
			var row;
			var err;
			var res;

      //var pool = mysql.createPool(config.getDBConfig());
      
      var pool = mysqlconn.poolConnection();

      pool.getConnection(function(sqlerr, Connection) {
        // connected! (unless `err` is set)
        if(sqlerr!=null){
          util.log('log','get ConnectPool error');
          util.log('log',sqlerr);
          err = sqlerr;  
          //util.jsonadd(err);
          callback(sqlerr, null);

        }else
        {
        selectSQL1 = 'select lp.uuid_,lp.emailAddress,em.LoginName,em.EmployeeID ' ;
        selectSQL1 = selectSQL1 +' from lportal.user_ lp,ivggs_whs.trnemployee em '
        selectSQL1 = selectSQL1 + ' where emailAddress = ';
        selectSQL1 = selectSQL1 + Connection.escape(util.jsonget(questquery,'/username'));
        selectSQL1 = selectSQL1 + ' and password_ = ' + Connection.escape(util.jsonget(questquery,'/credential')) ;
        selectSQL1 = selectSQL1 + 'and emailAddress = LoginName';

        util.log('debug',selectSQL1);
            var query = Connection.query(selectSQL1);
            query
              .on('error', function(sqlerr) {
                // Handle error, an 'end' event will be emitted after this as well
                results = sqlerr;
                util.log('log','Connect error '+ sqlerr);
                util.jsonadd(results,'/sqlstmt',selectSQL1);
              })
              .on('result', function(rows) {
                // Pausing the connnection is useful if your processing involves I/O
                //connection.pause();
                util.jsonadd(results,'/queryresult/username',rows.LoginName);
                util.jsonadd(results,'/queryresult/userid',rows.EmployeeID);
                util.jsonadd(results,'/queryresult/uuid',rows.uuid_);
                i=i+1;
              })
              .on('end', function(rows) {
                    if(i==1){
                      util.jsonadd(results,'/errno','200');
                      util.jsonadd(results,'/errmsg','User Valid');
                      util.jsonadd(results,'/module','login');
                    }else
                    {
                      util.jsonadd(results,'/errno','400');
                      util.jsonadd(results,'/errmsg','User InValid');
                      util.jsonadd(results,'/module','login');
                    }
                  Connection.release();
                  callback(null,results);  
              });
        }
        
      });

		}
			  ],function(sqlerr,results){

			    if(sqlerr == null||sqlerr == '' ){

			   	 if(util.jsonexist(results,'/errno') != true){
			        util.jsonadd(results,'/errno','200');
			    	}
            util.log('log','login returns');
            util.log('log',results);
			      callback(results);
			    }
			    else
			    {
			      //global.queryDBStatus = 'err';
			      util.log('error',"err  = "+ sqlerr);
			      results = sqlerr;
            util.log('log','login returns');
            util.log('log',results);
            callback(results);
			    }
  		}); //async.series end

}

/*取得员工的考勤规则
输入参数：开始日期，结束日期，员工ID

*/
function getWHSetting(questquery,response,callback){ 
  var i = 0;
  var results ={
    errno:'',
    errmsg:''
  };
  var pool;
  var Connection;
  var selectSQL1;

  async.series([

      function(callback){
      var sqlerr;
      var row;
      var err;
      var res;

      //var pool = mysql.createPool(config.getDBConfig());
      
      var pool = mysqlconn.poolConnection();

      pool.getConnection(function(sqlerr, Connection) {
        // connected! (unless `err` is set)
        if(sqlerr!=null){
          util.log('log','get ConnectPool error');
          util.log('log',sqlerr);
          err = sqlerr;  
          //util.jsonadd(err);
          callback(sqlerr, null);

        }else
        {

        selectSQL1 = ' SELECT a.WHSettingID,a.DtSettlementType, ';
        selectSQL1 += ' a.AMFrom,a.AMTo,a.MiddleFrom,a.MiddleTo,a.PMFrom,a.PMTo, a.AlarmWH,';
        selectSQL1 += ' a.FromDt,a.ToDt,a.OvertimeDuration,a.OvertimeStartTime,a.OvertimeWHUnit,a.OvertimeStartWH, ';
        selectSQL1 += ' b.EmployeeID,b.DtFrom,b.DtTo FROM mstwhsetting a,rtnemwh b ';
        selectSQL1 += ' WHERE a.WHSettingID = b.WHSettingID AND a.FlgEnable = 1 and a.DelFlg = 0 ';
        //selectSQL1 += ' and a.FromDt between b.DtFrom and b.DtTo ';
        //selectSQL1 += ' and a.ToDt between b.DtFrom and b.DtTo ';
        selectSQL1 += ' and b.EmployeeID = '+ Connection.escape(util.jsonget(questquery,'/userid')) + ' and '
        selectSQL1 += ' ('+Connection.escape(util.jsonget(questquery,'/startdt')) +' between b.DtFrom and b.DtTo ';  
        selectSQL1 += ' and ' + Connection.escape(util.jsonget(questquery,'/enddt')) + ' between b.DtFrom and b.DtTo) ';
        selectSQL1 += ' order by a.FromDt,a.ToDt ';

        util.log('debug',selectSQL1);
            var query = Connection.query(selectSQL1);
            query
              .on('error', function(sqlerr) {
                // Handle error, an 'end' event will be emitted after this as well
                results = sqlerr;
                util.log('log','Connect error '+ sqlerr);
                util.jsonadd(results,'/sqlstmt',selectSQL1);
                
              })
              .on('result', function(rows) {
                // Pausing the connnection is useful if your processing involves I/O
                //connection.pause();
                util.jsonadd(results,'/queryresult'+i+'/FromDT',rows.FromDt);
                util.jsonadd(results,'/queryresult'+i+'/ToDT',rows.ToDt);
                util.jsonadd(results,'/queryresult'+i+'/AMFrom',rows.AMFrom);
                util.jsonadd(results,'/queryresult'+i+'/AMTo',rows.AMTo);
                util.jsonadd(results,'/queryresult'+i+'/MiddleFrom',rows.MiddleFrom);
                util.jsonadd(results,'/queryresult'+i+'/MiddleTo',rows.MiddleTo);
                util.jsonadd(results,'/queryresult'+i+'/PMFrom',rows.PMFrom);
                util.jsonadd(results,'/queryresult'+i+'/PMTo',rows.PMTo);
                util.jsonadd(results,'/queryresult'+i+'/AlarmWH',rows.AlarmWH);
                util.jsonadd(results,'/queryresult'+i+'/OvertimeWHUnit',rows.OvertimeWHUnit);
                util.jsonadd(results,'/queryresult'+i+'/OvertimeStartTime',rows.OvertimeStartTime);
                util.jsonadd(results,'/queryresult'+i+'/OvertimeStartWH',rows.OvertimeStartWH);
                util.jsonadd(results,'/queryresult'+i+'/OvertimeDuration',rows.OvertimeDuration);

                i=i+1;
              })
              .on('end', function(rows) {
                
                  if(i>0){

                      util.jsonadd(results,'/rowcount',i);
                      util.jsonadd(results,'/errmsg','setting get Succ');
                      util.jsonadd(results,'/errno','200');
                      util.jsonadd(results,'/module','getWHSetting');
                   }
                   else
                   {

                      util.jsonadd(results,'/rowcount',0);
                      util.jsonadd(results,'/errmsg','setting get Empty');
                      util.jsonadd(results,'/errno','200');
                      util.jsonadd(results,'/module','getWHSetting');

                   }  
                  
                  Connection.release();
                  callback('',results);  
              });
        }
        
      });

    }
        ],function(sqlerr,results){

          if(sqlerr == null||sqlerr == '' ){
           
            util.log('log','getWHSetting returns');
            util.log('log',JSON.stringify(results));
            callback(results);
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;
            util.log('log','getWHSetting returns');
            util.jsonadd(results,'/errno','400');
            util.jsonadd(results,'/errmsg','setting get Error');
            util.jsonadd(results,'/module','getWHSetting');


            util.log('log','getWHSetting returns');
            util.log('log',JSON.stringify(results));
            callback(results);
          }


            

            
      }); //async.series end

}


//取得需要出勤的日历
/*
输入参数，开始日期，结束日期
*/
function getCalendar(questquery,response,callback){ 
  var i = 0;
  var results ={
    errno:'',
    errmsg:''
  };
  var pool;
  var Connection;
  var selectSQL1;

  async.series([

      function(callback){
      var sqlerr;
      var row;
      var err;
      var res;

      //var pool = mysql.createPool(config.getDBConfig());
      
      var pool = mysqlconn.poolConnection();

      pool.getConnection(function(sqlerr, Connection) {
        // connected! (unless `err` is set)
        if(sqlerr!=null){
          util.log('log','get ConnectPool error');
          util.log('log',sqlerr);
          err = sqlerr;  
          //util.jsonadd(err);
          callback(sqlerr, null);

        }else
        {

        selectSQL1 = ' select ymd,weekdate,dtdaytype from MstCalendar '; 
        selectSQL1 += ' where ymd between ' + Connection.escape(util.jsonget(questquery,'/startdt'));  
        selectSQL1 += ' and ' + Connection.escape(util.jsonget(questquery,'/enddt'));

        util.log('debug',selectSQL1);
            var query = Connection.query(selectSQL1);
            query
              .on('error', function(sqlerr) {
                // Handle error, an 'end' event will be emitted after this as well
                results = sqlerr;
                util.log('log','Connect error '+ sqlerr);
                util.jsonadd(results,'/sqlstmt',selectSQL1);
              })
              .on('result', function(rows) {
                // Pausing the connnection is useful if your processing involves I/O
                //connection.pause();
                util.jsonadd(results,'/queryresult'+i+'/ymd',rows.ymd);
                util.jsonadd(results,'/queryresult'+i+'/weekdate',rows.weekdate);
                util.jsonadd(results,'/queryresult'+i+'/dtdaytype',rows.dtdaytype);
              
                i=i+1;
              })
              .on('end', function(rows) {
                  if(i>0){


                      util.jsonadd(results,'/errno','200');
                      util.jsonadd(results,'/errmsg','Calendar get Succ');
                      util.jsonadd(results,'/module','getCalendar');
                      util.jsonadd(results,'/rowcount',i);
                   }
                   else
                   {
                      util.jsonadd(results,'/errno','400');
                      util.jsonadd(results,'/errmsg','Calendar get Error');
                      util.jsonadd(results,'/module','getCalendar');
                      util.jsonadd(results,'/rowcount',i);
                   }   
                  Connection.release();
                  callback(null,results);  
              });
        }
        
      });

    }
        ],function(sqlerr,results){

          if(sqlerr == null||sqlerr == '' ){

           if(util.jsonexist(results,'/errno') != true){
              util.jsonadd(results,'/errno','200');
            }
            util.log('log','getCalendar returns');
            util.log('log',results);
            callback(results);
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;
            util.log('log','getCalendar returns');
            util.log('log',results);
            callback(results);
          }
      }); //async.series end

}

exports.login=login;
exports.getWHSetting=getWHSetting;
exports.getCalendar = getCalendar;