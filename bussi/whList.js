/* 工时一览模块
  包含
  1.取得员工当月每日填写的工时的详细信息，用于日历方式显示
json 格式为：
{ errno : '200',
  errmsg: 'getEmptyWorkTime complete',
  module: 'getEmptyWorkTime',
  queryresult0 :{
	"EmptyDate":"20140201"
  },
  queryresult1 :{
	.....
  }
}

2. 取得当月已填写的加班合计
3. 取得当月填写的休假合计
4. 取得填写的项目的预实数据
5. 取的每天最早和最晚的门禁时间

*/

var mysql = require('mysql');
var mysqlconn = require('../dbutil/mysqlconn.js');
var sys = require('sys');
var util = require('../util/util.js');
var async = require('async');
var config = require('../config/config.js')
var moment = require('moment');
var login = require('./login.js');

//带有callback  取得员工当月每日填写的工时的详细信息，用于日历方式显示

function getWHDetailList(questquery,response,callback){
  var i = 0;
  var results ={
    errno:'',
    errmsg:''
  };
  var pool;
  var Connection;
  var selectSQL1;

	async.series([
      //取得每天详细的考勤记录
    	function(callback){
			var sqlerr;
			var row;
			var err;
			var res;

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
          //出勤申请 行列转换 方便后续计算是否满出勤
        selectSQL1 = ' select EmployeeID,ObjYMD, ';
        selectSQL1 += ' max(case whtype when "1" then formid else 0 end) whid, ';
        selectSQL1 += ' max(case whtype when "1" then WH else 0 end) abswh, ';
        selectSQL1 += ' max(case whtype when "1" then DtAppStatus else 0 end) whStatus, ';
        selectSQL1 += ' max(case whtype when "1" then FlgHR else 0 end) whFlgHR, ';
        selectSQL1 += ' max(case whtype when "1" then FromDt else 0 end) whFromDt, ';
        selectSQL1 += ' max(case whtype when "1" then ToDt else 0 end) whToDt, ';
        selectSQL1 += ' max(case whtype when "1" then PJInfoID else 0 end) whPJInfoID, ';
        selectSQL1 += ' max(case whtype when "1" then FlgOut else 0 end) whFlgOut, ';
        selectSQL1 += ' max(case whtype when "1" then FlgPJG else 0 end) whFlgPJG, ';

        selectSQL1 += ' max(case whtype when "2" then formid else 0 end) ovid, ';
        selectSQL1 += ' max(case whtype when "2" then WH else 0 end) ovwh, ';
        selectSQL1 += ' max(case whtype when "2" then DtAppStatus else 0 end) ovStatus, ';
        selectSQL1 += ' max(case whtype when "2" then FlgHR else 0 end) ovFlgHR, ';
        selectSQL1 += ' max(case whtype when "2" then FromDt else 0 end) ovFromDt, ';
        selectSQL1 += ' max(case whtype when "2" then ToDt else 0 end) ovToDt, ';
        selectSQL1 += ' max(case whtype when "2" then PJInfoID else 0 end) ovPJInfoID, ';
        selectSQL1 += ' max(case whtype when "2" then FlgOut else 0 end) ovFlgOut, ';
        selectSQL1 += ' max(case whtype when "2" then FlgPJG else 0 end) ovFlgPJG, ';

        selectSQL1 += ' max(case whtype when "3" then formid else 0 end) vcid, ';
        selectSQL1 += ' max(case whtype when "3" then WH else 0 end) vcwh, ';
        selectSQL1 += ' max(case whtype when "3" then DtAppStatus else 0 end) vcStatus, ';
        selectSQL1 += ' max(case whtype when "3" then FlgHR else 0 end) vcFlgHR, ';
        selectSQL1 += ' max(case whtype when "3" then FromDt else 0 end) vcFromDt, ';
        selectSQL1 += ' max(case whtype when "3" then ToDt else 0 end) vcToDt, ';
        selectSQL1 += ' max(case whtype when "3" then PJInfoID else 0 end) vcPJInfoID, ';
        selectSQL1 += ' max(case whtype when "3" then FlgOut else 0 end) vcFlgOut, ';
        selectSQL1 += ' max(case whtype when "3" then FlgPJG else 0 end) vcFlgPJG ';

        selectSQL1 += ' from   ';
        selectSQL1 += ' ( ';
        selectSQL1 += ' select wh.WHFormID as formid,wh.EmployeeID,wh.ObjYMD,whd.WH as WH,wh.DtAppStatus,wh.FlgHR, ';
        selectSQL1 += ' whd.FromDt,whd.ToDt,whd.PJInfoID,whd.FlgOut,whd.FlgPJG,1 as whtype ';
        selectSQL1 += ' from trnwhform wh,trnwhformdetail whd ';
        selectSQL1 += ' where wh.WHFormID = whd.WHFormID ';
        selectSQL1 += ' and wh.DelFlg !=1 and whd.DelFlg!=1 ';
        selectSQL1 += ' union all ';
        selectSQL1 += ' select ov.OVFormID as formid,ov.EmployeeID,ov.ObjYMD,ov.OVWH as WH, ov.DtAppStatus,ov.FlgHR, ';
        selectSQL1 += ' ovd.FromDt,ovd.ToDt,ovd.PJInfoID,ovd.FlgOut,ovd.FlgPJG,2 as whtype ';
        selectSQL1 += ' from trnovform ov,trnovformdetail ovd ';
        selectSQL1 += ' where ov.OVFormID = ovd.OVFormID ';
        selectSQL1 += ' and ov.DelFlg !=1 and ovd.DelFlg!=1 ';
        selectSQL1 += ' union all ';
        selectSQL1 += ' select vc.VCFormID as formid,vc.EmployeeID,vcd.ObjYMD,vcd.VCTime as WH, vc.DtAppStatus,vcd.FlgHR, ';
        selectSQL1 += ' vcd.VCFromDt,vcd.VCToDt,null as PJInfoID,null as FlgOut,null as FlgPJG,3 as whtype ';
        selectSQL1 += ' from trnvcform vc,trnvcformdetail vcd ';
        selectSQL1 += ' where vc.VCFormID = vcd.VCFormID ';
        selectSQL1 += ' and vc.DelFlg !=1 and vcd.DelFlg!=1 ';
        selectSQL1 += ' ) detail ';
        selectSQL1 += ' where EmployeeID ='  + Connection.escape(util.jsonget(questquery,'/userid'))
        selectSQL1 += ' and ObjYMD between ' + Connection.escape(util.jsonget(questquery,'/startdt')) + ' and ' + Connection.escape(util.jsonget(questquery,'/enddt'))
        selectSQL1 += ' group by detail.EmployeeID,ObjYMD ';

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
                util.jsonadd(results,'/queryresult'+i+'/EmployeeID',rows.EmployeeID);
                util.jsonadd(results,'/queryresult'+i+'/ObjYMD',rows.ObjYMD);

                util.jsonadd(results,'/queryresult'+i+'/whid',rows.whid);
                util.jsonadd(results,'/queryresult'+i+'/whtype',rows.whtype);
                util.jsonadd(results,'/queryresult'+i+'/abswh',rows.abswh);
                util.jsonadd(results,'/queryresult'+i+'/whStatus',rows.whStatus);
                util.jsonadd(results,'/queryresult'+i+'/whFlgHR',rows.whFlgHR);
                util.jsonadd(results,'/queryresult'+i+'/whFromDt',rows.whFromDt);
                util.jsonadd(results,'/queryresult'+i+'/whToDt',rows.whToDt);
                util.jsonadd(results,'/queryresult'+i+'/whPJInfoID',rows.whPJInfoID);
                util.jsonadd(results,'/queryresult'+i+'/whFlgOut',rows.whFlgOut);
                util.jsonadd(results,'/queryresult'+i+'/whFlgPJG',rows.whFlgPJG);

                util.jsonadd(results,'/queryresult'+i+'/ovwh',rows.ovwh);
                util.jsonadd(results,'/queryresult'+i+'/ovid',rows.ovid);
                util.jsonadd(results,'/queryresult'+i+'/ovStatus',rows.ovStatus);
                util.jsonadd(results,'/queryresult'+i+'/ovFlgHR',rows.ovFlgHR);
                util.jsonadd(results,'/queryresult'+i+'/ovFromDt',rows.ovFromDt);
                util.jsonadd(results,'/queryresult'+i+'/ovToDt',rows.ovToDt);
                util.jsonadd(results,'/queryresult'+i+'/ovPJInfoID',rows.ovPJInfoID);
                util.jsonadd(results,'/queryresult'+i+'/ovFlgOut',rows.ovFlgOut);
                util.jsonadd(results,'/queryresult'+i+'/ovFlgPJG',rows.ovFlgPJG);

                util.jsonadd(results,'/queryresult'+i+'/vcid',rows.vcid);
                util.jsonadd(results,'/queryresult'+i+'/vcwh',rows.vcwh);
                util.jsonadd(results,'/queryresult'+i+'/vcStatus',rows.vcStatus);
                util.jsonadd(results,'/queryresult'+i+'/vcFlgHR',rows.vcFlgHR);
                util.jsonadd(results,'/queryresult'+i+'/vcFromDt',rows.vcFromDt);
                util.jsonadd(results,'/queryresult'+i+'/vcToDt',rows.vcToDt);
                util.jsonadd(results,'/queryresult'+i+'/vcPJInfoID',rows.vcPJInfoID);
                util.jsonadd(results,'/queryresult'+i+'/vcFlgOut',rows.vcFlgOut);
                util.jsonadd(results,'/queryresult'+i+'/vcFlgPJG',rows.vcFlgPJG);
                //util.jsonadd(results,'/queryresult'+i+'/uuid',rows.uuid_);
                i=i+1;
              })
              .on('end', function(rows) {

                  if(i>0){
                    util.jsonadd(results,'/errno','200');
                    util.jsonadd(results,'/errmsg','getWHDetailList complete');
                    util.jsonadd(results,'/rowcount',i);
                    util.jsonadd(results,'/module','getWHDetailList');
                  }
                  else
                  {
                    util.jsonadd(results,'/errno','300');
                    util.jsonadd(results,'/errmsg','getWHDetailList Empty');
                    util.jsonadd(results,'/rowcount',0);
                    util.jsonadd(results,'/module','getWHDetailList');
                  }

                  Connection.release();
                  callback(null,results);
              });
        }

      });
  }


			  ],function(sqlerr,results){

			    if(sqlerr == null||sqlerr == '' ){


            util.log('info','getWHDetailList returns');
            util.log('info',JSON.stringify(results));
			      callback(results);
			    }
			    else
			    {
			      //global.queryDBStatus = 'err';
			      util.log('error',"err  = "+ sqlerr);
			      results = sqlerr;
            util.jsonadd(results,'/errno','400');
            util.jsonadd(results,'/errmsg','getWHDetailList error');
              // util.jsonadd(results,'/rowcount',i);
            util.jsonadd(results,'/module','getWHDetailList');
            util.log('info','getWHDetailList returns');
            util.log('info',JSON.stringify(results));
            callback(results);
			    }
  		}); //async.series end

}

