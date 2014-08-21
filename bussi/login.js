/*1.login 模块
*/

var mysql = require('mysql');
var mysqlconn = require('../dbutil/mysqlconn.js');
var sys = require('sys');
var util = require('../util/util.js');
var async = require('async');
var Wind = require('wind');
var config = require('../config/config.js');
var moment = require('moment');

global.UserValidatedList={
  };

global.userToken = {
  userid:'',
  uuid:'',
  LoginDate:''
  };

//使用连接池方式
/*
输入参数 员工的邮箱，密码
*/
function login(questquery,response,callback){
  var i = 0;
  var result ={
    errno:'',
    errmsg:'',
    queryresult:{
        username:'',
        uuid:'',
        userid:''
    }
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

      //var pool = mysqlconn.poolConnection();
      //先检验IVGGS的用户名密码的正确性
      var pool = mysql.createPool(config.getivggsDBConfig());

      pool.getConnection(function(sqlerr, Connection) {
        // connected! (unless `err` is set)
        if(sqlerr!=null){
          util.log('info','get ConnectPool error');
          util.log('info',sqlerr);
          err = sqlerr;
          //util.jsonadd(err);
          callback(sqlerr, null);

        }else
        {
        selectSQL1 = 'select uuid() as uuid,lp.emailAddress ' ;
        selectSQL1 = selectSQL1 +' from lportal.user_ lp '
        selectSQL1 = selectSQL1 + ' where emailAddress = ';
        selectSQL1 = selectSQL1 + Connection.escape(util.jsonget(questquery,'/username'));
        selectSQL1 = selectSQL1 + ' and password_ = ' + Connection.escape(util.jsonget(questquery,'/credential')) ;
        selectSQL1 = selectSQL1 + ' and active_ = 1';


        util.log('debug',selectSQL1);
            var query = Connection.query(selectSQL1);
            query
              .on('error', function(sqlerr) {
                // Handle error, an 'end' event will be emitted after this as well
                result = sqlerr;
                util.log('info','Connect error '+ sqlerr);
                util.jsonadd(result,'/sqlstmt',selectSQL1);
                callback(sqlerr,null);
              })
              .on('result', function(rows) {
                // Pausing the connnection is useful if your processing involves I/O
                //connection.pause();
                util.jsonadd(result,'/queryresult/username',rows.emailAddress);
                //util.jsonadd(results,'/queryresult/userid',rows.EmployeeID);
                util.jsonadd(result,'/queryresult/uuid',rows.uuid);
                util.log('debug','ivggs user check return ' + rows.emailAddress + '  ' + rows.uuid);
                i=i+1;
              })
              .on('end', function(rows) {
                    if(i==1){
                              //ivggs用户名密码存在后，检查工数的有效性
                            util.log('info','ivggs password check passed ');
                            Connection.release();
                            var poolwhs = mysql.createPool(config.getDBConfig());
                            i=0;
                              poolwhs.getConnection(function(sqlerr, Connectionwhs) {
                                // connected! (unless `err` is set)
                                if(sqlerr!=null){
                                  util.log('info','get ConnectPool error');
                                  util.log('info',sqlerr);
                                  err = sqlerr;
                                  //util.jsonadd(err);
                                  callback(sqlerr, null);

                                }else
                                {

                                selectSQL1 = 'select emorg.employeeid from rtnemployeeorg emorg,trnemployee em ';
                                selectSQL1 +=' where emorg.delflg =0 and em.DelFlg =0 ';
                                selectSQL1 +=' and em.EmployeeID = emorg.EmployeeID ';
                                selectSQL1 +=' and em.LoginName = '+ Connection.escape(util.jsonget(questquery,'/username'));
                                selectSQL1 +=' and "' + moment().format('YYYYMMDD') + '" between emorg.usefulfromdt and emorg.usefultodt ';
                                selectSQL1 +=' group by 1 ';


                                util.log('debug',selectSQL1);
                                    var query = Connectionwhs.query(selectSQL1);
                                    query
                                      .on('error', function(sqlerr) {
                                        // Handle error, an 'end' event will be emitted after this as well
                                        result = sqlerr;
                                        util.log('info','Connect error '+ sqlerr);
                                        util.jsonadd(result,'/sqlstmt',selectSQL1);
                                        callback(sqlerr,null);
                                      })
                                      .on('result', function(rows) {
                                        // Pausing the connnection is useful if your processing involves I/O
                                        //connection.pause();
                                        //util.jsonadd(results,'/queryresult/username',rows.LoginName);
                                        util.jsonadd(result,'/queryresult/userid',rows.employeeid);
                                        //util.jsonadd(results,'/queryresult/uuid',rows.uuid);
                                        util.log('debug','whs user check return ' + rows.employeeid );
                                        i=i+1;
                                      })
                                      .on('end', function(rows) {
                                            if(i==1){
                                              util.jsonadd(result,'/errno','200');
                                              util.jsonadd(result,'/errmsg','User Valid');
                                              util.jsonadd(result,'/module','login');

                                              util.jsonadd(userToken,'/userid',util.jsonget(result,'/queryresult/userid'));
                                              util.jsonadd(userToken,'/uuid',util.jsonget(result,'/queryresult/uuid'));
                                              util.jsonadd(userToken,'/LoginDate',moment().format('YYYY-MM-DD'));

                                              util.jsonadd(UserValidatedList,'/UserValidatedList'+'/userid'+util.jsonget(result,'/queryresult/userid'),userToken);

                                              process.send(UserValidatedList);
                                              util.log('debug','UserValidatedList refreshed '+ JSON.stringify(UserValidatedList));

                                            }else
                                            {
                                              util.log('info','whs user check return error');
                                              util.jsonadd(result,'/errno','300');
                                              util.jsonadd(result,'/errmsg','User InValid');
                                              util.jsonadd(result,'/module','login');
                                              util.jsonadd(result,'/queryresult',null);
                                            }
                                          Connectionwhs.release();
                                          callback(null,result);
                                      });

                                }

                              });

/*
                      util.jsonadd(results,'/errno','200');
                      util.jsonadd(results,'/errmsg','User Valid');
                      util.jsonadd(results,'/module','login');

                      util.jsonadd(userToken,'/userid',util.jsonget(results,'/queryresult/userid'));
                      util.jsonadd(userToken,'/uuid',util.jsonget(results,'/queryresult/uuid'));
                      util.jsonadd(userToken,'/LoginDate',moment().format('YYYY-MM-DD'));

                      util.jsonadd(UserValidatedList,'/UserValidatedList'+'/userid'+util.jsonget(results,'/queryresult/userid'),userToken);

                      process.send(UserValidatedList);
                      util.log('debug','UserValidatedList refreshed '+ JSON.stringify(UserValidatedList));
*/
                    }else
                    {
                     util.log('info','ivggs user check return error');
                          util.jsonadd(result,'/errno','300');
                          util.jsonadd(result,'/errmsg','User InValid');
                          util.jsonadd(result,'/module','login');
                          util.jsonadd(result,'/queryresult',null);
                          Connection.release();
                          callback(null,result);
                    }
                  //callback(null,results);
              });
        }

      });

    },

        ],function(sqlerr,results){

          if(sqlerr == null||sqlerr == '' ){

            util.log('info','login returns');
            util.log('info',JSON.stringify(results));
            //util.log('info','userToken is ' + JSON.stringify(userToken));
            callback(results[0]);
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;
            util.log('info','login returns');
            util.jsonadd(results,'/errno','400');
            util.log('info',JSON.stringify(results));
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
          util.log('info','get ConnectPool error');
          util.log('info',sqlerr);
          err = sqlerr;
          //util.jsonadd(err);
          callback(sqlerr, null);

        }else
        {

        selectSQL1 = ' SELECT a.WHSettingID,a.DtSettlementType, ';
        selectSQL1 += ' a.AMFrom,a.AMTo,a.MiddleFrom,a.MiddleTo,a.PMFrom,a.PMTo, a.AlarmWH,';
        selectSQL1 += ' a.FromDt,a.ToDt,a.OvertimeDuration,a.OvertimeStartTime,a.OvertimeWHUnit,a.OvertimeStartWH, ';
        selectSQL1 += ' b.EmployeeID,b.DtFrom,b.DtTo , ';
        selectSQL1 += ' (((a.AMTo - a.AMFrom)  + (a.PMTo - a.PMFrom)) % 100)/60  + floor(((a.AMTo - a.AMFrom)  + (a.PMTo - a.PMFrom)) / 100) as avgHour';
        selectSQL1 += ' FROM mstwhsetting a,rtnemwh b ';
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
                util.log('info','Connect error '+ sqlerr);
                util.jsonadd(results,'/sqlstmt',selectSQL1);
                callback(sqlerr,null);
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
                util.jsonadd(results,'/queryresult'+i+'/avgHour',rows.avgHour );
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
                      util.jsonadd(results,'/errno','300');
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

            util.log('info','getWHSetting returns');
            util.log('info',JSON.stringify(results));
            callback(results[0]);
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;
            util.jsonadd(results,'/errno','400');
            util.jsonadd(results,'/errmsg','setting get Error');
            util.jsonadd(results,'/module','getWHSetting');


            util.log('info','getWHSetting returns Error');
            util.log('info',JSON.stringify(results));
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

  util.log('debug','getCalendar get ' + JSON.stringify(questquery));
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
          util.log('info','get ConnectPool error');
          util.log('info',sqlerr);
          err = sqlerr;
          //util.jsonadd(err);
          callback(sqlerr, null);

        }else
        {

        selectSQL1 = ' select ymd,weekdate,dtdaytype from MstCalendar ';
        selectSQL1 += ' where ymd between ' + Connection.escape(util.jsonget(questquery,'/startdt'));
        selectSQL1 += ' and ' + Connection.escape(util.jsonget(questquery,'/enddt'));

        if(util.jsonexist(questquery,'/dtdaytype')){
          selectSQL1 += ' and dtdaytype = ' + Connection.escape(util.jsonget(questquery,'/dtdaytype'));
        }

        util.log('debug',selectSQL1);
            var query = Connection.query(selectSQL1);
            query
              .on('error', function(sqlerr) {
                // Handle error, an 'end' event will be emitted after this as well
                results = sqlerr;
                util.log('info','Connect error '+ sqlerr);
                util.jsonadd(results,'/sqlstmt',selectSQL1);
                callback(sqlerr,null);
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
                      util.jsonadd(results,'/errno','300');
                      util.jsonadd(results,'/errmsg','Calendar get Empty');
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
            util.log('info','getCalendar returns');
            util.log('info',results);
            callback(results[0]);
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;
            util.log('info','getCalendar returns');
            util.jsonadd(results,'/errno','400');
            util.jsonadd(results,'/errmsg','Calendar get Error');
            util.jsonadd(results,'/module','getCalendar');
            util.log('info',results);
            callback(results);
          }
      }); //async.series end

}

