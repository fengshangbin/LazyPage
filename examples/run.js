const fs = require('fs');
const path = require('path');
const url = require('url');
const http = require('http');

let mimetype = {
  'css': 'text/css',
  'gif': 'image/gif',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'webp': 'image/webp',
  'js': 'text/javascript',
  'json': 'application/json',
  'pdf': 'application/pdf',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'swf': 'application/x-shockwave-flash',
  'woff': 'application/font-woff',
  'woff2': 'application/font-woff2',
  'ttf': 'application/x-font-ttf',
  'eot': 'application/vnd.ms-fontobject',
  'txt': 'text/plain',
  'wav': 'audio/x-wav',
  'mp3': 'audio/mpeg3',
  'mp4': 'video/mp4',
  'xml': 'text/xml'
};

// 创建server
let server = http.createServer(function (request, response) {
	var pathname = url.parse(request.url).pathname;
	var realPath = path.join('', pathname).substring(1);
	//console.log(realPath);
	var ext = path.extname(realPath);
	ext = ext ? ext.slice(1) : 'unknown';
	fs.exists(realPath, function (exists) {
		if (!exists) {
			response.writeHead(404, {
				'Content-Type': 'text/plain'
			});
			response.write('This request URL ' + pathname + ' was not found on this server.');
			response.end();
		} else {
			fs.readFile(realPath, 'binary', function (err, file) {
				if (err) {
					response.writeHead(500, {
						'Content-Type': 'text/plain'
					});
					response.end(err);
				} else {
					var contentType = mimetype[ext] || 'text/plain';
					response.writeHead(200, {
						'Content-Type': contentType
					});
					response.write(file, 'binary');
					response.end();
				}
			});
		}
	});
});

//设置监听端口
server.listen(8089, '127.0.0.1', function () {
	console.log('服务已经启动，访问地址为：\nhttp://127.0.0.1:8089/index.html');
});