//加班时间合计
function getTotalOVTime(questquery,response,callback){
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
          //出勤申请 行列转换 方便后续计算是否满出勤
        selectSQL1 = ' select EmployeeID, ';
        selectSQL1 += ' sum(wh) TotalOVTime ';
        selectSQL1 += ' from ';
        selectSQL1 += ' ( ';
        selectSQL1 += ' select ov.EmployeeID,ov.ObjYMD,ov.OVWH as WH, ov.DtAppStatus,ov.FlgHR, ';
        selectSQL1 += ' ovd.FromDt,ovd.ToDt,ovd.PJInfoID,ovd.FlgOut,ovd.FlgPJG,"2" as whtype ';
        selectSQL1 += ' from trnovform ov,trnovformdetail ovd ';
        selectSQL1 += ' where ov.OVFormID = ovd.OVFormID ';
        selectSQL1 += ' and ov.DelFlg !=1 and ovd.DelFlg!=1 ';
        selectSQL1 += ' ) detail ';
        selectSQL1 += ' where EmployeeID ='  + Connection.escape(util.jsonget(questquery,'/userid'))
        selectSQL1 += ' and ObjYMD between ' + Connection.escape(util.jsonget(questquery,'/startdt')) + ' and ' + Connection.escape(util.jsonget(questquery,'/enddt'))
        selectSQL1 += ' group by detail.EmployeeID ';

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
                util.jsonadd(results,'/queryresult'+i+'/EmployeeID',rows.EmployeeID);
                util.jsonadd(results,'/queryresult'+i+'/TotalOVTime',rows.TotalOVTime);
                //util.jsonadd(results,'/queryresult'+i+'/uuid',rows.uuid_);
                i=i+1;
              })
              .on('end', function(rows) {
                  if(i>0){


                           util.jsonadd(results,'/errno','200');
                           util.jsonadd(results,'/errmsg','getTotalOVTime complete');
                           util.jsonadd(results,'/rowcount',i);
                           util.jsonadd(results,'/module','getTotalOVTime');


                      }
                      else
                      {
                        util.jsonadd(results,'/errno','200');
                           util.jsonadd(results,'/errmsg','getTotalOVTime Empty');
                           util.jsonadd(results,'/rowcount',0);
                           util.jsonadd(results,'/module','getTotalOVTime');

                      }
                  Connection.release();
                  callback(null,results);
              });
        }

      });
  }


        ],function(sqlerr,results){
           if(sqlerr == null||sqlerr == '' ){
                util.log('info','getTotalOVTime returns');
                        util.log('info',JSON.stringify(results));
                        callback(results);
           }
           else
           {

          util.jsonadd(results,'/errno','400');
                        util.jsonadd(results,'/errmsg','getTotalOVTime error');
                          // util.jsonadd(results,'/rowcount',i);
                        util.jsonadd(results,'/module','getTotalOVTime');
                        util.log('info','getTotalOVTime returns');
                        util.log('info',JSON.stringify(results));
                        callback(results);

            }
      }); //async.series end

}

