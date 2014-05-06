var AES = require("crypto-js/aes");
var des = require("crypto-js/tripledes");
var encutf8 = require("crypto-js/enc-utf8");
var encbase64 = require("crypto-js/enc-base64");
var encHex = require("crypto-js/enc-hex");
var config = require('../config/config.js')


function aesencrypt(encryptedString){

	var ASECrypt = config.getASECrypt();
	var encrypted = AES.encrypt(encryptedString, ASECrypt['SecretPassphrase'],ASECrypt['Salt'],ASECrypt['iv']);
	return encrypted.toString();

}

function aesdecrypt(encryptedString){

	var ASECrypt = config.getASECrypt();
	//var key = encHex.parse('000102030405060708090a0b0c0d0e0f');
    //var iv  = encHex.parse('101112131415161718191a1b1c1d1e1f');
    var key = '000102030405060708090a0b0c0d0e0f';
    var iv  = '101112131415161718191a1b1c1d1e1f';
    console.log(key);
    console.log(iv);
	var decrypted = AES.decrypt(encryptedString, ASECrypt['SecretPassphrase'],ASECrypt['Salt'],ASECrypt['iv']);
    //var decrypted = AES.decrypt(encryptedString, key,'',iv);
	//return decrypted.toString(encutf8);
	//console.log(decrypted);
	return decrypted;
}
//tripledes 加密
function desencrypt(encryptedString){

	var ASECrypt = config.getASECrypt();
	var encrypted = des.encrypt(encryptedString, "password");
	return encrypted.toString();

}
//tripledes 解密
function desdecrypt(encryptedString){

	var ASECrypt = config.getASECrypt();
	
	var decrypted = des.decrypt(encryptedString, "password");

	return decrypted.toString(encutf8);

}

function decrypt(encryptedString){

	console.log("before is "+encryptedString)
	var decrypted = ConvertHexToString(encryptedString);
	
	return decrypted.toString(encutf8);

}
function encrypt(encryptedString){

	var encrypted = ConvertStringToHex(encryptedString);
	return encrypted.toString();

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