//取得可以填写的项目信息

//PJG中包含的pj项目必须至少有1个非0的预订工数
/*
输入参数，当前日
*/
function getAvailPJ(questquery,response,callback){
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
          util.log('info','get ConnectPool error');
          util.log('info',sqlerr);
          err = sqlerr;
          //util.jsonadd(err);
          callback(sqlerr, null);

        }else
        {

        selectSQL1 = ' select pj.PJInfoID,pj.PJNo,pj.Name from trnpjperson pjp,trnpjinfo pj ';
        selectSQL1 += ' where pjp.PJInfoID = pj.pjinfoid ';
        selectSQL1 += ' and flgfinish = 1 ';
        selectSQL1 += ' and pjgid =0 ';
        selectSQL1 += ' and pjp.EmployeeID = ' + Connection.escape(util.jsonget(questquery,'/userid'));
        selectSQL1 += ' and delflg !=1 ';
        if(util.jsonexist(questquery,'/pjinfoid'))
        {
          selectSQL1 += ' and pj.PJInfoID =  ' +  Connection.escape(util.jsonget(questquery,'/pjinfoid'));
        }
        selectSQL1 += ' union ';
        selectSQL1 += ' select pjg.pjgid,pjg.pjgcode,pjg.name ';
        selectSQL1 += ' from trnpjg pjg,trnpjinfo pj,trnpjperson pjp ';
        selectSQL1 += ' where pj.pjgid = pjg.pjgid ';
        selectSQL1 += ' and pj.delflg !=1 ';
        selectSQL1 += ' and pjp.PJInfoID = pj.pjinfoid ';
        selectSQL1 += ' and pjp.EmployeeID = ' + Connection.escape(util.jsonget(questquery,'/userid'));
        if(util.jsonexist(questquery,'/pjinfoid'))
        {
          selectSQL1 += ' and pjg.pjgid =  ' +  Connection.escape(util.jsonget(questquery,'/pjinfoid'));
        }
        selectSQL1 += ' and pj.pjinfoid in ( ';
        selectSQL1 += ' select pjinfoid from trnpjdetail ';
        selectSQL1 += ' where FlgPartner = 1 ';
        selectSQL1 += ' and expWH !=0 ';
        selectSQL1 += ' and objym = ' + Connection.escape(moment(util.jsonget(questquery,'/currentdt'),'YYYYMMDD').format('YYYYMM'));
        selectSQL1 += ' and  employeeid = ' + Connection.escape(util.jsonget(questquery,'/userid'));
        selectSQL1 += ' ) ';
        selectSQL1 += ' group by 1,2,3 ';


        util.log('debug',selectSQL1);
            var query = Connection.query(selectSQL1);
            query
              .on('error', function(sqlerr) {
                // Handle error, an 'end' event will be emitted after this as well
                results = sqlerr;
                util.log('info','Connect error '+ sqlerr);
                util.jsonadd(results,'/sqlstmt',selectSQL1);
                callback(sqlerr,null);
              })
              .on('result', function(rows) {
                // Pausing the connnection is useful if your processing involves I/O
                //connection.pause();
                util.jsonadd(results,'/queryresult'+i+'/PJInfoID',rows.PJInfoID);
                util.jsonadd(results,'/queryresult'+i+'/PJNo',rows.PJNo);
                util.jsonadd(results,'/queryresult'+i+'/Name',rows.Name);

                i=i+1;
              })
              .on('end', function(rows) {
                  if(i>0){


                      util.jsonadd(results,'/errno','200');
                      util.jsonadd(results,'/errmsg','AvailPJ get Succ');
                      util.jsonadd(results,'/module','getAvailPJ');
                      util.jsonadd(results,'/rowcount',i);
                   }
                   else
                   {
                      util.jsonadd(results,'/errno','300');
                      util.jsonadd(results,'/errmsg','AvailPJ get Empty');
                      util.jsonadd(results,'/module','getAvailPJ');
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
            util.log('info','getAvailPJ returns');
            util.log('info',JSON.stringify(results));
            callback(results[0]);
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;
            util.log('info','getAvailPJ returns');
            util.jsonadd(results,'/errno','400');
            util.jsonadd(results,'/errmsg','getAvailPJ get Error');
            util.jsonadd(results,'/module','getAvailPJ');
            util.log('info',results);
            callback(results);
          }
      }); //async.series end

}

exports.login=login;
exports.getWHSetting=getWHSetting;
exports.getCalendar = getCalendar;
exports.getAvailPJ = getAvailPJ;