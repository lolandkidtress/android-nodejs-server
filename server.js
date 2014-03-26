var http = require('http'); 
var url = require("url");
var cluster = require('cluster');
var util = require("./util/util.js");
var config = require("./config/config.js");
var router = require("./route");
var crypt = require("./crypto/crypto.js")

var action="";   //action数据
var questquery=""; //业务数据，需解密


//global.tracelevel = config.getTraceLevel();
//global.db_config = config.getDBConfig();

//function dohandle(route, handle){ 
function dohandle(){ 
    server = http.createServer(function (request, response) {   
        if(request.url != '/favicon.ico'){

        util.log('debug','全局TraceLevel: ' + config.getTraceLevel());
        util.log('debug','数据库连接信息: ' + JSON.stringify(config.getDBConfig()));

        util.log('debug', 'Worker #'+ cluster.worker.id + "@" + cluster.worker.process.pid + " Serverd for U ");
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

        questquery =url.parse(request.url).query; //业务数据，需解密
        
        if(questquery){
            questquery = crypt.decrypt(questquery).toString(); //解密,失败返回''
            //var questquery = JSON.parse(questquery.replace(/%20/g,' ').replace(/%22/g,'"'));   // 替换双引号,转换成json对象
        }
            action = pathname ; 
            util.log('debug', "action " + action + " received " );
            util.log('debug',"decrypt result is " + questquery);
        //action和业务数据分开
            
    	 if(questquery!=''){

            questquery=questquery.replace(re,function(word){
            var buffer=new Buffer(3),
            array=word.split('%');
            array.splice(0,1);
            array.forEach(function(val,index){
            buffer[index]=parseInt('0x'+val,16);
            });
            return buffer.toString('utf8');
            });

            util.log('info','bussiness query is ' );
            questquery = JSON.parse(questquery);
            util.log('info',questquery);
            
            router.route(pathname,questquery, response, request);//根据action的值去调用不同的业务
         }
    	 else
         {
          util.log('info','decrypt error'); 
          err = {
            'err': '404 not found'
            };
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write(JSON.stringify(err));
        response.end();
         }
       
    	 
      }

    })   
    server.listen(8000);   
       
} 

exports.dohandle = dohandle;;