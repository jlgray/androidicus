function load_nav(){
	function move(dx, dy) {
		var X = this.attr("x") + dx - (this.dx || 0);
		var	Y = this.attr("y");
		if (X > 10 && X < w-20)
			this.attr({x: X, y: Y});
		this.dx = dx;
		/*this.dy = dy;*/
	}
	function up() {
		this.dx = 0;
	}
	function end(){
		alert((this.attr("x")-10)/(w-30));
	}
	var w = 100, h = 40;
	var paper = Raphael('spiro_slider',w,h);
	paper.rect(10,h/2-8,w-22,6).attr({gradient: '0-#009-#f90:50-#f00', stoke: 0});
	var slider_cont = paper.rect(w/2-10 ,h/2-15, 10, 20, 5).attr({gradient: '270-#ccc-#666', opacity: .5});
	
	slider_cont.drag(move, up, end);
	
	
}

function set_listeners(){
	$('#color_selector').hide();	
	$('.color_chooser').mousedown(function(e){
										$('#color_selector').show();
										$('#color_selector').css({'left': (e.pageX - 2) + 'px', 'top': (e.pageY - 2) +"px"});
										$('#color_selector').mouseleave(function(){
																				$('#color_selector').hide();
																				});
										
										
										});
	$('#color_selector div').hover(function(){$(this).css('border', '1px solid black');});
	$('#color_selector div').mouseout(function(){$(this).css('border', '1px solid white');});
}


$(function(){
		   load_nav();
		   set_listeners();});