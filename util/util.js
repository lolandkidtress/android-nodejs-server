var moment = require('moment');
var config = require('../config/config.js');
var timeout = 200;

exports.err = function(errMsg, callback) {
  //模拟一个错误的产生，让async各个函数末尾的callback接收到。
    timeout = timeout || 200;
    setTimeout(function() {
        callback(errMsg);
    }, timeout);
};

exports.log = function(ilevel,msg, obj) {
    //对console.log进行了封装。添加时间的输出和日志级别的判断
    var level = {
        info:'info',  //最小
        debug:'debug', //较大
        Err:'error'
    };
    var infolevel;
    var tracelever = config.getTraceLevel();

    if(tracelever==''||tracelever){   //设置过全局变量则根据全局变量
        infolevel = ilevel;
    }
     
    if(tracelever=='debug'){
        infolevel = 'debug'; 
    }

    if(tracelever=='info'){
        infolevel = 'info';
    }

    if(ilevel=='error'){
        infolevel = 'error';
    }
    
    //infolevel = ilevel;
    if(infolevel == level['info']){
            if(obj!==undefined) {
            process.stdout.write(msg);
            console.log(obj);
            } else {
            console.log(msg);
            }
    }
    else if(infolevel == level['debug']){
            process.stdout.write(moment().format('YYYY-MM-DD hh:mm:ss.SSS')+'> ');
	       //process.stdout.write(moment().tz("asia/Shanghai").format('YYYY-MM-DD hh:mm:ss.SSS')+'> ');  //需要timezone包

            if(obj!==undefined) {
            process.stdout.write(msg);
            console.log(obj);
            } else {
            console.log(msg);
            }
    }
    else if(infolevel == level['Err'] ){
          process.stdout.write(moment().format('YYYY-MM-DD hh:mm:ss.SSS')+'> ');
           //process.stdout.write(moment().tz("asia/Shanghai").format('YYYY-MM-DD hh:mm:ss.SSS')+'> ');  //需要timezone包

            if(obj!==undefined) {
            process.stdout.write(msg);
            console.log('error！' + obj);
            } else {
            console.log('error! ' + msg);
            }  
    } 


};

exports.AESencrypt = function(key, String) {
  ////输入key和需要解密的字符串
    process.stdout.write(moment().format('YYYY-MM-DD hh:mm:ss.SSS')+'> ');
    //process.stdout.write(moment().tz("asia/Shanghai").format('YYYY-MM-DD hh:mm:ss.SSS')+'> ');  //需要timezone包

    if(String!==undefined) {
        var encrypted = AES.encrypt("Message", "Secret Passphrase");

console.log(encrypted.toString());
    } else {
        console.log(msg);
    }
};

exports.AESdecrypt = function(key, String) {
  //输入key和需要解密的字符串
    process.stdout.write(moment().format('YYYY-MM-DD hh:mm:ss.SSS')+'> ');
    //process.stdout.write(moment().tz("asia/Shanghai").format('YYYY-MM-DD hh:mm:ss.SSS')+'> ');  //需要timezone包

    if(obj!==undefined) {
        process.stdout.write(msg);
        console.log(obj);
    } else {
        console.log(msg);
    }
};

exports.wait = function(mils) {
  //刻意等待mils的时间，mils的单位是毫秒。
    var now = new Date;
    while(new Date - now <= mils);
}

exports.fire = function(obj, callback, timeout) {
  //直接将obj的内容返回给
    timeout = timeout || 200;
    setTimeout(
        function() {
        callback(null, obj);
    }
    , timeout);
};