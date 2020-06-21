var express = require("express");
var lazypage = require("lazypage-node");

var app = express();
app.use(lazypage.filter("static"));
app.use(express.static("static"));

app.listen(8081, function () {
  console.log("LazyPage node.js测试，访问地址为 http://localhost:8081/");
});

app.removeListener;

//打开默认浏览器
const openDefaultBrowser = function (url) {
  var exec = require("child_process").exec;
  //console.log(process.platform);
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
openDefaultBrowser("http://localhost:8081/");
