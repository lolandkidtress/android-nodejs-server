var util = require('./util.js');
var config = require("../config/config.js");
var moment = require('moment');

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
   if(config.getTraceLevel()=='debug'){  //debug直接返回1
      util.log('log','debug mode,pass');
      callback('1');
   }else{
   			if(util.jsonexist(UserValidatedList,'/UserValidatedList') != true){
   				util.log('log','UserValidatedList is empty');
   				callback('0');
   			}else
   			{
   				   				//util.log('debug','UserValidatedList uuid is:' + util.jsonget(UserValidatedList,'/userid'+util.jsonget(bussiquery,'/userid')+'/uuid'));
		      if(util.jsonexist(UserValidatedList,'/UserValidatedList/userid' + util.jsonget(bussiquery,'/userid')+'/uuid') != true)
				{
					   	util.log('log','User uuid not exist');
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
				      	Epdata=config.getExpireTime();
				      	var now = moment().format('YYYY/MM/DD');
				      	var LoginDate = moment(util.jsonget(UserValidatedList,'/UserValidatedList/userid'+util.jsonget(bussiquery,'/userid')+'/LoginDate')).format('YYYY/MM/DD');
				      	util.log('debug','Now is: ' + now + ',LoginData is : ' + LoginDate + ',ExpireTime :' + Epdata);

				      	if(moment(new Date(LoginDate)).add('days',Epdata).format('YYYY/MM/DD') > now  )
				      	{
				      		util.log('debug','UserValidatedList pass');
				      		callback('1');
				      	}else{
				      		util.log('log','User uuid Expire');
				      		callback('0');
				      	}
				      }
				}

		    }
		}


}