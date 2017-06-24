/* package to generate, import and export Ethereum keys.
https://github.com/ethereumjs/keythereum
*/
var fs = require('fs');
var keythereum = require("keythereum");

var dir = './keystore';

/* key creation
*/
var params = { keyBytes: 32, ivBytes: 16 };

// Generate
// 1. a new random private key (256 bit)
// 2. the salt (256 bit) used by the key derivation function
// 3. the initialization vector (128 bit) used to AES-128-CTR encrypt the key
var dk = keythereum.create(params);

console.log("privateKey:", dk.privateKey.toString("hex"));
console.log("salt:", dk.salt.toString("hex"));
console.log("iv:", dk.iv.toString("hex"));

// keystore's password & the key derivation function (default: PBKDF2-SHA256)
var password = "1234";
var kdf = "pbkdf2";


/* dump the keystore file
*/
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// keystore format
// https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
var keyObject = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv);
keythereum.exportToFile(keyObject);

address = JSON.parse(JSON.stringify(keyObject)).address
console.log(address);

/* key import: parse keystore file into an keyObject
*/

// Specify keystore's directory path
var datadir = "./";

// import keystore
var keyObject = keythereum.importFromFile(address, datadir);
console.log(keyObject);

// recover privateKey from keystore
var privateKey = keythereum.recover(password, keyObject);
console.log(privateKey.toString('hex'));
