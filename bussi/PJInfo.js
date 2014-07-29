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
          util.log('info','get ConnectPool error');
          util.log('info',sqlerr);
          err = sqlerr;
          //util.jsonadd(err);
          callback(sqlerr, null);

        }else
        {

        selectSQL1 =  ' select TrnPJG.pjgid as id,TrnPJG.name,sum(wh.wh) total from  ';
        selectSQL1 +=  ' (  ';
        selectSQL1 +=  ' select wh.EmployeeID,wh.ObjYMD,whd.WH as WH,wh.DtAppStatus,wh.FlgHR,  ';
        selectSQL1 +=  ' whd.FromDt,whd.ToDt,whd.PJInfoID,whd.FlgOut,whd.FlgPJG,"1" as whtype ';
        selectSQL1 +=  ' from trnwhform wh,trnwhformdetail whd ';
        selectSQL1 +=  ' where wh.WHFormID = whd.WHFormID ';
        selectSQL1 +=  ' and wh.DelFlg !=1 and whd.DelFlg!=1 ';
        selectSQL1 +=  ' union all ';
        selectSQL1 +=  ' select ov.EmployeeID,ov.ObjYMD,ov.OVWH as WH, ov.DtAppStatus,ov.FlgHR, ';
        selectSQL1 +=  ' ovd.FromDt,ovd.ToDt,ovd.PJInfoID,ovd.FlgOut,ovd.FlgPJG,"2" as whtype ';
        selectSQL1 +=  ' from trnovform ov,trnovformdetail ovd ';
        selectSQL1 +=  ' where ov.OVFormID = ovd.OVFormID ';
        selectSQL1 +=  ' and ov.DelFlg !=1 and ovd.DelFlg!=1 ) wh ';
        selectSQL1 +=  ' INNER join TrnPJG ON wh.PJInfoID = TrnPJG.PJGID ';
        selectSQL1 +=  ' where wh.FlgPJG = 1 ';
        selectSQL1 +=  ' and TrnPJG.FlgFinish = 1 ';
        selectSQL1 +=  ' and TrnPJG.DelFlg = 0 ';
        selectSQL1 +=  ' and wh.EmployeeID = '  + Connection.escape(util.jsonget(questquery,'/userid'));
        selectSQL1 +=  ' and left(objymd,6) = ' + Connection.escape(util.jsonget(questquery,'/startdt')) ;
        selectSQL1 +=  ' group by 1,2 ';
        selectSQL1 +=  ' union ';
        selectSQL1 +=  ' select TrnPJInfo.PJInfoID as id,TrnPJInfo.name,sum(wh.wh) total from ';
        selectSQL1 +=  ' ( ';
        selectSQL1 +=  ' select wh.EmployeeID,wh.ObjYMD,whd.WH as WH,wh.DtAppStatus,wh.FlgHR,  ';
        selectSQL1 +=  ' whd.FromDt,whd.ToDt,whd.PJInfoID,whd.FlgOut,whd.FlgPJG,"1" as whtype ';
        selectSQL1 +=  ' from trnwhform wh,trnwhformdetail whd ';
        selectSQL1 +=  ' where wh.WHFormID = whd.WHFormID ';
        selectSQL1 +=  ' and wh.DelFlg !=1 and whd.DelFlg!=1 ';
        selectSQL1 +=  ' union all ';
        selectSQL1 +=  ' select ov.EmployeeID,ov.ObjYMD,ov.OVWH as WH, ov.DtAppStatus,ov.FlgHR, ';
        selectSQL1 +=  ' ovd.FromDt,ovd.ToDt,ovd.PJInfoID,ovd.FlgOut,ovd.FlgPJG,"2" as whtype ';
        selectSQL1 +=  ' from trnovform ov,trnovformdetail ovd ';
        selectSQL1 +=  ' where ov.OVFormID = ovd.OVFormID ';
        selectSQL1 +=  ' and ov.DelFlg !=1 and ovd.DelFlg!=1 ) wh ';
        selectSQL1 +=  ' INNER join TrnPJInfo ON wh.PJInfoID = TrnPJInfo.PJGID ';
        selectSQL1 +=  ' where wh.FlgPJG = 2 ';
        selectSQL1 +=  ' and TrnPJInfo.FlgFinish = 1 ';
        selectSQL1 +=  ' and TrnPJInfo.DelFlg = 0 ';
        selectSQL1 +=  ' and wh.EmployeeID = '  + Connection.escape(util.jsonget(questquery,'/userid'));
        selectSQL1 +=  ' and left(objymd,6) = ' + Connection.escape(util.jsonget(questquery,'/startdt')) ;
        selectSQL1 +=  ' group by 1,2  ';

        util.log('debug',selectSQL1);

            var query = Connection.query(selectSQL1);
            query
              .on('error', function(sqlerr) {
                // Handle error, an 'end' event will be emitted after this as well
                results = sqlerr;
                util.log('info','Connect error '+ sqlerr);
                util.jsonadd(results,'/sqlstmt',selectSQL1);

              })
              .on('result', function(rows) {
                // Pausing the connnection is useful if your processing involves I/O
                //connection.pause();
                util.jsonadd(results,'/queryresult'+i+'/pjid',rows.id);
                util.jsonadd(results,'/queryresult'+i+'/pjName',rows.name);
                util.jsonadd(results,'/queryresult'+i+'/totaltime',rows.total);
                //合计每一个项目时间
                //util.jsonadd(results,'/queryresult'+i+'/uuid',rows.uuid_);
                i=i+1;
              })
              .on('end', function(rows) {
                    if(i>0){

                           util.jsonadd(results,'/errno','200');
                           util.jsonadd(results,'/errmsg','getTotalFctPJTime complete');
                           util.jsonadd(results,'/rowcount',i);
                           util.jsonadd(results,'/module','getTotalFctPJTime');
                      }
                      else
                      {
                        util.jsonadd(results,'/errno','200');
                           util.jsonadd(results,'/errmsg','getTotalFctPJTime Empty');
                           util.jsonadd(results,'/rowcount',0);
                           util.jsonadd(results,'/module','getTotalFctPJTime');
                      }
                  Connection.release();
                  callback(null,results);
              });
        }

      });
  }


        ],function(sqlerr,results){

          if(sqlerr == null||sqlerr == '' ){

            util.log('info','getTotalFctPJTime returns');
            util.log('info',JSON.stringify(results));
            callback(results);
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;
            util.jsonadd(results,'/errno','400');
            util.jsonadd(results,'/errmsg','getTotalFctPJTime error');
              // util.jsonadd(results,'/rowcount',i);
            util.jsonadd(results,'/module','getTotalFctPJTime');
            util.log('info','getTotalFctPJTime returns');
            util.log('info',JSON.stringify(results));
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
          util.log('info','get ConnectPool error');
          util.log('info',sqlerr);
          err = sqlerr;
          //util.jsonadd(err);
          callback(sqlerr, null);

        }else
        {

        selectSQL1 = ' SELECT ';    //PJG
        selectSQL1 += '        MAX(T3.Name)  AS Name  ';
        selectSQL1 += '       ,SUM(T1.ExpWH) AS ExpWH  ';
        selectSQL1 += '       ,T3.PJGID  as id';
        selectSQL1 += '       ,"1" as pjgflg ';
        selectSQL1 += '    FROM  ';
        selectSQL1 += '                 TrnPJDetail AS T1  ';
        selectSQL1 += '      INNER JOIN TrnPJInfo   AS T2  ';
        selectSQL1 += '        ON T1.PJInfoID = T2.PJInfoID  ';
        selectSQL1 += '      INNER JOIN TrnPJG      AS T3  ';
        selectSQL1 += '        ON T2.PJGID    = T3.PJGID  ';
        selectSQL1 += '    WHERE  ';
        selectSQL1 += '             T1.EmployeeID = ' + Connection.escape(util.jsonget(questquery,'/userid'));
        selectSQL1 += ' AND T1.ObjYM = ' + Connection.escape(util.jsonget(questquery,'/startdt')) ;
        selectSQL1 += '         AND T3.FlgFinish  = 1  ';
        selectSQL1 += '         AND T1.DelFlg     = "0"  ';
        selectSQL1 += '         AND T2.DelFlg     = "0"  ';
        selectSQL1 += '         AND T3.DelFlg     = "0"  ';
        selectSQL1 += '    GROUP BY  ';
        selectSQL1 += '         T3.PJGID  ';
        selectSQL1 += ' union all ';

        selectSQL1 += ' SELECT  ';  //PJ
        selectSQL1 += '    T2.Name  ';
        selectSQL1 += '   ,IFNULL(T1.ExpWH,0) AS ExpWH  ';
        selectSQL1 += '   ,T2.PJInfoID as id ';
        selectSQL1 += '   ,"2" as pjgflg ';
        selectSQL1 += ' FROM TrnPJDetail AS T1  ';
        selectSQL1 += ' INNER JOIN TrnPJInfo AS T2  ';
        selectSQL1 += '    ON T1.PJInfoID = T2.PJInfoID  ';
        selectSQL1 += ' WHERE   ';
        selectSQL1 += '     T1.EmployeeID      = ' + Connection.escape(util.jsonget(questquery,'/userid'));
        selectSQL1 += '  AND T1.ObjYM          = ' + Connection.escape(util.jsonget(questquery,'/startdt')) ;
        selectSQL1 += '  AND T2.FlgFinish      = 1  ';
        selectSQL1 += '  AND T2.PJGID          = "0" ';
        selectSQL1 += '  AND T2.FlgUnProject   = "2" ';
        selectSQL1 += '  AND T1.DelFlg         = "0" ';
        selectSQL1 += '  AND T2.DelFlg         = "0" ';



        util.log('debug',selectSQL1);

            var query = Connection.query(selectSQL1);
            query
              .on('error', function(sqlerr) {
                // Handle error, an 'end' event will be emitted after this as well
                results = sqlerr;
                util.log('info','Connect error '+ sqlerr);
                util.jsonadd(results,'/sqlstmt',selectSQL1);

              })
              .on('result', function(rows) {
                // Pausing the connnection is useful if your processing involves I/O
                //connection.pause();
                util.jsonadd(results,'/queryresult'+i+'/PjName',rows.PjName);
                util.jsonadd(results,'/queryresult'+i+'/ExpWH',rows.ExpWH);
                util.jsonadd(results,'/queryresult'+i+'/id',rows.id);
                util.jsonadd(results,'/queryresult'+i+'/pjgflg',rows.pjgflg);

                //util.jsonadd(results,'/queryresult'+i+'/uuid',rows.uuid_);
                i=i+1;
              })
              .on('end', function(rows) {

                  if(i>0){

                           util.jsonadd(results,'/errno','200');
                           util.jsonadd(results,'/errmsg','getTotalEstPJTime complete');
                           util.jsonadd(results,'/rowcount',i);
                           util.jsonadd(results,'/module','getTotalEstPJTime');
                      }
                      else
                      {
                        util.jsonadd(results,'/errno','200');
                           util.jsonadd(results,'/errmsg','getTotalEstPJTime Empty');
                           util.jsonadd(results,'/rowcount',0);
                           util.jsonadd(results,'/module','getTotalEstPJTime');
                      }
                  Connection.release();
                  callback(null,results);
              });
        }

      });
  }


        ],function(sqlerr,results){

        if(sqlerr == null||sqlerr == '' ){

            util.log('info','getTotalEstPJTime returns');
            util.log('info',JSON.stringify(results));
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
            util.log('info','getTotalEstPJTime returns');
            util.log('info',JSON.stringify(results));
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
          util.log('info','get ConnectPool error');
          util.log('info',sqlerr);
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
        selectSQL1 += ' where EmployeeID = '  + Connection.escape(util.jsonget(questquery,'/userid')) ;
        selectSQL1 += ' and ObjYM = ' + Connection.escape(util.jsonget(questquery,'/startdt')) ;

        util.log('debug',selectSQL1);

            var query = Connection.query(selectSQL1);
            query
              .on('error', function(sqlerr) {
                // Handle error, an 'end' event will be emitted after this as well
                results = sqlerr;
                util.log('info','Connect error '+ sqlerr);
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
            util.log('info','getEstPJTimeDetail returns');
            util.log('info',JSON.stringify(results));
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
            util.log('info','getEstPJTimeDetail returns');
            util.log('info',JSON.stringify(results));
            callback(results);
          }
      }); //async.series end

}


exports.getEstPJTimeDetail = getEstPJTimeDetail;
exports.getTotalEstPJTime = getTotalEstPJTime;
exports.getTotalFctPJTime = getTotalFctPJTime;