var moment = require('moment');

var timeout = 200;

exports.err = function(errMsg, callback) {
  //模拟一个错误的产生，让async各个函数末尾的callback接收到。
    timeout = timeout || 200;
    setTimeout(function() {
        callback(errMsg);
    }, timeout);
};

exports.log = function(msg, obj) {
  //对console.log进行了封装。主要是增加了时间的输出
    process.stdout.write(moment().format('YYYY-MM-DD hh:mm:ss.SSS')+'> ');
	//process.stdout.write(moment().tz("asia/Shanghai").format('YYYY-MM-DD hh:mm:ss.SSS')+'> ');  //需要timezone包

    if(obj!==undefined) {
        process.stdout.write(msg);
        console.log(obj);
    } else {
        console.log(msg);
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