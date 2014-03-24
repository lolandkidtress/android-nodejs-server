var path=require("path");
var fs = require("fs");
var fs = require("fs");
var mime = require("./mime.js");

function uploadfile (response, callback) {
        console.log("File System uploadfile Handle called");
};

function downloadfile (response, realPath,callback) {
        console.log("File System downloadfile Handle called");
        var ext = path.extname(realPath);

        ext = ext ? ext.slice(1) : 'unknown';
        var contentType = mime.getMime(ext);

        console.log("file type = " + contentType);


		path.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            var err = {
    		'err': '404 not found'
    		};
            response.write(JSON.stringify(err));
            response.end();

        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.write(JSON.stringify(err));
                    response.end();

                } else {
                    response.writeHead(200, {
                        'Content-Type': 'text/html'
                    });

                    response.write(file, "binary");

                    response.end();
                }
            });
        }
    });
};

exports.uploadfile = uploadfile;
exports.downloadfile = downloadfile;
