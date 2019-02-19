var analyzeScript={
	extractCode: function(str, isStyle) {
	  var cata = isStyle ? "style" : "script"
		, scriptFragment = "<" + cata + "[^>]*>([\\S\\s]*?)</" + cata + "\\s*>"
		, matchAll = new RegExp(scriptFragment, "img")
		, matchOne = new RegExp(scriptFragment, "im")
	    , matchSrc = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
	    , matchType = /type=[\'\"]?([^\'\"]*)[\'\"]?/i
		, matchResults = str.match(matchAll) || [] 
	    , src = []
		, ret = [];

	  for (var i = 0, len = matchResults.length; i < len; i++) {
		var typetemp = (matchResults[i].match(matchType) || [ "", "" ])[1].toLowerCase();
		if(typetemp==""||typetemp.indexOf("javascript")>=0){
			var temp = (matchResults[i].match(matchOne) || [ "", "" ])[1];
			if(temp && temp!="")ret.push(temp);
			var srctemp = (matchResults[i].match(matchSrc) || [ "", "" ])[1];
			if(srctemp && srctemp!="")src.push(srctemp);
		}
	  }
	  return {codes:ret,srcs:src};
	},
	evalScripts: function(code) {
	  var head = document.getElementsByTagName("head")[0]
		, js = document.createElement("script");

	  js.text = code;
	  head.insertBefore(js, head.firstChild);
	  head.removeChild(js);
	  //js.remove();
	},
	dynamicLoadJs: function(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
		script.onload = script.onreadystatechange = function () {
			if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete"){
				script.onload = script.onreadystatechange = null;
				head.removeChild(script);
				//script.remove();
				//console.log(123);
				if(callback)callback();
			}
		};
		script.onerror = function(){
			//console.log(321);
			if(callback)callback();
		}
        head.appendChild(script);
    },
	evalStyles: function(code) {
	  var head = document.getElementsByTagName("head")[0]
		, css = document.createElement("style");

	  css.type = "text/css";
	  try {
		css.appendChild(document.createTextNode(code));
	  } catch (e) {
		css.styleSheet.cssText = code;
	  }
	  head.appendChild(css);
	}
};
module.exports=analyzeScript;