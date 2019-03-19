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

// 遍历本地目录
let root = path.join("");
let htmlPaths = new Set();
let map = new Map();
readDirSync(root);
function readDirSync(pathStr){
	//var files = fs.readdirSync(pathStr)
	let pa = fs.readdirSync(pathStr);
	pa.forEach(function(ele,index){
		let filePath = path.join(pathStr,ele);
		let info = fs.statSync(filePath);
		if(info.isDirectory()){
			readDirSync(filePath);
		}else{
			if(!ele.startsWith("_") && ele.endsWith(".html")){
				let reg = new RegExp(path.sep+path.sep, "g");
				let realPath = "/"+filePath.replace(reg, "/");
				let routePath = realPath.replace("-.html", "");
				routePath = routePath.replace(/\+/g, "/");
				routePath = routePath.replace(/\$/g, "([^/]*?)");

				if(routePath != realPath){
					map.set("^"+routePath+"$", realPath);
				}else{
					htmlPaths.add(realPath);
				}
			}
		}	
	})
}
//console.log(htmlPaths);
//console.log(map);
// 创建server
let server = http.createServer(function (request, response) {
	if(server.onRequest){
		server.onRequest(request, response);
	}
	var pathname = url.parse(request.url).pathname;
	var realPath = path.join("", pathname.substring(1));
	var appentScript;
	var ext = path.extname(realPath);
	ext = ext.length>0 ? ext.slice(1) : 'unknown';
	console.log(pathname);
	if(ext!="unknown" && ext!="html"){
		
	}else if(htmlPaths.has(pathname)){
		
	}else if(pathname === '/' && htmlPaths.has("/index.html")){
		realPath = "index.html";
		ext="html";
	}else{
		for (let key of map.keys()) {
        	//console.log(key);
			let reg = new RegExp(key, "i");
			if(reg.test(pathname)){
				//console.log(pathname, key, reg.exec(pathname));
				let group = reg.exec(pathname);
				realPath = map.get(key).substring(1);
				ext="html";
				//console.log(group.length);
				if(group.length>1){
					let pathParams = group.slice(1,group.lengths);
					appentScript = "<script>LazyPage.pathParams=[\""+pathParams.join("\",\"")+"\"];LazyPage.pathReg='"+key+"';</script>\n";
					//console.log(appentScript);
				}
			}
    	}
	}
	//console.log(realPath);
	fs.exists(realPath, function (exists) {
		if (!exists) {
			response.writeHead(404, {
				'Content-Type': 'text/plain'
			});
			response.write('This request URL ' + pathname + ' was not found on this server.');
			response.end();
		} else {
			fs.readFile(realPath, appentScript==null?'binary':"utf8", function (err, file) {
				if (err) {
					response.writeHead(500, {
						'Content-Type': 'text/plain'
					});
					//console.log(err);
					response.write(JSON.stringify(err));
					response.end();
				} else {
					var contentType = mimetype[ext] || 'text/plain';
					response.writeHead(200, {
						'Content-Type': contentType
					});
					if(appentScript!=null){
						let bodyEnd = file.lastIndexOf("</body>");
						if(bodyEnd>0){
							file = file.substring(0, bodyEnd)+appentScript+file.substring(bodyEnd);
						}else{
							file += "\n"+appentScript;
						}
					}
					response.write(file, appentScript==null?'binary':"utf8");
					response.end();
				}
			});
		}
	});
});

//设置监听端口
server.listen(8089, function () {
	console.log('服务已经启动，访问地址为：\nhttp://localhost:8089');
});
//打开默认浏览器
const openDefaultBrowser = function (url) {
  var exec = require('child_process').exec;
  //console.log(process.platform)
  switch (process.platform) {
    case "darwin":
      exec('open ' + url);
      break;
    case "win32":
      exec('start ' + url);
      break;
    default:
      exec('xdg-open', [url]);
  }
}
openDefaultBrowser('http://localhost:8089')
module.exports=server;