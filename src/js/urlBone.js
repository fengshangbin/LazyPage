var readyDom = require('./documentReady.js');
var ajax = require('./ajax.js');

var pageStore = {};
var domain;
var publicPathLen = 0;
var reg = null;
function initHref(){
	domain = getRootPath(location.href);
	if(LazyPage.pathReg !=null){
		reg = new RegExp(LazyPage.pathReg.substring(1), "i");
		var publicPath = location.pathname.replace(reg, "");
		publicPathLen = publicPath.length;
	}
	//console.log(publicPath);
	var defaultElement = document.querySelector(".page.in");
	var targetPageId = LazyPage.pathParams!=null?LazyPage.pathParams[LazyPage.pathParams.length-1]:null;
	var targetElement = targetPageId!=null?document.getElementById(targetPageId):null;
	if(targetElement==null){
		targetElement = defaultElement;
	}
	if(targetElement==null)return;
	pageStore[location.pathname] = [targetElement, LazyPage.pathParams];
	if(targetElement.classList.contains("out"))showPage(location.pathname);
	window.history.replaceState(LazyPage.pathParams, '', location.href);
	document.addEventListener("click", function(event){
		var target = event.target;
		if (!target) return;
		if (target.tagName.toLowerCase() != "a" && !(target = target.getParentElementByTag("a"))) {
			return;
		}
		var href = target.href;
		//console.log("href: "+href);
		if (/^javascript/.test(href)) {
			return;
		}
		if(domain!=null) href = href.replace(new RegExp(domain, "i"), "");
		if (/^http/i.test(href)){
			return;
		}
		event.preventDefault();
		goto(href);
	});
	window.onpopstate = function(event) {
		/*LazyPage.pathParams = event.state;
		console.log("oppopstate: "+event.state);
		LazyPage.checkBlocks();*/
		var hrefPathName = location.pathname;
		//pageStore[hrefPathName] = event.state;
		if(pageStore[hrefPathName]==null){
			
		}
		showPage(hrefPathName);
	}
	
}
function goto(href){
	//console.log(getRealUrl(href));
	if(getRealUrl(href) == location.href)return;
	var hrefPathName = getHrefPathName(href);
	if(pageStore[hrefPathName] != null){
		showPage(hrefPathName);
		window.history.pushState(pageStore[hrefPathName][1], '', href);
		return;
	}else if(reg != null){
		var hrefPath = hrefPathName.substring(publicPathLen);
		//console.log(hrefPath);
		if(reg.test(hrefPath)){
			let group = reg.exec(hrefPath);
			if(group.length>1){
				LazyPage.pathParams = group.slice(1,group.lengths);
				var targetPageId = LazyPage.pathParams[LazyPage.pathParams.length-1];
				var targetElement = document.getElementById(targetPageId);
				if(targetElement!=null){
					pageStore[hrefPathName] = [targetElement, LazyPage.pathParams];
					window.history.pushState(LazyPage.pathParams, '', href);
					showPage(hrefPathName);
					return;
				}
			}
		}
	}
	ajax({
		url: href,
		header: {"lazypageajax":true},
		success:function(msg){
			console.log(msg);
		}, 
		error:function(e){ 
			console.log("error",e);
		} 
	});
}
function showPage(inPagePath){
	var target = pageStore[inPagePath];
	var inPage = target[0];
	LazyPage.pathParams = target[1];
	var parent = inPage.parentNode;
	var outPage = parent.querySelector(".page.in");
	inPage.classList.remove("out");
	inPage.classList.add("in");
	if(outPage!=inPage && outPage!=null){
		outPage.classList.add("out");
		outPage.classList.remove("in");
	}
}
function getRootPath(path){
	var regex = "^((https|http|ftp|rtsp|mms)?://[^/]*)";
	var pattern = new RegExp(regex, "i");
	var m = pattern.exec(path);
	if(m.length>0){
		return m[1];
	}
	return null;
}
function getRealUrl(url){
	if(checkUrl(url))return url;
	else{
		var regex = "("+domain+"/?)";
		var pattern = new RegExp(regex, "g");
		var path = location.pathname.replace(pattern, "");
		if(path.endsWith("/"))path+="end";
		var paths = path.split("/");
		paths.pop();
		if(url.startsWith("/")){
			return domain+url;
		}else if(url.startsWith("../")){
			var count = 0;
			while(url.startsWith("../")){
				url = url.substring(3);
				count++;
			}
			var pathBuffer = "/";
			for(var i=0; i<paths.length-count; i++){
				pathBuffer += paths[i];
			}
			if(pathBuffer.length>1)pathBuffer+=("/");
			return domain+pathBuffer+url;
		}else{
			url = url.replace(/\.\//g, "");
			var pathStr = paths.join("/");
			if(pathStr.length>0)pathStr+="/";
			return domain+"/"+pathStr+url;
		}
	}
}
function checkUrl(url){
	var regex = "^((https|http|ftp|rtsp|mms)?://)(.*?)";
	var pattern = new RegExp(regex, "i");
	return pattern.test(url);
}
function getHrefPathName(href){
	if(href.indexOf("?")>-1){
		var index= href.indexOf("?");
		href = href.substring(0, index);
	}
	if(href.indexOf("#")>-1){
		var index= href.indexOf("#");
		href = href.substring(0, index);
	}
	return href;
}
/**
 * prototype extend method: get parent element by tagName
**/
Element.prototype.getParentElementByTag = function(tag) {
	if (!tag) return null;
	var element = null, parent = this;
	var popup = function() {
		parent = parent.parentElement;
		if (!parent) return null;
		var tagParent = parent.tagName.toLowerCase();
		if (tagParent === tag) {
			element = parent;
		} else if (tagParent == "body") {
			element = null;
		} else {
			popup();
		}
	};
	popup();
	return element;
};
readyDom(function(){
	initHref();
})
module.exports=goto;