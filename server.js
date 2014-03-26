var http = require('http'); 
var url = require("url");
var cluster = require('cluster');
var util = require("./util/util.js");
var config = require("./config/config.js");

var action="";   //action数据

//global.tracelevel = config.getTraceLevel();
//global.db_config = config.getDBConfig();

function dohandle(route, handle){ 
    server = http.createServer(function (request, response) {   
        if(request.url != '/favicon.ico'){

        util.log('debug','全局TraceLevel: ' + config.getTraceLevel());
        util.log('debug','数据库连接信息: ' + JSON.stringify(config.getDBConfig()));

        util.log('debug', 'Worker #'+ cluster.worker.id + "@" + cluster.worker.process.pid + " Serverd for U ");
        util.log('debug', "Request.url: " + JSON.stringify(url.parse(request.url)) + " received.");

         //需要多一步加密的动作
         //var decryptourl = decrypto(request.url); 解密request
        
        //传过来的解密后的全部request  空格替换
        var pathname = url.parse(request.url).pathname.replace(/%20/g,' '); 
        
            var questquery =url.parse(request.url).query;

        if(questquery){
            var questquery = JSON.parse(questquery.replace(/%20/g,' ').replace(/%22/g,'"'));   // 替换双引号,转换成json对象
        }
        

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

        //将action和业务数据分开
            action = pathname ; 
            util.log('debug', "action " + action + " received " );
            util.log('debug',questquery );

         /*根据"/"拆分url和参数
         *  第一个/后的是功能 比如 select/insert/update/login
         *  之后将业务数据重组成jason格式
         */

         //var QueryString = url.parse(request.url).h
    	 
    	 //route(handle, pathname, response, request);
         route(handle, action, response, request); //根据action的值去调用不同的业务
    	 
      }

    })   
    server.listen(8000);   
       
} 

exports.dohandle = dohandle;;