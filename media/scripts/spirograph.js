A.spirograph = new Spirograph();

function Spirograph(){
    var spiral = $('#spiral').get(0);
    var sctx = spiral.getContext('2d');

    var circles = $('#circles').get(0);
    var cctx = circles.getContext('2d');        

    
    this.init = function(){
        console.log("INIT!");
        makePage();
        load_nav();
        set_listeners();
        preview();
    };
    
    function makePage(){
        $('#spiro_stop').hide();
        $('#color_selector').hide();
    }
    
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
            start.dt = 28*(1.0-(this.attr("x")-10)/(w-30));
            if ($('#spiral').hasClass('drawing')){
                clearInterval(start.rotate);
                start();
            }
        }
        
        var w = 100, h = 40;
        var paper = Raphael('spiro_slider',w,h);
        paper.rect(10,h/2-8,w-22,6).attr({gradient: '0-#009-#f90:50-#f00', stoke: 0});
        var slider = paper.rect(w/2-6 ,h/2-15, 10, 20, 5).attr({gradient: '270-#ccc-#666', opacity: .5});
        
        slider.drag(move, up, end);	
    }
    
    function set_listeners(){
        	
        $('.color_chooser').mousedown(function(e){
            var color_selector = $('#color_selector_base').clone().attr("id", "new_color_selector");
            color_selector.css({'left': (e.pageX - 2) + 'px', 'top': (e.pageY - 2) +"px"});
            $("body").append(color_selector);
            color_selector.show();
            color_selector.data("chooser", $(this).attr("id"));
            color_selector.mouseleave(function(){
                $(this).remove();
            });
            color_selector.children("div").each(function(){
                $(this).hover(function(){
                    $(this).css('border', '1px solid black');
                });
                $(this).mouseout(function(){
                    $(this).css('border', '1px solid white');
                });
                $(this).mousedown(function(){
                    var chooser_id = "#"+$(this).parent().data("chooser");
                    $(chooser_id).css('background-color', $(this).css('background-color'));
                    $('#new_color_selector').remove();
                    preview();
                });
                
            });
        });
            
        

        $('#spiro_generate').click(function(){
                                          $('#spiral').addClass('drawing');
                                          start();
                                          $('#spiro_generate').hide();
                                          $('#spiro_stop').show();
                                       });
        
        $('#spiro_stop').click(function(){
                                         stop_spiraling();
                                        });
                                         
        
        $('#spiro_clear').click(function(){
                                         $('#spiral').removeClass('drawing');
                                         start.theta1 = 0;
                                         stop_spiraling();
                                         sctx.clearRect(0, 0, $('#circles').get(0).width, $('#circles').get(0).height);
                                         preview();
                                         });
        
        
        
        $('#get_radius1').blur(preview);
        
        $('#get_radius2').blur(preview);
        $('#get_h').blur(preview);
        
        $('#get_radius1').click(preview);
        $('#get_radius2').click(preview);
        $('#get_h').click(preview);
    }

    function preview(){
        var circles = $('#circles').get(0);
        var r1 = parseInt($('#get_radius1').val());
        var r2 = parseInt($('#get_radius2').val());
        var h = parseInt($('#get_h').val());
        var c1 = [circles.width/2, circles.height/2];
        var color1 = $('#spiro_get_color1').css('background-color');
        var color2 = $('#spiro_get_color2').css('background-color');
        var color_pen = $('#spiro_get_colorh').css('background-color');
        
        if ( r1 > c1[0] ){
            r1 = c1[0];		
            $('#get_radius1').val("" + r1);
        }
        
        if ( r2 >= r1 ){
            r2 = r1 - 1;
            $('#get_radius2').val("" + r2);
        }
        
        var dr = r1-r2;
        
        if (dr + h > c1[0]){
            h = c1[0] - dr;
            $('#get_h').val("" + h);
        }

        
        cctx.clearRect(0,0,circles.width,circles.height);
        
        //draw annular ring
        cctx.beginPath();
        cctx.strokeStyle = color1;
        cctx.arc(c1[0], c1[1],r1,0,2*Math.PI,true);
        cctx.stroke();
        
        //draw planetary ring
        cctx.beginPath();
        cctx.strokeStyle = color2;
        cctx.arc(c1[0]+dr, c1[1],r2,0,2*Math.PI,true);
        cctx.stroke();
        
        //draw h
        cctx.beginPath();
        cctx.strokeStyle = color_pen;
        cctx.moveTo(c1[0]+dr, c1[1]);
        cctx.lineTo(c1[0]+dr + h, c1[1]);
        cctx.stroke();
        
        //draw pen point
        cctx.beginPath();
        cctx.fillStyle = color_pen;
        cctx.arc(c1[0]+dr + h, c1[1] ,2,0,2*Math.PI,true);
        cctx.fill();
        
        
    }

    function start(){
        var circles = $('#circles').get(0);
        var r1 = parseInt($('#get_radius1').val());
        var r2 = parseInt($('#get_radius2').val());
        var dr = r1-r2;
        var h = parseInt($('#get_h').val());
        var c1 = [circles.width/2, circles.height/2];
        var theta1 = start.theta1 || 0;
        var dt = start.dt || 14;
        
        var color1 = $('#spiro_get_color1').css('background-color');
        var color2 = $('#spiro_get_color2').css('background-color');
        var color_pen = $('#spiro_get_colorh').css('background-color');
        
        sctx.strokeStyle=color_pen;
        
        /*A mysterious small man dressed all in black once gave me this function on a slip of paper.
        He told me I would need it someday and vanished into the shadows. Today was that day.*/
        var dtheta = 9*r2/Math.pow(h*dr,1.1);
        if (dtheta > .25)
            dtheta = .25;
        
        function gcd(a,b){
            while (b!=0){
                var temp = b;
                b = a % b;
                a = temp;
            }
            return a;
        }
        
        function rotate_plan(){
        
        
            var x = (r1-r2)*Math.cos(theta1) + h*Math.cos((r1-r2)*theta1/-r2) + c1[0];
            var y = (r1-r2)*Math.sin(theta1) + h*Math.sin((r1-r2)*theta1/-r2) + c1[1];
            if (theta1==0){
                rotate_plan.oldx = x;
                rotate_plan.oldy = y;
            }
            
            //draw outer ring
            cctx.clearRect(0,0,circles.width,circles.height);
            cctx.beginPath();
            cctx.strokeStyle = color1;
            cctx.arc(c1[0],c1[1],r1,0,2*Math.PI,true);
            cctx.stroke();
            
            //draw inner ring
            cctx.beginPath();
            cctx.strokeStyle = color2;
            cctx.arc(c1[0]+dr*Math.cos(theta1%(2*Math.PI)), c1[1]+dr*Math.sin(theta1%(2*Math.PI)),r2,0,2*Math.PI,true);
            cctx.stroke();
            
            //draw pen tip
            cctx.beginPath();
            cctx.fillStyle = color_pen;
            cctx.arc(x,y,2,0,2*Math.PI,true);
            cctx.fill();
            
            //connect inner circle center to pen tip
            cctx.beginPath();
            cctx.strokeStyle = color_pen;
            cctx.moveTo(c1[0]+dr*Math.cos(theta1%(2*Math.PI)), c1[1]+dr*Math.sin(theta1%(2*Math.PI)));
            cctx.lineTo(x,y);
            cctx.stroke();
            
            //connect new point of curve to last point
            sctx.beginPath();
            sctx.moveTo(rotate_plan.oldx,rotate_plan.oldy);
            sctx.lineTo(x,y);
            sctx.stroke();
            
            rotate_plan.oldx = x;
            rotate_plan.oldy = y;
            
            start.theta1 = theta1;
            theta1 += dtheta;

            if (theta1-dtheta>=(2*Math.PI*r2/gcd(r1,r2))){
                start.theta1 = 0;
                cctx.clearRect(0,0,circles.width,circles.height);
                stop_spiraling();
            }

        }
        
        
        start.rotate = setInterval(rotate_plan, dt);
    }

    function stop_spiraling(){
        $('#spiral').removeClass('drawing');
        clearInterval(start.rotate);
        $('#spiro_stop').hide();
        $('#spiro_generate').show();
    }
}    