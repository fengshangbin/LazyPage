var element = getElementById(document.body.innerHTML, "a.html");
console.log(element);

function addIdReg(id, regs){
	regs.push(0, new RegExp("< *([^ |>]*).*?\\bid *= *\""+value+"\"[^>]*>", "img"));
}
function getTagReg(tag, regs){
	regs.push(0, new RegExp("< *("+tag+")[^>]*>", "img"));
}
function getClassReg(classNames, regs){
	var classReg = "";
	for(var i=0; i<classNames.length; i++){
		classReg+="(?=.*?\\b"+className+"\\b)";
	}
	regs.push(0, new RegExp("< *([^ |>]*).*?\\bclass *= *\"([^\"]*)\"[^>]*>", "img"));
	regs.push(2, new RegExp(classReg, "i"));
}
function getAttrReg(attrs, regs){
	
}
function queryElements(regStr, html, option){
	var idReg = new RegExp(".*?#([^[#.]+)");
	//var idMatchReg= "< *([^ |>]*).*?\\b"+key+" *= *\""+value+"\"[^>]*>";
	var classReg = new RegExp(".*?\\.([^[#.]+)", "g");
	var tagReg = new RegExp("^([^[#.]+)");
	var attrReg = new RegExp(".*?\\[([^]]+)", "g");
	
	
	var steps = regStr.split(" ");
	for(var i=0; i<steps.length; i++){
		var step = steps[i];
		var stepGroup = //ig
	}
	
	var match = new RegExp(regStr, "img");
	var result = option.multiElement ? [] : null;
	var group = match.exec(html);
	while(group!=null){
		if(option.regStr!=null){
			while(group!=null){
				var nextContent = group[option.index];
				var nextMatch = new RegExp(option.regStr, "im");
				if(nextMatch.test(nextContent)){
					break;
				}
				group = match.exec(html);
			}
			if(group == null)return result;
		}
		var searchStart = group.index+group[0].length;
		var closeIndex = 0;
		if(/\/ *>$/.test(group[0])==false){
			closeIndex = queryCloseTag(group[1], html.substring(searchStart));
		}
		var targetHtml = html.substring(group.index, searchStart+closeIndex);
		if(result == null){
			result = targetHtml;
			break;
		}else{
			result.push(targetHtml);
			group = match.exec(html);
		}
	}
	return result;
}


function getElementById(html, id){
	return getElementByAttr(html, "id", id, false);
}
function getElementsByTag(html, tag){
	var regStr = "< *("+tag+")[^>]*>";
	return queryElement(regStr, html, {multiElement: true});
}
function getElementsByClass(html, classNames){
	var classArr = classNames.split(".");
	var classReg = "";
	for(var i=0; i<classArr.length; i++){
		var className = classArr[i];
		if(className.length>0){
			classReg+="(?=.*?\\b"+className+"\\b)";
		}
	}
	var option = {
		multiElement: true,
		index: 2,
		regStr: classReg
	};
	var regStr = "< *([^ |>]*).*?\\bclass *= *\"([^\"]*)\"[^>]*>";
	return queryElement(regStr, html, option);
}
function getElementByAttr(html, key, value, multiElement){
	var regStr = "< *([^ |>]*).*?\\b"+key+" *= *\""+value+"\"[^>]*>";
	return queryElement(regStr, html, {multiElement: multiElement});
}
function queryElement(regStr, html, option){
	var match = new RegExp(regStr, "img");
	var result = option.multiElement ? [] : null;
	var group = match.exec(html);
	while(group!=null){
		if(option.regStr!=null){
			while(group!=null){
				var nextContent = group[option.index];
				var nextMatch = new RegExp(option.regStr, "im");
				if(nextMatch.test(nextContent)){
					break;
				}
				group = match.exec(html);
			}
			if(group == null)return result;
		}
		var searchStart = group.index+group[0].length;
		var closeIndex = 0;
		if(/\/ *>$/.test(group[0])==false){
			closeIndex = queryCloseTag(group[1], html.substring(searchStart));
		}
		var targetHtml = html.substring(group.index, searchStart+closeIndex);
		if(result == null){
			result = targetHtml;
			break;
		}else{
			result.push(targetHtml);
			group = match.exec(html);
		}
	}
	return result;
}
function queryCloseTag(tag, html){
	var regStrAll = "< */? *"+tag+"[^>]*>";
	var matchAll = new RegExp(regStrAll, "img");

	var regStrClose = "< */ *"+tag+" *>";
	var matchClose = new RegExp(regStrClose, "im");

	var openCount = 1;
	var lastCloseIndex = 0;
	while(openCount > 0){
		var groupAll=matchAll.exec(html);
		if(groupAll==null){
			break;
		}else{
			if(matchClose.test(groupAll[0])){
				openCount--;
				lastCloseIndex = groupAll.index+groupAll[0].length;
			}else{
				openCount++;
				if(new RegExp("\\b"+tag+"\\b", "i").test("input br image"))return 0;
			}
		}
	}
	return lastCloseIndex;
}
