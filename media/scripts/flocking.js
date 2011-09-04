//
var ux = [1,0,0];
var uy = [0,1,0];
var uz = [0,0,1];
var shape = [[1,0,0], [0,1,0], [0,-1,0]]
var vr = scale_vector3(shape[0], 1.0);



A = {};
A.flocking = new Flocking();

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
}

function Flocking(){
    var total_boids = 200;
    var boids = [];
    var thisFlocking = this;
    var canvasID = 'boid-space';
    var canvasSize = ['1250', '900']
    var time_limit = 100000;
    var dt = 10;
	var iter = 0;
	this.gravity = [0.0,0.0002,0.0];
    
    this.init = function(){
        var that=this;
        this.canvas = document.getElementById(canvasID);
        
        if (this.canvas.getContext)
            var context = this.canvas.getContext("2d");
        else
            throw "No canvas with ID '" + canvasID + "'"; 
        
        this.canvas.setAttribute('width', canvasSize[0]);
        this.canvas.setAttribute('height', canvasSize[1]);
        
        this.boid_buffer = document.getElementById("boid-buffer");
        this.boid_ctx = this.boid_buffer.getContext("2d");
        
        this.boid_buffer.setAttribute('width', 20);
        this.boid_buffer.setAttribute('height', 20);
        this.time_elapsed = 0;
        
        
        for (var i=0; i<total_boids; i++){
            boids[i] = new Boid({
                id: i,
                pos: [i/total_boids, i/total_boids, 0],//[0.4+0.2*Math.cos(i*2*Math.PI/total_boids), 0.4+0.2*Math.sin(i*2*Math.PI/total_boids), 0.0],
                velocity: [0,0,0]//velocity: [0.002*Math.sin(i*2*Math.PI/total_boids), -0.002*Math.cos(i*2*Math.PI/total_boids), 0.0]
            }); 
        }
		
        var i=0;
        function run(){
			
            //get each boid's neighbors
            for (var i=0; i<boids.length; i++){
                boids[i].flock.boids = [];
                for (var j=0; j<boids.length; j++){
                    if (i==j) continue;
                    var distance = Math.sqrt(Math.pow(boids[i].pos[0] - boids[j].pos[0],2) + 
                                             Math.pow(boids[i].pos[1] - boids[j].pos[1],2) +
                                             Math.pow(boids[i].pos[2] - boids[j].pos[2],2))
                    if (distance < boids[i].search_radius){
                        boids[i].flock.boids[boids[i].flock.boids.length] = boids[j];
                    }
                }
				//console.log(i++);
            }
			iter++;
			//console.log(thisFlocking.time_elapsed)
			//thisFlocking.time_elapsed += 0;

            thisFlocking.canvas.width = thisFlocking.canvas.width;
            for (var i=0; i<boids.length; i++){
                //console.log(i);
                boids[i].update();
                boids[i].render(context);
            }
            //that.time_elapsed += dt;
        };
        
        
        interval = setInterval(run, dt);
        setTimeout("clearInterval(interval)", time_limit);
        
    };
    
    
    
    var Boid = function(options){
        
        
        
        this.max_acceleration = 'max_acceleration' in options? options.max_acceleration: 0.003; //percentage of canvas that Boid can cover in one iteration
        this.max_velocity = 'max_velocity' in options? options.max_velocity: 0.008; //percentage of canvas that Boid can cover in one iteration
        this.max_rollspeed = 0.01*Math.PI;
        this.max_pitchspeed = 0.01*Math.PI;
        
        this.velocity = 'velocity' in options? options.velocity.slice(): [0.001*Math.random(),0.001*Math.random(),0.0]; //velocity as a percentage
        this.angular_velocity = [0.0,0.0,0.0];  //roll, pitch, and yaw
        
        this.id = options.id;
        this.pos = 'pos' in options? options.pos.slice(0): [0.5,0.5,0.0]; //position as a percentage
        
        this.behaviors = [this.cohesion]; //Keep this?
        this.search_radius = 'search_radius' in options? options.search_radius: 0.5; //position as a percentage
        this.flock = {
            boids: [],
            center: []
        };
        
        this.size = 16;
        this.shape = [
                     [1.0, 0.0, 0.0],
                     [0.0, 0.3, 0.0],
                     [0.0, -0.3, 0.0]
        ]; 
		//These could be elements of shape, but this way allowes shape to be independent
		//Also, these should be unit vectors
        this.normal = [0.0, 0.0, 1.0];
        this.dir = [1.0, 0.0, 0.0];   //direction boid moves, also roll axis 
        this.pitch_axis = [0.0, 1.0, 0.0];
        
    };


    Boid.prototype.cohesion = function(parent){
                            
        var cohesion_factor = 0.001;
        var return_vector = [
            cohesion_factor * (parent.flock.center[0] - parent.pos[0]),
            cohesion_factor * (parent.flock.center[1] - parent.pos[1]), 
            cohesion_factor * (parent.flock.center[2] - parent.pos[2])
        ]
        return return_vector;
    }

    Boid.prototype.get_flock = function(){
        for (var i=0; i<boids.length; i++){
            boids[i].flock.boids = [];
            for (var j=0; j<boids.length; j++){
                if (i==j) continue;
                var distance = Math.sqrt(Math.pow(boids[i].pos[0] - boids[j].pos[0],2) + 
                                         Math.pow(boids[i].pos[1] - boids[j].pos[1],2) +
                                         Math.pow(boids[i].pos[2] - boids[j].pos[2],2))
                if (distance < boids[i].search_radius){
                    boids[i].flock.boids[boids[i].flock.boids.length] = boids[j];
                }
            }
        }
    }
    
    Boid.prototype.orient = function(goal){
        /*
            TODO: fix coupling (using this.dir, but then this.a_v[0])
            orients the boid toward a goal
			goal should be a vector sharing an origin with this boid
            Define plane A as the boid's plane
            Define plane B_r by goal and the roll axis
            Define plane B_p by goal and the pitch axis
            The angle between A and B will be equal to the angle between their normals
        */
        
        //Roll
        //Get the normals of plane B_r
		
		var theta = 0.0
        var br_n = cross_product3(goal, this.dir); 
		var pitch_speed = 0;
        //If the goal is a scalar of the direction, the normal vector for plane B
        //will be [0,0,0]. TODO: roll to orient with ground?
        var roll_speed = 0;
        if (br_n[0] != 0 || br_n[1] != 0 || br_n[2] != 0){
            //get angle between plane A and B
            theta = angle_between3(br_n, this.normal);
            //Figure out direction to roll
			//Domain of theta: 0->3.14
            //If theta is not close to PI/2 within a tolerance or 0.04
			if (theta < 0.5*Math.PI - 0.04 || theta > 0.5*Math.PI + 0.04) {
				var roll_speed = this.max_rollspeed;
				//Not sure this is the right way to do this...
				if ( theta > Math.PI/2 ){
					//console.log("check")
					roll_speed *= -1.0;
				}
				
			}
        }
		var roll_matrix = get_rotation_matrix(this.dir, roll_speed);
		var rolled_shape = apply_matrix(roll_matrix, this.shape);
		var rolled_data = apply_matrix(roll_matrix, [this.normal, this.pitch_axis]);
		this.normal = rolled_data[0];
		this.pitch_axis = scale_vector3(rolled_data[1], 1.0);
		//Pitch
		var bp_n = cross_product3(goal, this.pitch_axis);
		
		var pitch_speed=0;
		if (bp_n[0] != 0 || bp_n[1] != 0 || bp_n[2] != 0){
			theta = angle_between3(bp_n, this.normal);
			if (theta < Math.PI-0.04 && theta > 0.04) {
				var pitch_speed = this.max_pitchspeed;
				if ( dot_product3(this.normal, goal) > 0 )
					pitch_speed *= -1.0;
			}
		}


		var pitch_matrix = get_rotation_matrix(this.pitch_axis, pitch_speed);
		this.shape = apply_matrix(pitch_matrix, rolled_shape);
		//var i=this.shape.length;
		//while(i--) this.shape[i] = scale_vector3(this.shape[i], 1.0);
		var pitched_data = apply_matrix(pitch_matrix, [this.normal, this.dir]);
		this.normal = scale_vector3(pitched_data[0], 1.0);
		this.dir = scale_vector3(pitched_data[1], 1.0);
		var normal="", dir="", pos="", pitch="", gl="";
		var i=3;
		while (i--) {
			normal += this.normal[2-i].toFixed(2)+", ";
			dir += this.dir[2-i].toFixed(2)+", "; 
			pos += this.pos[2-i].toFixed(3)+", "; 
			pitch += this.pitch_axis[2-i].toFixed(2)+", "; 
			gl += goal[2-i].toFixed(2)+", "; 
			}
		//console.log("NORM: ", normal, "DIR: ", dir, "PITCH: ", pitch,"GOAL: ", gl, "POS: ", pos);
	}
    
    Boid.prototype.render = function(context){
        //console.log(this.angle.slice())
        
        var size = this.size+this.size*this.pos[2];
        size = (size > this.size) ? this.size : (size < 0) ? 0 : size;
        //var size = 30;
		var pos = [context.canvas.width*this.pos[0], context.canvas.height*this.pos[1]];
        //console.log(this.pty_angles[0], this.normal[2])
        context.fillStyle = (this.normal[2]>0) ? "rgb(0,0,0)" : "rgb(150,150,150)"
        context.translate(pos[0],pos[1]);
        context.beginPath();
        context.lineTo(this.shape[0][0]*size, this.shape[0][1]*size);
        context.lineTo(this.shape[1][0]*size, this.shape[1][1]*size);
        context.lineTo(this.shape[2][0]*size, this.shape[2][1]*size);
        context.closePath();
        context.stroke();
        context.fill();
        context.translate(-pos[0],-pos[1])
    };

    Boid.prototype.update = function(){
        
        //calculate the center of the flock
        var center =  (this.flock.boids.length == 0) ? this.pos.slice() : [0,0,0] ;
        for (var i=0; i < this.flock.boids.length; i++){
            center[0] += this.flock.boids[i].pos[0];
            center[1] += this.flock.boids[i].pos[1];
            center[2] += this.flock.boids[i].pos[2];
        }

        var boids_length = (this.flock.boids.length > 0) ? this.flock.boids.length : 1;
        center[0] /= boids_length;
        center[1] /= boids_length;
        center[2] /= boids_length;
        
        this.flock.center = center.slice(0);
        //this.flock.center = [0.5,0.5+.002*iter,-iter*0.002]
		if (this.flock.center[0]>1.0) this.flock.center[0] = 2.0 - this.flock.center[0];
		if (this.flock.center[0]<0.0) this.flock.center[0] = -this.flock.center[0];
		
		if (this.flock.center[1]>0.5) this.flock.center[1] = 0.9 - this.flock.center[1];
		if (this.flock.center[1]<0.0) this.flock.center[1] = -this.flock.center[1];
		
		if (this.flock.center[2]>1.0) this.flock.center[2] = 2.0 - this.flock.center[2];
		if (this.flock.center[2]<0.0) this.flock.center[2] = -this.flock.center[2];
		
       //Translate goal vector to the origin
        var goal = [this.flock.center[0] - this.pos[0],
                    this.flock.center[1] - this.pos[1],
                    this.flock.center[2] - this.pos[2]];
					
        this.orient(goal);
        //console.log(goal.slice(), this.pos.slice())
        //console.log(this.pty_angles.slice(), this.angular_velocity.slice());
        
        var acceleration = scale_vector3(this.dir, this.max_acceleration);
		
        this.velocity[0] += acceleration[0];
        this.velocity[1] += acceleration[1];
        this.velocity[2] += acceleration[2];
		
		if (Math.sqrt(dot_product3(this.velocity, this.velocity)) > this.max_velocity)
			this.velocity = scale_vector3(this.velocity, this.max_velocity)
          
		this.velocity[0] += thisFlocking.gravity[0];
        this.velocity[1] += thisFlocking.gravity[1];
        this.velocity[2] += thisFlocking.gravity[2];
        
        //console.log(center, goal, this.pty_angles.slice(), this.velocity.slice()) 
        
        this.pos[0] = (this.pos[0]+this.velocity[0]); 
        this.pos[1] = (this.pos[1]+this.velocity[1]); 
        this.pos[2] = (this.pos[2]+this.velocity[2]);
        //console.log(this.shape[0].slice(), this.shape[1].slice(), this.shape[2].slice(), this.normal.slice());        
    };
};



$(document).ready(function(){
    A.flocking.init();
});