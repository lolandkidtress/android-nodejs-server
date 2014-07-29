/*


insert into trnvcform (EmployeeID, ApplyDate, SubmitTime, DtAppStatus, FileID, VCDay, Memo, DelFlg, CreateTime, CreateBy, UpdateTime, UpdateBy ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ) 
insert into trnvcformdetail (VacationSettingID, VCFormID, SplitNo, ObjYMD, VCFromDt, VCToDt, VCTime, DtVacationType, FlgHR, DelFlg, CreateTime, CreateBy, UpdateTime, UpdateBy ) 
values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ) 



休假种类为1＋2＋3＋4。																															
1有薪休假/调休/人事设定的特别休假																															
		该类休假在申请前已经事先拥有，用户在申请后直接进入审批流程由上长承认																													
		如果选择了特别休假，需要再选择特别休假名称。																													
		特别休假剩余天数取得：在特别休假设定表及特别休假员工关联表中，根据特别休假表ID，员工表ID及休假开始日取得剩余的休假天数；																													
												填写的休假开始日及休假截止日必须在休假开始日到调休申请截止日的范围内。																			
		①类休假在申请时是不会实际占用休假，上长承认休假申请之后扣假。																													
																															
2病假/病假（保胎假）/事假/工伤假/其他休假（地铁延误等）																															
		该类休假在申请前为0，用户按需申请																													
		病假/病假（保胎假）的场合，连续3天（含）以上需要上传病假证明（要Check）																													
		其他休假（地铁延误等）的场合，申请休假的时候需要上传附件。（要Check）																													
																															
3产前假/产假/流产假																															
		该类休假在申请前为0，用户按需申请，该休假申请后人事可以随时修改（审批通过后也可以修改）																													
		以天为单位进行申请。																													
																															
4婚假/丧假/产前检查/陪产假/孕期工间休息（1H/天）/哺乳时间/哺乳假/晚育护理假																															
		该类假期剩余天数取得：在员工个人假期表中，根据员工表ID+D假期种类及休假开始日取得剩余的休假天数；																													
												填写的休假开始日及休假截止日必须在休假开始日到调休申请截止日的范围内。																			
		选择这类休假时，如果剩余天数为0的话，提示信息【是否提交休假期间申请】，如果选择是，就跳转到【休假期间申请】机能																													
		如果选择否，休假种类初始化为空白																													
		如果剩余天数大于0的话，可以填写休假申请。流程和①相同。																													
	4类休假在申请时不会实际占用休假，上长承认休假申请之后扣假。																													



只能提交1，3类假，2,4类假不能在手机端提交

2类假只保存，不提交，需要web端上传照片证明
3类假只能按天申请
4类假不能


休假申请返回值.说明

200 成功


*/


var mysql = require('mysql');
var mysqlconn = require('../dbutil/mysqlconn.js');
var sys = require('sys');
var util = require('../util/util.js');
var async = require('async');
var Wind = require('wind');
var config = require('../config/config.js');
var moment = require('moment');
var login = require('./login.js');


//取得员工在申请休假时的规则
function getVCSetting(questquery,response,callback){ 
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

        selectSQL1 = ' 	select a.EmployeeID,c.DtVacationType,d.des,c.MinUsedUnit,c.ApplyStartWH,c.FlgWhole ';
		selectSQL1 += ' from mstwhsetting b,rtnemwh a,mstwhsettingdetail c,mstdictdata d ';
		selectSQL1 += ' where a.WHSettingID = b.WHSettingID and b.WHSettingID = c.WHSettingID ';
		selectSQL1 += ' and c.DtVacationType = d.Value ';
		selectSQL1 += ' and d.dictType = "WHRestType" ';
        selectSQL1 += ' and a.EmployeeID = '+ Connection.escape(util.jsonget(questquery,'/userid')) + ' and ' ;
        selectSQL1 += ' ('+Connection.escape(util.jsonget(questquery,'/startdt')) +' between a.DtFrom and a.DtTo ';
        selectSQL1 += ' and ' + Connection.escape(util.jsonget(questquery,'/enddt')) + ' between a.DtFrom and a.DtTo) ';
        selectSQL1 += ' order by 1,2 ';

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
                util.jsonadd(results,'/queryresult'+i+'/DtVacationType',rows.DtVacationType);
                util.jsonadd(results,'/queryresult'+i+'/des',rows.des);
                util.jsonadd(results,'/queryresult'+i+'/MinUsedUnit',rows.MinUsedUnit);
                util.jsonadd(results,'/queryresult'+i+'/ApplyStartWH',rows.ApplyStartWH);
                util.jsonadd(results,'/queryresult'+i+'/FlgWhole',rows.FlgWhole);

                i=i+1;
              })
              .on('end', function(rows) {

                  if(i>0){

                      util.jsonadd(results,'/rowcount',i);
                      util.jsonadd(results,'/errmsg','setting get Succ');
                      util.jsonadd(results,'/errno','200');
                      util.jsonadd(results,'/module','getVCSetting');
                   }
                   else
                   {

                      util.jsonadd(results,'/rowcount',0);
                      util.jsonadd(results,'/errmsg','setting get Empty');
                      util.jsonadd(results,'/errno','300');
                      util.jsonadd(results,'/module','getVCSetting');

                   }
                  
                  Connection.release();
                  callback('',results);
              });
        }
        
      });

    }
        ],function(sqlerr,results){

          if(sqlerr == null||sqlerr == '' ){
           
            util.log('info','getVCSetting returns');
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
            util.jsonadd(results,'/module','getVCSetting');


            util.log('info','getVCSetting returns Error');
            util.log('info',JSON.stringify(results));
            callback(results);
          }

      }); //async.series end

}



