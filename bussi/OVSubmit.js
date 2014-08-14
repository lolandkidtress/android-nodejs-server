/*

insert into TrnOVForm ( EmployeeID ,ObjYMD,OVWH, DtAppStatus , DelFlg , CreateTime, CreateBy, UpdateTime, UpdateBy, FlgHR ) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ) 

insert into TrnWHForm ( EmployeeID, ObjYMD, DtAppStatus, DelFlg, CreateTime, CreateBy, UpdateTime, UpdateBy, FlgBYD, FlgHR ) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ) 

insert into TrnOVFormDetail ( OVFormID, FromDt, ToDt, PJInfoID, OVWH, FlgOut, FlgPJG, DelFlg, CreateTime, CreateBy, UpdateTime, UpdateBy ) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ) 

OVSubmit={
	userid:26,startdt:20140501,enddt:20140531,uuid:7485d6b3-c8b6-43b9-bea0-8fc8a8f2400f,applydate:20140525,"ovwh":"",
	TrnOVForm:{
		EmployeeID:"",
		ObjYMD:"",
		OVWH:"",
		DtAppStatus:""
	},
	TrnOVFormDetail0:{
		FromDt:"",
		ToDt:"",
		PJInfoID:"",
		OVWH:"",
		FlgOut:"",
		FlgPJG:""
	},
	TrnOVFormDetail1:{
		FromDt:"",
		ToDt:"",
		PJInfoID:"",
		OVWH:"",
		FlgOut:"",
		FlgPJG:""
	},
	detailrow:2,

}


加班申请返回值.说明


200.成功
301.没有设定考勤规则
302.该条加班数据日期和其他工时/加班/休假区间冲突
303.没有设定过日历
304.加班时间必须是出勤日的正常出勤时间以外或休日/国定假日/IV休日的日期
305.开始或结束时间不符合门禁时间 （公司外为否的数据，最小开始时间不能小于门禁打卡时间；最大的结束时间不能大于门禁打卡时间）
306.项目没有分配工时（PJ中没有分配该员工或者选择的加班项目为PJG的场合，如果该员工在PJG下所有PJ中都没有该月的预定工数或者预定工数为0，报错。）
307.项目不可以为非稼动
308.
309.
310.
311.非出勤日的加班时间不能小于加班起算时间
312.加班时间不符合最小单位
313.没有设定考勤审批工作流
314.考勤审批工作流重复
315.加班申请时，工时已经在申请/提交状态
316.休假申请时，工时已经在申请/提交状态


400 系统异常

500 用户失效
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


function OVInfoValidateCheck(questquery,callback){
	util.log('debug','OVInfoValidateCheck get questquery' + JSON.stringify(questquery));

  var totalrow = util.jsonget(questquery,'/detailrow');
  var err={
    errno:"",
    errmsg:"",
    module:"VCSubmit"
  }

  var arr = [{ userid:'',startdt:'',enddt:''
  }]
  ;
  var currentyear = 0 ;
  var lastyear = 0;
  var duration = 0;

  	//并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行
	//如果某个函数出错，则立刻将err和已经执行完的函数的结果值传给parallel最终的callback。
	async.parallel([

		function(callback){
		//数据格式check
		util.log('debug','308 enter');
        var arr308 = [] ;
            for (var i=0;i<totalrow;i++)
                ( function (i) {   //循环取得每一条明细申请的时间

                      arr308[i] ={
                        FromDt:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FromDt'),
                        ToDt:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/ToDt'),
                        FlgPJG:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FlgPJG'),
                        FlgOut:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FlgOut'),
                        no:i
                      }
                })(i);

                if(moment(util.jsonget(questquery,'/applydate'),'YYYYMMDD').isValid()){
	                async.forEachSeries(arr308, function(item308 , callback) {
	                      if(typeof parseInt(item308.FlgPJG) =='number'){
	                      		if( item308.FlgOut == 1 || item308.FlgOut == 2  ){
	                      			if((typeof parseInt(item308.FromDt))=='number' && (typeof parseInt(item308.ToDt))=='number' && parseInt(item308.FromDt)<= parseInt(item308.ToDt)){
	                      				cb = {
	                                      "errn":200
	                                    }
	                                    callback(null,cb);
	                      			}else{
	                      				cb = {
			                              "errno":"308",
			                              "errmsg:":"数据格式校验错误FromDt/ToDt",
			                              "No":item308.no,
			                              "module":"OVSubmit"
			                              }
		                            	callback(cb,null);
	                      				}

	                      		}else{
	                      			cb = {
		                              "errno":"308",
		                              "errmsg:":"数据格式校验错误FlgOut",
		                              "No":item308.no,
		                              "module":"OVSubmit"
		                              }
		                            callback(cb,null);
	                      		}
	                      }else{
	                      	cb = {
	                              "errno":"308",
	                              "errmsg:":"数据格式校验错误FlgPJG",
	                              "No":item308.no,
	                              "module":"OVSubmit"
	                              }
	                              callback(cb,null);
	                      }

		               }, function(err) {

		                    if(err!= null && err !=''){
		                      util.log('info','308 err: ' + JSON.stringify(err));
		                      callback(err);
		                    }

		                      else{
		                      callback(null,'308 check pass');
		                    }

		                }
		               ); //async.forEachSeries
 					}else{
                				cb = {
	                              "errno":"308",
	                              "errmsg:":"数据格式校验错误applydate",
	                              "module":"OVSubmit"
	                              }
	                              callback(cb,null);
                	}

    	},

		//301,304,308,309,310,311,312
		function(callback){
			util.log('debug','301,303,304,308,309,310,311,312');
			var arr301=[];
					for (var i=0;i<totalrow;i++)
			                ( function (i) {   //循环取得每一条明细申请的时间
			                      arr301[i] ={
			                        no:i,
			                        userid:util.jsonget(questquery,'/userid'),
			                        pjinfoid:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/PJInfoID'),
			                        FromDt:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FromDt'),
			                        startdt:util.jsonget(questquery,'/applydate'),
                        			enddt:util.jsonget(questquery,'/applydate'),
			                        ToDt:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/ToDt'),
			                        FlgOut:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FlgOut'),
			                        FlgPJG:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FlgPJG'),
			                        currentdt:util.jsonget(questquery,'/applydate')
			                      };
			                })(i);
			          async.forEachSeries(arr301, function(item301, callback) {
			          			 async.auto({
			          			 	//取得考勤规则
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
                                                                  "errmsg:":"没有设定考勤规则",
                                                                  "No":item301.no,
                                                                  "module":"OVSubmit"
                                                                }
                                                        callback(cb,null);

                                                      }else{
                                                        callback(null,cb);
                                                      }

                                                });
                                            },  //WHSetting: function (callback)
                                     //根据申请日取得出勤日历
                                     calendar: function (callback) {
                                     		login.getCalendar(item301,null,
                                     			function(cb){
                                     				if(util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') == 200){  //取得了日历
                                     					callback(null,cb);
                                     				}
                                     				else
                                     				{	//申请日没有设定过日历
                                     					cb = {
                                                                  "errno":"303",
                                                                  "errmsg:":"没有设定日历",
                                                                  "No":item301.no,
                                                                  "module":"OVSubmit"
                                                                }
                                                        callback(cb,null);
                                     				}
                                     			});

                                     },  //calendar function (callback) {
                                     resultsDetailList: ['WHSetting', 'calendar', function(callback,results) {
                                     		util.log('debug','No:' + item301.no + ' resultsDetailList: ' + JSON.stringify(results));
                                     		if(util.jsonget(results,'/calendar/queryresult0/dtdaytype') == 1 ){   //正常出勤日 check 304，308，309，310,312
                                     				//上午加班
                                     				if( item301.ToDt <= util.jsonget(results,'/WHSetting/queryresult0/AMFrom') ){
                                     						//312 最小单位
                                     						duration = (parseInt(item301.ToDt/100)*60 + item301.ToDt%100)  - (parseInt(item301.FromDt/100)*60 + item301.FromDt%100);
															util.log('debug','出勤日上午申请的时间 :' + duration);
															//早上没有最小起算时间，直接计算最小单位
															if( duration % (util.jsonget(results,'/WHSetting/queryresult0/OvertimeWHUnit')*60) == 0 ){
																callback(null,'200');
																}
															else{
																cb = {
			                                                          "errno":"312",
			                                                          "errmsg:":"加班时间不符合最小单位",
			                                                          "No":item301.no,
			                                                          "module":"OVSubmit"
			                                                        }
                                                        		callback(cb,null);
															}
                                     				}else{
                                     					//下午加班
                                     					if(item301.FromDt >= util.jsonget(results,'/WHSetting/queryresult0/PMTo') && item301.ToDt >= util.jsonget(results,'/WHSetting/queryresult0/PMTo'))
                                     					{
                                     						duration = (parseInt(item301.ToDt/100)*60 + item301.ToDt%100)  - (parseInt(item301.FromDt/100)*60 + item301.FromDt%100);
                                     						//310 起算时间
                                     						if(duration >= (util.jsonget(results,'/WHSetting/queryresult0/OvertimeStartWH')*60) ){
                                     								//312 加班时间不符合最小单位
                                     								if( parseInt(duration - (util.jsonget(results,'/WHSetting/queryresult0/OvertimeStartWH')*60) ) % (util.jsonget(results,'/WHSetting/queryresult0/OvertimeWHUnit')*60) == 0 ){
                                     									callback(null,'200');
                                     								}else{
                                     									cb = {
					                                                          "errno":"312",
					                                                          "errmsg:":"加班时间不符合最小单位",
					                                                          "No":item301.no,
					                                                          "module":"OVSubmit"
					                                                        }
			                                                     callback(cb,null);
                                     								}
                                     						}else{
                                     							cb = {
			                                                          "errno":"310",
			                                                          "errmsg:":"加班时间不能小于起算单位",
			                                                          "No":item301.no,
			                                                          "module":"OVSubmit"
			                                                        }
			                                                     callback(cb,null);

                                     						}
                                     					}else{
                                     						//304 加班时间必须是出勤日的正常出勤时间以外
		                                     					cb = {
			                                                          "errno":"304",
			                                                          "errmsg:":"加班时间必须是出勤日的正常出勤时间以外",
			                                                          "No":item301.no,
			                                                          "module":"OVSubmit"
			                                                        }
                                                        		callback(cb,null);
                                     					}
                                     				}

                                     		}else //非出勤日 311 非出勤日的加班时间不能小于加班起算时间 312 最小单位
                                     		{

												duration = (parseInt(item301.ToDt/100)*60 + item301.ToDt%100)  - (parseInt(item301.FromDt/100)*60 + item301.FromDt%100);
												util.log('debug','非出勤日申请的时间 :' + duration);

												//311 非出勤日的加班时间不能小于加班起算时间
												if(duration < util.jsonget(results,'/WHSetting/queryresult0/OvertimeStartWH')){
													//312.加班时间不符合最小单位
													if( (duration - util.jsonget(results,'/WHSetting/queryresult0/OvertimeStartWH')*60)%(util.jsonget(results,'/WHSetting/queryresult0/OvertimeWHUnit')*60) == 0 ){
														callback(null,'200');
													}
													else{
														cb = {
                                                          "errno":"312",
                                                          "errmsg:":"加班时间不符合最小单位",
                                                          "No":item301.no,
                                                          "module":"OVSubmit"
                                                        }
                                                        callback(cb,null);
													}
												}else{
													 cb = {
                                                          "errno":"311",
                                                          "errmsg:":"非出勤日的加班时间不能小于加班起算时间",
                                                          "No":item301.no,
                                                          "module":"OVSubmit"
                                                        }
                                                        callback(cb,null);
												}
                                     		}
                                     		callback(null,results);
                                     }]
			          			 }, function(err, results) {

                                          if(err!= null && err !=''){
                                            util.log('debug','301 err:' + 'No' + item301.no + ' '+ JSON.stringify(err));
                                            callback(err,null);

                                          }else{

                                          util.log('debug','No' + item301.no + ' 301,303,304,308,309,310,311,312 check Ok ');
                                          //callback(null,results);
                                          //callback(null,item.no);

                                          callback('','results');

                                          }
                                        }
                                    );  // async.auto({




			          }, function(err) {   //async.forEachSeries(

			                    if(err!= null && err !=''){
			                      util.log('info','306: ' + JSON.stringify(err));
			                      callback(err);
			                    }

			                      else{
			                          callback(null,'306 pass');
			                    }

			                }
			               );
		},




		//306 项目没有分配工时（PJ中没有分配该员工或者选择的加班项目为PJG的场合，如果该员工在PJG下所有PJ中都没有该月的预定工数或者预定工数为0，报错。）
		function(callback){
			util.log('debug','306 enter');
			var arr306=[];
					for (var i=0;i<totalrow;i++)
			                ( function (i) {   //循环取得每一条明细申请的时间
			                      arr306[i] ={
			                        no:i,
			                        userid:util.jsonget(questquery,'/userid'),
			                        pjinfoid:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/PJInfoID'),
			                        FromDt:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FromDt'),
			                        startdt:util.jsonget(questquery,'/applydate'),
                        			enddt:util.jsonget(questquery,'/applydate'),
			                        ToDt:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/ToDt'),
			                        FlgOut:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FlgOut'),
			                        FlgPJG:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FlgPJG'),
			                        currentdt:util.jsonget(questquery,'/applydate')
			                      };
			                })(i);
			          async.forEachSeries(arr306, function(item306, callback) {
			          		login.getAvailPJ(item306,null,
			                function(cb){
			                	if( util.jsonexist(cb,'/errno') &&  util.jsonget(cb,'/errno') == 200){
			                		cb = {
			                			errno:"200"
			                		}
			                		callback(null,cb);
			                	}
			                	else
			                	{
			                		cb = {
                                        "errno":"306",
                                        "errmsg:":"项目没有分配工时",
                                        "No":item306.no,
                                        "module":"OVSubmit"
                                      }
			                        callback(cb,null);
			                	}


			                });



			           }, function(err) {

			                    if(err!= null && err !=''){
			                      util.log('info','306: ' + JSON.stringify(err));
			                      callback(err);
			                    }

			                      else{
			                          callback(null,'306 pass');
			                    }

			                }
			               );
		},



		//307 项目不可以为非稼动
		function (callback){
			util.log('debug','307 enter');
			var arr307 = [];
					 	 for (var i=0;i<totalrow;i++)
			                ( function (i) {   //循环取得每一条明细申请的时间
			                      arr307[i] ={
			                        no:i,
			                        userid:util.jsonget(questquery,'/userid'),
			                        pjinfo:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/PJInfoID'),
			                        FromDt:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FromDt'),
			                        startdt:util.jsonget(questquery,'/applydate'),
                        			enddt:util.jsonget(questquery,'/applydate'),
			                        ToDt:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/ToDt'),
			                        FlgOut:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FlgOut'),
			                        FlgPJG:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FlgPJG'),
			                        currentdt:util.jsonget(questquery,'/applydate')
			                      };
			                })(i);
			           async.forEachSeries(arr307, function(item307, callback) {
			           			//非稼动 = 4
			           			if(item307.pjinfo == 4){
			           					cb = {
			                                            "errno":"307",
			                                            "errmsg:":"项目不可以为非稼动",
			                                            "No":item307.no,
			                                            "module":"OVSubmit"
			                                          }
			                               callback(cb,null);
			           			}else{
			           				cb={
			           					errno:200
			           				}
			           				callback(null,cb);
			           			}

			                }, function(err) {

			                    if(err!= null && err !=''){
			                      util.log('info','307: ' + JSON.stringify(err));
			                      callback(err);
			                    }

			                      else{
			                          callback(null,'307 pass');
			                    }

			                }
			               );
		},

		 //305 开始或结束时间不符合门禁时间 （公司外为否的数据，最小开始时间不能小于门禁打卡时间；最大的结束时间不能大于门禁打卡时间）
		 function (callback){

		 	util.log('debug','305 enter');
		 	var arr305 = [] ;
		 	 for (var i=0;i<totalrow;i++)
			                ( function (i) {   //循环取得每一条明细申请的时间
			                      arr305[i] ={
			                        no:i,
			                        userid:util.jsonget(questquery,'/userid'),
			                        pjinfo:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/PJInfoID'),
			                        FromDt:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FromDt'),
			                        startdt:util.jsonget(questquery,'/applydate'),
                        			enddt:util.jsonget(questquery,'/applydate'),
			                        ToDt:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/ToDt'),
			                        FlgOut:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FlgOut'),
			                        FlgPJG:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FlgPJG'),
			                        currentdt:util.jsonget(questquery,'/applydate')
			                      };
			                })(i);

			            async.forEachSeries(arr305, function(item305, callback) {
			            		if(item305.FlgOut ==2){  //公司外是否

			                      whList.getAccessRecord(item305,null,
			                          function(cb){
			         				   	if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') == 300  ){  //返回结果中没有数据
			                                  cb = {
			                                            "errno":"305",
			                                            "errmsg:":"开始或结束时间不符合门禁时间",
			                                            "No":item305.no,
			                                            "module":"OVSubmit"
			                                          }
			                                  callback(cb,null);

			                                }

			                           if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') == 200  ){  //返回结果中有数据
			                           	//最小开始时间不能小于门禁打卡时间；最大的结束时间不能大于门禁打卡时间
			                                if( moment(item305.FromDt,'HH:mm:ss').format('HH:mm:ss') < util.jsonget(cb,'/queryresult0/OutTime') || moment(item305.ToDt,'HH:mm:ss').format('HH:mm:ss') > util.jsonget(cb,'/queryresult0/InTime'))
			                                {
			                                	cb = {
			                                            "errno":"305",
			                                            "errmsg:":"开始或结束时间不符合门禁时间",
			                                            "No":item305.no,
			                                            "module":"OVSubmit"
			                                          }
			                                  callback(cb,null);
			                                }else{
			                                	cb={
						           					errno:200
						           				}
			                                	callback(null,cb);
			                                }


			                            }else{
			                                	cb = {
			                                            "errno":"400",
			                                            "errmsg:":"系统异常",
			                                            "No":item305.no,
			                                            "module":"OVSubmit"
			                                          }
			                                  callback(cb,null);
			                                }

			                          });
			                  	 }else{
			                  	 	cb ={
			                  	 		errno:200
			                  	 	}
			                  	 	callback(null,cb);
			                  	 }

			                }, function(err) {

			                    if(err!= null && err !=''){
			                      util.log('info','305: ' + JSON.stringify(err));
			                      callback(err);
			                    }

			                      else{
			                          callback(null,'305 check pass');
			                    }

			                }
			               );  // async.forEach(

		 },
		 //302 该条加班数据日期和其他工时/加班/休假区间冲突
		 function(callback){
		 	        util.log('debug','302 enter');
			        var arr302 = [] ;
			        for (var i=0;i<totalrow;i++)
			                ( function (i) {   //循环取得每一条明细申请的时间
			                      arr302[i] ={
			                        no:i,
			                        userid:util.jsonget(questquery,'/userid'),
			                        pjinfo:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/PJInfoID'),
			                        FromDt:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FromDt'),
			                        startdt:util.jsonget(questquery,'/applydate'),
                        			enddt:util.jsonget(questquery,'/applydate'),
			                        ToDt:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/ToDt'),
			                        FlgOut:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FlgOut'),
			                        FlgPJG:util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FlgPJG'),
			                        currentdt:util.jsonget(questquery,'/applydate')
			                      };
			                })(i);
			                //检查申请的时间是否有重叠
			                for (var i=0;i<totalrow;i++)
			                 ( function (i) {
			                     for (var j=0;j<totalrow;j++)
			                         ( function (j) {
			                          util.log('debug','时间重叠check:'+ i+':' + j + ' ' + arr302[i].startdt+ ' ' + arr302[j].startdt+ ' ' + arr302[i].FromDt+ '<=' +   arr302[j].ToDt + ' ' +   arr302[i].ToDt +  '>' + arr302[j].FromDt)

			                              if( (arr302[i].no < arr302[j].no) && (arr302[i].startdt==arr302[j].startdt ) && ( arr302[i].FromDt <= arr302[j].ToDt && arr302[i].ToDt > arr302[j].FromDt ) ){
			                                cb = {
			                                    "errno":"302",
			                                    "errmsg:":"该条加班数据时间和其他工时/加班/休假时间冲突",
			                                    "No":i,
			                                    "module":"OVSubmit"
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
			                                            "errmsg:":"该条加班数据时间和其他工时/加班/休假时间冲突",
			                                            "No":item302.no,
			                                            "module":"OVSubmit"
			                                          }
			                                  callback(cb,null);

			                                }else{
			                                	cb={
						           					errno:200
						           				}
			                                  callback(null,cb);
			                                }

			                          });



			                }, function(err) {

			                    if(err!= null && err !=''){
			                      util.log('info','302: ' + JSON.stringify(err));
			                      callback(err);
			                    }

			                      else{
			                          callback(null,'302 check pass');
			                    }

			                }
			               );  // async.forEach(
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
                "module":"OVSubmit"
              }

              callback(cb);
          }
	});

}
;


function insertOV(questquery,callback){
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

      var insertOVHeadArray =
      {
        EmployeeID:"" ,
        ObjYMD:"",
        OVWH:"",
        DtAppStatus:"0" ,
        DelFlg:0 ,
        CreateTime:'',
        CreateBy:"",
        UpdateTime:'',
        UpdateBy:"",
        FlgHR:"2"
      };

     var insertOVDetailArray =
      {
        OVFormID:"", FromDt:"", ToDt:"", PJInfoID:"", OVWH:"", FlgOut:"",
        FlgPJG:"", DelFlg:"0", CreateTime:"", CreateBy:"", UpdateTime:"", UpdateBy:""
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
        inWFType:"2", inTableKey:"", inUserID:"", inOrgCD:"", inPositionID:"", inObjYMD:"",
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
        		if (err) { callback('beginTransaction err:' + err, null); }else
        		{
        		       util.log('debug','beginTransaction ');

        		       insertOVHeadSQL1 = ' insert into TrnOVForm ';
				       //insertSQL1 += '  EmployeeID ,ObjYMD,OVWH, DtAppStatus , DelFlg , CreateTime, CreateBy, UpdateTime, UpdateBy, FlgHR
				       insertOVHeadSQL1 += ' set ? ';

		              util.jsonadd(insertOVHeadArray,'/EmployeeID',util.jsonget(questquery,'/userid'));
		              util.jsonadd(insertOVHeadArray,'/ObjYMD',util.jsonget(questquery,'/applydate'));
		              util.jsonadd(insertOVHeadArray,'/OVWH',util.jsonget(questquery,'/ovwh'));
		              util.jsonadd(insertOVHeadArray,'/CreateBy',util.jsonget(questquery,'/userid'));
					  util.jsonadd(insertOVHeadArray,'/CreateTime',moment().format('YYYY-MM-DD HH:mm:ss'));
		              //util.log("debug", 'insertOVHeadSQL1 = '+ insertOVHeadSQL1);

		              var sqlquery = Connection.query(insertOVHeadSQL1, insertOVHeadArray, function(err, result) {
		                  //Connection.query('replace INTO test SET id="222212",res="eeee"', function(err, result) {
		                    if (err) {
		                       callback('query err:'+err, null);

		                    }else   //Head插入后
		                    {
		                    	util.log('debug','insertOVHeadSQL1 = ' +sqlquery.sql )
		                    	SelectSQL="select last_insert_id() as id";
		                    	var query = Connection.query(SelectSQL);
					            query
					              .on('error', function(sqlerr) {
					                // Handle error, an 'end' event will be emitted after this as well
					                results = sqlerr;
					                util.jsonadd(results,'/sqlstmt',SelectSQL);
					                callback(sqlerr,null);
					              })
					              .on('result', function(rows) {
					                // Pausing the connnection is useful if your processing involves I/O
					                //connection.pause();
					                last_insert_id = rows.id;
					                util.log('debug','last_insert_id = : ' + last_insert_id);
					              })
					              .on('end', function(rows)
					              {
								               //callback(null,last_insert_id);
								               for (var i=0;i<totalrow;i++)
									             ( function (i) {
									                  util.jsonadd(insertOVDetailArray,'/OVFormID',last_insert_id);
									                  util.jsonadd(insertOVDetailArray,'/FromDt',util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FromDt'));
									                  util.jsonadd(insertOVDetailArray,'/ToDt',util.jsonget(questquery,'/TrnOVFormDetail'+i+'/ToDt'));
									                  util.jsonadd(insertOVDetailArray,'/PJInfoID',util.jsonget(questquery,'/TrnOVFormDetail'+i+'/PJInfoID'));
									                  util.jsonadd(insertOVDetailArray,'/OVWH',util.jsonget(questquery,'/TrnOVFormDetail'+i+'/OVWH'));
									                  util.jsonadd(insertOVDetailArray,'/FlgOut',util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FlgOut'));
									                  util.jsonadd(insertOVDetailArray,'/FlgPJG',util.jsonget(questquery,'/TrnOVFormDetail'+i+'/FlgPJG'));
													  util.jsonadd(insertOVDetailArray,'/CreateBy',util.jsonget(questquery,'/userid'));
													  util.jsonadd(insertOVDetailArray,'/CreateTime',moment().format('YYYY-MM-DD HH:mm:ss'));

									                  var insertOVDetailSQL1 = "insert into TrnOVFormDetail set ?";
									                  //util.log("debug", 'insertOVDetailSQL1 = '+ insertOVDetailSQL1);

									                  sqlquery = Connection.query(insertOVDetailSQL1, insertOVDetailArray, function(err, result) {
									                  //Connection.query('replace INTO test SET id="222212",res="eeee"', function(err, result) {
									                    if (err) {

					                					   util.jsonadd(results,'/sqlstmt',err);
					                					   callback(results,null);


									                    }

									                  });
														done=i;
									                  util.log('debug','run' + done + ':' + sqlquery.sql);

									                })(i);
									                 if(done+1==totalrow){
									                 		var ExistWHHead = ' select count(*) as count from TrnWHForm ';
									                 			ExistWHHead += ' where EmployeeID = ' + Connection.escape(util.jsonget(questquery,'/userid'));
									                 			ExistWHHead += ' and ObjYMD = ' + Connection.escape(util.jsonget(questquery,'/applydate'));
									                 			ExistWHHead += ' and DelFlg =0 ';

									                 			sqlquery = Connection.query(ExistWHHead);
									                 			util.log('debug',sqlquery.sql);
																sqlquery
																.on('error', function(sqlerr) {
																		results = sqlerr;
																		util.log('info','Connect error '+ sqlerr);
																		util.jsonadd(results,'/sqlstmt',selectSQL1);
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
																		            util.jsonadd(insertWHHeadArray,'/ObjYMD',util.jsonget(questquery,'/applydate'));
																		            util.jsonadd(insertWHHeadArray,'/CreateBy',util.jsonget(questquery,'/userid'));
																		            util.jsonadd(insertWHHeadArray,'/CreateTime',moment().format('YYYY-MM-DD hh:mm:ss'));

															                 		 sqlquery = Connection.query(insertWHHeadSQL1, insertWHHeadArray, function(err, result) {

															                 			 if (err) {
								                       										callback('query err:'+err, null);
								                    									 }else{
								                    									 	util.log('debug','insertWHHeadSQL1 = ' + sqlquery.sql);
								                    									 	//console.log('debug','last last_insert_id = ' + result.insertId);
																							  } // insertWHHeadSQL1 else end
																							}); //insertWHHeadSQL1 end
																				} // ExistWHHead.on('result', function(rows) end
																	})
																	.on('end', function(result) {
																		//取得员工当前的组织CD和职位
															                 				var getUserOrgPos = ' select b.OrgCD,c.PositionID ';
															                 				getUserOrgPos += ' FROM RtnEmployeeOrg a, MstOrg b,MstPosition c ';
															                 				getUserOrgPos += ' WHERE  a.FlgPart=0  ';
																							getUserOrgPos += ' AND a.OrgCD=b.OrgCD AND a.UsefulFromDt >= b.UsefulFromDt AND a.UsefulToDt <= b.UsefulToDt  ';
																							getUserOrgPos += ' AND a.PositionID = c.PositionID AND a.DelFlg="0" AND b.DelFlg="0" AND c.DelFlg="0" ';
																							getUserOrgPos += ' AND EmployeeID ='  + Connection.escape(util.jsonget(questquery,'/userid'));
																							getUserOrgPos += ' AND ' + Connection.escape(util.jsonget(questquery,'/applydate')) + 'between  a.UsefulFromDt and a.UsefulToDt';
																							getUserOrgPos += ' limit 1';

																							sqlquery = Connection.query(getUserOrgPos);
																							util.log('debug',sqlquery.sql);
																							sqlquery
																							.on('error', function(sqlerr) {
																							                   		results = sqlerr;
																									                util.log('info','Connect error '+ sqlerr);
																									                util.jsonadd(results,'/sqlstmt',selectSQL1);
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
																									 submitOVQuery  += Connection.escape(util.jsonget(questquery,'/applydate')) + ',2, ';
																									 submitOVQuery  += last_insert_id + ',';
																									 submitOVQuery  += Connection.escape(util.jsonget(questquery,'/userid')) + ',';
																									 submitOVQuery  += OrgCD + ',';
																									 submitOVQuery  += PositionID + ',';
																									 submitOVQuery  +='"",@res) ; select cast(@res as char(90)) resu ;';

																											//调用提交存储过程
																					                 		//var submitOVQuery='call procWFSubmit(2, 10965,149,123131321,8,20140725,"",@res) ; select cast(@res as char(90)) resu ;';

																							                sqlquery = Connection.query(submitOVQuery);
																							                util.log('debug',sqlquery.sql);
																							                  //Connection.query('replace INTO test SET id="222212",res="eeee"', function(err, result) {
																							                   //util.log("debug", 'submitOVQuery = '+ sqlquery.sql);
																							                   sqlquery
																							                   .on('error', function(sqlerr) {
																							                   		results = sqlerr;
																									                util.log('info','Connect error '+ sqlerr);
																									                util.jsonadd(results,'/sqlstmt',selectSQL1);
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
																															/* 存储过程返回值：
																									                			1：成功
																																-1:当前没有流程定义
																																-2:当前存在多个流程定义；
																															  -3: 加班申请时，工时已经在申请/提交状态
																															  -4: 休假申请时，工时已经在申请/提交状态
																																-100:SQL执行错误；
																																*/
																									                		//callback(sqlerr,null);
																							                   	switch(spreturn)
																															{
																															case '1':
																															  util.log('info','procWFSubmit return 1');
																															  //update flg
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
																										                          util.jsonadd(results,'/errmsg','insertOV complete');
																										                          //返回加班主表的ID
																										                          util.jsonadd(results,'/OVFormID',last_insert_id);
																										                          callback(null, results);
																										                        }
																										                    	});

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
																							                   });

																								}); //取得员工当前的组织CD和职位 end
																	}); // WHExist end

															   } //done+1==totalrow  OVDetail  insert end

				                    });   //last_insert_id.on('end', function(rows) {
				                   }  // OVhead 插入后 else end
 		                  });  //insertOVHeadArray end

        		}
	        	});
	    	}

		});
  	  }
		],function(sqlerr,results){

          if(sqlerr == null||sqlerr == '' ){

            util.log('debug','insertOV returns');
            util.log('debug',JSON.stringify(results));
            callback(results[0]);
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
            util.log('info','insertOV returns');
            util.log('info',JSON.stringify(results));
            callback(results);
          }
      }); //async.series end

}
;


