/* 通知模块 
  包含 
  1.取得传入员工的当月没有填写完整的工时的日期
	
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


*/

var mysql = require('mysql');
var mysqlconn = require('../dbutil/mysqlconn.js');
var sys = require('sys');
var util = require('../util/util.js');
var async = require('async');
var Wind = require('wind')
var config = require('../config/config.js')


function getWHEmptyDate(questquery,response,callback){ 
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
        selectSQL1 = ' select cal.ymd,wh.ObjYMD from mstcalendar cal ';
		selectSQL1 += ' left join (select ObjYMD from trnwhform where AbsWH > 0 ) wh '; 
		selectSQL1 += ' on cal.YMD = wh.ObjYMD ';
		selectSQL1 += ' where cal.ymd between ' + Connection.escape(util.jsonget(questquery,'/startdt')) + ' and ' + Connection.escape(util.jsonget(questquery,'/enddt')); 
        
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
            util.log('info','getWHEmptyDate returns');
            util.log('info',results);
			      callback(results);
			    }
			    else
			    {
			      //global.queryDBStatus = 'err';
			      util.log('error',"err  = "+ sqlerr);
			      results = sqlerr;
            util.log('info','getWHEmptyDate returns');
            util.log('info',results);
            callback(results);
			    }
  		}); //async.series end

}

exports.getWHEmptyDate=getWHEmptyDate;