// 今年度取得有薪假明细
function getPaidVCTime(questquery,response,callback){
  var i = 0;
  var result ={
    errno:'',
    errmsg:''
  };
  var pool;
  var Connection;
  var selectSQL1;
  var avgHour;
  var LeftWH;
  var VCWH;

  async.waterfall([

       function (callback){  //先取得考勤规则数据

      //通过applydate取得月初和月末
      var appdate = moment(util.jsonget(questquery,'/currentdt'),'YYYYMMDD').format('YYYY-MM-DD');

      //util.jsonadd(questquery,'/startdt',moment(appdate).startOf('month').format('YYYY-MM-DD'));
      util.jsonadd(questquery,'/startdt',util.jsonget(questquery,'/currentdt'));
      //util.jsonadd(questquery,'/enddt',moment(appdate).endOf('month').format('YYYY-MM-DD'));
      util.jsonadd(questquery,'/enddt',util.jsonget(questquery,'/currentdt'));

            login.getWHSetting(questquery,response,
              function(cb){
                //util.log('debug','WHSetting get ' + JSON.stringify(cb));
                //util.log('debug','WHSetting get ' + util.jsonget(cb[0],'/errno'));
              if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') == 400){  //异常情况下
                  cb = {"errno":"400",
                    "errmsg:":util.jsonget(cb,'/errmsg'),
                    "module":"getPaidVCTimeHandle"
                  }

                  callback(cb,null);
              }else{
                if( util.jsonexist(cb[0],'/errno') && util.jsonget(cb[0],'/errno') == 200){   //非异常情况下返回

                  util.log('debug','getPaidVCTime.getWHSetting OK ' + JSON.stringify(cb));

                  //计算一天的小时数
                  avgHour = util.jsonget(cb[0],'/queryresult0/avgHour');
                  callback(null,avgHour);
                }else{
                  cb = {
                    "errno":"300",
                    "errmsg:":"getPaidVCTime.getWHSetting Error",
                    "module":"getPaidVCTimeHandle"
                  }

                  callback(cb,null);
                }
              }
              });
    },

      function (avgHour,callback){
      var sqlerr;
      var row;
      var err;
      var res;

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

/*
今年度有薪休假剩余天数：SUM（员工有薪休假表.给予工时-调休消耗工时）                                                                              员工有薪休假表.D假期承认状态：1已承认                            
                        -SUM（休假申请明细表.休假时间 （休假类型=1：有薪假&表单状态=1:未承认））


                      select SUM(IFNULL(UsefulWH, 0)-IFNULL(RestUsedWH, 0)) AS allUsefulHour from TrnPaidVC T1
                      where T1.EmployeeID=24 and T1.DtAppStatus=1 and T1.GetDt<='2014' and T1.DelFlg = '0'
                      and T1.UsefulEndDt >= '20140721' and T1.UsefulFromDt <= '20140721';

                      select IFNULL(SUM(T2.VCTime), 0) AS vcTime from TrnVCForm T1, TrnVCFormDetail T2
                      where T1.EmployeeID=24 and (T1.DtAppStatus=0 OR T1.DtAppStatus=1 OR T1.DtAppStatus=3 )
                      and T1.DelFlg = 0 and T1.VCFormID = T2.VCFormID and T2.ObjYMD LIKE "2014%"
                      and T2.DtVacationType=1 and T2.DelFlg = 0 ;
*/

        selectSQL1 = ' select IFNULL(max(LeftWH),0) as LeftWH,IFNULL(max(vcTime),0) as VCWH ';
        selectSQL1 += ' from ';
        selectSQL1 += ' ( ';
        selectSQL1 += ' select SUM(IFNULL(UsefulWH, 0)-IFNULL(RestUsedWH, 0)) AS LeftWH from TrnPaidVC T1 ';
        selectSQL1 += ' where  T1.DtAppStatus=1 and T1.DelFlg = 0  ';
        selectSQL1 += ' and T1.GetDt<=' + moment(util.jsonget(questquery,'/currentdt'),'YYYYMMDD').format('YYYY') ;
        selectSQL1 += ' and T1.EmployeeID= ' + Connection.escape(util.jsonget(questquery,'/userid'));
        selectSQL1 += ' and ' + moment(util.jsonget(questquery,'/currentdt'),'YYYYMMDD').format('YYYYMMDD') + ' between T1.UsefulFromDt and T1.UsefulEndDt  ';
        selectSQL1 += ' ) lef  ';
        selectSQL1 += ' , ';
        selectSQL1 += ' ( ';
        selectSQL1 += ' select IFNULL(SUM(T2.VCTime), 0) AS vcTime from TrnVCForm T1, TrnVCFormDetail T2 ';
        selectSQL1 += ' where (T1.DtAppStatus=0 OR T1.DtAppStatus=1 OR T1.DtAppStatus=3 ) ';
        selectSQL1 += ' and T1.DelFlg = 0 and T1.VCFormID = T2.VCFormID  ';
        selectSQL1 += ' and T2.DtVacationType=1 and T2.DelFlg = 0 ';
        selectSQL1 += ' and T2.ObjYMD LIKE  "'+ moment(util.jsonget(questquery,'/currentdt'),'YYYYMMDD').format('YYYY')  + '%"'; 
        selectSQL1 += ' and T1.EmployeeID=  '+ Connection.escape(util.jsonget(questquery,'/userid'));
        selectSQL1 += ' ) vc ';


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

                if(rows != null||rows != '' ){
                // Pausing the connnection is useful if your processing involves I/O
                //connection.pause();

                LeftWH = rows.LeftWH ;
                VCWH = rows.VCWH ;

                i=i+1;
               }
              })
              .on('end', function(rows) {
                console.log(LeftWH,VCWH);
                  if(i>0){

                           util.jsonadd(result,'/errno','200');
                           util.jsonadd(result,'/errmsg','getPaidVCTime complete');
                           util.jsonadd(result,'/LeftWH',LeftWH);
                           util.jsonadd(result,'/LeftDay',LeftWH/avgHour);
                           util.jsonadd(result,'/VCWH',VCWH);
                           util.jsonadd(result,'/VCDay',VCWH/avgHour);
                           util.jsonadd(result,'/module','getPaidVCTime');
                           callback(null,result);

                      }
                      else
                      {
                        util.jsonadd(result,'/errno','200');
                           util.jsonadd(result,'/errmsg','getPaidVCTime Empty');
                           util.jsonadd(result,'/LeftWH',0);
                           util.jsonadd(result,'/LeftDay',0);
                           util.jsonadd(result,'/VCWH',0);
                           util.jsonadd(result,'/VCDay',0);
                           util.jsonadd(result,'/module','getPaidVCTime');
                           callback(null,result);

                      }

                  Connection.release();

              });
        }
      });
  }


        ],function(sqlerr,result){

          if(sqlerr == null||sqlerr == '' ){

            util.log('info','getPaidVCTime returns');
            util.log('info',JSON.stringify(result));
            callback(result);
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;

            util.log('info',JSON.stringify(results));
            callback(results);
          }
      }); //async.series end

}

