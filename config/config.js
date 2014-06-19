

var request = "";  //业务数据 json对象
var tracelever ="debug"; //全局的日志级别

var db_config = {
  host: '192.168.175.129',
  user: 'whs',
  password: 'whs',
  database: 'ivggs_whs'
};

var Access_db_config = {
  host: '192.168.175.129',
  user: 'whs',
  password: 'whs',
  database: 'ivggs_whs'
};

var ASECrypt = {
	SecretPassphrase:'password',
	Salt:'salt',
	iv:'vector'
}

var ServerPort = '8000';

function getTraceLevel(){
	return tracelever;
}

function getDBConfig(){
	return db_config;
}
function getASECrypt(){
	return ASECrypt;
}
function getServerPort(){
	return ServerPort;
}


exports.getTraceLevel = getTraceLevel;
exports.getDBConfig = getDBConfig;
exports.getASECrypt = getASECrypt;
exports.getServerPort  = getServerPort;