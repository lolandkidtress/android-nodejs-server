

var request = "";  //业务数据 json对象
//error or debug or info
var tracelever ="debug"; //全局的日志级别

var db_config = {
  host: '192.168.20.85',
  user: 'whs',
  password: 'whs',
  database: 'ivggs_whs',
  charset : 'UTF8_GENERAL_CI',
  port : 3306,
  multipleStatements :true,
  insecureAuth: true
};

var ivggs_db_config = {
  host: '192.168.20.145',
  user: 'whs',
  password: 'whs',
  database: 'lportal'
};


//  alg: 'des-ede3',  //3des-ecb
//  alg: 'des-ede3-cbc',  //3des-ecb

var CryptParam = {
	key:'0123456789abcd0123456789',  //8的倍数
	alg:'des-ede3-cbc',
	iv:'12345678',
  autoPad:false,
}

var logdest = '/ivggs/log/nodejs/server.log';

var ServerPort = '8001';
var ExpireTime = 3; //用户登录后的天数

function getTraceLevel(){
	return tracelever;
}

function getDBConfig(){
	return db_config;
}
function getivggsDBConfig(){
  return ivggs_db_config;
}
function getCryptParam(){
	return CryptParam;
}
function getServerPort(){
	return ServerPort;
}

function getLogDest(){
  return logdest;
}

function getExpireTime(){
  return ExpireTime;
}


exports.getTraceLevel = getTraceLevel;
exports.getDBConfig = getDBConfig;
exports.getivggsDBConfig = getivggsDBConfig;
exports.getCryptParam = getCryptParam;
exports.getServerPort  = getServerPort;
exports.getLogDest  = getLogDest;
exports.getExpireTime  = getExpireTime;