// 取得调休剩余天数
function getLieuVCTime(questquery,response,callback){
  var i = 0;
  var results ={
    errno:'',
    errmsg:''
  };
  var pool;
  var Connection;
  var selectSQL1;
  var avgHour;
  var LeftWH;
  var LeftWHin30;
  var LeftDay;
  var LeftDayin30;

  async.waterfall([

      function (callback){  //先取得考勤规则数据

      var appdate = moment(util.jsonget(questquery,'/currentdt'),'YYYYMMDD').format('YYYY-MM-DD');

      //util.jsonadd(questquery,'/startdt',moment(appdate).startOf('month').format('YYYY-MM-DD'));
      util.jsonadd(questquery,'/startdt',util.jsonget(questquery,'/currentdt'));
      //util.jsonadd(questquery,'/enddt',moment(appdate).endOf('month').format('YYYY-MM-DD'));
      util.jsonadd(questquery,'/enddt',util.jsonget(questquery,'/currentdt'));

            login.getWHSetting(questquery,response,
              function(cb){
                //util.log('debug','WHSetting get ' + JSON.stringify(cb));
                //util.log('debug','WHSetting get ' + util.jsonget(cb[0],'/errno'));
              if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') == 400){  //异常情况下
                  cb = {"errno":"400",
                    "errmsg:":util.jsonget(cb,'/errmsg'),
                    "module":"getLieuVCTimeHandle"
                  }

                  callback(cb,null);
              }else{
                if( util.jsonexist(cb[0],'/errno') && util.jsonget(cb[0],'/errno') == 200){   //非异常情况下返回

                  util.log('debug','getLieuVCTime.getWHSetting OK ' + JSON.stringify(cb));

                  //计算一天的小时数
                  avgHour = util.jsonget(cb[0],'/queryresult0/avgHour');
                  callback(null,avgHour);
                }else{
                  cb = {
                    "errno":"301",
                    "errmsg:":"getLieuVCTime.getWHSetting Error",
                    "module":"getLieuVCTimeHandle"
                  }

                  callback(cb,null);
                }
              }
              });
    },

      function (avgHour,callback){
      var sqlerr;
      var row;
      var err;
      var res;



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

/*
调休剩余天数：SUM（员工加班申请表.认可可调休工时-调休消耗工时） 员工出勤申请表.D表单状态：2已承认
                        -SUM（休假申请明细表.休假时间 （休假类型=2：调休&表单状态=1:未承认））
                       初始时间条件：系统时间在调休截止时间之前
                      select SUM(IFNULL(T1.ConfirmUseWH, 0)-IFNULL(T1.RestUsedWH, 0)) AS restHour30
                      from TrnOVForm T1, TrnWHForm T2 where T1.EmployeeID=24 and T1.DelFlg = 0
                      and T2.EmployeeID=24 and T1.ObjYMD=T2.ObjYMD and T2.DtAppStatus=2
                      and T2.DelFlg = 0 and T1.UsedEndTime>='2014-07-21'
*/

        selectSQL1 = ' select IFNULL(max(restHour),0) as LeftWH,IFNULL(max(restHour30),0) as LeftWHin30 ';
        selectSQL1 += ' from (  ';
        selectSQL1 += ' select SUM(IFNULL(T1.ConfirmUseWH, 0)-IFNULL(T1.RestUsedWH, 0)) AS restHour  ';
        selectSQL1 += ' from TrnOVForm T1, TrnWHForm T2  ';
        selectSQL1 += ' where T1.EmployeeID=T2.EmployeeID and T1.DelFlg = 0  ';
        selectSQL1 += ' and T1.ObjYMD=T2.ObjYMD and T2.DtAppStatus=2  ';
        selectSQL1 += ' and T2.DelFlg = 0  ';
        selectSQL1 += ' and T1.UsedEndTime >= '+Connection.escape(util.jsonget(questquery,'/currentdt'));
        selectSQL1 += ' and T2.EmployeeID=' + Connection.escape(util.jsonget(questquery,'/userid'));
        selectSQL1 += ' ) res, ';
        selectSQL1 += ' (select SUM(IFNULL(T1.ConfirmUseWH, 0)-IFNULL(T1.RestUsedWH, 0)) AS restHour30  ';
        selectSQL1 += ' from TrnOVForm T1, TrnWHForm T2  ';
        selectSQL1 += ' where T1.EmployeeID=T2.EmployeeID and T1.DelFlg = 0  ';
        selectSQL1 += ' and T1.ObjYMD=T2.ObjYMD and T2.DtAppStatus=2  ';
        selectSQL1 += ' and T2.DelFlg = 0  ';
        selectSQL1 += ' and T1.UsedEndTime BETWEEN ' + Connection.escape(util.jsonget(questquery,'/currentdt')) + ' and ' ;
        selectSQL1 +=  moment(util.jsonget(questquery,'/currentdt'),'YYYYMMDD').add('months', 1).format('YYYYMMDD');
        selectSQL1 += ' and T2.EmployeeID=' + Connection.escape(util.jsonget(questquery,'/userid'));
        selectSQL1 += ' ) res3 ';


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

                if(rows != null||rows != '' ){
                // Pausing the connnection is useful if your processing involves I/O
                //connection.pause();

                LeftWH = rows.LeftWH;
                LeftWHin30 = rows.LeftWHin30;
                i=i+1;
               }

              })
              .on('end', function(rows) {
                  if(i>0){
                            //根据考勤规则计算每天的小时

                           util.jsonadd(results,'/errno','200');
                           util.jsonadd(results,'/errmsg','getLieuVCTime complete');
                           util.jsonadd(results,'/LeftWH',LeftWH);
                           util.jsonadd(results,'/LeftDay',LeftWH/avgHour);
                           util.jsonadd(results,'/LeftWHin30',LeftWHin30);
                           util.jsonadd(results,'/LeftDayin30',LeftWHin30/avgHour);
                           util.jsonadd(results,'/module','getLieuVCTimeHandle');
                           console.log(results);
                           callback(null,results);

                      }
                      else
                      {
                        util.jsonadd(result,'/errno','200');
                           util.jsonadd(results,'/errmsg','getLieuVCTime complete');
                           util.jsonadd(results,'/LeftWH',0);
                           util.jsonadd(results,'/LeftDay',0);
                           util.jsonadd(results,'/LeftWHin30',0);
                           util.jsonadd(results,'/LeftDayin30',0);
                           util.jsonadd(results,'/module','getLieuVCTimeHandle');
                           callback(null,results);

                      }

                  Connection.release();

              });

        }
      });
  }


        ],function(sqlerr,results){

          if(sqlerr == null||sqlerr == '' ){

            util.log('info','getLieuVCTime returns');
            util.log('info',JSON.stringify(results));
            callback(results);
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;
            util.log('info',JSON.stringify(results));
            callback(results);
          }
      }); //async.series end

}

