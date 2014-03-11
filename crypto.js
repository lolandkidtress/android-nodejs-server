var AES = require("crypto-js/aes");

var encrypted = AES.encrypt("Message", "Secret Passphrase");

console.log(encrypted.toString());

