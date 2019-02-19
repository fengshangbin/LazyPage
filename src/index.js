var _ready = require('./js/ready.js');
var readyDom = require('./js/documentReady.js');
var baidu = require('./js/baiduTemplate.js');
var analyzeScript = require('./js/analyzeScript.js');
var ajax = require('./js/ajax.js');

var readyLazy = new _ready();
var scriptTotal=0, scriptLoad=0;

function renderDom(block){
	var html = block.html;
	var data = block.data;
	if(html==null||data==null)return;
	let out = baidu.template(html, data);
	
	block.outerHTML = out;
	let matchScripts = analyzeScript.extractCode(out);
	var codes = matchScripts.codes;
	var srcs = matchScripts.srcs;
	for(let m = 0, len = codes.length; m < len; m++){
		analyzeScript.evalScripts(codes[m]);
	}
	scriptTotal += srcs.length;
	for(let n = 0, len = srcs.length; n < len; n++){
		analyzeScript.dynamicLoadJs(srcs[n], function(){
			scriptLoad++;
			checkBlocks();
		});
	}
	block.html=null;
	block.data=null;
	block=null;
	checkBlocks();
}

function checkBlocks(){
	let blocks = document.querySelectorAll("script[type=x-tmpl-lazypage]");
	let lazyCount = 0;
	for(let i=0; i<blocks.length; i++){
		let block = blocks[i];
		if(block.data||block.ajaxData||block.source||block.ajaxSource)continue;
		var lazyStr = block.getAttribute("lazy");
		if(lazyStr!=null && lazyStr!="false"){
			lazyCount++;
			continue;
		}
		var waitStr = block.getAttribute("wait");
		if(waitStr!=null && waitStr!=""){
			var waits = waitStr.split(" ");
			var removeWait = false;
			for(let j=0; j<waits.length; j++){
				var waitID = waits[j];
				if(LazyPage.data[waitID]!=null){
					waitStr = waitStr.replace(new RegExp(waitID+" ?", "g"), "");
					removeWait = true;
				}
			}
			if(removeWait == true)block.setAttribute("wait", waitStr);
		}
		if(waitStr!=null && waitStr!=""){
			lazyCount++;
			continue;
		}
		runBlock(block);
	}
	if(blocks.length == lazyCount && scriptTotal == scriptLoad){
		readyLazy.trigger();
	}
}

function getQueryString(name){
　　var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
　　var r = window.location.search.substr(1).match(reg);
　　if(r!=null)return r[2];//unescape(r[2]);
   return '';
}

function addModeData(block, data){
	block.data=data;
	let id = block.getAttribute("id");
	if(id!=null){
		LazyPage.data[id]=block.data;
		var blocks=document.querySelectorAll("script[wait]");
		for(let i=0; i<blocks.length; i++){
			var item = blocks[i];
			var wait = item.getAttribute("wait");
			wait = wait.replace(new RegExp(id+" ?", "g"), "");
			item.setAttribute("wait", wait);
		}
	}
}

function runBlock(block){
	let src = block.getAttribute("src");
	let source = block.getAttribute("source");
	let matchJson = /(^\{(.*?)\}$)|(^\[(.*?)\]$)/;
	if(source!=null&&source!=""){
		if(matchJson.test(source)){
			source=source.replace(/'/g,"\"");
			addModeData(block, JSON.parse(source));
		}else{
			block.ajaxData=true;
			let ajaxType = block.getAttribute("ajax-type");
			let ajaxData = block.getAttribute("ajax-data")||"";
			ajaxData=ajaxData.replace(/{&(.*?)}/g, function(match, p1, offset){
				return getQueryString(p1);
			});
			ajaxData=ajaxData.replace(/{@(.*?)}/g, function(match, p1, offset){
				return eval("LazyPage.data."+p1);
			});
			ajax({
			  url:source,
			  dataType: "json",
			  type: ajaxType,
			  data: ajaxData,
			  success:function(msg){
				  addModeData(block, msg);
				  renderDom(block);
			  }, 
			  error:function(e){ 
				console.log("error",e);
			  } 
			});
		}
	}else{
		block.data={};
	}
	if(src!=null&&src!=""){
		block.ajaxSource=true;
		ajax({
		  url:src,
		  success:function(msg){
			block.html = msg;
			renderDom(block);
		  }, 
		  error:function(e){ 
			console.log("error",e);
		  } 
		});
	}else{
		let html = block.innerHTML;
		block.html = html.replace(/jscript/g,'script');
		
	}
	renderDom(block);
}

readyDom(function(){
	checkBlocks();
})
function ready(fn){readyLazy.bind(fn);}
let data = {};
if(window&&window.innerWidth>1)document.cookie="LazyPageAjax=1";
export {baidu,ready,runBlock,data};
//module.exports = baidu;