function load_test(){
	var paper = Raphael('test_paper', 400, 400);
	function start_test(){
		paper.rect(10,10,20,20).attr({fill: "#f00"});
	}
	
	
	window.focus();
	$(document).keyup(function(){
		start_test();
	});
	
	
}

$(function(){
$.ajax({url: '../insertee.html', success: function(data){
												   		 $('#test_contain').html(data);
														 load_test();
												   }});
});