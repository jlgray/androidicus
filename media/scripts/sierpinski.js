$(document).ready(function(){
	
					   
	var depth = 0;					   
	var width = 600, height = 600;
	var clickOnX = 0, clickOnY = 0;
	var innerColor = "#fff", outerColor = "#000";
	
	paper = Raphael('paper', width +1 , height + 1);
	paths = [];
	startSierpinski(0);
	
	$('#contain').mousedown(function(evt){ 
										for(var i = 0; i<paths.length; i++){paths[i].remove();}
										paths = [];
										if (evt.button == 0){
											if (depth <8)
												depth++;
											evt.preventDefault();
											startSierpinski(depth);
											return false;
										}
										if (evt.button == 2){
											if (depth > 0)
												depth-=1;
											evt.preventDefault();
											startSierpinski(depth);
											return false;
										}
										});
	/*$('#contain').mouseup(function(evt){var dx = evt.pageX - clickOnX; 
								 	  var dy = evt.pageY - clickOnY;
									  var curr_off = [$('#contain').offset().left, $('#contain').offset().top];
									  $(this).offset({top: curr_off[1] + dy, left: curr_off[0] + dx}); 
									  });*/
	

	window.focus();
	$(document).keyup(function(evt){
							   if (evt.keyCode == '90' || evt.keyCode=='88')
							   		for(var i = 0; i<paths.length; i++)
							   			paths[i].remove();
							   
							   paths = [];
							   if (evt.keyCode == '90'){
								   	if (depth <8)
								   		depth++;
									evt.preventDefault();
							   		startSierpinski(depth);
							   }
							   if (evt.keyCode == '88'){
								   	if (depth > 0)
										depth-=1;
									evt.preventDefault();
							   		startSierpinski(depth);
							   }
							   
							   });
	
	function startSierpinski(sdepth){
		var x1 = 0, y1 = height, x2 = width/2, y2 = 0, x3 = width, y3 = height;
		paths.push(paper.path("M"  +x1 + "," + y1+"L" + x2 + "," + y2 + "," + x3 + "," + y3 + "z").attr({fill: outerColor, stroke: 0}));
		
		if (sdepth>0){
			subPath(1,
					0.5*(x1+x2),
					0.5*(y1+y2),
					0.5*(x1+x3),
					0.5*(y1+y3),
					0.5*(x2+x3),
					0.5*(y2+y3));
		}
		
		function subPath(n,x1,y1,x2,y2,x3,y3){
			paths.push(paper.path("M"  +x1 + "," + y1+"L" + x2 + "," + y2 + "," + x3 + "," + y3 + "z").attr({fill: innerColor, stroke: 0}));
			if (n<sdepth){
				subPath(n+1,
						0.5*((x1+x2)+(x1-x3)),
						0.5*((y1+y2)+(y1-y3)),
						0.5*((x1+x2)+(x2-x3)),
						0.5*((y1+y2)+(y2-y3)),
						0.5*(x1+x2),
						0.5*(y1+y2));
				
				subPath(n+1,
						0.5*(x2+x3),
						0.5*(y2+y3),
						0.5*((x2+x3)+(x2-x1)),
						0.5*((y2+y3)+(y2-y1)),
						0.5*((x2+x3)+(x3-x1)),
						0.5*((y2+y3)+(y3-y1)));
				
				subPath(n+1,
						0.5*((x1+x3)+(x1-x2)),
						0.5*((y1+y3)+(y1-y2)),
						0.5*(x1+x3),
						0.5*(y1+y3),
						0.5*((x1+x3)+(x3-x2)),
						0.5*((y1+y3)+(y3-y2)));
			
			
			}
		}
	}
});