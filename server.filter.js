'use strict';

var parseUrl = require('parseurl');
var fs = require('fs');
var pathNode = require('path');

module.exports = { filter: filter };

function filter(root) {
  let htmlPaths = new Set();
  let map = [];
  let rootLen = root.length;
  readDirSync(root);
  function readDirSync(pathStr) {
    var files = fs.readdirSync(pathStr);
    files.forEach(function(ele, index) {
      let filePath = pathNode.join(pathStr, ele);
      let info = fs.statSync(filePath);
      if (info.isDirectory()) {
        if (ele != 'node_modules') readDirSync(filePath);
      } else {
        if (!ele.startsWith('_') && ele.endsWith('.html')) {
          let reg = new RegExp(pathNode.sep + pathNode.sep, 'g');
          let realPath = filePath.substring(rootLen).replace(reg, '/');
          let routePath = realPath.replace('-.html', '');
          routePath = routePath.replace(/\+/g, '/');
          routePath = routePath.replace(/\$/g, '([^/]*?)');
          if (routePath != realPath) {
            map.push({
              key: '^' + routePath + '$',
              value: realPath
            });
          } else {
            htmlPaths.add(realPath);
          }
        }
      }
    });
  }
  map.sort(function(a, b) {
    return a.key.length > b.key.length ? 1 : -1;
  });

  return (req, res, next) => {
    var path = parseUrl(req).pathname;
    //console.log(path);
    var cookies = req.headers.cookie;
    //var lazyPageSpider = cookies && cookies.indexOf('LazyPageSpider=0') > -1;
    var pathParams = null;
    var appentScript = null;
    var ext = pathNode.extname(path);
    ext = ext.length > 0 ? ext.slice(1) : 'unknown';
    var fileName = pathNode.basename(path);
    var hitHtml = false;
    if (ext != 'unknown' && ext != 'html') {
      next();
    } else if (fileName.startsWith('_') && ext == 'html') {
      next();
    } else {
      if (htmlPaths.has(path)) {
        hitHtml = true;
      } else if (path.endsWith('/') && htmlPaths.has(path + 'index.html')) {
        hitHtml = true;
        path = path + 'index.html';
      } else {
        for (var i = 0; i < map.length; i++) {
          var key = map[i].key;
          let reg = new RegExp(key, 'i');
          if (reg.test(path)) {
            let group = reg.exec(path);
            path = map[i].value.substring(1);
            appentScript = '1';
            if (group.length > 1) {
              pathParams = group.slice(1, group.lengths);
              appentScript = '<script>LazyPage.pathParams=["' + pathParams.join('","') + '"];</script>\n';
            }
            break;
          }
        }
      }
      //console.log(lazyPageSpider);
      if (appentScript) {
        //|| (!lazyPageSpider && hitHtml)
        //console.log(path);
        fs.readFile(root + '/' + path, 'utf-8', function(err, html) {
          if (err) {
            console.log(err);
            next('code 404, file not found');
          } else {
            if (appentScript != null && appentScript != '1') {
              var bodyEnd = html.lastIndexOf('</body>');
              if (bodyEnd > 0) {
                html = html.substring(0, bodyEnd) + appentScript + html.substring(bodyEnd);
              } else {
                html += '\n' + appentScript;
              }
            }
            /* if (!lazyPageSpider) {
              var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
              var query = fullUrl.split('?');
              query = query.length > 1 ? query[1] : null;
              try {
                new analyzeHtml().parse(fullUrl, query, html, pathParams, cookies, function(code, result) {
                  if (code == 200) {
                    render(req, res, result);
                  } else {
                    console.log(result);
                    next('server error');
                  }
                });
              } catch (error) {
                console.log(error);
                next('server error');
              }
            } else { */
            render(req, res, html);
            //}
          }
        });
      } else {
        next();
      }
    }
  };
}

function render(req, res, doc) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.setHeader('Content-Length', Buffer.byteLength(doc));
  res.end(doc);
}
