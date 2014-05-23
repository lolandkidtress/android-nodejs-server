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
          util.log('log','get ConnectPool error');
          util.log('log',sqlerr);
          err = sqlerr;  
          //util.jsonadd(err);
          callback(sqlerr, null);

        }else
        {
          //出勤申请 行列转换 方便后续计算是否满出勤
        selectSQL1 = ' select EmployeeID,ObjYMD, ';
        selectSQL1 += ' max(case whtype when "1" then "1" else 0 end) whtype, '; 
        selectSQL1 += ' max(case whtype when "1" then WH else 0 end) abswh, ';
        selectSQL1 += ' max(case whtype when "1" then DtAppStatus else 0 end) whStatus, ';
        selectSQL1 += ' max(case whtype when "1" then FlgHR else 0 end) whFlgHR, ';
        selectSQL1 += ' max(case whtype when "1" then FromDt else 0 end) whFromDt, ';
        selectSQL1 += ' max(case whtype when "1" then ToDt else 0 end) whToDt, ';
        selectSQL1 += ' max(case whtype when "1" then PJInfoID else 0 end) whPJInfoID, ';
        selectSQL1 += ' max(case whtype when "1" then FlgOut else 0 end) whFlgOut, ';
        selectSQL1 += ' max(case whtype when "1" then FlgPJG else 0 end) whFlgPJG, ';

        selectSQL1 += ' max(case whtype when "2" then "1" else 0 end) ovtype, ';
        selectSQL1 += ' max(case whtype when "2" then WH else 0 end) ovwh, ';
        selectSQL1 += ' max(case whtype when "2" then DtAppStatus else 0 end) ovStatus, ';
        selectSQL1 += ' max(case whtype when "2" then FlgHR else 0 end) ovFlgHR, ';
        selectSQL1 += ' max(case whtype when "2" then FromDt else 0 end) ovFromDt, ';
        selectSQL1 += ' max(case whtype when "2" then ToDt else 0 end) ovToDt, ';
        selectSQL1 += ' max(case whtype when "2" then PJInfoID else 0 end) ovPJInfoID, ';
        selectSQL1 += ' max(case whtype when "2" then FlgOut else 0 end) ovFlgOut, ';
        selectSQL1 += ' max(case whtype when "2" then FlgPJG else 0 end) ovFlgPJG, ';

        selectSQL1 += ' max(case whtype when "3" then "1" else 0 end) vctype, ';
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
        selectSQL1 += ' select wh.EmployeeID,wh.ObjYMD,wh.AbsWH as WH,wh.DtAppStatus,wh.FlgHR, '; 
        selectSQL1 += ' whd.FromDt,whd.ToDt,whd.PJInfoID,whd.FlgOut,whd.FlgPJG,"1" as whtype ';
        selectSQL1 += ' from trnwhform wh,trnwhformdetail whd ';
        selectSQL1 += ' where wh.WHFormID = whd.WHFormID ';
        selectSQL1 += ' and wh.DelFlg !=1 and whd.DelFlg!=1 ';
        selectSQL1 += ' union all ';
        selectSQL1 += ' select ov.EmployeeID,ov.ObjYMD,ov.OVWH as WH, ov.DtAppStatus,ov.FlgHR, ';
        selectSQL1 += ' ovd.FromDt,ovd.ToDt,ovd.PJInfoID,ovd.FlgOut,ovd.FlgPJG,"2" as whtype ';
        selectSQL1 += ' from trnovform ov,trnovformdetail ovd ';
        selectSQL1 += ' where ov.OVFormID = ovd.OVFormID ';
        selectSQL1 += ' and ov.DelFlg !=1 and ovd.DelFlg!=1 ';
        selectSQL1 += ' union all ';
        selectSQL1 += ' select vc.EmployeeID,vcd.ObjYMD,vcd.VCTime as WH, vc.DtAppStatus,vcd.FlgHR, ';
        selectSQL1 += ' vcd.VCFromDt,vcd.VCToDt,"" as PJInfoID,"" as FlgOut,"" as FlgPJG,"3" as whtype ';
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
                util.log('log','Connect error '+ sqlerr);
                util.jsonadd(results,'/sqlstmt',selectSQL1);
                
              })
              .on('result', function(rows) {
                // Pausing the connnection is useful if your processing involves I/O
                //connection.pause();
                util.jsonadd(results,'/queryresult'+i+'/EmployeeID',rows.EmployeeID);
                util.jsonadd(results,'/queryresult'+i+'/ObjYMD',rows.ObjYMD);
                util.jsonadd(results,'/queryresult'+i+'/whtype',rows.whtype);
                util.jsonadd(results,'/queryresult'+i+'/abswh',rows.abswh);
                util.jsonadd(results,'/queryresult'+i+'/whStatus',rows.whStatus);
                util.jsonadd(results,'/queryresult'+i+'/whFlgHR',rows.whFlgHR);
                util.jsonadd(results,'/queryresult'+i+'/whFromDt',rows.whFromDt);
                util.jsonadd(results,'/queryresult'+i+'/whToDt',rows.whToDt);
                util.jsonadd(results,'/queryresult'+i+'/whPJInfoID',rows.whPJInfoID);
                util.jsonadd(results,'/queryresult'+i+'/whFlgOut',rows.whFlgOut);
                util.jsonadd(results,'/queryresult'+i+'/whFlgPJG',rows.whFlgPJG);
                
                util.jsonadd(results,'/queryresult'+i+'/ovtype',rows.ovtype);
                util.jsonadd(results,'/queryresult'+i+'/ovwh',rows.ovwh);
                util.jsonadd(results,'/queryresult'+i+'/ovStatus',rows.ovStatus);
                util.jsonadd(results,'/queryresult'+i+'/ovFlgHR',rows.ovFlgHR);
                util.jsonadd(results,'/queryresult'+i+'/ovFromDt',rows.ovFromDt);
                util.jsonadd(results,'/queryresult'+i+'/ovPJInfoID',rows.ovPJInfoID);
                util.jsonadd(results,'/queryresult'+i+'/ovFlgOut',rows.ovFlgOut);
                util.jsonadd(results,'/queryresult'+i+'/ovFlgPJG',rows.ovFlgPJG);

                util.jsonadd(results,'/queryresult'+i+'/vctype',rows.vctype);
                util.jsonadd(results,'/queryresult'+i+'/vcwh',rows.vcwh);
                util.jsonadd(results,'/queryresult'+i+'/vcStatus',rows.vcStatus);
                util.jsonadd(results,'/queryresult'+i+'/vcFlgHR',rows.vcFlgHR);
                util.jsonadd(results,'/queryresult'+i+'/vcFromDt',rows.vcFromDt);
                util.jsonadd(results,'/queryresult'+i+'/vcToDt',rows.vcToDt);
                util.jsonadd(results,'/queryresult'+i+'/vcPJInfoID',rows.vcPJInfoID);
                util.jsonadd(results,'/queryresult'+i+'/ovFlgOut',rows.ovFlgOut);
                util.jsonadd(results,'/queryresult'+i+'/ovFlgPJG',rows.ovFlgPJG);
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
                    util.jsonadd(results,'/errno','200');
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
          

            util.log('log','getWHDetailList returns');
            util.log('log',JSON.stringify(results));
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
            util.log('log','getWHDetailList returns');
            util.log('log',JSON.stringify(results));
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
          util.log('log','get ConnectPool error');
          util.log('log',sqlerr);
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
                util.log('log','Connect error '+ sqlerr);
                util.jsonadd(results,'/sqlstmt',selectSQL1);
                
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
                util.log('log','getTotalOVTime returns');
                        util.log('log',JSON.stringify(results));
                        callback(results);   
           }
           else
           {

           
          util.jsonadd(results,'/errno','400');
                        util.jsonadd(results,'/errmsg','getTotalOVTime error');
                          // util.jsonadd(results,'/rowcount',i);
                        util.jsonadd(results,'/module','getTotalOVTime');
                        util.log('log','getTotalOVTime returns');
                        util.log('log',JSON.stringify(results));
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
          util.log('log','get ConnectPool error');
          util.log('log',sqlerr);
          err = sqlerr;  
          //util.jsonadd(err);
          callback(sqlerr, null);

        }else
        {
          //出勤申请 行列转换 方便后续计算是否满出勤
        selectSQL1 = ' select EmployeeID, ';
        selectSQL1 += ' sum(WH) as TotalVCTime ';
        selectSQL1 += ' from   ';
        selectSQL1 += ' ( ';
        selectSQL1 += ' select vc.EmployeeID,vcd.ObjYMD,vcd.VCTime as WH, vc.DtAppStatus,vcd.FlgHR, ';
        selectSQL1 += ' vcd.VCFromDt,vcd.VCToDt,"" as PJInfoID,"" as FlgOut,"" as FlgPJG,"3" as whtype ';
        selectSQL1 += ' from trnvcform vc,trnvcformdetail vcd ';
        selectSQL1 += ' where vc.VCFormID = vcd.VCFormID ';
        selectSQL1 += ' and vc.DelFlg !=1 and vcd.DelFlg!=1 ';
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
                util.log('log','Connect error '+ sqlerr);
                util.jsonadd(results,'/sqlstmt',selectSQL1);
                
              })
              .on('result', function(rows) {

                if(rows != null||rows != '' ){
                // Pausing the connnection is useful if your processing involves I/O
                //connection.pause();
                util.jsonadd(results,'/queryresult'+i+'/EmployeeID',rows.EmployeeID);
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

            util.log('log','getTotalVCTime returns');
            util.log('log',JSON.stringify(results));
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
            util.log('log','getTotalVCTime returns');
            util.log('log',JSON.stringify(results));
            callback(results);
          }
      }); //async.series end

}





exports.getWHDetailList=getWHDetailList;
exports.getTotalVCTime =getTotalVCTime;
exports.getTotalOVTime =getTotalOVTime;



