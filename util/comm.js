var util = require('./util.js');
var config = require("../config/config.js");
var moment = require('moment');
var async = require('async');
var mysql = require('mysql');

//多个进程间同步校验通过的用户
exports.syncUserValidatedList = function(obj,callback) {

		util.log('debug','syncUserValidatedList old List is :' + JSON.stringify(UserValidatedList));
        util.log('debug','syncUserValidatedList new List :' + JSON.stringify(obj));

        if(util.jsonexist(UserValidatedList,'/UserValidatedList') != true){
        	//没有初始化过UserValidatedList
        	util.jsonadd(UserValidatedList,'/UserValidatedList',util.jsonget(obj,'/UserValidatedList'));
        	util.log('debug','syncUserValidatedList result List  :' + JSON.stringify(UserValidatedList));
        }else{
        	//已初始化的UserValidatedList,总是清空,添加最新的节点
        	util.jsonremove(UserValidatedList,'/UserValidatedList');
        	util.jsonadd(UserValidatedList,'/UserValidatedList',util.jsonget(obj,'/UserValidatedList'));
        	util.log('debug','syncUserValidatedList result List  :' + JSON.stringify(UserValidatedList));
        }

};

//校验成功返回1，失败返回0
exports.userValidateCheck = function(bussiquery,callback){
   util.log('debug','UserValidatedList is ' + JSON.stringify(UserValidatedList));
   util.log('debug','userid = ' + util.jsonget(bussiquery,'/userid'));
   util.log('debug','usertoken = ' + util.jsonget(bussiquery,'/uuid'));
   if(config.getTraceLevel()==''){  //debug直接返回1
      util.log('info','debug mode,pass');
      callback('1');
   }else{
   			if(util.jsonexist(UserValidatedList,'/UserValidatedList') != true){
   				util.log('info','UserValidatedList is empty');
   				callback('0');
   			}else
   			{
   				   				//util.log('debug','UserValidatedList uuid is:' + util.jsonget(UserValidatedList,'/userid'+util.jsonget(bussiquery,'/userid')+'/uuid'));
		      if(util.jsonexist(UserValidatedList,'/UserValidatedList/userid' + util.jsonget(bussiquery,'/userid')+'/uuid') != true)
				{
					   	util.log('info','User uuid not exist');
   						callback('0');
				}else{
					  util.log('debug','UserValidatedList uuid is:' + util.jsonget(UserValidatedList,'/UserValidatedList/userid'+util.jsonget(bussiquery,'/userid')+'/uuid'));

					  util.log('debug','Query uuid ' + util.jsonget(bussiquery,'/uuid'));
				      if(util.jsonget(UserValidatedList,'/UserValidatedList/userid'+util.jsonget(bussiquery,'/userid')+'/uuid') != util.jsonget(bussiquery,'/uuid')){
				        util.log('log','User uuid not equal');
				        callback('0');
				      }
				      //util.log('log','/'+util.jsonget(UserValidatedList,'/26/uuid'));
				      else{
				      	/*
				      	Epdata=config.getExpireTime();
				      	var now = moment().format('YYYY/MM/DD');
				      	var LoginDate = moment(util.jsonget(UserValidatedList,'/UserValidatedList/userid'+util.jsonget(bussiquery,'/userid')+'/LoginDate')).format('YYYY/MM/DD');
				      	util.log('debug','Now is: ' + now + ',LoginData is : ' + LoginDate + ',ExpireTime :' + Epdata);

				      	if(moment(new Date(LoginDate)).format('YYYY/MM/DD') != now  )
				      	{
				      		util.log('debug','UserValidatedList err');
				      		callback('0');
				      	}else{
				      		util.log('info','User uuid Expire');
				      	*/
				      		
				      		var Connection;
				      		var selectSQL1;
				      		var result ={};
  
				      		async.series([
				      			function(callback){
				      				var sqlerr;
				      				var rows;
				      				var err;

				      				//先检验IVGGS的用户名密码的正确性
				      				var pool = mysql.createPool(config.getivggsDBConfig());

				      				pool.getConnection(function(sqlerr, Connectionwhs) {
				      					// connected! (unless `err` is set)
				      					if(sqlerr!=null){
				      						util.log('info','get ConnectPool error');
				      						util.log('info',sqlerr);
				      						err = sqlerr;
				      						callback(sqlerr, null);
				      					}else{
				      						selectSQL1 = 'select uuid() as uuid ' ;
				      						util.log('debug',selectSQL1);
				      						var query = Connectionwhs.query(selectSQL1);
				      						query
				      						.on('error', function(sqlerr) {
				      							result = sqlerr;
				      							util.log('info','Connect error '+ sqlerr);
				      							util.jsonadd(result,'/sqlstmt',selectSQL1);
				      							callback(sqlerr,null);
				      						})
				      						.on('result', function(rows) {
				      							util.jsonadd(result,'/queryresult/uuid',rows.uuid);
				      						})
				      						.on('end', function(rows) {
        										util.jsonadd(result,'/errno','200');
        										util.jsonadd(result,'/errmsg','User Valid');
        										util.jsonadd(result,'/module','login');
        										
        										util.jsonadd(userToken,'/userid',util.jsonget(bussiquery,'/userid'));
        										util.jsonadd(userToken,'/uuid',util.jsonget(result,'/queryresult/uuid'));
        										util.jsonadd(userToken,'/LoginDate',moment().format('YYYY-MM-DD'));

        										util.jsonadd(UserValidatedList,'/UserValidatedList'+'/userid'+util.jsonget(bussiquery,'/userid'),userToken);

        										process.send(UserValidatedList);
        										util.log('debug','UserValidatedList refreshed '+ JSON.stringify(UserValidatedList));

        										Connectionwhs.release();
        										callback(null,result);
        									});
        								}
        							});
        						}
							],
							function(sqlerr,results){
								if(sqlerr == null||sqlerr == '' ){
									util.log('info','login returns');
									util.log('info',JSON.stringify(results));
									callback('1');
								}else{
									//global.queryDBStatus = 'err';
									util.log('error',"err  = "+ sqlerr);
									results = sqlerr;
									util.log('info','login returns');
									util.jsonadd(results,'/errno','400');
									util.log('info',JSON.stringify(results));
									callback('0');
								}
							}); 
				      	//}
				      }
				}

		    }
		}
}


//取得更新后UUID
exports.uuidget = function(questquery, callback) {
	if(util.jsonget(UserValidatedList,'/UserValidatedList/userid'+util.jsonget(questquery,'/userid')+'/userid') != util.jsonget(questquery,'/userid')){
		callback('0');
	}else{
		var newuuid = util.jsonget(UserValidatedList,'/UserValidatedList/userid'+util.jsonget(questquery,'/userid')+'/uuid');
		callback(newuuid);
	}
}