var AES = require("crypto-js/aes");
var des = require("crypto-js/tripledes");
var encutf8 = require("crypto-js/enc-utf8");
var encbase64 = require("crypto-js/enc-base64");
var config = require('../config/config.js')


function aesencrypt(encryptedString){

	var ASECrypt = config.getASECrypt();
	var encrypted = AES.encrypt(encryptedString, ASECrypt['SecretPassphrase'],ASECrypt['Salt'],ASECrypt['iv']);
	return encrypted.toString();

}

function aesdecrypt(encryptedString){

	var ASECrypt = config.getASECrypt();
	var decrypted = AES.decrypt(encryptedString, ASECrypt['SecretPassphrase'],ASECrypt['Salt'],ASECrypt['iv']);

	return decrypted.toString(encutf8);

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
	console.log(encryptedString);
	var decrypted = des.decrypt(encryptedString, "password");

	return decrypted.toString(encutf8);

}

/*
var ASECrypt = config.getASECrypt();
var encrypted = AES.encrypt("Message", ASECrypt['SecretPassphrase'],ASECrypt['Salt'],ASECrypt['iv']);
var decrypted = AES.decrypt(encrypted, ASECrypt['SecretPassphrase'],ASECrypt['Salt'],ASECrypt['iv']);
*/

exports.desencrypt = desencrypt;
exports.desdecrypt = desdecrypt;