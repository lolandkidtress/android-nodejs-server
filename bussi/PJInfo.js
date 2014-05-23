var mysql = require('mysql');
var mysqlconn = require('../dbutil/mysqlconn.js');
var sys = require('sys');
var util = require('../util/util.js');
var async = require('async');
var config = require('../config/config.js')

// 取得项目时间的实绩合计  (当日所在月的)
function getTotalFctPJTime(questquery,response,callback){ 
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

        selectSQL1 = ' select EmployeeID,sum(WH) as TotalPJTime';
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
        selectSQL1 += ' and PJInfoID <> "" or PJInfoID is not null ';
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
                util.jsonadd(results,'/queryresult'+i+'/TotalPJTime',rows.TotalPJTime);
                //合计每一个项目时间
                //util.jsonadd(results,'/queryresult'+i+'/uuid',rows.uuid_);
                i=i+1;
              })
              .on('end', function(rows) {
                
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
               util.jsonadd(results,'/errmsg','getTotalPJTime complete');
               util.jsonadd(results,'/rowcount',i);
               util.jsonadd(results,'/module','getTotalPJTime');

            }
            util.log('log','getTotalPJTime returns');
            util.log('log',JSON.stringify(results));
            callback(results);
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;
            util.jsonadd(results,'/errno','400');
            util.jsonadd(results,'/errmsg','getTotalPJTime error');
              // util.jsonadd(results,'/rowcount',i);
            util.jsonadd(results,'/module','getTotalPJTime');
            util.log('log','getTotalPJTime returns');
            util.log('log',JSON.stringify(results));
            callback(results);
          }
      }); //async.series end

}

//取得项目的预计时间的合计 (当日所在月的)
function getTotalEstPJTime(questquery,response,callback){ 
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

        
        selectSQL1 = ' select * from ( ';
        selectSQL1 += ' select pjinfo.PJGID,pjg.Name as pjgName,pjinfo.PJInfoID,pjinfo.Name as pjName, ';
        selectSQL1 += ' pjdetail.EmployeeID,pjdetail.ObjYM,sum(pjdetail.ExpWH) as  TotalExpWH';
        selectSQL1 += ' from trnpjinfo pjinfo, trnpjg pjg, ';
        selectSQL1 += ' trnpjdetail pjdetail ';
        selectSQL1 += ' where pjinfo.PJGID = pjg.PJGID ';
        selectSQL1 += ' and pjinfo.DelFlg !=1 and pjg.DelFlg != 1 ';
        selectSQL1 += ' and pjinfo.PJInfoID = pjdetail.PJInfoID ';
        selectSQL1 += ' and pjdetail.DelFlg !=1 ';
        selectSQL1 += ' group by pjinfo.PJGID,pjdetail.EmployeeID,pjdetail.ObjYM ';
        selectSQL1 += ' union all ';
        selectSQL1 += ' select "" as PJGID,"" as pjgName,pjinfo.PJInfoID,pjinfo.Name as pjName, ';
        selectSQL1 += ' pjdetail.EmployeeID,pjdetail.ObjYM,sum(pjdetail.ExpWH) as  TotalExpWH ';
        selectSQL1 += ' from trnpjinfo pjinfo, ';
        selectSQL1 += ' trnpjdetail pjdetail ';
        selectSQL1 += ' where ';
        selectSQL1 += ' pjinfo.DelFlg !=1  ';
        selectSQL1 += ' and pjinfo.PJInfoID = pjdetail.PJInfoID ';
        selectSQL1 += ' and pjdetail.DelFlg !=1 ';
        selectSQL1 += ' and pjinfo.PJGID not in(select pjg.PJGID from trnpjg pjg ) ';
        selectSQL1 += ' group by pjinfo.PJInfoID,pjdetail.EmployeeID,pjdetail.ObjYM ';
        selectSQL1 += ' ) detail ';
        selectSQL1 += ' where EmployeeID ='  + Connection.escape(util.jsonget(questquery,'/userid'))
        selectSQL1 += ' and ObjYMD between ' + Connection.escape(util.jsonget(questquery,'/startdt')).substring(0,6) 



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
                util.jsonadd(results,'/queryresult'+i+'/PJGID',rows.PJGID);
                util.jsonadd(results,'/queryresult'+i+'/pjgName',rows.pjgName);
                util.jsonadd(results,'/queryresult'+i+'/PJInfoID',rows.PJInfoID);
                util.jsonadd(results,'/queryresult'+i+'/pjName',rows.pjName);
                util.jsonadd(results,'/queryresult'+i+'/EmployeeID',rows.EmployeeID);
                util.jsonadd(results,'/queryresult'+i+'/ObjYM',rows.ObjYM);
                util.jsonadd(results,'/queryresult'+i+'/TotalExpWH',rows.TotalExpWH);



                //util.jsonadd(results,'/queryresult'+i+'/uuid',rows.uuid_);
                i=i+1;
              })
              .on('end', function(rows) {
                
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
               util.jsonadd(results,'/errmsg','getTotalEstPJTime complete');
               util.jsonadd(results,'/rowcount',i);
               util.jsonadd(results,'/module','getTotalEstPJTime');

            }
            util.log('log','getTotalEstPJTime returns');
            util.log('log',JSON.stringify(results));
            callback(results);
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;
            util.jsonadd(results,'/errno','400');
            util.jsonadd(results,'/errmsg','getTotalEstPJTime error');
              // util.jsonadd(results,'/rowcount',i);
            util.jsonadd(results,'/module','getTotalEstPJTime');
            util.log('log','getTotalEstPJTime returns');
            util.log('log',JSON.stringify(results));
            callback(results);
          }
      }); //async.series end

}