// 取得休假合计
function getTotalVCTime(questquery,response,callback){
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

        selectSQL1 = ' select vc.EmployeeID,vcd.ObjYMD,vcd.VCTime as WH, vc.DtAppStatus,vcd.FlgHR, ';
        selectSQL1 += ' vcd.VCFromDt,vcd.VCToDt ';
        selectSQL1 += ' from trnvcform vc,trnvcformdetail vcd ';
        selectSQL1 += ' where vc.VCFormID = vcd.VCFormID ';
        selectSQL1 += ' and vc.DelFlg !=1 and vcd.DelFlg!=1 ';
        selectSQL1 += ' where EmployeeID ='  + Connection.escape(util.jsonget(questquery,'/userid'))
        selectSQL1 += ' and ObjYMD between ' + Connection.escape(util.jsonget(questquery,'/startdt')) + ' and ' + Connection.escape(util.jsonget(questquery,'/enddt'))
        selectSQL1 += ' group by detail.EmployeeID ';

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

                if(rows != null||rows != '' ){
                // Pausing the connnection is useful if your processing involves I/O
                //connection.pause();
                util.jsonadd(results,'/queryresult'+i+'/EmployeeID',rows.EmployeeID);
                util.jsonadd(results,'/queryresult'+i+'/TotalVCTime',rows.TotalVCTime);
                util.jsonadd(results,'/queryresult'+i+'/TotalVCTime',rows.TotalVCTime);
                util.jsonadd(results,'/queryresult'+i+'/TotalVCTime',rows.TotalVCTime);
                //util.jsonadd(results,'/queryresult'+i+'/uuid',rows.uuid_);
                i=i+1;
               }
              })
              .on('end', function(rows) {

                  if(i>0){
                           util.jsonadd(results,'/errno','200');
                           util.jsonadd(results,'/errmsg','getTotalVCTime complete');
                           util.jsonadd(results,'/rowcount',i);
                           util.jsonadd(results,'/module','getTotalVCTime');
                      }
                      else
                      {
                        util.jsonadd(results,'/errno','200');
                           util.jsonadd(results,'/errmsg','getTotalVCTime Empty');
                           util.jsonadd(results,'/rowcount',0);
                           util.jsonadd(results,'/module','getTotalVCTime');
                      }
                  Connection.release();
                  callback(null,results);
              });
        }
      });
  }


        ],function(sqlerr,results){

          if(sqlerr == null||sqlerr == '' ){

            util.log('info','getTotalVCTime returns');
            util.log('info',JSON.stringify(results));
            callback(results);
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;
            util.jsonadd(results,'/errno','400');
            util.jsonadd(results,'/errmsg','getTotalVCTime error');
              // util.jsonadd(results,'/rowcount',i);
            util.jsonadd(results,'/module','getTotalVCTime');
            util.log('info','getTotalVCTime returns');
            util.log('info',JSON.stringify(results));
            callback(results);
          }
      }); //async.series end

}

