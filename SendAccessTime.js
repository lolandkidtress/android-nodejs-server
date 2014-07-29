var http = require('http');
var mysql = require('mysql');
var sys = require('sys');
var util = require('./util/util.js');
var async = require('async');


var post_data = "";
var _pool;

/*
var options = {
    host: 'localhost',
    port: 8000,
    path: '',
    method: 'POST'
};
*/
var Access_db_config = {
  host: '192.168.30.230',
  user: 'whs',
  password: 'whs',
  database: 'nav',
  port: 3306
};


function poolConnection(callback){

   if(_pool==''||_pool == null){
      util.log('debug','create ConnectionPool');
      _pool = mysql.createPool(Access_db_config);
           //return callback(pool);
      return _pool;
   }else{
      util.log('debug','reuse ConnectionPool');
      return _pool;
   }
}

/*

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
  res.on('error',function(e){
    console.log(e);
  });
});

*/

function SendAccessRecord(callback){
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
      var er;

        Connection = mysql.createConnection(Access_db_config);

        //只更新当天的数据
        selectSQL1 = "select min(em.eventtime),max(em.eventtime), ";
        selectSQL1 += " case when  ";
        selectSQL1 += " TIME_TO_SEC(em.eventtime) between TIME_TO_SEC('9:00:00') and TIME_TO_SEC('9:05:00') ";
        selectSQL1 += " then DATE_FORMAT(current_date(),'%Y-%m-%d 9:00:00') ";
        selectSQL1 += " else ";
        selectSQL1 += " DATE_FORMAT(min(em.eventtime) + INTERVAL ( 900 - time_to_sec(min(em.eventtime)) mod 900) second, '%Y-%m-%d %k:%i:%s' ";
        selectSQL1 += " )  ";
        selectSQL1 += " end ";
        selectSQL1 += " OutTime , ";
        selectSQL1 += " case when ";
        selectSQL1 += " min(em.eventtime) + INTERVAL ( 900 - time_to_sec(min(em.eventtime)) mod 900) second >= max(em.eventtime) - INTERVAL ( time_to_sec(max(em.eventtime)) mod 900) second  ";
        selectSQL1 += " THEN ";
        selectSQL1 += " DATE_FORMAT(min(em.eventtime) + INTERVAL ( 900 - time_to_sec(min(em.eventtime)) mod 900) second, '%Y-%m-%d %k:%i:%s') ";
        selectSQL1 += " ELSE ";
        selectSQL1 += " DATE_FORMAT(max(em.eventtime) - INTERVAL ( time_to_sec(max(em.eventtime)) mod 900) second, '%Y-%m-%d %k:%i:%s') ";
        selectSQL1 += " end ";
        selectSQL1 += " inTime,  ";
        selectSQL1 += " em.employeeno ,DATE_FORMAT(em.eventtime,'%Y%m%d') objdate ";
        selectSQL1 += " from  event em ";
        selectSQL1 += " where em.employeeno != '' and em.typeid = 10  ";
        selectSQL1 += " and employeeno is not null ";
        selectSQL1 += " and DATE_FORMAT(eventtime,'%Y%m%d') >= DATE_FORMAT(current_date(),'%Y%m%d') ";
        selectSQL1 += " group by em.employeeno,DATE_FORMAT(eventtime,'%Y%m%d') ";
        selectSQL1 += " order by employeeno,objdate ";

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
                if(rows != null||rows != '' ){
                // Pausing the connnection is useful if your processing involves I/O
                //connection.pause();
                util.jsonadd(results,'/queryresult'+i+'/EmployeeID',rows.employeeno);
                util.jsonadd(results,'/queryresult'+i+'/objdate',rows.objdate);
                util.jsonadd(results,'/queryresult'+i+'/OutTime',rows.OutTime);
                util.jsonadd(results,'/queryresult'+i+'/inTime',rows.inTime);

                //util.jsonadd(results,'/queryresult'+i+'/uuid',rows.uuid_);
                i=i+1;
               }
              })
              .on('end', function(rows) {
                  if(i>0){
                    util.jsonadd(results,'/rowcount',i);
//[{"errno":"200","errmsg":"getAccess complete","queryresult0":{"objdate":"20140616","OutTime":"2014-06-16T06:43:42.000Z","inTime":"2014-06-16T06:44:38.000Z"},"queryresult1":{"objdate":"20140616","OutTime":"2014-06-16T06:49:57.000Z","inTime":"2014-06-16T06:50:28.000Z"},"rowcount":2,"module":"getAccess"}]
							util.log('info','send data :' + JSON.stringify(results));
                            http.get("http://iv.ivggs.com:10445/insertAccessRecord?"+JSON.stringify(results), function(res) {
                            //http.get("http://localhost:8001/insertAccessRecord?"+JSON.stringify(results), function(res) {
                            util.log('info',"Got response: " + res.statusCode);
		                            if(res.statusCode=='200'){
		                           util.jsonadd(results,'/errno','200');
		                           util.jsonadd(results,'/errmsg','SendAccessRecord complete');
		                           util.jsonadd(results,'/rowcount',i);
		                           util.jsonadd(results,'/module','SendAccessRecord');
		                           callback(null,results);
		                            }else{

		                           util.jsonadd(results,'/errno','400');
		                           util.jsonadd(results,'/errmsg','SendAccessRecord complete');
		                           util.jsonadd(results,'/rowcount',i);
		                           util.jsonadd(results,'/module','SendAccessRecord');
		                           callback(null,results);
		                            }
                               })
                            .on('data', function (chunk) {
                                console.log('BODY: ' + chunk);
                              })
                            .on('error', function(e) {
                                  util.log('info',"Got error: " + e.message);
                                  util.jsonadd(results,'/errno','400');
		                           util.jsonadd(results,'/errmsg','SendAccessRecord complete');
		                           util.jsonadd(results,'/rowcount',i);
		                           util.jsonadd(results,'/module','SendAccessRecord');
		                           callback(null,results);
                                })
                            .on('uncaughtException', function (err) {
                                  util.log(err.stack);
                                  util.log('info',"uncaughtException");
                                  util.jsonadd(results,'/errno','400');
		                           util.jsonadd(results,'/errmsg','SendAccessRecord complete');
		                           util.jsonadd(results,'/rowcount',i);
		                           util.jsonadd(results,'/module','SendAccessRecord');
		                           callback(null,results);
                                });

                            //req.end();

                      }
                      else
                      {
                        util.jsonadd(results,'/errno','300');
                           util.jsonadd(results,'/errmsg','SendAccessRecord Empty');
                           util.jsonadd(results,'/rowcount',0);
                           util.jsonadd(results,'/module','SendAccessRecord');
                           callback(null,results);
                      }
                  
              });
        }



        ],function(sqlerr,results){

          if(sqlerr == null||sqlerr == '' ){

            util.log('info','SendAccessRecord returns');
            //util.log('info',JSON.stringify(results));
            callback(results);
          }
          else
          {
            //global.queryDBStatus = 'err';
            util.log('error',"err  = "+ sqlerr);
            results = sqlerr;
            util.jsonadd(results,'/errno','400');
            util.jsonadd(results,'/errmsg','SendAccessRecord error');
              // util.jsonadd(results,'/rowcount',i);
            util.jsonadd(results,'/module','SendAccessRecord');
            util.log('info','SendAccessRecord returns err');
            util.log('info',JSON.stringify(results));
            callback(results);
          }
      }); //async.series end

}


var i = 0;
  var results ={
    errno:'',
    errmsg:''
  };
  var pool;

  util.log('info','SendAccessRecord Start');

    SendAccessRecord(
              function(callback){
                util.log('info',"SendAccessRecord end");
                //console.log(callback);
                  //req.write('option');
                process.exit(0);
              }
    );

