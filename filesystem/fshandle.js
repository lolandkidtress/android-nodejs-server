var path=require("path");
var fs = require("fs");
var http = require("http");
var mime = require("./mime.js");
var util = require("../util/util.js");

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


function downloadStream (response, realPath,callback) {
        util.log('info','File System downloadfile Handle called');
        var ext = path.extname(realPath);

        ext = ext ? ext.slice(1) : 'unknown';
        var contentType = mime.getMime(ext);

        //需要添加文件格式的屏蔽

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
            util.log('error','File Not Found');

            } else {

                    option ={
                    encoding: 'utf-8', 
                    bufferSize: 64 * 1024
                    }

                    response.writeHead(200, {
                        'Content-Type': 'text/html'
                    });

                    var rs = fs.createReadStream(realPath,option);
                    var data = '';
                    
                    rs.on("data", function (trunk){
                    data += trunk;
                    });

                    rs.on("end", function () {
                    response.write(data);
                    response.end();
                    util.log('info','FileDownload completed');
                    });
                 }
            });
        }


exports.uploadfile = uploadfile;
exports.downloadfile = downloadfile;
exports.downloadStream = downloadStream;