//取得每个项目的预计信息(当日所在月的每日明细)，
function getEstPJTimeDetail(questquery,response,callback){ 
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
        selectSQL1 = ' select * from ( ';  
        selectSQL1 += ' select pjinfo.PJGID,pjg.Name as pjgName,pjinfo.PJInfoID,pjinfo.Name as pjName,pjinfo.FlgFinish, ';
        selectSQL1 += ' pjinfo.FlgUnProject,pjinfo.PMID,pjdetail.PJDetailID, ';
        selectSQL1 += ' pjdetail.EmployeeID,pjdetail.ObjYM,pjdetail.ExpWH,pjdetail.FctWH ';
        selectSQL1 += ' from trnpjinfo pjinfo, trnpjg pjg, ';
        selectSQL1 += ' trnpjdetail pjdetail ';
        selectSQL1 += ' where pjinfo.PJGID = pjg.PJGID ';
        selectSQL1 += ' and pjinfo.DelFlg !=1 and pjg.DelFlg != 1 ';
        selectSQL1 += ' and pjinfo.PJInfoID = pjdetail.PJInfoID ';
        selectSQL1 += ' and pjdetail.DelFlg !=1 ';
        selectSQL1 += ' union all ';
        selectSQL1 += ' select "" as PJGID,"" as pjgName,pjinfo.PJInfoID,pjinfo.Name as pjName,pjinfo.FlgFinish, ';
        selectSQL1 += ' pjinfo.FlgUnProject,pjinfo.PMID,pjdetail.PJDetailID, ';
        selectSQL1 += ' pjdetail.EmployeeID,pjdetail.ObjYM,pjdetail.ExpWH,pjdetail.FctWH ';
        selectSQL1 += ' from trnpjinfo pjinfo, ';
        selectSQL1 += ' trnpjdetail pjdetail ';
        selectSQL1 += ' where ';
        selectSQL1 += ' pjinfo.DelFlg !=1  ';
        selectSQL1 += ' and pjinfo.PJInfoID = pjdetail.PJInfoID ';
        selectSQL1 += ' and pjdetail.DelFlg !=1 ';
        selectSQL1 += ' and pjinfo.PJGID not in(select pjg.PJGID from trnpjg pjg ) ';
        selectSQL1 += ' ) detail ';
        selectSQL1 += ' where EmployeeID ='  + Connection.escape(util.jsonget(questquery,'/userid')) ;
        selectSQL1 += ' and ObjYM = ' + Connection.escape(util.jsonget(questquery,'/startdt')).substr(0,6) ;

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
                util.jsonadd(results,'/queryresult'+i+'/PJGID',rows.PJGID);
                util.jsonadd(results,'/queryresult'+i+'/pjgName',rows.pjgName);
                util.jsonadd(results,'/queryresult'+i+'/PJInfoID',rows.PJInfoID);
                util.jsonadd(results,'/queryresult'+i+'/pjName',rows.pjName);
                util.jsonadd(results,'/queryresult'+i+'/FlgFinish',rows.FlgFinish);
                util.jsonadd(results,'/queryresult'+i+'/FlgUnProject',rows.FlgUnProject);
                util.jsonadd(results,'/queryresult'+i+'/PMID',rows.PMID);
                util.jsonadd(results,'/queryresult'+i+'/PJDetailID',rows.PJDetailID);
                util.jsonadd(results,'/queryresult'+i+'/EmployeeID',rows.EmployeeID);
                util.jsonadd(results,'/queryresult'+i+'/ObjYM',rows.ObjYM);
                util.jsonadd(results,'/queryresult'+i+'/ExpWH',rows.ExpWH);
                util.jsonadd(results,'/queryresult'+i+'/FctWH',rows.FctWH);
                
                //util.jsonadd(results,'/queryresult'+i+'/uuid',rows.uuid_);
                i=i+1;
              })
              .on('end', function(rows) {
                
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
               util.jsonadd(results,'/errmsg','getEstPJTimeDetail complete');
               util.jsonadd(results,'/rowcount',i);
               util.jsonadd(results,'/module','getEstPJTimeDetail');

            }
            util.log('log','getEstPJTimeDetail returns');
            util.log('log',JSON.stringify(results));
            callback(results);
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;
            util.jsonadd(results,'/errno','400');
            util.jsonadd(results,'/errmsg','getEstPJTimeDetail error');
              // util.jsonadd(results,'/rowcount',i);
            util.jsonadd(results,'/module','getEstPJTimeDetail');
            util.log('log','getEstPJTimeDetail returns');
            util.log('log',JSON.stringify(results));
            callback(results);
          }
      }); //async.series end

}


exports.getEstPJTimeDetail = getEstPJTimeDetail;
exports.getTotalEstPJTime = getTotalEstPJTime;
exports.getTotalFctPJTime = getTotalFctPJTime;