//检查传入的formid是否可以删除

function DeleteVCCheck(formid,callback){ 
  var i = 0;
  var result ={
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

        selectSQL1 = ' select count(*)  as cnt from trnvcform ';
    selectSQL1 += ' where (dtAppStatus =1 or dtAppStatus = 2 )';  //未提交以外的状态
    //selectSQL1 += ' and delflg = 0 ';
    selectSQL1 += ' and vcformid = ' + formid ;


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
                row = rows.cnt;

              })
              .on('end', function(rows) {
                  util.jsonadd(result,'/errno','200');
                  util.jsonadd(result,'/row',row);
                  Connection.release();
                  callback('',result);
              });
        }
      });

    }
        ],function(sqlerr,results){

          if(sqlerr == null||sqlerr == '' ){

            util.log('info','DeleteVCCheck returns');
            util.log('info',results);
            callback(results);  //返回行数
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;
            util.jsonadd(results,'/errno','400');
            util.jsonadd(results,'/errmsg','DeleteVCCheck get Error');
            util.jsonadd(results,'/module','DeleteVCCheck');


            util.log('info','DeleteVCCheck returns Error');
            util.log('info',JSON.stringify(results));
            callback(results);
          }

      }); //async.series end

}



function deleteVC(questquery,callback){
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
      var cnt = 0;
      var cntdetail = 0;

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
        Connection.beginTransaction(function(err) {
          if (err) { callback('beginTransaction err:' + err, null); }else
          {
          selectSQL1 = ' update trnvcform set DelFlg = 1, '
          selectSQL1 += ' updatetime = "' + moment().format('YYYY-MM-DD HH:mm:ss') + '",';
          selectSQL1 += ' UpdateBy = ' + util.jsonget(questquery,'/userid') ;
      selectSQL1 += ' where (dtAppStatus !=1 or dtAppStatus !=2) and DelFlg =0';
      selectSQL1 += ' and vcformid = "' + util.jsonget(questquery,'/vcformid') + '";';

      selectSQL1 += ' update trnvcformdetail set DelFlg = 1,';
      selectSQL1 += ' updatetime = "' + moment().format('YYYY-MM-DD HH:mm:ss') + '",';
          selectSQL1 += ' UpdateBy = "' + util.jsonget(questquery,'/userid') + '"';
      selectSQL1 += ' where DelFlg =0';
      selectSQL1 += ' and vcformid = ' + util.jsonget(questquery,'/vcformid');

          util.log('debug',selectSQL1);
              var query = Connection.query(selectSQL1);
              query
                .on('error', function(sqlerr) {
                  // Handle error, an 'end' event will be emitted after this as well
                  results = sqlerr;
                  util.log('info','Connect error '+ sqlerr);
                  util.jsonadd(results,'/sqlstmt',selectSQL1);
                  Connection.rollback(function() {
              util.log('debug','rollback');
              Connection.release();
              });
                  callback(sqlerr,null);
                })
                .on('result', function(row,index) {
                  // Pausing the connnection is useful if your processing involves I/O
                  //connection.pause();
                  //index==0 的row结果是第一句update的结果
                  if(index ==0){
                    cnt = row.changedRows ;
                    util.log('info', 'head:' + cnt + ' rows changed');
                  }
                  //index==1 的row结果是第二句update的结果
                  if(index ==1){
                    cntdetail = row.changedRows ;
                    util.log('info','detail:' + cntdetail + ' rows changed');
                  }



                })
                .on('end', function() {
                    if(cnt!=1){   //没有正确更新1行
                    Connection.rollback(function() {
              util.log('debug','rollback');
              Connection.release();
              });
                    callback(cnt + ' rows changed',null);
                    }else{
              Connection.commit(function(err) {
              if (err) {
                Connection.rollback(function() {
                  Connection.release();
                  util.log('debug','rollback');
                  callback('commit err' + err, null);
                });
                }else{
                  util.log('debug','commit! ');
                  util.jsonadd(results,'/errno','200');
                  util.jsonadd(results,'/errmsg','deleteVC complete');
                  callback(null, results);
                }
              });

                    }

                });
          }
         }); //beginTransaction
        });

      }
          ],function(sqlerr,results){

            if(sqlerr == null||sqlerr == '' ){

              util.log('info','deleteVC returns');
              util.log('info',results);
              callback(results);  //返回行数
            }
            else
            {
              //global.queryDBStatus = 'err';
              util.log('error',"err  = "+ sqlerr);
              //results = sqlerr;
              util.jsonadd(results,'/errno','400');
              util.jsonadd(results,'/errmsg',sqlerr);
              util.jsonadd(results,'/module','deleteVC');


              util.log('info','deleteVC returns Error');
              util.log('info',JSON.stringify(results));
              callback(results);
            }

      }); //async.series end

}



