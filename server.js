var http = require('http');
var socketio ; 
var url = require("url");
var cluster = require('cluster');
var util = require("./util/util.js");
var comm = require("./util/comm.js");
var config = require("./config/config.js");
var router = require("./route");
var crypt = require("./crypto/crypto.js");
var login = require('./bussi/login.js');
var domain = require('domain');

var action="";   //action数据
var questquery=""; //业务数据，解密后
var bussiquery="";

//global.tracelevel = config.getTraceLevel();
//global.db_config = config.getDBConfig();

//function dohandle(route, handle){
function dohandle(){

    server = http.createServer(function (request, response) {

      var d = domain.create();   //捕捉所有未捕获的错误
      d.on('error', function(er) {
      util.log('error', "Domain Catch uncaughtException: " + er.stack);
      err = {
            "errno": "400",
            "errmsg": "uncaughtException"
            };
      router.route('/errhandle',err, response, request);
    });

    d.add(request);
    d.add(response);
    d.run(function() {
        if(request.url != '/favicon.ico'){

        util.log('debug', "Request.url: " + JSON.stringify(url.parse(request.url)) + " received.");

        //解密,失败直接返400错误''
        //替换 / 为 ''
        var pathname = crypt.decrypt(url.parse(request.url).path.replace('/','')); 
        //var pathname = url.parse(request.url).path;

        /*
        //正确显示中文，将三字节的字符转换为utf-8编码
        re=/(%[0-9A-Fa-f]{2}){3}/g;
        pathname=pathname.replace(re,function(word){
        var buffer=new Buffer(3),
            array=word.split('%');
        array.splice(0,1);
        array.forEach(function(val,index){
            buffer[index]=parseInt('0x'+val,16);
        });
        return buffer.toString('utf8');
        });
        */

        //拆分action和实际业务数据
        action = pathname.substring(0,pathname.indexOf("?",0)) ;
        util.log('debug', "action " + action + " received " );
        var query = pathname.substring(pathname.indexOf("?",0)+1,pathname.length) ;
        //var query = pathname.length;
        util.log('debug', "query " + query + " received " );
        questquery = query;

        if(questquery!=null&&action!=null&&action!=''){

            //将string类型转为为json对象;
            bussiquery = JSON.parse(query);

         if(bussiquery!=''&& bussiquery!=null){

            util.log('debug','buss query is ' );
            util.log('debug',bussiquery); //字符串
            if(action!='/login' && action!='/insertAccessRecord'){
                  util.log('debug','userValidateCheck enter');
                  comm.userValidateCheck(bussiquery,function(cb){
                    util.log('debug','userValidateCheck return' + cb);
                    if(cb!=1){   //uuid校验失败
                              util.log('info','Session InValid');
                              err = {
                                'errno': '500',
                                'errmsg': 'Session InValid'
                                };

                             router.route('/errhandle',err, response, request);
                            }
                            else{  //uuid通过了
                              router.route(action,bussiquery, response, request); //根据action的值去调用不同的业务
                            }
                  });
                }else{ //是login模块
                  router.route(action,bussiquery, response, request);//根据action的值去调用不同的业务
                }

            //router.route(pathname,bussiquery, response, request);//根据action的值去调用不同的业务
         }
         else  //解密失败
         {
          util.log('info','decrypt error');
          err = {
            'errno': '401.4',
            'errmsg': 'decrypt error'
            };
         /*
          response.writeHead(401.4, {"Content-Type": "text/html"});
          response.write(JSON.stringify(err));
          response.end();
          util.log('info','end of response');
          */
         router.route('/errhandle',err, response, request);

         }
        }else {  //业务数据是空
          util.log('info','query/action is null');
          err = {
            'errno': '404',
            'errmsg': 'Page not found'
            };
         /*
          response.writeHead(401.4, {"Content-Type": "text/html"});
          response.write(JSON.stringify(err));
          response.end();
          util.log('info','end of response');
          */
         router.route('/errhandle',err, response, request);
        }
      } //request.url != '/favicon.ico'


    });  //d.run


    })
    //server.listen(8000);
      //socketio = require('socket.io').listen(server);

      server.listen(config.getServerPort());
      util.log('info','Server start on ' + config.getServerPort());
}

exports.dohandle = dohandle;