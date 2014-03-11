

function ErrorHandle(error){
	 //console.log('error when connecting to db:', error);
	 console.trace();
}
exports.ErrorHandle = ErrorHandle;




var async = require('async');
async.series([
        function (callback) { 
			var values = ['Chad', 'Lung', 'Hello World'];
  			client.query('INSERT INTO MyTable SET firstname = ?, lastname = ? , message = ?', values,
    					function(error, results) {
									      if(error) {
									        console.log("ClientReady Error: " + error.message);
									        client.end();
									        return;
									      }
									      console.log('Inserted: ' + results.affectedRows + ' row.');
										      console.log('Id inserted: ' + results.insertId);
										      callback(null,1);
										    }
  						); 
  							},
        function (callback) {
        GetData(client);
        callback(null,1);}],
        
 function (err, results) {
            return;
        });