function OVSubmit(questquery,response,callback){
	async.waterfall([     //有顺序的执行,前一个函数的结果作为下一个函数的参数
 	/*
 	function (callback){  //先取得考勤规则数据

 			//通过applydate取得月初和月末
 			var appdate = moment(util.jsonget(questquery,'/applydate'),'YYYYMMDD').format('YYYY-MM-DD');

 			util.jsonadd(questquery,'/startdt',moment(appdate).startOf('month').format('YYYY-MM-DD'));
 			util.jsonadd(questquery,'/enddt',moment(appdate).endOf('month').format('YYYY-MM-DD'));

            login.getWHSetting(questquery,response,
            	function(cb){
            		//util.log('debug','WHSetting get ' + JSON.stringify(cb));
            		//util.log('debug','WHSetting get ' + util.jsonget(cb[0],'/errno'));
            	if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') == 400){  //异常情况下
            			cb = {"errno":"400",
            				"errmsg:":util.jsonget(cb,'/errmsg'),
            				"module":"OVSubmit"
            			}
            			callback(cb,null);
            	}else{
            		if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') == 200){   //非异常情况下返回
            			util.log('debug','OVSubmit.getWHSetting OK ' + JSON.stringify(cb));
            			callback(null,cb);
            		}else{
            			cb = {
            				"errno":"301",
            				"errmsg:":"OVSubmit.getWHSetting Error",
            				"module":"OVSubmit"
            			}
            			callback(cb,null);
            		}
            	}
            	});
    },
    */
    function (callback) {  //根据考勤规则检查加班数据

            OVInfoValidateCheck(questquery,
              function(cb){
                util.log('debug','OVInfoValidateCheck retrun ' + JSON.stringify(cb));
                if(util.jsonget(cb,'/errno') != 200){  //校验出错
                  callback(cb,null);
                }else
                callback(null,cb);
              });
    },
   function (results,callback) {  //保存并提交
   			insertOV(questquery,
            	function(cb){
            		//util.log('debug','WHSetting get ' + JSON.stringify(cb));
            		//util.log('debug','WHSetting get ' + util.jsonget(cb[0],'/errno'));
            	if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') == 400){  //异常情况下
            			cb = {"errno":"400",
            				"errmsg:":util.jsonget(cb,'/errmsg'),
            				"module":"OVSubmit"
            			}
            			callback(cb,null);
            	}else{
            		if( util.jsonexist(cb[0],'/errno') && util.jsonget(cb[0],'/errno') == 200){   //非异常情况下返回
            			util.jsonadd(cb[0],'/module','OVSubmit');
            			util.log('debug','OVSubmit.insertOV OK ' + JSON.stringify(cb));
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
			    	util.jsonadd(results[0],'/errmsg','OVSubmit succ');
		            util.log('info','OVSubmit returns');
		            util.log('info',results);
					 callback(results[0]);
			    }
			    else
			    {
			      //global.queryDBStatus = 'err';
					util.log('error',"err  = "+ JSON.stringify(err));
					results = err;
		            util.log('info','OVSubmit returns');
		            util.log('info',results);
		            callback(results);
			    }

});

}

//检查传入的formid是否可以删除

function DeleteOVCheck(formid,callback){ 
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

        selectSQL1 = ' select count(*)  as cnt from trnovform ';
		selectSQL1 += ' where (dtAppStatus =1 or dtAppStatus = 2 )';  //未提交以外的状态
		//selectSQL1 += ' and delflg = 0 ';
		selectSQL1 += ' and ovformid = ' + formid ;


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

            util.log('info','DeleteOVCheck returns');
            util.log('info',results);
            callback(results);  //返回行数
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;
            util.jsonadd(results,'/errno','400');
            util.jsonadd(results,'/errmsg','DeleteOVCheck get Error');
            util.jsonadd(results,'/module','DeleteOVCheck');


            util.log('info','DeleteOVCheck returns Error');
            util.log('info',JSON.stringify(results));
            callback(results);
          }

      }); //async.series end

}



