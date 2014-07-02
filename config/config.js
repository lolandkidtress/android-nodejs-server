

var request = "";  //业务数据 json对象
var tracelever ="debug"; //全局的日志级别

var db_config = {
  host: '192.168.20.85',
  user: 'whs',
  password: 'whs',
  database: 'ivggs_whs',
  insecureAuth: true
};

var ivggs_db_config = {
  host: '192.168.20.145',
  user: 'whs',
  password: 'whs',
  database: 'lportal'
};

var ASECrypt = {
	SecretPassphrase:'password',
	Salt:'salt',
	iv:'vector'
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
function getASECrypt(){
	return ASECrypt;
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
exports.getASECrypt = getASECrypt;
exports.getServerPort  = getServerPort;
exports.getLogDest  = getLogDest;
exports.getExpireTime  = getExpireTime;