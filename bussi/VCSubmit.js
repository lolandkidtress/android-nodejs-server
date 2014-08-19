/*


insert into trnvcform (EmployeeID, ApplyDate, SubmitTime, DtAppStatus, FileID, VCDay, Memo, DelFlg, 
CreateTime, CreateBy, UpdateTime, UpdateBy ) 
values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ) 
insert into trnvcformdetail (VacationSettingID, VCFormID, SplitNo, ObjYMD, VCFromDt, 
VCToDt, VCTime, DtVacationType, FlgHR, DelFlg, CreateTime, CreateBy, UpdateTime, UpdateBy ) 
values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )


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
var whList = require('./whList.js');


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
        if(util.jsonexist(questquery,'/vctype') && util.jsonget(questquery,'/vctype')!= null){
          selectSQL1 += ' and c.DtVacationType = ' + Connection.escape(util.jsonget(questquery,'/vctype'));
        }
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
              	  util.jsonadd(results,'/userid',util.jsonget(questquery,'/userid'));
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
                    util.jsonadd(cb,'/userid',util.jsonget(questquery,'/userid'));
                    callback(cb,null);
                  }

                }else{
                  cb = {
                    "errno":"301",
                    "errmsg:":"VCDelete.DeleteVCCheck Error",
                    "module":"VCDelete"
                    }
                  util.jsonadd(cb,'/userid',util.jsonget(questquery,'/userid'));
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
                  util.jsonadd(cb[0],'/userid',util.jsonget(questquery,'/userid'));
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

/*
休假种类为1＋2＋3＋4。
1.有薪休假/调休/特别休假
    该类休假在申请前已经事先拥有，用户在申请后直接进入审批流程由上长承认
    如果选择了特别休假，需要再选择特别休假名称。
    特别休假剩余天数取得：在特别休假设定表及特别休假员工关联表中，根据特别休假表ID，员工表ID及休假开始日取得剩余的休假天数；
                        填写的休假开始日及休假截止日必须在休假开始日到调休申请截止日的范围内。
    1类休假在申请时是不会实际占用休假，上长承认休假申请之后扣假。

2.病假/病假（保胎假）/事假/工伤假/其他休假（地铁延误等）
    该类休假在申请前为0，用户按需申请
    病假/病假（保胎假）的场合，连续3天（含）以上需要上传病假证明（要Check）
    其他休假（地铁延误等）的场合，申请休假的时候需要上传附件。（要Check）

3.产前假/产假/流产假
    该类休假在申请前为0，用户按需申请，该休假申请后人事可以随时修改（审批通过后也可以修改）
    以天为单位进行申请。

4.婚假/丧假/产前检查/陪产假/孕期工间休息（1H/天）/哺乳时间/哺乳假/晚育护理假
    该类假期剩余天数取得：在员工个人假期表中，根据员工表ID+D假期种类及休假开始日取得剩余的休假天数；
                        填写的休假开始日及休假截止日必须在休假开始日到调休申请截止日的范围内。
    选择这类休假时，如果剩余天数为0的话，提示信息【是否提交休假期间申请】，如果选择是，就跳转到【休假期间申请】机能
    如果选择否，休假种类初始化为空白
    如果剩余天数大于0的话，可以填写休假申请。流程和①相同。
  4类休假在申请时不会实际占用休假，上长承认休假申请之后扣假。


只能提交1类假中的有薪休假/调休，其余类假不能在手机端修改和提交

休假种类对应code
1：有薪假；2：调休；3：病假；4：病假（保胎）；5：事假；
6：工伤假；7：婚假；8：丧假；9：产假；10：陪产假；
11：孕期工间休息；12：哺乳时间；13：产前假；14：产检；
15：哺乳假；16：晚育护理假；17：流产假；18：特别休假；19：其他

休假申请返回值.说明

200.成功

301.没有设定考勤规则
302.该条休假数据时间和其他工时/加班/休假时间冲突
303.休假时间必须是出勤日
304.休假时间必须是出勤日的正常出勤时间内
305.休假不可以跨月
306.休假必须是全天
307.没有设定日历
308.数据格式校验错误
309.有薪假天数不可为负数
310.调休天数不能为负数
311.休假不符合起始单位
312.休假不符合最小单位
313.没有设定考勤审批工作流
314.考勤审批工作流重复
315.加班申请时，工时已经在申请/提交状态
316.休假申请时，工时已经在申请/提交状态
317.只可以申请有薪假和调休

400 系统异常

500 用户失效


*/

/*  检验顺序

         301                                 305                      302               303
        _____                              _______                  _______             _______
          |                                   |                        |                   |
          |                                   |                        |                   |
304         306   309 310 311   312           |                        |                   |
____________________________________          |                        |                   |
                   |                          |                        |                   |
__________________________________________________________________________________________________________________________________
                                    313,314,315,316  (提交时通过共通校验)


*/



