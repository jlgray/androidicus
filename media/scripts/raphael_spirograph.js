/*$(document).ready(function(){
	var theta1 = 0, theta2 = 0, r1 = 100, r2 = 50;
	var width=300, height = 300;
	var c1 = [width/2, height/2];
	var c2 = [c1[0]+r1-r2, c1[1]];
	
	var paper = Raphael("paper", width , height);
	var annulus = paper.circle(c1[0], c1[1], r1);
	var planet = paper.circle(c2[0], c2[1], r2);
	var test_line = paper.path("M" + c2[0] + " " + c2[1] + " l " + r2*Math.cos(theta2)+" "+r2*Math.sin(theta2));
	

	function rotate_plan(){
		theta2 = (theta2 + .05);
		var t1 = (theta2*r2)/r1;
		var x = ((r1-r2)*Math.cos(t1) + c1[0])
		var y = ((r1-r2)*Math.sin(t1) + c1[1])
		var t_x = x - c2[0];
		var t_y = y - c2[1];
		c2[0]+=t_x;
		c2[1]+=t_y;
		planet.translate(t_x, t_y);
		test_line = paper.path("M" + c2[0] + " " + c2[1] + " l " + r2*Math.cos(-theta2)+" "+r2*Math.sin(-theta2));
	}
	rotate = setInterval(rotate_plan, 10);
	
});

$(document).ready(function(){
	var theta1 = 0, theta2 = 0, r1 = 100, r2 = 50;
	var width=300, height = 300;
	var c1 = [width/2, height/2];
	var c2 = [c1[0]+r1-r2, c1[1]];
	
	var paper = Raphael("paper", width , height);
	var annulus = paper.circle(c1[0], c1[1], r1);
	var planet = paper.circle(c2[0], c2[1], r2);
	var test_line = paper.path("M" + c2[0] + " " + c2[1] + " l " + r2*Math.cos(theta2)+" "+r2*Math.sin(theta2));
	

	function rotate_plan(){
		theta2 = (theta2 + .05);
		var t1 = (theta2*r2)/r1;
		var t_x = ((r1-r2)*Math.cos(t1) + c1[0]) - c2[0];
		var t_y = ((r1-r2)*Math.sin(t1) + c1[1]) - c2[1];
		c2[0]+=t_x;
		c2[1]+=t_y;
		planet.translate(t_x, t_y);
		var test_line = paper.path("M" + c2[0] + " " + c2[1] + " l " + r2*Math.cos(-theta2)+" "+r2*Math.sin(-theta2));
	}
	rotate = setInterval(rotate_plan, 10);
	
});*/
$(document).ready(function(){
	alert('check');
	var theta1 = 0, theta2 = 0, r1 = 100, r2 = 23, dr = r1-r2, h=20;
	var width=300, height = 300;
	var c1 = [width/2, height/2];
	var c2 = [c1[0]+dr, c1[1]];
	
	var paper = Raphael("paper", width , height);
	//var annulus = paper.circle(c1[0], c1[1], r1);
	var planet = paper.circle(c2[0], c2[1], r2);
	var spiralStr = "M" + (c2[0]+r2) + " " + c2[1] + "L";
	var spiral = paper.path(spiralStr);
	function gcd(a,b){
		while (b!=0){
			var temp = b;
			b = a % b;
			a = temp;
		}
		return a;
	}
	function rotate_plan(){
		theta1 += .1;
		var x = (r1-r2)*Math.cos(theta1) + h*Math.cos((r1-r2)*theta1/r2);
		var y = (r1-r2)*Math.sin(theta1) + h*Math.sin((r1-r2)*theta1/r2);
		spiralStr += " " + (x+c1[0]) + " " + (y+c1[1]);
		spiral.remove();
		spiral = paper.path(spiralStr);
		if (theta1>(2*Math.PI*r2/gcd(r1,r2))){
			clearInterval(rotate);
		}

	}
	rotate = setInterval(rotate_plan, 10);
});
