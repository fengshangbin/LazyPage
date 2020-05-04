var express = require("express");
var serverFilter = require("lazypage-node");

var app = express();
app.use(serverFilter.filter("static")); // src为当前项目前端代码目录
app.use(express.static("static"));

app.listen(8082, function () {
  console.log("start lazypage server，访问地址为 http://localhost:8082/");
});

//打开默认浏览器
const openDefaultBrowser = function (url) {
  var exec = require("child_process").exec;
  switch (process.platform) {
    case "darwin":
      exec("open " + url);
      break;
    case "win32":
      exec("start " + url);
      break;
    default:
      exec("xdg-open", [url]);
  }
};
openDefaultBrowser("http://localhost:8082");
