var http = require('http'); 
var url = require("url");
var cluster = require('cluster');


global.request = "";  //业务员数据 json对象

var action="";   //action数据

function dohandle(route, handle){ 
    server = http.createServer(function (request, response) {   
        if(request.url != '/favicon.ico'){

         console.log('Worker #'+ cluster.worker.id + "@" + cluster.worker.process.pid + " Serverd for U ");

         //需要多一步加密的动作
         //var decryptourl = decrypto(request.url); 解密request
        
        //传过来的解密后的全部request  空格替换
        var pathname = url.parse(request.url).pathname.replace(/%20/g,' ');  
        

        
        //能够正确显示中文，将三字节的字符转换为utf-8编码
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
         global.request = pathname;   
         action = pathname ;

         console.log("Request for pathname: " + pathname + " received.");
         console.log("Request for global.requestURL: " + global.request + " received.");
         console.log("action " + action + " called " );

         /*根据"/"拆分url和参数
         *  第一个/后的是功能 比如 select/insert/update/login
         *  之后将业务数据重组成jason格式
         */

         //var QueryString = url.parse(request.url).
    	 
    	 //route(handle, pathname, response, request);
         route(handle, action, response, request); //根据action的值去调用不同的业务
    	 
      }

    })   
    server.listen(8000);   
       
} 





exports.dohandle = dohandle;;