//取得门禁数据
function getAccessRecord(questquery,response,callback){
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

        selectSQL1 = " select em.employeeid,rec.objDate,DATE_FORMAT(rec.InTime,'%H:%i:%s') as InTime, "
        selectSQL1 += " DATE_FORMAT(rec.OutTime,'%H:%i:%s') as OutTime ";
        selectSQL1 += ' from trnrecord rec,trnemployee em ';
        selectSQL1 += ' where rec.employeeNo = em.employeeNo '
        selectSQL1 += ' and em.employeeID = '  + Connection.escape(util.jsonget(questquery,'/userid'))
        selectSQL1 += ' and rec.objDate between ' + Connection.escape(util.jsonget(questquery,'/startdt')) + ' and ' + Connection.escape(util.jsonget(questquery,'/enddt'))
        selectSQL1 += ' order by rec.objDate ; ';

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

                if(rows != null||rows != '' ){
                // Pausing the connnection is useful if your processing involves I/O
                //connection.pause();
                util.jsonadd(results,'/queryresult'+i+'/EmployeeID',rows.employeeNo);
                util.jsonadd(results,'/queryresult'+i+'/objDate',rows.objDate);
                util.jsonadd(results,'/queryresult'+i+'/InTime',rows.InTime);
                util.jsonadd(results,'/queryresult'+i+'/OutTime',rows.OutTime);
                //util.jsonadd(results,'/queryresult'+i+'/uuid',rows.uuid_);
                i=i+1;
               }
              })
              .on('end', function(rows) {

                  if(i>0){
                           util.jsonadd(results,'/errno','200');
                           util.jsonadd(results,'/errmsg','getAccessRecord complete');
                           util.jsonadd(results,'/rowcount',i);
                           util.jsonadd(results,'/module','getAccessRecord');
                      }
                      else
                      {
                        util.jsonadd(results,'/errno','300');
                           util.jsonadd(results,'/errmsg','getAccessRecord Empty');
                           util.jsonadd(results,'/rowcount',0);
                           util.jsonadd(results,'/module','getAccessRecord');
                      }
                  Connection.release();
                  callback(null,results);
              });
        }
      });
  }


        ],function(sqlerr,results){

          if(sqlerr == null||sqlerr == '' ){

            util.log('info','getAccessRecord returns');
            util.log('info',JSON.stringify(results));
            callback(results);
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;
            util.jsonadd(results,'/errno','400');
            util.jsonadd(results,'/errmsg','getAccessRecord error');
              // util.jsonadd(results,'/rowcount',i);
            util.jsonadd(results,'/module','getAccessRecord');
            util.log('info','getAccessRecord returns');
            util.log('info',JSON.stringify(results));
            callback(results);
          }
      }); //async.series end

}