/*
休假删除的返回值

200 正常删除
301 已进入考勤审批流程，不能删除
400 系统异常
500 用户失效
*/


function VCDeleteHandle(questquery,response,callback){
  async.waterfall([     //有顺序的执行,前一个函数的结果作为下一个函数的参数
  function (callback){  //检查是否不能删除 仅当未提交或已驳回的状态可以删除

      var vcformid = util.jsonget(questquery,'/vcformid');

            DeleteVCCheck(vcformid,
              function(cb){
                //util.log('debug','WHSetting get ' + JSON.stringify(cb));
                //util.log('debug','WHSetting get ' + util.jsonget(cb[0],'/errno'));
              if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') == 400){  //异常情况下
                  cb = {"errno":"400",
                    "errmsg:":util.jsonget(cb,'/errmsg'),
                    "module":"VCDelete"
                  }
                  callback(cb,null);
              }else{
                if( util.jsonexist(cb[0],'/errno') && util.jsonget(cb[0],'/errno') == 200){   //非异常情况下返回
                  util.log('debug','VCDelete.DeleteVCCheck OK ' + JSON.stringify(cb));
                  if(util.jsonget(cb[0],'/row') == 0){  //可以删除
                    callback(null,questquery);
                  }
                  else
                  {
                    util.log('debug','VCDelete.DeleteVCCheck return > 0 ' );
                    cb = {
                    "errno":"301",
                    "errmsg:":"VCDelete.DeleteVCCheck Error",
                    "module":"VCDelete"
                    }
                  callback(cb,null);
                  }

                }else{
                  cb = {
                    "errno":"301",
                    "errmsg:":"VCDelete.DeleteVCCheck Error",
                    "module":"VCDelete"
                    }
                  callback(cb,null);
                }
              }
              });
    },

   function (results,callback) {  //通过check后，置删除标志位
        deleteVC(questquery,
              function(cb){
                //util.log('debug','WHSetting get ' + JSON.stringify(cb));
                //util.log('debug','WHSetting get ' + util.jsonget(cb[0],'/errno'));
              if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') == 400){  //异常情况下
                  cb = {"errno":"400",
                    "errmsg:":util.jsonget(cb,'/errmsg'),
                    "module":"VCDelete"
                  }
                  callback(cb,null);
              }else{
                if( util.jsonexist(cb[0],'/errno') && util.jsonget(cb[0],'/errno') == 200){   //非异常情况下返回
                  util.jsonadd(cb[0],'/module','VCDelete');
                  util.log('debug','VCDelete.deleteVC OK ' + JSON.stringify(cb));
                  callback(null,cb);
                }else{
                  /*
                  cb = {
                    "errno":"301",
                    "errmsg:":"OVSubmit.insertOV Error",
                    "module":"OVSubmit"
                  }
                  */
                  callback(cb,null);
                }
              }
              });
    },
    /*
   function (results,callback) {  //提交
        SubmitOV(questquery,
              function(cb){
                //util.log('debug','insertOV retrun ' + JSON.stringify(cb));
                callback(null,cb);
              });
    },
  */
], function(err, results) {

  if(err == null||err == '' ){

    if(util.jsonexist(results[0],'/errno') != true){
              util.jsonadd(results[0],'/errno','200');
            }
            util.jsonadd(results[0],'/errmsg','VCDelete succ');
                util.log('info','VCDeleteHandle returns');
                util.log('info',results);
           callback(results[0]);
          }
          else
          {
            //global.queryDBStatus = 'err';
          util.log('error',"err  = "+ JSON.stringify(err));
          results = err;
                util.log('info','VCDeleteHandle returns');
                util.log('info',results);
                callback(results);
          }

});

}

exports.getVCSetting = getVCSetting
exports.VCDelete = VCDeleteHandle;