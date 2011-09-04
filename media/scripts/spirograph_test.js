$(document).ready(function(){
	var paper = Raphael("paper", 300, 300);
	var pathStr = "M 0 0";
	
	/*for (var i = 0; i<10; i++){
		var pathStr += " l " + 2*i + " " + i;
		//testPath.attr({path: pathStr + "z"});
	}*/
	var testPath = paper.path("M 0 0 l 10 10 10 5");
	/*
	function increasePath(){
		pathStr += "l 10 10";
		testPath = paper.path(pathStr);
	}
	setInterval(increasPath, 50);*/

});
