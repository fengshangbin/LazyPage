var _ready = require('./js/ready.js');
var readyDom = require('./js/documentReady.js');
var baiduRun = require('./js/baiduTemplate.js');
var analyzeScript = require('./js/analyzeScript.js');
var ajax = require('./js/ajax.js');
/* var goto = require('./js/urlBone.js');
var css = require('./css/lazypage.css'); */

var readyLazy = new _ready();
var scriptTotal = 0,
  scriptLoad = 0;

function renderDom(block) {
  //console.log(block.parentNode);
  if (block.parentNode == null) return;
  var html = block.html;
  var data = block.data;
  if (html == null || data == null) return;
  //html = replaceParamAsString(html);
  html = replaceParamAsValue(html, false);
  //console.log(html);
  let out = baidu.template(html, data);
  //console.log(block);
  block.outerHTML = out;
  let matchScripts = analyzeScript.extractCode(out);
  var codes = matchScripts.codes;
  var srcs = matchScripts.srcs;
  for (let m = 0, len = codes.length; m < len; m++) {
    analyzeScript.evalScripts(codes[m]);
  }
  scriptTotal += srcs.length;
  var blockScriptLoad = 0;
  for (let n = 0, len = srcs.length; n < len; n++) {
    analyzeScript.dynamicLoadJs(srcs[n], function() {
      scriptLoad++;
      blockScriptLoad++;
      if (blockScriptLoad == srcs.length) renderDomEnd(block);
      //checkBlocks();
    });
  }
  if (blockScriptLoad == srcs.length) renderDomEnd(block);
  /* if (block.callback != null) block.callback();
  block.html = null;
  block.data = null;
  block.callback = null;
  block = null;
  checkBlocks(); */
}

function renderDomEnd(block) {
  if (block.callback != null) block.callback();
  block.html = null;
  block.data = null;
  block.callback = null;
  releaseWait(block);
  checkBlocks();
}

function checkBlocks() {
  let blocks = document.querySelectorAll('script[type=x-tmpl-lazypage]');
  let lazyCount = 0;
  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    if (block.data || block.ajaxData || block.source || block.ajaxSource) continue;
    var lazyStr = block.getAttribute('lazy');
    if (lazyStr != null && lazyStr != 'false') {
      lazyCount++;
      continue;
    }
    /* var waitStr = block.getAttribute('wait');
    if (waitStr != null && waitStr != '') {
      var waits = waitStr.split(' ');
      var removeWait = false;
      for (let j = 0; j < waits.length; j++) {
        var waitID = waits[j];
        if (LazyPage.data[waitID] != null) {
          waitStr = waitStr.replace(new RegExp(waitID + ' ?', 'g'), '');
          removeWait = true;
        }
      }
      if (removeWait == true) block.setAttribute('wait', waitStr);
    }
    if (waitStr != null && waitStr != '') {
      lazyCount++;
      continue;
    } */
    var waitStr = block.getAttribute('wait');
    if (waitStr != null && waitStr != '') {
      lazyCount++;
      continue;
    }
    runBlock(block);
  }
  if (blocks.length == lazyCount && scriptTotal == scriptLoad) {
    readyLazy.trigger();
  }
}

function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return r[2]; //unescape(r[2]);
  return '';
}

function addModeData(block, data) {
  block.data = data;
  let id = block.getAttribute('id');
  if (id != null) {
    LazyPage.data[id] = block.data;
  }
}

function replaceParamAsValue(html, isString) {
  html = html.replace(/{&(.*?)}/g, function(match, p1, offset) {
    return toValueString(getQueryString(p1), isString);
  });
  html = html.replace(/{\$(.*?)}/g, function(match, p1, offset) {
    return toValueString(eval('LazyPage.pathParams[' + p1 + ']'), isString);
  });
  html = html.replace(/{@(.*?)}/g, function(match, p1, offset) {
    return toValueString(eval('LazyPage.data.' + p1), isString);
  });
  return html;
}
function toValueString(value, isString) {
  if (isString) return value;
  if (typeof value == 'string') return '"' + value + '"';
  else return value;
}

/* function replaceParamAsString(html) {
  html = html.replace(/{{&(.*?)}}/g, function(match, p1, offset) {
    return getQueryString(p1);
  });
  html = html.replace(/{{\$(.*?)}}/g, function(match, p1, offset) {
    return eval('LazyPage.pathParams[' + p1 + ']');
  });
  html = html.replace(/{{@(.*?)}}/g, function(match, p1, offset) {
    return eval('LazyPage.data.' + p1);
  });
  return html;
} */

function releaseWait(block) {
  let id = block.getAttribute('id');
  if (id != null) {
    var blocks = document.querySelectorAll('script[wait]');
    for (let i = 0; i < blocks.length; i++) {
      var item = blocks[i];
      var wait = item.getAttribute('wait');
      wait = wait.replace(new RegExp(id + ' ?', 'g'), '');
      item.setAttribute('wait', wait);
    }
  }
}

function runBlock(block, callback) {
  let src = block.getAttribute('src');
  let source = block.getAttribute('source');
  let matchJson = /(^\{(.*?)\}$)|(^\[(.*?)\]$)/;
  block.callback = callback;
  if (source != null && source != '') {
    if (matchJson.test(source)) {
      source = source.replace(/'/g, '"');
      addModeData(block, JSON.parse(source));
    } else {
      block.ajaxData = true;
      let ajaxType = block.getAttribute('ajax-type');
      let ajaxData = block.getAttribute('ajax-data') || '';
      ajaxData = replaceParamAsValue(ajaxData, true);
      source = replaceParamAsValue(source, true);
      ajax({
        url: source,
        //dataType: 'json',
        type: ajaxType,
        data: ajaxData,
        success: function(msg) {
          msg = JSON.parse(msg);
          addModeData(block, msg);
          renderDom(block);
        },
        error: function(e) {
          console.log('error', e);
          block.setAttribute('type', 'x-tmpl-lazypage-error');
          checkBlocks();
        }
      });
    }
  } else {
    block.data = {};
  }
  if (src != null && src != '') {
    block.ajaxSource = true;
    src = replaceParamAsValue(src, true);
    ajax({
      url: src,
      success: function(msg) {
        block.html = msg;
        renderDom(block);
      },
      error: function(e) {
        console.log('error', e);
        block.setAttribute('type', 'x-tmpl-lazypage-error');
        checkBlocks();
      }
    });
  } else {
    let html = block.innerHTML;
    block.html = html.replace(/jscript/g, 'script');
  }
  renderDom(block);
}

readyDom(function() {
  checkBlocks();
});
function ready(fn) {
  readyLazy.bind(fn);
}
let data = {};
if (window && window.innerWidth > 1) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + 365);
  document.cookie = 'LazyPageSpider=0;expires=' + exdate.toGMTString() + ';path=/';
}
export { ready, runBlock, checkBlocks, data };
//module.exports = baidu;
