/*!
 *  lazypage.js 
 *  by fengshangbin 2019-01-10 
 *  https://github.com/fengshangbin/LazyPage 
 *  Easy H5 Page Framework
 */
var LazyPage=function(e){var t={};function a(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,a),n.l=!0,n.exports}return a.m=e,a.c=t,a.d=function(e,t,r){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(r,n,function(t){return e[t]}.bind(null,n));return r},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="/dist/",a(a.s=1)}([function(e,t){e.exports=function(){var e=!1,t=[];this.bind=function(a){e?a.call(window):t.push(a)},this.trigger=function(){if(!e){e=!0;for(var a=0;a<t.length;a++)t[a].apply(window);t=null}}}},function(e,t,a){e.exports=a(2)},function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"baidu",function(){return baidu}),__webpack_require__.d(__webpack_exports__,"ready",function(){return ready}),__webpack_require__.d(__webpack_exports__,"runBlock",function(){return runBlock}),__webpack_require__.d(__webpack_exports__,"data",function(){return data});var _ready=__webpack_require__(0),readyDom=__webpack_require__(3),baidu=__webpack_require__(4),analyzeScript=__webpack_require__(5),ajax=__webpack_require__(6),readyLazy=new _ready,scriptTotal=0,scriptLoad=0;function renderDom(e){var t=e.html,a=e.data;if(null!=t&&null!=a){var r=baidu.template(t,a);e.outerHTML=r;for(var n=analyzeScript.extractCode(r),c=n.codes,o=n.srcs,l=0,u=c.length;l<u;l++)analyzeScript.evalScripts(c[l]);scriptTotal+=o.length;for(var i=0,p=o.length;i<p;i++)analyzeScript.dynamicLoadJs(o[i],function(){scriptLoad++,checkBlocks()});null!=e.callback&&e.callback(),e.html=null,e.data=null,e.callback=null,e=null,checkBlocks()}}function checkBlocks(){for(var e=document.querySelectorAll("script[type=x-tmpl-lazypage]"),t=0,a=0;a<e.length;a++){var r=e[a];if(!(r.data||r.ajaxData||r.source||r.ajaxSource)){var n=r.getAttribute("lazy");if(null==n||"false"==n){var c=r.getAttribute("wait");if(null!=c&&""!=c){for(var o=c.split(" "),l=!1,u=0;u<o.length;u++){var i=o[u];null!=LazyPage.data[i]&&(c=c.replace(new RegExp(i+" ?","g"),""),l=!0)}1==l&&r.setAttribute("wait",c)}null==c||""==c?runBlock(r):t++}else t++}}e.length==t&&scriptTotal==scriptLoad&&readyLazy.trigger()}function getQueryString(e){var t=new RegExp("(^|&)"+e+"=([^&]*)(&|$)"),a=window.location.search.substr(1).match(t);return null!=a?a[2]:""}function addModeData(e,t){e.data=t;var a=e.getAttribute("id");if(null!=a){LazyPage.data[a]=e.data;for(var r=document.querySelectorAll("script[wait]"),n=0;n<r.length;n++){var c=r[n],o=c.getAttribute("wait");o=o.replace(new RegExp(a+" ?","g"),""),c.setAttribute("wait",o)}}}function runBlock(block,callback){var src=block.getAttribute("src"),source=block.getAttribute("source"),matchJson=/(^\{(.*?)\}$)|(^\[(.*?)\]$)/;if(block.callback=callback,null!=source&&""!=source)if(matchJson.test(source))source=source.replace(/'/g,'"'),addModeData(block,JSON.parse(source));else{block.ajaxData=!0;var ajaxType=block.getAttribute("ajax-type"),ajaxData=block.getAttribute("ajax-data")||"";ajaxData=ajaxData.replace(/{&(.*?)}/g,function(e,t,a){return getQueryString(t)}),ajaxData=ajaxData.replace(/{\$(.*?)}/g,function(match,p1,offset){return eval("LazyPage.pathParams["+p1+"]")}),ajaxData=ajaxData.replace(/{@(.*?)}/g,function(match,p1,offset){return eval("LazyPage.data."+p1)}),ajax({url:source,dataType:"json",type:ajaxType,data:ajaxData,success:function(e){addModeData(block,e),renderDom(block)},error:function(e){console.log("error",e),block.setAttribute("type","x-tmpl-lazypage-error"),checkBlocks()}})}else block.data={};if(null!=src&&""!=src)block.ajaxSource=!0,ajax({url:src,success:function(e){block.html=e,renderDom(block)},error:function(e){console.log("error",e),block.setAttribute("type","x-tmpl-lazypage-error"),checkBlocks()}});else{var html=block.innerHTML;block.html=html.replace(/jscript/g,"script")}renderDom(block)}function ready(e){readyLazy.bind(e)}readyDom(function(){checkBlocks()});var data={};if(window&&window.innerWidth>1){var exdate=new Date;exdate.setDate(exdate.getDate()+365),document.cookie="LazyPageSpider=0;expires="+exdate.toGMTString()+";path=/"}},function(e,t,a){var r,n=new(a(0)),c=function e(t){n.trigger(),document.removeEventListener?document.removeEventListener("DOMContentLoaded",e,!1):document.attachEvent&&(document.detachEvent("onreadystatechange",e),window==window.top&&(clearInterval(r),r=null))};document.addEventListener?document.addEventListener("DOMContentLoaded",c,!1):document.attachEvent&&(document.attachEvent("onreadystatechange",function(){/loaded|complete/.test(document.readyState)&&c()}),window==window.top&&(r=setInterval(function(){try{document.documentElement.doScroll("left")}catch(e){return}c()},5))),e.exports=n.bind},function(e,t,a){function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}!function(t){var a=e.exports;a.template=function(e,a){var r=function(){if(!t.document)return n._compile(e);var a=document.getElementById(e);if(a){if(n.cache[e])return n.cache[e];var r=/^(textarea|input)$/i.test(a.nodeName)?a.value:a.innerHTML;return n._compile(r)}return n._compile(e)}(),c=n._isObject(a)?r(a).replace(/<&([^&]*?)&>/g,"<%$1%>").replace(/<&&/g,"<&").replace(/&&>/g,"&>"):r;return r=null,c};var n=a.template;n.versions=n.versions||[],n.versions.push("1.0.6"),n.cache={},n.LEFT_DELIMITER=n.LEFT_DELIMITER||"<%",n.RIGHT_DELIMITER=n.RIGHT_DELIMITER||"%>",n.ESCAPE=!0,n._encodeHTML=function(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\\/g,"&#92;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")},n._encodeReg=function(e){return String(e).replace(/([.*+?^=!:${}()|[\]\/\\])/g,"\\$1")},n._encodeEventHTML=function(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/\\\\/g,"\\").replace(/\\\//g,"/").replace(/\\n/g,"\n").replace(/\\r/g,"\r")},n._compile=function(e){var t="var _template_fun_array=[];\nvar fn=(function(__data__){\nvar _template_varName='';\nfor(name in __data__){\n_template_varName+=('var '+name+'=__data__[\"'+name+'\"];');\n};\neval(_template_varName);\n_template_fun_array.push('"+n._analysisStr(e)+"');\n_template_varName=null;\n})(_template_object);\nfn = null;\nreturn _template_fun_array.join('');\n";return new Function("_template_object",t)},n._isObject=function(e){return"function"==typeof e||!(!e||"object"!==r(e))},n._analysisStr=function(e){var t=n.LEFT_DELIMITER,a=n.RIGHT_DELIMITER,r=n._encodeReg(t),c=n._encodeReg(a);return e=(e=String(e).replace(new RegExp("("+r+"[^"+c+"]*)//.*\n","g"),"$1").replace(/<!--[\w\W]*?-->/gm,"").replace(/{@(.*?)}/g,function(e,t,a){return"LazyPage.data."+t}).replace(new RegExp(r+"\\*.*?\\*"+c,"g"),"").replace(new RegExp("[\\r\\t\\n]","g"),"").replace(new RegExp(r+"(?:(?!"+c+")[\\s\\S])*"+c+"|((?:(?!"+r+")[\\s\\S])+)","g"),function(e,t){var a="";if(t)for(a=t.replace(/\\/g,"&#92;").replace(/'/g,"&#39;");/<[^<]*?&#39;[^<]*?>/g.test(a);)a=a.replace(/(<[^<]*?)&#39;([^<]*?>)/g,"$1\r$2");else a=e;return a})).replace(new RegExp("("+r+"[\\s]*?var[\\s]*?.*?[\\s]*?[^;])[\\s]*?"+c,"g"),"$1;"+a).replace(new RegExp("("+r+":?[hvu]?[\\s]*?=[\\s]*?[^;|"+c+"]*?);[\\s]*?"+c,"g"),"$1"+a).split(t).join("\t"),e=(e=n.ESCAPE?e.replace(new RegExp("\\t=(.*?)"+c,"g"),"',typeof($1) === 'undefined'?'':LazyPage.baidu.template._encodeHTML($1),'"):e.replace(new RegExp("\\t=(.*?)"+c,"g"),"',typeof($1) === 'undefined'?'':$1,'")).replace(new RegExp("\\t:h=(.*?)"+c,"g"),"',typeof($1) === 'undefined'?'':LazyPage.baidu.template._encodeHTML($1),'").replace(new RegExp("\\t(?::=|-)(.*?)"+c,"g"),"',typeof($1)==='undefined'?'':$1,'").replace(new RegExp("\\t:u=(.*?)"+c,"g"),"',typeof($1)==='undefined'?'':encodeURIComponent($1),'").replace(new RegExp("\\t:v=(.*?)"+c,"g"),"',typeof($1)==='undefined'?'':LazyPage.baidu.template._encodeEventHTML($1),'").split("\t").join("');").split(a).join("_template_fun_array.push('").split("\r").join("\\'")}}(window)},function(e,t){var a={extractCode:function(e,t){for(var a=t?"style":"script",r="<"+a+"[^>]*>([\\S\\s]*?)</"+a+"\\s*>",n=new RegExp(r,"img"),c=new RegExp(r,"im"),o=/src=[\'\"]?([^\'\"]*)[\'\"]?/i,l=/type=[\'\"]?([^\'\"]*)[\'\"]?/i,u=e.match(n)||[],i=[],p=[],d=0,s=u.length;d<s;d++){var _=(u[d].match(l)||["",""])[1].toLowerCase();if(""==_||_.indexOf("javascript")>=0){var f=(u[d].match(c)||["",""])[1];f&&""!=f&&p.push(f);var g=(u[d].match(o)||["",""])[1];g&&""!=g&&i.push(g)}}return{codes:p,srcs:i}},evalScripts:function(e){var t=document.getElementsByTagName("head")[0],a=document.createElement("script");a.text=e,t.insertBefore(a,t.firstChild),t.removeChild(a)},dynamicLoadJs:function(e,t){var a=document.getElementsByTagName("head")[0],r=document.createElement("script");r.type="text/javascript",r.src=e,r.onload=r.onreadystatechange=function(){this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState||(r.onload=r.onreadystatechange=null,a.removeChild(r),t&&t())},r.onerror=function(){t&&t()},a.appendChild(r)},evalStyles:function(e){var t=document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css";try{a.appendChild(document.createTextNode(e))}catch(t){a.styleSheet.cssText=e}t.appendChild(a)}};e.exports=a},function(e,t,a){e.exports=function(){var e={type:arguments[0].type||"GET",url:arguments[0].url||"",async:arguments[0].async||"true",data:arguments[0].data||null,dataType:arguments[0].dataType||"text",contentType:arguments[0].contentType||"application/x-www-form-urlencoded",beforeSend:arguments[0].beforeSend||function(){},success:arguments[0].success||function(){},error:arguments[0].error||function(){}};e.beforeSend();var t=window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):window.XMLHttpRequest?new XMLHttpRequest:void 0;t.responseType=e.dataType,"get"==e.type.toLowerCase()&&null!=e.data&&""!=e.data&&(e.url+=e.url.indexOf("?")>0?"&":"?",e.url+=e.data),t.open(e.type,e.url,e.async),t.setRequestHeader("Content-Type",e.contentType),t.send("post"==e.type.toLowerCase()&&null!=e.data?e.data:null),t.onreadystatechange=function(){4==t.readyState&&(200==t.status?e.success(t.response):e.error(t.status))}}}]);