function deleteOV(questquery,callback){
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
	        selectSQL1 = ' update trnovform set DelFlg = 1, '
	        selectSQL1 += ' updatetime = "' + moment().format('YYYY-MM-DD HH:mm:ss') + '",';
	        selectSQL1 += ' UpdateBy = ' + util.jsonget(questquery,'/userid') ;
			selectSQL1 += ' where (dtAppStatus !=1 or dtAppStatus !=2) and DelFlg =0';
			selectSQL1 += ' and ovformid = "' + util.jsonget(questquery,'/ovformid') + '";';

			selectSQL1 += ' update trnovformdetail set DelFlg = 1,';
			selectSQL1 += ' updatetime = "' + moment().format('YYYY-MM-DD HH:mm:ss') + '",';
	        selectSQL1 += ' UpdateBy = "' + util.jsonget(questquery,'/userid') + '"';
			selectSQL1 += ' where DelFlg =0';
			selectSQL1 += ' and ovformid = ' + util.jsonget(questquery,'/ovformid');

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
									util.jsonadd(results,'/errmsg','deleteOV complete');
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

	            util.log('info','deleteOV returns');
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
	            util.jsonadd(results,'/module','deleteOV');


	            util.log('info','deleteOV returns Error');
	            util.log('info',JSON.stringify(results));
	            callback(results);
	          }

      }); //async.series end

}