function VCSubmit(questquery,response,callback){
  async.waterfall([     //有顺序的执行,前一个函数的结果作为下一个函数的参数
  /*
  function (callback){  //先取得考勤规则数据

      //通过applydate取得月初和月末
      var appdate = moment(util.jsonget(questquery,'/applydate'),'YYYYMMDD').format('YYYY-MM-DD');

      util.jsonadd(questquery,'/startdt',moment(appdate).startOf('month').format('YYYY-MM-DD'));
      util.jsonadd(questquery,'/enddt',moment(appdate).endOf('month').format('YYYY-MM-DD'));

      var vcsettingquery = {
        userid="",
        FromDt="",
        ToDt="",
        vctype=""
      }

            getVCSetting(questquery,response,
              function(cb){
                //util.log('debug','WHSetting get ' + JSON.stringify(cb));
                //util.log('debug','WHSetting get ' + util.jsonget(cb[0],'/errno'));
              if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') == 400){  //异常情况下
                  cb = {"errno":"400",
                    "errmsg:":util.jsonget(cb,'/errmsg'),
                    "module":"VCSubmit"
                  }
                  callback(cb,null);
              }else{
                if( util.jsonexist(cb[0],'/errno') && util.jsonget(cb[0],'/errno') == 200){   //非异常情况下返回
                  util.log('debug','VCSubmit.getWHSetting OK ' + JSON.stringify(cb));
                  callback(null,cb);
                }else{
                  cb = {
                    "errno":"301",
                    "errmsg:":"VCSubmit.getWHSetting Error",
                    "module":"VCSubmit"
                  }
                  callback(cb,null);
                }
              }
              });
    },
    */

    //function (results,callback) {  //根据考勤规则检查加班数据
      function (callback){  //检查休假数据
            VCInfoValidateCheck(questquery,
              function(cb){
                util.log('debug','VCInfoValidateCheck retrun ' + JSON.stringify(cb));
                if(util.jsonget(cb,'/errno') != 200){  //校验出错
                  callback(cb,null);
                }else
                callback(null,cb);
              });
    },
   function (results,callback) {  //保存并提交
        insertVC(questquery,
              function(cb){
                //util.log('debug','WHSetting get ' + JSON.stringify(cb));
                //util.log('debug','WHSetting get ' + util.jsonget(cb[0],'/errno'));
              if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') == 400){  //异常情况下
                  cb = {"errno":"400",
                    "errmsg:":util.jsonget(cb,'/errmsg'),
                    "module":"VCSubmit"
                  }
                  callback(cb,null);
              }else{
                if( util.jsonexist(cb[0],'/errno') && util.jsonget(cb[0],'/errno') == 200){   //非异常情况下返回
                  util.jsonadd(cb[0],'/module','VCSubmit');
                  util.log('debug','VCSubmit.insertVC OK ' + JSON.stringify(cb));
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
            util.jsonadd(results[0],'/errmsg','VCSubmit succ');
                util.log('info','VCSubmit returns');
                util.log('info',results);
                util.jsonadd(results[0],'/userid',util.jsonget(questquery,'/userid'));
           callback(results[0]);
          }
          else
          {
            //global.queryDBStatus = 'err';
          util.log('error',"err  = "+ JSON.stringify(err));
          results = err;
                util.log('info','VCSubmit returns');
                util.log('info',results);
                callback(results);
          }

  });

};


//插入trnvcform
//插入trnvcformdetail
//如果当天没有正常出勤数据，需要补充trnwhform
//提交



function insertVC(questquery,callback){
  util.log('debug','insert get ' + JSON.stringify(questquery));
  var i = 0;
  var results ={
    errno:'',
    errmsg:''
  };

  var spreturn=0;
  var OrgCD ;
  var PositionID ;
  var pool;
  var Connection;
  var last_insert_id;
  var done=0;
  var totalrow = util.jsonget(questquery,'/detailrow');

      var insertVCHeadArray =
      {
        EmployeeID:"" ,
        ApplyDate:"",
        SubmitTime:"",
        DtAppStatus:"0" ,
        FileID:"",
        VCDay:"",
        Memo:"",
        DelFlg:0 ,
        CreateTime:'',
        CreateBy:"",
        UpdateTime:'',
        UpdateBy:"",
      };

     var insertVCDetailArray =
      {
        VacationSettingID:"",
        VCFormID:"",
        SplitNo:"",
        ObjYMD:"",
        VCFromDt:"", VCToDt:"",
        VCTime:"",
        DtVacationType:"",
        des:"",
        FlgHR:2,
        Memo:"",
        DelFlg:"0", CreateTime:"", CreateBy:"", UpdateTime:"", UpdateBy:""
      };

      var insertWHHeadArray =
      {
        EmployeeID:"" ,
        ObjYMD:"",
        DtAppStatus:0 ,
        FlgBYD:2,
        FlgHR:2,
        DelFlg:0 ,
        CreateTime:'',
        CreateBy:"",
        UpdateTime:'',
        UpdateBy:""

      };

     var procWFSubmitArray =
      {
        inWFType:"3", inTableKey:"", inUserID:"", inOrgCD:"", inPositionID:"", inObjYMD:"",
        inMemo:"",res:""
      };

  async.series([   //顺序执行
 function(callback){
            pool = mysqlconn.poolConnection();
            pool.getConnection(function(sqlerr, Connection) {

                        // connected! (unless `err` is set)
                    if(sqlerr!=null){
                      util.log('info','get ConnectPool error');
                      util.log('info',sqlerr);
                      err = sqlerr;
                      //util.jsonadd(err);
                      callback(sqlerr, null);

                    }else{
                        Connection.beginTransaction(function(err) {
                            if (err) { callback('beginTransaction err:' + err, null);
                            }else
                            {
                                util.log('debug','beginTransaction ');
                                insertVCHeadSQL1 = ' insert into TrnVCForm ';
                                insertVCHeadSQL1 += ' set ? ';

                                util.jsonadd(insertVCHeadArray,'/EmployeeID',util.jsonget(questquery,'/userid'));
                                util.jsonadd(insertVCHeadArray,'/ApplyDate',util.jsonget(questquery,'/TrnVCFormDetail0/ObjYMD'));
                                util.jsonadd(insertVCHeadArray,'/VCDay',util.jsonget(questquery,'/VCDay'));
                                util.jsonadd(insertVCHeadArray,'/Memo',util.jsonget(questquery,'/Memo'));
                                util.jsonadd(insertVCHeadArray,'/SubmitTime',moment().format('YYYY-MM-DD HH:mm:ss'));
                                util.jsonadd(insertVCHeadArray,'/CreateBy',util.jsonget(questquery,'/userid'));
                                util.jsonadd(insertVCHeadArray,'/CreateTime',moment().format('YYYY-MM-DD HH:mm:ss'));

                                var sqlquery = Connection.query(insertVCHeadSQL1, insertVCHeadArray, function(err, result) {
                                  if (err) {
                                    callback('query err:'+err, null);

                                  }else   //Head插入后
                                  {
                                      util.log('debug','insertVCHeadSQL1 = ' +sqlquery.sql )
                                      SelectSQL="select last_insert_id() as id";
                                      var query = Connection.query(SelectSQL);
                                      query
                                      .on('error', function(sqlerr) {
                                        // Handle error, an 'end' event will be emitted after this as well
                                        results = sqlerr;
                                        util.jsonadd(results,'/sqlstmt',SelectSQL);
                                        Connection.rollback(function() {
                                          Connection.release();

                                          util.log('debug','rollback');
                                          //callback('query err' + err, null);
                                        });
                                        callback(sqlerr,null);
                                      })
                                      .on('result', function(rows) {
                                        // Pausing the connnection is useful if your processing involves I/O
                                        //connection.pause();
                                        last_insert_id = rows.id;
                                        util.log('debug','last_insert_id = : ' + last_insert_id);
                                                                                    //插入明细
                                            for (var i=0;i<totalrow;i++)
                                            ( function (i) {
                                                  util.jsonadd(insertVCDetailArray,'/VCFormID',last_insert_id);
                                                  util.jsonadd(insertVCDetailArray,'/ObjYMD',util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD'));
                                                  util.jsonadd(insertVCDetailArray,'/VCFromDt',util.jsonget(questquery,'/TrnVCFormDetail'+i+'/FromDt'));
                                                  util.jsonadd(insertVCDetailArray,'/VCToDt',util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ToDt'));
                                                  util.jsonadd(insertVCDetailArray,'/VCTime',util.jsonget(questquery,'/TrnVCFormDetail'+i+'/VCTime'));
                                                  util.jsonadd(insertVCDetailArray,'/DtVacationType',util.jsonget(questquery,'/TrnVCFormDetail'+i+'/vctype'));
                                                  util.jsonadd(insertVCDetailArray,'/SplitNo',util.jsonget(questquery,'/TrnVCFormDetail'+i+'/SplitNo'));
                                                  util.jsonadd(insertVCDetailArray,'/CreateBy',util.jsonget(questquery,'/userid'));
                                                  util.jsonadd(insertVCDetailArray,'/CreateTime',moment().format('YYYY-MM-DD HH:mm:ss'));

                                                  var insertVCDetailSQL1 = "insert into TrnVCFormDetail set ?";
                                                  //util.log("debug", 'insertOVDetailSQL1 = '+ insertOVDetailSQL1);

                                                  sqlquery = Connection.query(insertVCDetailSQL1, insertVCDetailArray, function(err, result) {

                                                      if (err) {
                                                       util.jsonadd(results,'/sqlstmt',err);
                                                       Connection.rollback(function() {
                                                           Connection.release();

                                                           util.log('debug','rollback');
                                                           //callback('update err' + err, null);
                                                       });
                                                       callback(results,null);
                                                      } // if(err) 839

                                                  });  //sqlquery = Connection.query(insertVCDetailSQL1,  832
                                                  done=i;
                                                  util.log('debug','run' + done + ':' + sqlquery.sql);
                                             })(i);
                                              //插入WH头表
                                            for (var i=0;i<totalrow;i++)
                                            ( function (i) {
                                              var ExistWHHead = ' select count(*) as count from TrnWHForm ';
                                              ExistWHHead += ' where EmployeeID = ' + Connection.escape(util.jsonget(questquery,'/userid'));
                                              ExistWHHead += ' and ObjYMD = ' + Connection.escape(util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD'));
                                              ExistWHHead += ' and DelFlg =0 ';
                                              sqlquery = Connection.query(ExistWHHead);
                                              util.log('debug',sqlquery.sql);
                                                sqlquery
                                                .on('error', function(sqlerr) {
                                                    results = sqlerr;
                                                    util.log('info','Connect error '+ sqlerr);
                                                    util.jsonadd(results,'/sqlstmt',selectSQL1);
                                                    Connection.rollback(function() {
                                                        Connection.release();

                                                        util.log('debug','rollback');
                                                        callback('query err' + err, null);
                                                    });
                                                    callback(sqlerr,null);

                                                  })
                                                .on('result', function(rows) {
                                                  util.log('debug','ExistWHHead return ' + JSON.stringify(rows));
                                                  var count =rows.count;
                                                      if(count=='0')  //考勤表没有记录
                                                        {
                                                            insertWHHeadSQL1 = ' insert into TrnWHForm ';
                                                            insertWHHeadSQL1 += ' set ? ';
                                                            util.jsonadd(insertWHHeadArray,'/EmployeeID',util.jsonget(questquery,'/userid'));
                                                            util.jsonadd(insertWHHeadArray,'/ObjYMD',util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD'));
                                                            util.jsonadd(insertWHHeadArray,'/CreateBy',util.jsonget(questquery,'/userid'));
                                                            util.jsonadd(insertWHHeadArray,'/CreateTime',moment().format('YYYY-MM-DD hh:mm:ss'));
                                                            sqlquery = Connection.query(insertWHHeadSQL1, insertWHHeadArray, function(err, result) {

                                                               if (err) {
                                                                    Connection.rollback(function() {
                                                                        Connection.release();

                                                                        util.log('debug','rollback');
                                                                        //callback('update err' + err, null);
                                                                    });
                                                                    callback('query err:'+err, null);
                                                                 }else{
                                                                  util.log('debug','insertWHHeadSQL1 = ' + sqlquery.sql);
                                                                 } // else 895
                                                               });
                                                        } // if(count=='0')
                                                  });  //.on('result', function(rows) {


                                            })(i);  // //插入WH头表  855
                                      })
                                      .on('end', function(rows)
                                      {
                                          for (var i=0;i<totalrow;i++)   //循环调用提交
                                                ( function (i) {
                                          //取得员工当前的组织CD和职位
                                          var getUserOrgPos = ' select b.OrgCD,c.PositionID ';
                                              getUserOrgPos += ' FROM RtnEmployeeOrg a, MstOrg b,MstPosition c ';
                                              getUserOrgPos += ' WHERE  a.FlgPart=0  ';
                                              getUserOrgPos += ' AND a.OrgCD=b.OrgCD AND a.UsefulFromDt >= b.UsefulFromDt AND a.UsefulToDt <= b.UsefulToDt  ';
                                              getUserOrgPos += ' AND a.PositionID = c.PositionID AND a.DelFlg="0" AND b.DelFlg="0" AND c.DelFlg="0" ';
                                              getUserOrgPos += ' AND EmployeeID ='  + Connection.escape(util.jsonget(questquery,'/userid'));
                                              getUserOrgPos += ' AND ' + Connection.escape(util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD')) + 'between  a.UsefulFromDt and a.UsefulToDt';
                                              getUserOrgPos += ' limit 1';

                                              sqlquery = Connection.query(getUserOrgPos);
                                              util.log('debug',sqlquery.sql);
                                              sqlquery
                                              .on('error', function(sqlerr) {
                                                                  results = sqlerr;
                                                                  util.log('info','Connect error '+ sqlerr);
                                                                  util.jsonadd(results,'/sqlstmt',selectSQL1);
                                                                  Connection.rollback(function() {
                                                                      Connection.release();

                                                                      util.log('debug','rollback');
                                                                      //callback('commit err' + err, null);
                                                                  });
                                                                  callback(sqlerr,null);
                                                                 })
                                              .on('result', function(rows) {
                                                util.log('debug','getUserOrgPos return ' + JSON.stringify(rows));
                                                 OrgCD =rows.OrgCD;
                                                 PositionID = rows.PositionID;
                                                })
                                              .on('end', function(result) {
                                                    //procWFSubmit(IN inObjYMD char(8), IN inWFType int, IN inTableKey int, IN inUserID int, IN inOrgCD varchar(64), IN inPositionID int, IN inMemo varchar(512), OUT outResult int)

                                                   var submitOVQuery=' call procWFSubmit( ';
                                                   submitOVQuery  += Connection.escape(util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD')) + ',3, '; //休假 inWFType=3
                                                   submitOVQuery  += last_insert_id + ',';
                                                   submitOVQuery  += Connection.escape(util.jsonget(questquery,'/userid')) + ',';
                                                   submitOVQuery  += OrgCD + ',';
                                                   submitOVQuery  += PositionID + ',';
                                                   submitOVQuery  +='"",@res) ; select cast(@res as char(90)) resu ;';

                                                   sqlquery = Connection.query(submitOVQuery);
                                                   util.log('debug',sqlquery.sql);
                                                   sqlquery
                                                                 .on('error', function(sqlerr) {
                                                                    results = sqlerr;
                                                                  util.log('info','Connect error '+ sqlerr);
                                                                  util.jsonadd(results,'/sqlstmt',selectSQL1);
                                                                  Connection.rollback(function() {
                                                                      Connection.release();

                                                                      util.log('debug','rollback');
                                                                      //callback('commit err' + err, null);
                                                                  });
                                                                  callback(sqlerr,null);
                                                                 })
                                                                 .on('fields', function(fields) {
                                                            // the field packets for the rows to follow
                                                          //console.log('fields',fields);
                                                          })
                                                                 .on('result', function(row,index) {
                                                                    //存储过程的结果放在第2句SQL的中
                                                                  if(index=1) {
                                                                    spreturn = row.resu;
                                                                    }
                                                                })
                                                                 .on('end',function(){
                                                                    switch(spreturn)
                                                                        {
                                                                        case '1':
                                                                          util.log('info','procWFSubmit return 1');
                                                                          //update flg
                                                                          if(i+1 == totalrow) { //明细行都更新完后
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
                                                                                        util.jsonadd(results,'/errmsg','insertVC complete');
                                                                                        //返回加班主表的ID
                                                                                        util.jsonadd(results,'/VCFormID',last_insert_id);
                                                                                        callback(null, results);
                                                                                      }
                                                                                    });
                                                                            }
                                                                          break;
                                                                        case '-1':

                                                                          util.log('info','procWFSubmit return 当前没有流程定义');
                                                                          util.jsonadd(results,'/errno','313');
                                                                          util.jsonadd(results,'/errmsg','当前没有流程定义');
                                                                          Connection.rollback(function() {
                                                                                        util.log('debug','rollback');
                                                                                        Connection.release();

                                                                                      });
                                                                          callback(null,results);
                                                                          break;
                                                                        case '-2':

                                                                          util.log('info','procWFSubmit return 当前存在多个流程定义');
                                                                          util.jsonadd(results,'/errno','314');
                                                                          util.jsonadd(results,'/errmsg','当前存在多个流程定义');
                                                                          Connection.rollback(function() {
                                                                                        util.log('debug','rollback');
                                                                                        Connection.release();

                                                                                      });
                                                                          callback(null,results);
                                                                          break;
                                                                        case '-3':

                                                                          util.log('info','procWFSubmit return 加班申请时，工时已经在申请/提交状态');
                                                                          util.jsonadd(results,'/errno','315');
                                                                          util.jsonadd(results,'/errmsg','加班申请时，工时已经在申请/提交状态');
                                                                          Connection.rollback(function() {
                                                                                        util.log('debug','rollback');
                                                                                        Connection.release();

                                                                                      });
                                                                          callback(null,results);
                                                                          break;
                                                                        case '-4':

                                                                          util.log('info','procWFSubmit return 休假申请时，工时已经在申请/提交状态');
                                                                          util.jsonadd(results,'/errno','316');
                                                                          util.jsonadd(results,'/errmsg','休假申请时，工时已经在申请/提交状态');
                                                                          Connection.rollback(function() {
                                                                                        util.log('debug','rollback');
                                                                                        Connection.release();

                                                                                      });
                                                                          callback(null,results);
                                                                          break;

                                                                        case '-100':
                                                                          util.log('info','procWFSubmit return SQL执行错误');
                                                                          util.jsonadd(results,'/errno','400');
                                                                          util.jsonadd(results,'/errmsg','SQL执行错误');
                                                                          Connection.rollback(function() {
                                                                                        util.log('debug','rollback');
                                                                                        Connection.release();

                                                                                      });
                                                                          callback(null,results);
                                                                          break;

                                                                        case '0':
                                                                          util.log('info','procWFSubmit return SQL执行错误');
                                                                          util.jsonadd(results,'/errno','400');
                                                                          util.jsonadd(results,'/errmsg','SQL执行错误');
                                                                          Connection.rollback(function() {
                                                                                        util.log('debug','rollback');
                                                                                        Connection.release();

                                                                                      });
                                                                          callback(null,results);
                                                                          break;
                                                                        }

                                                      }); // sqlquery = Connection.query(submitOVQuery); on end
                                                }); //  sqlquery = Connection.query(getUserOrgPos); on end  910
                                            })(i); //循环取得组织code后提交  907

                                      });  // .on('end'  817
                                    } //Head插入后 800
                                   });//var sqlquery = Connection.query(insertVCHeadSQL1, insertVCHeadArray, function(err  795

                            } // 782 else
                        }); //Connection.beginTransaction(function(err) {  779
                    }
            }); //pool.getConnection(function(sqlerr, Connection)

    },
    ],function(sqlerr,results){

          if(sqlerr == null||sqlerr == '' ){

            util.log('debug','insertVC returns');
            util.log('debug',JSON.stringify(results));
            callback(results);
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = {"errno":"400",
                    "errmsg:":sqlerr,
                  }
            util.jsonadd(results,'/errno','400');
            util.jsonadd(results,'/errmsg',sqlerr);
              // util.jsonadd(results,'/rowcount',i);
            util.log('info','insertVC returns');
            util.log('info',JSON.stringify(results));
            callback(results);
          }
      }); //async.series end

}
;

//休假申请时检验顺序

function VCInfoValidateCheck(questquery,callback){

  util.log('debug','VCInfoValidateCheck get questquery' + JSON.stringify(questquery));
  var totalrow = util.jsonget(questquery,'/detailrow');
  var err={
    errno:"",
    errmsg:"",
    module:"VCSubmit"
  }

  var arr = [{ userid:'',startdt:'',enddt:''
  }]
  ;

  var count = 0;
  var paidtotaltime = 0; //申请表单中的有薪假合计
  var paidtotalday = 0;
  var lieutotaltime = 0; //申请表单中的调休合计
  var lieutotalday = 0;
  var totaltime = 0;
  var totalday = 0;
  var leftPaidVCTime = 0; //剩余有薪假 分钟
  var leftLieuVCTime = 0; //剩余调休 分钟

  var currentyear = 0 ;
  var lastyear = 0;

//并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行
//如果某个函数出错，则立刻将err和已经执行完的函数的结果值传给parallel最终的callback。
async.parallel([
    //数据格式校验  308 数据格式校验错误 ,317 有薪假和调休
    function(callback){
     /*
      ObjYMD":"20140901",'
      +'"FromDt":"0900",'
      +'"ToDt":"1730",'
      +'"VCTime":"8.5",'
      +'"vctype":"1",'
      +'"SplitNo":"1"'
      */
      util.log('debug','308,317 enter');
        var arr308 = [] ;
            for (var i=0;i<totalrow;i++)
                ( function (i) {   //循环取得每一条明细申请的时间

                      arr308[i] ={
                        vctype:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/vctype'),
                        FromDt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/FromDt'),
                        ToDt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ToDt'),
                        currentdt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD'),
                        SplitNo:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/SplitNo'),
                        no:i
                      }
                })(i);

                async.forEachSeries(arr308, function(item308 , callback) {
                   util.log('debug' , item308.vctype+ moment(item308.currentdt,"YYYY-MM-DD").toString() +  item308.FromDt + item308.ToDt );
                   if((item308.vctype==1 || item308.vctype==2)){

                            if((typeof parseInt(item308.SplitNo))=='number'){

                                util.log('debug',moment(item308.currentdt,"YYYY-MM-DD").toString()+' '+ moment(item308.currentdt,'YYYY-MM-DD').isValid());
                                  if(moment(item308.currentdt,'YYYYMMDD').isValid()){
                                        if((typeof parseInt(item308.FromDt))=='number' && (typeof parseInt(item308.ToDt))=='number'){
                                            cb = {
                                              "errn":200
                                            }
                                            callback(null,cb);
                                        }else{
                                          cb = {
                                            "errno":"308",
                                            "errmsg:":"数据格式校验错误FromDt/ToDt",
                                            "No":item308.no,
                                            "module":"VCSubmit"
                                            }
                                            callback(cb,null);
                                        }
                                      }else{
                                              cb = {
                                              "errno":"308",
                                              "errmsg:":"数据格式校验错误ObjYMD",
                                              "No":item308.no,
                                              "module":"VCSubmit"
                                              }
                                              callback(cb,null);
                                            }
                                  }else{   //if((typeof item308.SplitNo)=='number'){
                                                  cb = {
                                                        "errno":"308",
                                                        "errmsg:":"数据格式校验错误SplitNo",
                                                        "No":item308.no,
                                                        "module":"VCSubmit"
                                                      }
                                                      callback(cb,null);
                                        }//else

                          }else{

                               cb = {
                                    "errno":"317",
                                    "errmsg:":"只可以申请有薪假和调休",
                                    "No":i,
                                    "module":"VCSubmit"
                                  }
                                  callback(cb,null);
 
                            }//else

                            //foreach

               }, function(err) {

                    if(err!= null && err !=''){
                      util.log('info','308,317 err: ' + JSON.stringify(err));
                      callback(err);
                    }

                      else{
                      callback(null,'308,317 check pass');
                    }

                }
               );
    },

     //302 该条休假数据时间和其他工时/加班/休假时间冲突 305 休假不可以跨月
     function(callback){
        util.log('debug','302,305 enter');
        var arr302 = [] ;
        for (var i=0;i<totalrow;i++)
                ( function (i) {   //循环取得每一条明细申请的时间
                      arr302[i] ={
                        no:i,
                        userid:util.jsonget(questquery,'/userid'),
                        startdt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD'),
                        enddt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD'),
                        vctype:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/vctype'),
                        FromDt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/FromDt'),
                        ToDt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ToDt'),
                        currentdt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD')
                      };
                    currentyear = moment(util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD'),'YYYYMMDD');
                     if(currentyear != 0 && lastyear != 0){
                      if(currentyear.year() != lastyear.year() || currentyear.month() != lastyear.month()) {
                              cb = {
                                    "errno":"305",
                                    "errmsg:":"休假不可以跨月",
                                    "No":i,
                                    "module":"VCSubmit"
                                  }
                                  callback(cb,null);
                      }
                     }else
                     {
                      lastyear = currentyear;
                     }
                })(i);
                //检查申请的时间是否有重叠
                for (var i=0;i<totalrow;i++)
                 ( function (i) {
                     for (var j=0;j<totalrow;j++)
                         ( function (j) {
                          util.log('debug','时间重叠check:'+ i+':' + j + ' ' + arr302[i].startdt+ ' ' + arr302[j].startdt+ ' ' + arr302[i].FromDt+ '<=' +   arr302[j].ToDt + ' ' +   arr302[i].ToDt +  '>' + arr302[j].FromDt)
                                //(arr302[i].no < arr302[j].no) 避免重复check
                              if( (arr302[i].no < arr302[j].no) && (arr302[i].startdt==arr302[j].startdt ) && ( arr302[i].FromDt <= arr302[j].ToDt && arr302[i].ToDt > arr302[j].FromDt ) ){
                                cb = {
                                    "errno":"302",
                                    "errmsg:":"该条休假数据时间和其他工时/加班/休假时间冲突",
                                    "No":i,
                                    "module":"VCSubmit"
                                  }
                                  callback(cb,null);
                              }

                         })(j);
                 })(i);

                async.forEachSeries(arr302, function(item302, callback) {
                      whList.getExistWHList(item302,null,
                          function(cb){
                           if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') != 300  ){  //返回结果中有数据
                                  cb = {
                                            "errno":"302",
                                            "errmsg:":"该条休假数据时间和其他工时/加班/休假时间冲突",
                                            "No":item302.no,
                                            "module":"VCSubmit"
                                          }
                                  callback(cb,null);

                                }else{
                                  callback(null,cb);
                                }

                          });



                }, function(err) {

                    if(err!= null && err !=''){
                      util.log('info','302,305 err: ' + JSON.stringify(err));
                      callback(err);
                    }

                      else{
                      callback(null,'302,305 check pass');
                    }

                });  // async.forEach(

        //callback(null,'1212');//callback('','302 OK');
    },


      //303
     function(callback){
        util.log('debug','303 enter'); //303.休假时间必须是出勤日
        var arr303 = [] ;
        for (var i=0;i<totalrow;i++)
                ( function (i) {   //循环取得每一条明细申请的时间
                      arr303[i] ={
                        no:i,
                        userid:util.jsonget(questquery,'/userid'),
                        startdt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD'),
                        enddt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD'),
                        dtdaytype:1  //出勤日
                      };
                })(i);

                async.forEachSeries(arr303, function(item303, callback) {
                      login.getCalendar(item303,null,
                          function(cb){
                           if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') != 200  ){  //没有正确取得日历
                                  cb = {
                                            "errno":"303",
                                            "errmsg:":"休假时间必须是出勤日",
                                            "No":item303.no,
                                            "module":"VCSubmit"
                                          }
                                  callback(cb,null);

                                }else{
                                  callback(null,cb);
                                }

                          });
                }, function(err) {

                    if(err!= null && err !=''){
                      util.log('info','303 err: ' + JSON.stringify(err));
                      callback(err);
                    }

                      else{
                          callback(null,'303 check pass');
                    }

                });  // async.forEach(

        //callback(null,'1212');//callback('','302 OK');
    },

    //301,306,311,312,304,309,310
    function(callback){
          util.log('debug','301,306,311,312,304,309,310 enter');
          var arr301 =[];
                for (var i=0;i<totalrow;i++)
                ( function (i) {   //循环取得每一条明细申请的时间
                      arr301[i] ={
                        no:i,
                        userid:util.jsonget(questquery,'/userid'),
                        startdt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD'),
                        enddt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD'),
                        vctype:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/vctype'),
                        FromDt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/FromDt'),
                        ToDt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ToDt'),
                        currentdt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD')
                      };
                })(i);
                //util.log('debug',arr);
                //console.log('arr is ' + arr);

                // 所有操作并发执行，且全部未出错，最终得到的err为undefined。注意最终callback只有一个参数err。
                //根据明细取得考勤规则
                async.forEachSeries(arr301, function(item301, callback) {
                      //util.log('debug','1.1 enter: ' + item.userid +  item.startdt  +  item.enddt );
                            async.auto({  //先执行WHSetting和VCSetting 再合并在一起
                                        WHSetting: function (callback) {
                                                /*
                                                var settingquery = {
                                                  userid:util.jsonget(questquery,'/userid'),
                                                  startdt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD'),
                                                  enddt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD')
                                                }
                                                */
                                              login.getWHSetting(item301,null,
                                                function(cb){
                                                    //util.log('debug','No:' + item.no + ' VCSubmit.getWHSetting return ' + JSON.stringify(cb));
                                                      if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') != 200){  //没有正确取得考勤规则
                                                        cb = {
                                                                  "errno":"301",
                                                                  "errmsg:":"VCSubmit.getWHSetting Error",
                                                                  "No":item301.no,
                                                                  "module":"VCSubmit"
                                                                }
                                                        callback(cb,null);

                                                      }else{
                                                        callback(null,cb);
                                                      }

                                                });
                                            },  //WHSetting: function (callback)
                                        VCSetting: function (callback) {
                                                /*
                                                var vcsettingquery = {
                                                  userid:util.jsonget(questquery,'/userid'),
                                                  startdt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD'),
                                                  enddt:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/ObjYMD'),
                                                  vctype:util.jsonget(questquery,'/TrnVCFormDetail'+i+'/vctype')
                                                 }
                                                */
                                              getVCSetting(item301,null,
                                                function(cb){
                                                  //util.log('debug','No:' + item.no + ' VCSubmit.VCSetting return ' + JSON.stringify(cb));
                                                  if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') != 200){  //没有正确取得休假规则
                                                        cb = {
                                                                  "errno":"301",
                                                                  "errmsg:":"VCSubmit.getVCSetting Error",
                                                                  "No":item301.no,
                                                                  "module":"VCSubmit"
                                                                }
                                                        callback(cb,null);

                                                      }else{
                                                        callback(null,cb);
                                                      }

                                                });
                                            },  //VCSetting: function (callback)

                                          PaidVCTime: function (callback) {

                                            if(item301.vctype==1){
                                              whList.getPaidVCTime(item301,null,
                                                function(cb){
                                                  //console.log(cb);
                                                 if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') != 200  ){  //有薪假天数不可为负数
                                                        cb = {
                                                                  "errno":"309",
                                                                  "errmsg:":"有薪假天数不可为负数",
                                                                  "No":item301.no,
                                                                  "module":"VCSubmit"
                                                                }
                                                        callback(cb,null);
                                                        //util.log('debug','有薪假天数不可为负数' + cb);
                                                      }else{
                                                          //申请的天数+已用的天数小于有薪假天数检查的check放在301，306部分
                                                          leftPaidVCTime = ( Number(util.jsonget(cb,'/LeftWH')) - Number(util.jsonget(cb,'/VCWH')) );
                                                          util.log('info','No' + item301.no + '剩余有薪假小时:' +  leftPaidVCTime);
                                                          callback(null,cb);

                                                      }

                                                  });
                                                }else{
                                                    leftPaidVCTime = 0;
                                                    callback(null,'cb');
                                                }
                                          },
                                        LieuVCTime: function (callback) {
                                            if(item301.vctype==2){
                                                whList.getLieuVCTime(item301,null,
                                                function(cb){

                                                      if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') != 200  ){  //调休天数不能为负数
                                                        cb = {
                                                                  "errno":"310",
                                                                  "errmsg:":"调休天数不能为负数",
                                                                  "No":item301.no,
                                                                  "module":"VCSubmit"
                                                                }
                                                        callback(cb,null);
                                                        //util.log('debug','有薪假天数不可为负数' + cb);
                                                      }else{
                                                          //申请的天数+已用的天数小于有薪假天数检查的check放在301，306部分
                                                          leftLieuVCTime =  Number(util.jsonget(cb,'/LeftWH')) ;
                                                          util.log('info','No' + item301.no + '剩余调休小时数:' +  leftLieuVCTime);
                                                          callback(null,cb);

                                                      }
                                                });
                                            }else{
                                              leftLieuVCTime = 0;
                                              callback(null,'cb');
                                            }
                                          },
                                      resultsDetailList: ['WHSetting', 'VCSetting','PaidVCTime','LieuVCTime', function(callback,results) {

                                            util.log('debug','No:' + item301.no + ' resultsDetailList: ' + JSON.stringify(results));

                                              //取得考勤规则后，校验306,311，312，309
                                              var duration = (parseInt(item301.ToDt/100)*60 + item301.ToDt%100)  - (parseInt(item301.FromDt/100)*60 + item301.FromDt%100);
                                              console.log('请求的时间段 ' + duration);

                                              //申请的时间减去中午午休的时间
                                              //开始时间小于午休开始时间，结束时间大于午休结束时间
                                              if( item301.FromDt < util.jsonget(results,'/WHSetting/queryresult0/MiddleFrom') && item301.ToDt > util.jsonget(results,'/WHSetting/queryresult0/MiddleTo') ){
                                                duration = duration - ( (parseInt(util.jsonget(results,'/WHSetting/queryresult0/MiddleTo')/100)*60 + util.jsonget(results,'/WHSetting/queryresult0/MiddleTo')%100)  - (parseInt(util.jsonget(results,'/WHSetting/queryresult0/MiddleFrom')/100)*60 + util.jsonget(results,'/WHSetting/queryresult0/MiddleFrom')%100) );
                                                console.log('开始时间小于午休开始时间，结束时间大于午休结束时间 ' + duration);
                                              }

                                              //开始时间小于午休开始时间，结束时间在午休期间内
                                              if( item301.FromDt < util.jsonget(results,'/WHSetting/queryresult0/MiddleFrom') && item301.ToDt < util.jsonget(results,'/WHSetting/queryresult0/MiddleTo') && item301.ToDt > util.jsonget(results,'/WHSetting/queryresult0/MiddleFrom') ){
                                                duration = duration - ( (parseInt(item301.ToDt/100)*60 + item301.ToDt%100) - (parseInt(util.jsonget(results,'/WHSetting/queryresult0/MiddleFrom')/100)*60 + util.jsonget(results,'/WHSetting/queryresult0/MiddleFrom')%100) );
                                                console.log('开始时间小于午休开始时间，结束时间在午休期间内 ' + duration);
                                              }

                                              //开始时间在午休期间内，结束时间大于午休结束时间
                                              if( item301.FromDt > util.jsonget(results,'/WHSetting/queryresult0/MiddleFrom') && item301.FromDt < util.jsonget(results,'/WHSetting/queryresult0/MiddleTo') && item301.ToDt > util.jsonget(results,'/WHSetting/queryresult0/MiddleTo')  ){
                                                duration = duration - ( (parseInt(util.jsonget(results,'/WHSetting/queryresult0/MiddleTo')/100)*60 + util.jsonget(results,'/WHSetting/queryresult0/MiddleTo')%100)  - (parseInt(item301.FromDt/100)*60 + item301.FromDt%100) );
                                                console.log('开始时间在午休期间内，结束时间大于午休结束时间 ' + duration);
                                              }

                                              //开始时间大于午休开始时间，结束时间小于午休结束时间 304错误
                                              if( item301.FromDt >= util.jsonget(results,'/WHSetting/queryresult0/MiddleFrom') && item301.ToDt <= util.jsonget(results,'/WHSetting/queryresult0/MiddleTo') ){
                                                cb = {
                                                                    "errno":"304",
                                                                    "errmsg:":"休假时间必须是出勤日的正常出勤时间内",
                                                                    "No":item301.no,
                                                                    "module":"VCSubmit"
                                                                  }
                                                                  callback(cb,null);
                                              }
                                              //var minduration = item.FromDt - time.ToDt;
                                              util.log('debug','No' + item301.no + '休假持续时间:' + duration + '分钟');
                                              util.log('debug', '换算成天：' + ( Number(duration)/60/Number((util.jsonget(results,'/WHSetting/queryresult0/avgHour'))) ) );
                                              //将计算出的持续时间更新回questquery的vctime
                                              //VCDay 最后更新

                                              util.jsonadd(questquery,'/TrnVCFormDetail'+item301.no+'/VCTime',( Number(duration)/60));
                                              //util.jsonadd( questquery,'/TrnVCFormDetail0/VCTime', ( parseInt(Number(duration)/Number((util.jsonget(results,'/WHSetting/queryresult0/avgHour')))) ) );
                                              //util.jsonadd( questquery,'/TrnVCFormDetail1/VCTime',1);
                                              //根据每天的规则合计
                                              if(item301.vctype == 1){

                                              paidtotaltime +=  duration;  //分钟
                                              paidtotalday = Number(paidtotalday) + ( Number(duration)/60/Number((util.jsonget(results,'/WHSetting/queryresult0/avgHour')))  );  //根据每天的考勤规则转换成天
                                              totalday += paidtotalday;
                                              }

                                              if(item301.vctype == 2){

                                              lieutotaltime +=  duration;  //分钟
                                              lieutotalday = Number(lieutotalday) + ( Number(duration)/60/Number((util.jsonget(results,'/WHSetting/queryresult0/avgHour')))  );  //根据每天的考勤规则转换成天
                                              totalday += lieutotalday;
                                              }


                                              if(item301.vctype == 1) {
                                                    if(parseInt(paidtotaltime/60) > leftPaidVCTime) {
                                                    //剩余的有薪假 < 本次申请的合计
                                                    util.log('debug',parseInt(totaltime/60) +'>' +  leftPaidVCTime);
                                                    cb = {
                                                            "errno":"309",
                                                            "errmsg:":"有薪假天数不可为负数",
                                                            "No":item301.no,
                                                            "module":"VCSubmit"
                                                          }
                                                          callback(cb,null);
                                                      }
                                              }

                                              if(item301.vctype == 2) {
                                                    if(parseInt(lieutotaltime/60) > leftLieuVCTime) {
                                                    //剩余的调休 < 本次申请的合计
                                                      util.log('debug',parseInt(totaltime/60) +'>' +  leftLieuVCTime);
                                                      cb = {
                                                              "errno":"310",
                                                              "errmsg:":"调休天数不能为负数",
                                                              "No":item301.no,
                                                              "module":"VCSubmit"
                                                            }
                                                            callback(cb,null);
                                                    }
                                              }



                                              if(duration < (util.jsonget(results,'/VCSetting/queryresult0/ApplyStartWH')*60) ){
                                                //休假持续时间小于起始单位
                                                    util.log('debug',duration + '<' + (util.jsonget(results,'/VCSetting/queryresult0/ApplyStartWH')*60));
                                                    cb = {
                                                        "errno":"311",
                                                        "errmsg:":"休假不符合起始单位",
                                                        "No":item301.no,
                                                        "module":"VCSubmit"
                                                      }
                                                      callback(cb,null);

                                              }else{
                                                  //console.log((duration - util.jsonget(results,'/VCSetting/queryresult0/ApplyStartWH')*60)%(util.jsonget(results,'/VCSetting/queryresult0/MinUsedUnit')*60));
                                                  if( parseInt((duration - util.jsonget(results,'/VCSetting/queryresult0/ApplyStartWH')*60)/(util.jsonget(results,'/VCSetting/queryresult0/MinUsedUnit')*60) <= 0)
                                                      ||
                                                    (duration - util.jsonget(results,'/VCSetting/queryresult0/ApplyStartWH')*60)%(util.jsonget(results,'/VCSetting/queryresult0/MinUsedUnit')*60) != 0 ){
                                                     //(休假持续时间 - 起始单位 ) 除以最下单位后，有余数
                                                              cb = {
                                                                    "errno":"312",
                                                                    "errmsg:":"休假不符合最小单位",
                                                                    "No":item301.no,
                                                                    "module":"VCSubmit"
                                                                  }
                                                                  callback(cb,null);
                                                    }
                                                  else{
                                                    if(item301.ToDt > util.jsonget(results,'/WHSetting/queryresult0/PMTo') ||item301.FromDt < util.jsonget(results,'/WHSetting/queryresult0/AMFrom')){
                                                       //申请的时间在规定的出勤时间外
                                                       //util.log('debug',item301.ToDt,util.jsonget(results,'/WHSetting/queryresult0/PMTo'),item301.FromDt,util.jsonget(results,'/WHSetting/queryresult0/AMFrom'));
                                                                cb = {
                                                                    "errno":"304",
                                                                    "errmsg:":"休假时间必须是出勤日的正常出勤时间内",
                                                                    "No":item301.no,
                                                                    "module":"VCSubmit"
                                                                  }
                                                                  callback(cb,null);
                                                      }else{


                                                        if(util.jsonget(results,'/VCSetting/queryresult0/FlgWhole') == '0'){
                                                            callback(null,results);

                                                        }else{
                                                            if(item301.ToDt != util.jsonget(results,'/WHSetting/queryresult0/PMTo') ||item301.FromDt != util.jsonget(results,'/WHSetting/queryresult0/AMTo')){
                                                               //休假类型必须是全天，那么申请的时间应该是考勤规则中的开始和结束时间
                                                                  cb = {
                                                                      "errno":"306",
                                                                      "errmsg:":"休假必须是全天",
                                                                      "No":item301.no,
                                                                      "module":"VCSubmit"
                                                                    }
                                                                    callback(cb,null);
                                                            }
                                                            else{


                                                                callback(null,results);
                                                            }
                                                        } // else if(util.jsonget(results,'/VCSetting/queryresult0/FlgWhole') == '0'){
                                                      } //else if(item.ToDt >= util.jsonget(results,'/WHSetting/queryresult0/PMTo') ||　item.FromDt >= util.jsonget(results,'/WHSetting/queryresult0/AMTo')){
                                                  } //else

                                            } //else
                                        }]
                                      }, function(err, results) {

                                          if(err!= null && err !=''){
                                            util.log('debug','301 err:' + 'No' + item301.no + ' '+ JSON.stringify(err));
                                            callback(err,null);

                                          }else{

                                          util.log('debug','No' + item301.no + ' 306,311,312 check Ok ');
                                          //callback(null,results);
                                          //callback(null,item.no);
                                          count+=1;

                                          callback('','results');

                                          }
                                        }
                                    );  // async.auto({

                }, function(err) {

                    if(err!= null && err !=''){
                      util.log('info','301 err: ' + JSON.stringify(err));
                      callback(err);
                    }

                      else{

                        if(count==totalrow){
                          callback(null,'301,306,311,312 check pass');
                        }
                    }

                });  // async.forEach(
    }
],
// optional callback
function(err, results){
    //console.log('parallel!' + err);
    if(err!= null && err !=''){
                    callback(err);
                  }else
                  {
                     cb = {
                        "errno":"200",
                        "errmsg:":"Check pass",
                        "No":null,
                        "module":"VCSubmit"
                      }
                      //合计时间更新回head表
                      //util.log('debug','totalday is ' + totalday);
                      //util.jsonadd(questquery,'/VCDay', totalday);
                      util.jsonadd(questquery,'/VCDay', lieutotalday + paidtotalday);
                      callback(cb);
                  }
});



};



exports.getVCSetting = getVCSetting;
exports.VCDelete = VCDeleteHandle;
exports.VCSubmit = VCSubmit;