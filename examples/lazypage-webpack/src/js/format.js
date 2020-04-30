var format = {
	//千位数字逗号分隔
	toThousands: function(number){
		var num = (number || 0).toString();
		var nums=num.split(".");
		nums[0]=nums[0].replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,');
		return nums.join(".");
	},
	toTest: function(number){
		return "." + number + ".";
	}
}
if(typeof module !== 'undefined'){
	module.exports=format;
}