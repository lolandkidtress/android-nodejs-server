var http = require('http'); 
var url = require("url");


global.requestURL = "";
var action="";

function start(route, handle){ 
    server = http.createServer(function (request, response) {   
        if(request.url != '/favicon.ico'){
         console.log(request.url);
         
         
         var pathname = url.parse(request.url).pathname;
         
         global.requestURL = pathname;
         action ="/other";


         console.log("Request for " + pathname + " received.");
         console.log("Request for " + global.varA + " received.");

         /*根据"/"拆分url和参数
         *  第一个/后的是功能 比如 select/insert/update/login
         *  之后根的是具体的jason格式
         */

         //var QueryString = url.parse(request.url).
    	 
    	 //route(handle, pathname, response, request);
         route(handle, action, response, request); //根据action的值去调用不同的业务
    	 
      }

      

    })   
    server.listen(8000);   
       
} 





exports.start = start;;