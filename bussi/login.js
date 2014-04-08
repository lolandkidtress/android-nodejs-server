/*1.login 模块 

json 格式为：
{ errno : '401.1',
  errmsg: 'UserI『nfoInvalid',
  module: 'login',
  userid:'',
  username:'',
  password:''


}
*/

var mysql = require('mysql');
var mysqlconn = require('../dbutil/mysqlconn.js');
var sys = require('sys');
var util = require('../util/util.js');
var async = require('async');
var Wind = require('wind')
var config = require('../config/config.js')


function login2(questquery,response,callback){ 
  var i = 0;
  var results ={
    errno:'',
    errmsg:''
  };

//console.log(questquery);

  connection = mysql.createConnection(config.getDBConfig());


var selectSQL1 = 'select user_name,credential from cwd_user where user_name = ';
selectSQL1 = selectSQL1 + connection.escape(util.jsonget(questquery,'/user_name'));
selectSQL1 = selectSQL1 + ' and credential = ' + connection.escape(util.jsonget(questquery,'/credential'));

//util.jsonadd(parameter,'/user_name',util.jsonget(questquery,'/user_name'));
//util.jsonadd(parameter,'/credential',util.jsonget(questquery,'/credential'));

util.log('debug',selectSQL1);

async.series([
    function(callback){
var sqlerr;
var row;
var err;
var res;

var query = connection.query(selectSQL1);
query
  .on('error', function(sqlerr) {
    // Handle error, an 'end' event will be emitted after this as well
    util.log('DB connect error');
    util.log(sqlerr);
    results = sqlerr;
    util.jsonadd(results,'/sqlstmt',selectSQL1);
  })
  .on('result', function(rows) {
    // Pausing the connnection is useful if your processing involves I/O
    //connection.pause();
    util.jsonadd(results,'/queryresult'+i+'/username',rows.user_name);
    util.jsonadd(results,'/queryresult'+i+'/credential',rows.credential);
    i=i+1;

    //console.log(results);
  
  })
  .on('end', function(rows) {
        if(i==1){
        	util.jsonadd(results,'/errno','200');
        	util.jsonadd(results,'/errmsg','User Valid');
        }else
        {
        	util.jsonadd(results,'/errno','400');
        	util.jsonadd(results,'/errmsg','User InValid');
        }
      connection.destroy();
      callback(sqlerr, results);
 });
    }
    //,
    /*
    function (callback){
      connection.query(selectSQL2, function(sqlerr,results2){
                if(!sqlerr){
                          util.log('debug',results2);
                        }
                        results = sqlerr;
                        util.jsonadd(results,'/sqlstmt',selectSQL2);
                        callback(sqlerr, results2);
                  }
        );

    }
  */
  ],function(sqlerr,results){

    if(sqlerr == null||sqlerr == '' ){

   	 if(util.jsonexist(results,'/errno') != true){
        util.jsonadd(results,'/errno','200');
    	}
      callback(sqlerr,results);
    }
    else
    {
      //global.queryDBStatus = 'err';
      util.log('error',"err  = "+ sqlerr);
      results = sqlerr;
    }
    //return callback(null,results);
  });
}



function login(questquery,response,callback){ 
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
            selectSQL1 = 'select user_name,credential from cwd_user where user_name = ';
              selectSQL1 = selectSQL1 + Connection.escape(util.jsonget(questquery,'/user_name'));
              selectSQL1 = selectSQL1 + ' and credential = ' + Connection.escape(util.jsonget(questquery,'/credential'));
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
                util.jsonadd(results,'/queryresult'+i+'/username',rows.user_name);
                util.jsonadd(results,'/queryresult'+i+'/credential',rows.credential);
                i=i+1;
              })
              .on('end', function(rows) {
                    if(i==1){
                      util.jsonadd(results,'/errno','200');
                      util.jsonadd(results,'/errmsg','User Valid');
                    }else
                    {
                      util.jsonadd(results,'/errno','400');
                      util.jsonadd(results,'/errmsg','User InValid');
                    }
                  Connection.release();
                  callback(null,results);  
              });
        }
        
      });

		}
    //,
    /*
    function (callback){
      connection.query(selectSQL2, function(sqlerr,results2){
                if(!sqlerr){
                          util.log('debug',results2);
                        }
                        results = sqlerr;
                        util.jsonadd(results,'/sqlstmt',selectSQL2);
                        callback(sqlerr, results2);
                  }
        );

    }
  */
			  ],function(sqlerr,results){

			    if(sqlerr == null||sqlerr == '' ){

			   	 if(util.jsonexist(results,'/errno') != true){
			        util.jsonadd(results,'/errno','200');
			    	}
            util.log('log','login returns');
            util.log('log',results);
			      callback(results);
			    }
			    else
			    {
			      //global.queryDBStatus = 'err';
			      util.log('error',"err  = "+ sqlerr);
			      results = sqlerr;
            util.log('log','login returns');
            util.log('log',results);
            callback(results);
			    }
  		}); //async.series end

}

exports.login=login;