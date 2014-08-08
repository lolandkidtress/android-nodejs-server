var AES = require("crypto-js/aes");
var des = require("crypto-js/tripledes");
var encutf8 = require("crypto-js/enc-utf8");
var encbase64 = require("crypto-js/enc-base64");
var encHex = require("crypto-js/enc-hex");
var config = require('../config/config.js');
var util =require('../util/util.js');
var crypto = require('crypto');



//将接受到的加密字符串解密后base64解码成string
function decrypt(plaintext) {
  //var key = new Buffer(param.key);
  //var iv = new Buffer(param.iv ? param.iv : 0)
  //var plaintext = param.plaintext
  //var alg = param.alg
  //var autoPad = param.autoPad
  util.log('debug','解密对象:' + plaintext );
  var key = new Buffer(config.getCryptParam().key);
  var iv = new Buffer(config.getCryptParam().iv);
  var plaintext = plaintext;
  var alg = config.getCryptParam().alg;
  var autoPad = config.getCryptParam().autoPad;

  //decrypt
  var decipher = crypto.createDecipheriv(alg, key, iv);
  decipher.setAutoPadding(autoPad)
  var txt = decipher.update(plaintext, 'hex', 'utf8');
  txt += decipher.final('utf8');

  var p_path = new Buffer(txt, 'base64');
  var txt = p_path.toString();
  util.log('debug','解密后的：' + txt);

  return txt;

}

//接收到的字符串base64编码后加密
function encrypt (plaintext) {

  util.log('debug','加密对象:' + plaintext );
  var p_txt = new Buffer(plaintext);

  var plaintext = p_txt.toString('base64');
  util.log('debug','base64 编码后:' + plaintext + plaintext.length);

  //带加密的对象长度必须是8的倍数
  for(var i = 0 ; i< Number(plaintext.length%8);i++ )
  	( function (i) {
  		plaintext = plaintext +' ';
	})(i);

  var key = new Buffer(config.getCryptParam().key);
  var iv = new Buffer(config.getCryptParam().iv);

  var alg = config.getCryptParam().alg;
  var autoPad = config.getCryptParam().autoPad;

  //encrypt
  var cipher = crypto.createCipheriv(alg, key, iv);
  cipher.setAutoPadding(autoPad)  //default true
  var ciph = cipher.update(plaintext, 'utf8', 'hex');
  ciph += cipher.final('hex');

  util.log('debug','加密后:' + ciph);

  return ciph;
}


//16进制 转换成 ascii string

function ConvertHexToString(HexValue){
	if (HexValue.length % 2) return '';

	var tmp='';
	for(i=0;i<HexValue.length;i+=2)
	{
		//int ch = (int)HexValue.charAt(i)*10 + (int)HexValue.charAt(i+1) +2;
		//tmp += '%' + ch;
		//tmp += '%' 
		//tmp += parseInt(HexValue.substr(i,2))-parseInt(0);
		tmp = parseInt(HexValue.substr(i,2))-parseInt(0);
		tmp = String.fromCharCode(tmp);
		console.log(tmp);
		//tmp += '%' + ch;
		//console.log(UnicodeToUTF8(tmp));
	}
	/*
	var k=HexValue.split("%");  
   	var rs="";  
   	for(i=0;i<k.length;i++){  
      rs+=String.fromCharCode(k[i]);  
   	}  
	*/
   	console.log("after is " + tmp );
   	return tmp; 

	//return tmp;
}

//string 转换成16进制 

function ConvertStringToHex(StringValue){	
	var str="";  
	var s4="";

	for (var i=0;i<StringValue.length();i++)   
	{   
	//int ch = (int)StringValue.charAt(i) -2 ;  
	var ch = StringValue.charAt(i) -2 ;   
	s4 = Integer.toHexString(ch);   
	str = str + s4;   
	}   
	return str;   
}   


function UnicodeToUTF8(strInUni){
  if(null==strInUni)
    returnnull;
  var strUni=String(strInUni);
  var strUTF8=String();
  for(var i=0;i<strUni.length;i++){
    var wchr=strUni.charCodeAt(i);
    if(wchr<0x80){
      strUTF8+=strUni.charAt(i);
      }
    else if(wchr<0x800){
      var chr1=wchr&0xff;
      var chr2=(wchr>>8)&0xff;
      strUTF8+=String.fromCharCode(0xC0|(chr2<<2)|((chr1>>6)&0x3));
      strUTF8+=String.fromCharCode(0x80|(chr1&0x3F));
      }
    else{
      var chr1=wchr&0xff;
      var chr2=(wchr>>8)&0xff;
      strUTF8+=String.fromCharCode(0xE0|(chr2>>4));
      strUTF8+=String.fromCharCode(0x80|((chr2<<2)&0x3C)|((chr1>>6)&0x3));
      strUTF8+=String.fromCharCode(0x80|(chr1&0x3F));
      }
    }
  return strUTF8;
  }

/*
var ASECrypt = config.getASECrypt();
var encrypted = AES.encrypt("Message", ASECrypt['SecretPassphrase'],ASECrypt['Salt'],ASECrypt['iv']);
var decrypted = AES.decrypt(encrypted, ASECrypt['SecretPassphrase'],ASECrypt['Salt'],ASECrypt['iv']);
*/

exports.encrypt = encrypt;
exports.decrypt = decrypt;