var AES = require("crypto-js/aes");
var encutf8 = require("crypto-js/enc-utf8");
var encbase64 = require("crypto-js/enc-base64");
var config = require('../config/config.js')


function encrypt(encryptedString){

	var ASECrypt = config.getASECrypt();
	var encrypted = AES.encrypt(encryptedString, ASECrypt['SecretPassphrase'],ASECrypt['Salt'],ASECrypt['iv']);
	return encrypted.toString();

}

function decrypt(encryptedString){

	var ASECrypt = config.getASECrypt();
	var decrypted = AES.decrypt(encryptedString, ASECrypt['SecretPassphrase'],ASECrypt['Salt'],ASECrypt['iv']);

	return decrypted.toString(encutf8);

}

/*
var ASECrypt = config.getASECrypt();
var encrypted = AES.encrypt("Message", ASECrypt['SecretPassphrase'],ASECrypt['Salt'],ASECrypt['iv']);
var decrypted = AES.decrypt(encrypted, ASECrypt['SecretPassphrase'],ASECrypt['Salt'],ASECrypt['iv']);
*/

exports.encrypt = encrypt;
exports.decrypt = decrypt;