/*


insert into trnvcform (EmployeeID, ApplyDate, SubmitTime, DtAppStatus, FileID, VCDay, Memo, DelFlg, CreateTime, CreateBy, UpdateTime, UpdateBy ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ) 
insert into trnvcformdetail (VacationSettingID, VCFormID, SplitNo, ObjYMD, VCFromDt, VCToDt, VCTime, DtVacationType, FlgHR, DelFlg, CreateTime, CreateBy, UpdateTime, UpdateBy ) 
values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ) 



休假种类为①＋②＋③＋④。																															
①有薪休假/调休/人事设定的特别休假																															
		该类休假在申请前已经事先拥有，用户在申请后直接进入审批流程由上长承认																													
		如果选择了特别休假，需要再选择特别休假名称。																													
		特别休假剩余天数取得：在特别休假设定表及特别休假员工关联表中，根据特别休假表ID，员工表ID及休假开始日取得剩余的休假天数；																													
												填写的休假开始日及休假截止日必须在休假开始日到调休申请截止日的范围内。																			
		①类休假在申请时是不会实际占用休假，上长承认休假申请之后扣假。																													
																															
②病假/病假（保胎假）/事假/工伤假/其他休假（地铁延误等）																															
		该类休假在申请前为0，用户按需申请																													
		病假/病假（保胎假）的场合，连续3天（含）以上需要上传病假证明（要Check）																													
		其他休假（地铁延误等）的场合，申请休假的时候需要上传附件。（要Check）																													
																															
③产前假/产假/流产假																															
		该类休假在申请前为0，用户按需申请，该休假申请后人事可以随时修改（审批通过后也可以修改）																													
		以天为单位进行申请。																													
																															
④婚假/丧假/产前检查/陪产假/孕期工间休息（1H/天）/哺乳时间/哺乳假/晚育护理假																															
		该类假期剩余天数取得：在员工个人假期表中，根据员工表ID+D假期种类及休假开始日取得剩余的休假天数；																													
												填写的休假开始日及休假截止日必须在休假开始日到调休申请截止日的范围内。																			
		选择这类休假时，如果剩余天数为0的话，提示信息【是否提交休假期间申请】，如果选择是，就跳转到【休假期间申请】机能																													
		如果选择否，休假种类初始化为空白																													
		如果剩余天数大于0的话，可以填写休假申请。流程和①相同。																													
		④类休假在申请时不会实际占用休假，上长承认休假申请之后扣假。																													



只处理1，2，3类假，4类假不能在web端申请

2类假只保存，不提交，需要web端上传照片证明
3类假只能按天申请



加班申请返回值.说明

200 成功


*/


var mysql = require('mysql');
var mysqlconn = require('../dbutil/mysqlconn.js');
var sys = require('sys');
var util = require('../util/util.js');
var async = require('async');


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
          util.log('log','get ConnectPool error');
          util.log('log',sqlerr);
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
                util.log('log','Connect error '+ sqlerr);
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
           
            util.log('log','getVCSetting returns');
            util.log('log',JSON.stringify(results));
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


            util.log('log','getVCSetting returns Error');
            util.log('log',JSON.stringify(results));
            callback(results);
          }


            

            
      }); //async.series end

}

exports.getVCSetting = getVCSetting