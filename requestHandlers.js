var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable"),
    mysql = require('./mysqlconn.js');

function other(response, request){  //返回DB服务器是否正常
  
  var DBStatus = "DBrunOK";

   if(!mysql.AsyncCheckDBstatus(function(err) {
                            if (err) {
                              console.log('error happen');
                              console.log(err);
                              }
                              else{
                              console.log('no error');
                              }
                            }

                     )
      )

    {
      console.log('db error');
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write("dbconnect error");  
     /*
      mysql.EndDbConnect(function(err) {
                            if (err) {
                              console.log('error happen');
                              console.log(err);
                              }
                              else{
                              console.log('no error');
                              }
                            }

                     );   
      */
    }
    else {
      console.log('db ok');
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write("dbconnect ok");
    }


    //mysql.dbconnect();
    

    response.end();

}

function connect(response, request ){
        
    console.log("Request handler 'db connect' was called.");
      
    if(!mysql.dbconnect(function(err) {
                            if (err) {
                              console.log('error happen');
                              console.log(err);
                              }
                              else{
                              console.log('no error');
                              }
                            }

                     )
      )

    {
      console.log('db error');
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write("dbconnect error");  
     /*
      mysql.EndDbConnect(function(err) {
                            if (err) {
                              console.log('error happen');
                              console.log(err);
                              }
                              else{
                              console.log('no error');
                              }
                            }

                     );   
      */
    }
    else {
      console.log('db ok');
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write("dbconnect ok");
      mysql.EndDbConnect();
    }


    //mysql.dbconnect();
    

    response.end();
 
}

function update(response) {
  console.log("Request handler 'show' was called.");
  response.writeHead(200, {"Content-Type": "image/png"});
  fs.createReadStream("/tmp/test.png").pipe(response);
}

function none(response){
  console.log("Request handler '/' was called.");
  response.writeHead(404, {"Content-Type": "text/html"});
  response.write("nothing called");
  response.end();

}

//async.series([],function(err,results))}

function select(response){
  var queryStr = 'SELECT 1 + 1 AS solution';
  console.log("Request handler '/select' was called.");
  response.writeHead(202, {"Content-Type": "text/html"});

  mysql.dbconnect();
  mysql.dbselect(queryStr);
  //console.log(arguments);
  response.write("select result:" );
  mysql.EndDbConnect();
  
  //response.write("select result:" + result);
  response.end();

}



exports.other = other;
exports.connect = connect;
exports.update = update;
exports.none = none;
exports.select = select;


/*
// 加载mysql
var mysql = require('./mysqlConn');
// 加载mysql-queues 支持事务
var queues = require('mysql-queues');
// 加载async 支持顺序执行
var async = require('async');

var db_tran = function(){
   // 获取事务
    queues(mysql);
    var trans = mysql.startTransaction();

async.series([
    function(insert_cb) { 
        var insert_sql = "INSERT INTO `shop` (`id`, `name`, `address`, `tel`, `fax`, `mail`, `shop_kbn`, `modified_date`, `modified_id`) VALUES ('18', '1212', '1212', '12', '12', '12', '12', '2013-05-28 16:10:15', '0')";
        // 执行第一条sql语句 如果出错 直接进入最后的 错误方法 回滚事务
        trans.query(insert_sql, function(err, info) {
            insert_cb(err, info);
        })

    },
    function(update_cb_1) { 
        var update_sql_1 = "UPDATE `shop` SET `address`='管理会社  1' WHERE `id`='17'";

        // 执行第二条sql语句 如果出错 直接进入最后的 错误方法 回滚事务
        trans.query(update_sql_1, function(err, info) {
            update_cb_1(err, info);
        })
    },
    function(update_cb_2) {
        var update_sql_2 = "UPDATE `shop` SET `address`='管理会社  2' WHERE `id`='16'";
        // 执行第三条sql语句 如果出错 直接进入最后的 错误方法 回滚事务
        trans.query(update_sql_2, function(err, info) {
            update_cb_2(err, info);
        })

    }
], function(err, results) {
    if (err) {
        console.log("rollback");
        // 出错的场合 回滚
        trans.rollback();
    } else {
        // 没有错误的场合 提交事务
        trans.commit();
    }

});
// 执行这个事务
trans.execute();
}

*/   