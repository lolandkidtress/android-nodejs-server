/* 工时一览模块 
  包含 
  1.取得员工当月每日填写的工时的详细信息，已日历方式显示
	
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

*/

var mysql = require('mysql');
var mysqlconn = require('../dbutil/mysqlconn.js');
var sys = require('sys');
var util = require('../util/util.js');
var async = require('async');
var Wind = require('wind')
var config = require('../config/config.js')


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
          //出勤申请 行列转换 方便后面计算
        selectSQL1 += ' select EmployeeID,ObjYMD, ';
        selectSQL1 += ' max(case whtype when '1' then '1' else 0 end) whtype, '; 
        selectSQL1 += ' max(case whtype when '1' then WH else 0 end) abswh, ';
        selectSQL1 += ' max(case whtype when '1' then DtAppStatus else 0 end) whStatus, ';
        selectSQL1 += ' max(case whtype when '1' then FlgHR else 0 end) whFlgHR, ';
        selectSQL1 += ' max(case whtype when '1' then FromDt else 0 end) whFromDt, ';
        selectSQL1 += ' max(case whtype when '1' then ToDt else 0 end) whToDt, ';
        selectSQL1 += ' max(case whtype when '1' then PJInfoID else 0 end) whPJInfoID, ';
        selectSQL1 += ' max(case whtype when '1' then FlgOut else 0 end) whFlgOut, ';
        selectSQL1 += ' max(case whtype when '1' then FlgPJG else 0 end) whFlgPJG, ';

        selectSQL1 += ' max(case whtype when '2' then '1' else 0 end) ovtype, ';
        selectSQL1 += ' max(case whtype when '2' then WH else 0 end) ovwh, ';
        selectSQL1 += ' max(case whtype when '2' then DtAppStatus else 0 end) ovStatus, ';
        selectSQL1 += ' max(case whtype when '2' then FlgHR else 0 end) ovFlgHR, ';
        selectSQL1 += ' max(case whtype when '2' then FromDt else 0 end) ovFromDt, ';
        selectSQL1 += ' max(case whtype when '2' then ToDt else 0 end) ovToDt, ';
        selectSQL1 += ' max(case whtype when '2' then PJInfoID else 0 end) ovPJInfoID, ';
        selectSQL1 += ' max(case whtype when '2' then FlgOut else 0 end) ovFlgOut, ';
        selectSQL1 += ' max(case whtype when '2' then FlgPJG else 0 end) ovFlgPJG, ';

        selectSQL1 += ' max(case whtype when '3' then '1' else 0 end) vctype, ';
        selectSQL1 += ' max(case whtype when '3' then WH else 0 end) vcwh, ';
        selectSQL1 += ' max(case whtype when '3' then DtAppStatus else 0 end) vcStatus, ';
        selectSQL1 += ' max(case whtype when '3' then FlgHR else 0 end) vcFlgHR, ';
        selectSQL1 += ' max(case whtype when '3' then FromDt else 0 end) vcFromDt, ';
        selectSQL1 += ' max(case whtype when '3' then ToDt else 0 end) ovToDt, ';
        selectSQL1 += ' max(case whtype when '3' then PJInfoID else 0 end) vcPJInfoID, ';
        selectSQL1 += ' max(case whtype when '3' then FlgOut else 0 end) vcFlgOut, ';
        selectSQL1 += ' max(case whtype when '3' then FlgPJG else 0 end) vcFlgPJG ';

        selectSQL1 += ' from   ';
        selectSQL1 += ' ( ';
        selectSQL1 += ' select wh.EmployeeID,wh.ObjYMD,wh.AbsWH as WH,wh.DtAppStatus,wh.FlgHR, '; 
        selectSQL1 += ' whd.FromDt,whd.ToDt,whd.PJInfoID,whd.FlgOut,whd.FlgPJG,'1' as whtype ';
        selectSQL1 += ' from trnwhform wh,trnwhformdetail whd ';
        selectSQL1 += ' where wh.WHFormID = whd.WHFormID ';
        selectSQL1 += ' and wh.DelFlg !=1 and whd.DelFlg!=1 ';
        selectSQL1 += ' union all ';
        selectSQL1 += ' select ov.EmployeeID,ov.ObjYMD,ov.OVWH as WH, ov.DtAppStatus,ov.FlgHR, ';
        selectSQL1 += ' ovd.FromDt,ovd.ToDt,ovd.PJInfoID,ovd.FlgOut,ovd.FlgPJG,'2' as whtype ';
        selectSQL1 += ' from trnovform ov,trnovformdetail ovd ';
        selectSQL1 += ' where ov.OVFormID = ovd.OVFormID ';
        selectSQL1 += ' and ov.DelFlg !=1 and ovd.DelFlg!=1 ';
        selectSQL1 += ' union all ';
        selectSQL1 += ' select vc.EmployeeID,vcd.ObjYMD,vcd.VCTime as WH, vc.DtAppStatus,vcd.FlgHR, ';
        selectSQL1 += ' vcd.VCFromDt,vcd.VCToDt,'' as PJInfoID,'' as FlgOut,'' as FlgPJG,'3' as whtype ';
        selectSQL1 += ' from trnvcform vc,trnvcformdetail vcd ';
        selectSQL1 += ' where vc.VCFormID = vcd.VCFormID ';
        selectSQL1 += ' and vc.DelFlg !=1 and vcd.DelFlg!=1 ';
        selectSQL1 += ' ) detail ';
        selectSQL1 += ' where EmployeeID ='  + Connection.escape(util.jsonget(questquery,'/userid'))
        selectSQL1 += ' group by detail.EmployeeID,ObjYMD ';

        util.log('debug',selectSQL1);

            var query = Connection.query(selectSQL1);
            query
              .on('error', function(sqlerr) {
                // Handle error, an 'end' event will be emitted after this as well
                results = sqlerr;
                util.jsonadd(results,'/sqlstmt',selectSQL1);
              })
              .on('result', function(rows) {
                // Pausing the connnection is useful if your processing involves I/O
                //connection.pause();
                util.jsonadd(results,'/queryresult'+i+'/EmptyDate',rows.ymd);
                //util.jsonadd(results,'/queryresult'+i+'/uuid',rows.uuid_);
                i=i+1;
              })
              .on('end', function(rows) {
                   
                      util.jsonadd(results,'/errno','200');
                      util.jsonadd(results,'/errmsg','getEmptyWorkTime complete');
                      util.jsonadd(results,'/rowcount',i);
                      util.jsonadd(results,'/module','getEmptyWorkTime');
                   
                   
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
            util.log('log','getWHEmptyDate returns');
            util.log('log',results);
			      callback(results);
			    }
			    else
			    {
			      //global.queryDBStatus = 'err';
			      util.log('error',"err  = "+ sqlerr);
			      results = sqlerr;
            util.log('log','getWHEmptyDate returns');
            util.log('log',results);
            callback(results);
			    }
  		}); //async.series end

}

exports.getWHDetailList=getWHDetailList;