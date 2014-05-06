var http = require('http');
var socketio ; 
var url = require("url");
var cluster = require('cluster');
var util = require("./util/util.js");
var config = require("./config/config.js");
var router = require("./route");
var crypt = require("./crypto/crypto.js")

var action="";   //action数据
var questquery=""; //业务数据，解密后
var bussiquery="";

//global.tracelevel = config.getTraceLevel();
//global.db_config = config.getDBConfig();

//function dohandle(route, handle){ 
function dohandle(){ 
    server = http.createServer(function (request, response) {

        if(request.url != '/favicon.ico'){

        //util.log('debug', 'Worker #'+ cluster.worker.id + "@" + cluster.worker.process.pid + " Serverd for U ");
        util.log('debug', "Request.url: " + JSON.stringify(url.parse(request.url)) + " received.");

         
        //空格替换
        var pathname = url.parse(request.url).pathname.replace(/%20/g,' '); 
        
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

        action = pathname ; 
        util.log('debug', "action " + action + " received " );

        var query =url.parse(request.url).query; //业务数据，需解密
        util.log('debug', "query " + query + " received " );


        if(query!=null){
            
            //questquery = crypt.decrypt(query); //解密,失败返回'' 
            questquery = query; 
            //var questquery = JSON.parse(questquery.replace(/%20/g,' ').replace(/%22/g,'"'));   // 替换双引号和空格,转换成json对象
            //util.log('debug',"decrypt result is " + query.replace(/%20/g,' ').replace(/%22/g,'"'));
            util.log('debug',"decrypt result is " + questquery.replace(/%20/g,' ').replace(/%22/g,'"').replace(/%2f/g,'\\'));
            //var questquery = JSON.parse(query.replace(/%20/g,' ').replace(/%22/g,'"'));
            bussiquery=JSON.parse(questquery.replace(/%20/g,' ').replace(/%22/g,'"').replace(/%2f/g,'\\'));
            
         if(bussiquery!=''&& bussiquery!=null){
            
            util.log('info','buss query is ' );
            util.log('info',JSON.stringify(bussiquery));
            
            router.route(pathname,bussiquery, response, request);//根据action的值去调用不同的业务
         }
         else
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
          util.log('info','query is null'); 
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
         router.route('errhandle',err, response, request);
         
        }
       
         
      }

    })   
    //server.listen(8000);
      socketio = require('socket.io').listen(server);

      server.listen(config.getServerPort()); 

      socketio.enable('browser client minification');  // send minified client
      socketio.enable('browser client etag');          // apply etag caching logic based on version number
      socketio.enable('browser client gzip');          // gzip the file
      socketio.set('log level', 1);                    // reduce logging

      // enable all transports (optional if you want flashsocket support, please note that some hosting
      // providers do not allow you to create servers that listen on a port different than 80 or their
      // default port)
      socketio.set('transports', [
          'websocket'
        , 'flashsocket'
        , 'htmlfile'
        , 'xhr-polling'
        , 'jsonp-polling'
      ]);

      util.log('info','Server start on ' + config.getServerPort());
} 

exports.dohandle = dohandle;