//保存门禁数据
function insertAccessRecord(questquery,response,callback){
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
      var done=0;

      var totalrow = util.jsonget(questquery,'/rowcount');

      var insertArray =
      {
        employeeno:'',
        objdate:'',
        inTime:'',
        OutTime:'',
        duration:'0',
        dtrecordtype:'0',
        dtoptstatus:'0',
        inputtime:'NOW()',
        fileid:''
      }

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

         insertSQL1 = ' replace into trnrecord ';
         //insertSQL1 += ' (employeeno,objdate,inTime,outtime,duration,dtrecordtype,dtoptstatus,inputtime,fileid) ';
         //insertSQL1 += ' values( ';
         //insertSQL1 += '  20120901,20140605,current_date(),current_date(),null,0,0,NOW(),null) ; ';
         insertSQL1 += ' set ? ';

        util.log('debug',insertSQL1);

            Connection.beginTransaction(function(err) {

              if (err) { callback('beginTransaction err:' + err, null); }

                        for (var i=0;i<totalrow;i++)
             ( function (i) {
                  util.jsonadd(insertArray,'/employeeno',util.jsonget(questquery,'/queryresult'+i+'/EmployeeID'));
                  util.jsonadd(insertArray,'/objdate',util.jsonget(questquery,'/queryresult'+i+'/objdate'));
                  util.jsonadd(insertArray,'/inTime',util.jsonget(questquery,'/queryresult'+i+'/inTime'));
                  util.jsonadd(insertArray,'/OutTime',util.jsonget(questquery,'/queryresult'+i+'/OutTime'));
    
                  var sqlquery = Connection.query(insertSQL1, insertArray, function(err, result) {
                  //Connection.query('replace INTO test SET id="222212",res="eeee"', function(err, result) {
                    if (err) { 
                       callback('query err:'+err, null);

                    }
                  });

                  util.log('debug','run' + done + ':' + sqlquery.sql);
                  done=i;
                })(i);

               if(done+1==totalrow){
                   Connection.commit(function(err) {
                      if (err) {
                          Connection.rollback(function() {
                            callback('commit err' + err, null);
                          });
                        }else{
                          console.log('commit! ' + totalrow);
                           util.jsonadd(results,'/errno','200');
                           util.jsonadd(results,'/errmsg','insertAccessRecord complete');
                           util.jsonadd(results,'/rowcount',i);
                           util.jsonadd(results,'/module','insertAccessRecord');
                           Connection.release();
                        }
                    });
                 callback(null, results);
               }else{
                console.log('!=');
                 Connection.rollback(function() {
                            callback('commit err' + err, null);
                          });
                 Connection.release();
               }

            }); //beginTransaction

        }
      });
  }


        ],function(sqlerr,results){

          if(sqlerr == null||sqlerr == '' ){

            util.log('info','insertAccessRecord returns');
            util.log('info',JSON.stringify(results));
            callback(results);
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;
            util.jsonadd(results,'/errno','400');
            util.jsonadd(results,'/errmsg','insertAccessRecord error');
              // util.jsonadd(results,'/rowcount',i);
            util.jsonadd(results,'/module','insertAccessRecord');
            util.log('info','insertAccessRecord returns');
            util.log('info',JSON.stringify(results));
            callback(results);
          }
      }); //async.series end

}





exports.getWHDetailList=getWHDetailList;
exports.getTotalVCTime =getTotalVCTime;
exports.getTotalOVTime =getTotalOVTime;
exports.getPaidVCTime =getPaidVCTime;
exports.getAccessRecord = getAccessRecord;
exports.insertAccessRecord = insertAccessRecord;
exports.getLieuVCTime = getLieuVCTime;





