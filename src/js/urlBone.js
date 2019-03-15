var pageStore = {};
function getRootPath(path){
	var regex = "^((https|http|ftp|rtsp|mms)?://[^/]*)";
	var pattern = new RegExp(regex, "i");
	var m = pattern.exec(path);
	if(m.length>0){
		return m[1];
	}
	return null;
}
function initHref(){
	var domain = getRootPath(location.href);
	document.addEventListener("click", function(event){
		var target = event.target;
		if (!target) return;
		if (target.tagName.toLowerCase() != "a" && !(target = target.getParentElementByTag("a"))) {
			return;
		}
		var href = target.href;
		if (/^javascript/.test(href)) {
			return;
		}
		if(domain!=null) href = href.replace(new RegExp(domain, "i"), "");
		if (/^http/i.test(href)){
			return;
		}
		event.preventDefault();
		var oldPath = location.href.replace(new RegExp(domain, "i"), "");
		window.history.pushState(LazyPage.pathParams, '', href);
		
	});
	window.onpopstate = function(event) {
		LazyPage.pathParams = event.state;
		console.log("oppopstate: "+event.state);
	}
}
function goto(href){
	
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
initHref();
module.exports=goto;