/*
加班删除的返回值

200 正常删除
301 已进入考勤审批流程，不能删除
400 系统异常
500 用户失效
*/


function OVDeleteHandle(questquery,response,callback){
	async.waterfall([     //有顺序的执行,前一个函数的结果作为下一个函数的参数
 	function (callback){  //检查是否不能删除 仅当未提交或已驳回的状态可以删除

 			var ovformid = util.jsonget(questquery,'/ovformid');

            DeleteOVCheck(ovformid,
            	function(cb){
            		//util.log('debug','WHSetting get ' + JSON.stringify(cb));
            		//util.log('debug','WHSetting get ' + util.jsonget(cb[0],'/errno'));
            	if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') == 400){  //异常情况下
            			cb = {"errno":"400",
            				"errmsg:":util.jsonget(cb,'/errmsg'),
            				"module":"OVDelete"
            			}
            			callback(cb,null);
            	}else{
            		if( util.jsonexist(cb[0],'/errno') && util.jsonget(cb[0],'/errno') == 200){   //非异常情况下返回
            			util.log('debug','OVDelete.DeleteOVCheck OK ' + JSON.stringify(cb));
            			if(util.jsonget(cb[0],'/row') == 0){  //可以删除
            				callback(null,questquery);
            			}
            			else
            			{
            				util.log('debug','OVDelete.DeleteOVCheck return > 0 ' );
            				cb = {
            				"errno":"301",
            				"errmsg:":"OVDelete.DeleteOVCheck Error",
            				"module":"OVDelete"
            				}
            			callback(cb,null);
            			}

            		}else{
            			cb = {
            				"errno":"301",
            				"errmsg:":"OVDelete.DeleteOVCheck Error",
            				"module":"OVDelete"
            				}
            			callback(cb,null);
            		}
            	}
            	});
    },

   function (results,callback) {  //通过check后，置删除标志位
   			deleteOV(questquery,
            	function(cb){
            		//util.log('debug','WHSetting get ' + JSON.stringify(cb));
            		//util.log('debug','WHSetting get ' + util.jsonget(cb[0],'/errno'));
            	if( util.jsonexist(cb,'/errno') && util.jsonget(cb,'/errno') == 400){  //异常情况下
            			cb = {"errno":"400",
            				"errmsg:":util.jsonget(cb,'/errmsg'),
            				"module":"OVDelete"
            			}
            			callback(cb,null);
            	}else{
            		if( util.jsonexist(cb[0],'/errno') && util.jsonget(cb[0],'/errno') == 200){   //非异常情况下返回
            			util.jsonadd(cb[0],'/module','OVDelete');
            			util.log('debug','OVDelete.deleteOV OK ' + JSON.stringify(cb));
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
			    	util.jsonadd(results[0],'/errmsg','OVDelete succ');
		            util.log('info','OVDelete returns');
		            util.log('info',results);
					 callback(results[0]);
			    }
			    else
			    {
			      //global.queryDBStatus = 'err';
					util.log('error',"err  = "+ JSON.stringify(err));
					results = err;
		            util.log('info','OVDelete returns');
		            util.log('info',results);
		            callback(results);
			    }

});

}

exports.OVSubmit = OVSubmit;
exports.OVDelete = OVDeleteHandle;
