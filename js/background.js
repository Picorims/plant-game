// Plant is a 2 players strategy game, where the goal is to take as much space as possible on the terrain with a plant by making it growing.
    
// Copyright (c) 2019 Picorims<picorims.contact@gmail.com> and Cirno, France. All rights reserved.

// Licensed under the GNU Affero General Public License version 3.0 (GNU AGPL v3.0).
// More information about the license at LICENSE.txt to the root of the program. If it is missing, see <https://www.gnu.org/licenses/>.
// A full notice can be found at NOTICE.txt to the root of the program,
// and you should see README.txt as well for other information.

//BACKGROUND GRAPHICAL PROCESS AND OTHER GRAPHICS FOR THE OVERALL AMBIANCE.
//canvas from back layer to top layer:
var blur_background;//canvas with blur background, back layer
var falling_particles_back;//canvas for falling particles behind menus, etc.
var floating_particles;//canvas handling the few particles that float arround in the screen
var god_rays;//canvas that display god rays
var falling_particles_top;//canvas for falling particles in front of menus, etc.

//boolean
var graphical_init_finished = false;//if init ended. False by default as quick as possible, because of draw() early execution
var request_clear//if a clear should be performed for stuff concerned by low graphics.

//BLUR BACKGROUND
var blur_background_data;

//FALLING PARTICLES
var fall_ptcl_data;

//FLOATING PARTICLES
var float_ptcl_data;

//GOD RAYS
var god_rays_data;

//other
var cache;//HTML element containing all cached textures as canvas elements.
var cache_list;//array containing all cached textures as p5 Graphics canvas.

function GraphicInit() {//graphical process initialization. All var explanation below
    console.group("graphic init");
    console.info("%cgraphic init...","color:green; font-weight:bold");
    console.time("graphic init duration");
    
    //GIVE AN ID TO EACH CANVAS TO RECOGNIZE THEM IN THE CONSOLE
    blur_background.elt.id = "blur_background";
    falling_particles_back.elt.id = "falling_particles_back";
    floating_particles.elt.id = "floating_particles";
    god_rays.elt.id = "god_rays";
    falling_particles_top.elt.id = "falling_particles_top";

    
    //BLUR BACKGROUND
    blur_background_data = {
        blur:80,//blur intensity
        particles:[],//array containing all particles and their data
        count:30,//number of particles (those are light, but do not exceed 500)
        v_max:2,//maximum velocity that can be reached by particles. bigger it is, quicker they'll move. (have a big impact on step power!)
        step:0.025,//step, "speed" of the velocity change (acceleration, deceleration) of particles. bigger it is, smaller the movements will be.
        particle_style: {
            size:300,//size, radius of the particle
            allowed_colors:[//colors that the particle can take
                //note : body background color is extremely dark green, set the color to the borders of the background
                {r:18,g:88,b:18},//darker green
                {r:58,g:152,b:41},//dark green
                {r:102,g:218,b:102},//light green
                {r:136,g:226,b:136},//very light green
                {r:147,g:230,b:86},//green-yellow
                {r:186,g:228,b:96},//yellow-green
            ],
        },
        area: {
            top:0+200,
            left:0+200,
            bottom:window.innerHeight-200,
            right:window.innerWidth-200,
        },
    }
    blur_background.elt.style.filter = "blur("+blur_background_data.blur+"px)";//elt = element. blur_background is an object.
    CreateBlurBackgroundParticles(blur_background_data.count);
    blur_background.noStroke();

    //FALLING PARTICLES BACKGROUND
    fall_ptcl_data = {
        min_max_rotation_caching: 90,//In degree. All integer rotations from -x to x that should be cached for the render. 0 means only caching the original texture. 2 mean caching -2;-1;0;1;2 roations, 0 being the original rotation. (must be BIGGER THAN THE BIGGEST ROTATION possible !)
        particles:[],//array containing all particles and their data
        spawn_probability: 5,//i% of chance at each frame to spawn a new particle
        particle_style:{//styling of the particles. Ranges works as following : [most far, nearest] (from our view)
            //a particle is defined by a random percentage. Depending of that percentage, it will proportionally choose it's parameters in the ranges by mapping.
            src:temp_load.leave_particle,//texture
            size_range: [10,40],//size that can be taken
            color:{r:250,g:250,b:150},//particle color
            animation: {//curvy oscillation, leave falling. Parameters below. curve oscillation work by combining an horizontal sinusoidal with a vertical 2 times faster sinusoidal. depending of the vertical d, it will be like a "U" or a "8"(horizontal 8) or in between.
                gravity_range: [0.5,3],//positive gravity !
                //function: a.cos(bx+d)+c (note : sin would work as well)
                //==> a = vertical coefficient ; b = wave size (bigger value => smaller) ; c = vertical position of the function from origin ; d = horizontal position of the function from origin
                
                //HORIZONTAL MOVEMENT
                movement_width_range: [8,45],//a divided by 100
                horizontal_speed_range: [25,30],//b divided by 100000
                horizontal_c: 0,//c, correspond to the center value of the oscillation. The result of the function oscillate around him.
                // /!\ /!\ /!\ /!\ horizontal_d: DEFINED IN falling_particle();,//= delay, which move the oscillation function horizontally so at 0 it changes the starting point on the oscillation.
                // ==> It's effect is to change the curve oscillation shape ("U" or "8"(horizontal 8) or in between). Sign (+ or -) matters to flip it upside down or not !
                // ==> It's in RADIANS (so from 0 to 2*PI is enough to cover all posible movements) :
                //      => PI; 2*PI for a "8" horizontally
                //      => PI/2 for a "U" upside down
                //      => 3*PI/2 for a "U"
                //      => Other values to get in between possibilities
                //      => Negative value (-x) to mirror upside down

                //VERTICAL MOVEMENT
                //movement_height_range: IS MOVEMENT WIDTH RANGE,//a divided by 100
                //vertical_speed_range: IS HORIZONTAL SPEED MULTIPLICATED BY 2,//b divided by 10000
                //vertical_c: IS HORIZONTAL C,
                //vertical_d IS HORIZONTAL D,//= delay, which move the oscillation function horizontally so at 0 it changes the starting point on the oscillation. It's effect is to change the curve oscillation shape ("U" or "8"(horizontal 8) or in between). Sign (+ or -) matters to flip it upside down or not

                rotation_factor: 25,//how intensively the rotation evolves.
            },
        },
    }
    falling_particles_back.noStroke();
    falling_particles_top.noStroke();
    
    //FLOATING PARTICLES
    float_ptcl_data = {
        particles:[],//array containing all particles and their data
        count:7,//number of particles (warning with this value, can quickly generate important lags and a lot of resource consuption. This type of particle is intensive to generate, 10 is already heavy!)
        v_max:2,//maximum velocity that can be reached by particles. bigger it is, quicker they'll move. (have a big impact on step power!)
        step:0.025,//step, "speed" of the velocity change (acceleration, deceleration) of particles. bigger it is, smaller the movements will be.
        particle_style: {//styling of the particle. Ranges works as following : [most far, nearest] (from our view)
            //a particle is defined by a random percentage. Depending of that percentage, it will proportionally choose it's parameters in the ranges by mapping.
            size_range:[10,30],//size, radius of the particle
            speed_range:[0.3,1],
            src:temp_load.floating_particle,//texture
            
            // OBSOLETE :
            // gradient: {//gradient color
            //     center:{r:255,g:245,b:80,a:255},//center to corner
            //     corner:{r:229,g:239,b:110,a:50},
            // },
            // halo_gradient: {//halo gradient color
            //     center:{r:255,g:245,b:240,a:20},//center to corner
            //     corner:{r:255,g:245,b:200,a:0},
            // },
        },
        area: {
            top:100,
            left:100,
            bottom:window.innerHeight-100,
            right:window.innerWidth-100,
        },
    };
    CreateFloatingParticles(float_ptcl_data.count);//create particles
    floating_particles.noStroke();//remove stroke from particles

    //GOD RAYS
    god_rays_data = {
        rays: [],//array containing all particles and their data
        count: 7,//number of rays, those are pretty light but 20 on a classic processor with 4Go RAM can make some little fps drop. But this can be fixed by lowering others particle counts.
        blur: 3,//blur coefficient of the rays
        rays_style: {//styling of the rays. Ranges works as following : [most far, nearest] (from our view)
            //a ray is defined by a random percentage. Depending of that percentage, it will proportionally choose it's parameters in the ranges by mapping.
            color: {r:255,g:255,b:200,a:[0.3,0.5]},//rays color including random transparency
            size_range: [10, 100],//sizes that can be taken
            random_rotations: [-5,-10],//random rotations that can be taken, independant from percentage
            animation: {//horizontal oscillation. Parameters below
                //function: a.cos(bx)+c (note : sin would work as well)
                //==> a = vertical coefficient ; b = wave size (bigger value => smaller) ; c = vertical position of the function from origin
                movement_width_range: [5,20],//a
                speed_range: [0.01,0.04],//b
                c_range:[-100, window.innerWidth],//c, correspond to the center x position of a ray, the x coordinate of the ray oscillate arround it.
            },
        },
    }
    god_rays.elt.style.webkitFilter = "url(#horizontal_blur)";//elt = element. blur_background is an object.
    HTML.svg_filter.horizontal_blur.children[0].setAttribute("stdDeviation",god_rays_data.blur+",0");
    CreateGodRays(god_rays_data.count);
    god_rays.noStroke();

    //fix all canvas outside window, because of HTML.shadow_effect with window size, and canvas placed after it.
    for (var i=0; i<HTML.background_graphism_handler.children.length; i++) {
        HTML.background_graphism_handler.children[i].style.position = "fixed";
        HTML.background_graphism_handler.children[i].style.top = 0;
        HTML.background_graphism_handler.children[i].style.left = 0;
        HTML.background_graphism_handler.children[i].style.display = "initial";
    }

    
    
    
    //CACHING
    cache_list = [];
    cache = document.createElement("DIV");
    HTML.background_graphism_handler.appendChild(cache);
    cache.id = "cache";
    cache.style.position = "fixed";
    cache.style.width = window.innerWidth+"px";
    cache.style.left = -window.innerWidth+"px";//DISABLE FOR DEBUG ONLY
    
    //fall_ptcl cache
    cache.falling_ptcl = document.createElement("DIV");
    cache.appendChild(cache.falling_ptcl);
    cache.falling_ptcl.id = "falling_ptcl";
    
    //cache all possible rotations.
    var rot = fall_ptcl_data.min_max_rotation_caching;
    var cache_width = fall_ptcl_data.particle_style.size_range[1];
    for (let i = -rot; i < rot+1; i++) {//for all rotations that must be cached
        //caching one rotation
        var cached_texture = createGraphics(cache_width, cache_width);
        cached_texture.elt.style.display = "initial";
        cached_texture.parent("falling_ptcl");
        cached_texture.elt.id = `fall_ptcl_${i}`;
        cache_list[cached_texture.elt.id] = cached_texture;
        //cached_texture.background(100,100,100); //ENABLE FOR DEBUG ONLY
        
        //drawing the rotated texture
        //apply rotation
        cached_texture.translate(cache_width/2, cache_width/2);//set origin to the center;
        cached_texture.rotate(radians(i));//rotate
        //draw
        var img_data = {
            src: fall_ptcl_data.particle_style.src,
            width: fall_ptcl_data.particle_style.src.width,
            height: fall_ptcl_data.particle_style.src.height,
        };
        cached_texture.imageMode(CENTER);
        cached_texture.image(img_data.src, 0, 0, cache_width, (cache_width*img_data.height)/img_data.width );//draw img to origin (center). The img is drawn centered. (width*height/width to scale without deforming).
    }

    //END OF INIT
    graphical_init_finished = true;
    console.timeEnd("graphic init duration","color:green; font-weight:bold");
    console.info("%cgraphic init successfully ended","color:green; font-weight:bold");
    console.groupEnd("graphic init");
    document.dispatchEvent(event.graphism_ready);
}
function GraphicUpdate() {//graphical process update loop per frame
    if (graphical_init_finished) {
        FloatingParticlesUpdate();
        if (!options.low_graphics_enabled) FallingParticlesUpdate();
        if (!options.low_graphics_enabled) BlurBackgroundUpdate();//static if low graphics enabled
        RaysUpdate();
    }
    if (options.low_graphics_enabled && request_clear) {//clear useless canvas on low graphics enabled.
        falling_particles_back.clear();
        falling_particles_top.clear();
        request_clear = false;
    }
}



//#########################################################################################################################################################################################################################
//#########################################################################################################################################################################################################################
//BLUR BACKGROUND
function CreateBlurBackgroundParticles(count) {//BACKGROUND PARTICLES : function that creates all particles and their data.
    var step =           blur_background_data.step;
    var v_max =          blur_background_data.v_max;
    var allowed_colors = blur_background_data.particle_style.allowed_colors;

	for (var i=0 ; i<count ; i++) {
        // round(Rx*(1/step))/(1/step) to round in steps of "step" (use the reverse of it to round to it)
        // ==> ex: step=1 : x=1,2,3... ; ex2: step=5 : x=5,10,15...
        // ==> Rx=7;step=5 : round(7*(1/5))/(1/5) = round(7*0.2)/0.2 = round(1.4)/0.2 = 1/0.2 = 5
		blur_background_data.particles.push({
			x:      Math.round( random(0,window.innerWidth)  * (1/step) )   /   (1/step),//random x of the particle
			y:      Math.round( random(0,window.innerHeight) * (1/step) )   /   (1/step),//random y of the particle
			vx:     Math.round( random(-v_max, v_max)        * (1/step) )   /   (1/step),//random x velocity of the particle
			vy:     Math.round( random(-v_max, v_max)        * (1/step) )   /   (1/step),//random y velocity of the particle
			vx_ref: Math.round( random(-v_max, v_max)        * (1/step) )   /   (1/step),//random value for the next x velocity to reach by the particle
            vy_ref: Math.round( random(-v_max, v_max)        * (1/step) )   /   (1/step),//random value for the next y velocity to reach by the particle
            color:  allowed_colors[ getRandom(0, allowed_colors.length-1) ],
		});
	}
}
function BlurBackgroundUpdate() {//update loop
    BBUpdateCoordinates();//apply coordinates changes = movement
    blur_background.clear();//clear last frame
    
    //draw particles
    var particles = blur_background_data.particles;
    var size =      blur_background_data.particle_style.size;
	for (var i=0 ; i<particles.length ; i++) {
        blur_background.fill(particles[i].color.r, particles[i].color.g, particles[i].color.b);
        blur_background.ellipse(particles[i].x, particles[i].y, size, size);
	}
}
function BBUpdateCoordinates() {//update the coordinates of the particles. Velocities slowly try to approach a set vector reference (with x and y managed separately), and when they match (for x or y), the reference change (for x or y accordingly) and set a new value to approach. The slow random changes of velocity is what makes particles moving following some fictive curves.
    var particles = blur_background_data.particles;
    var step =      blur_background_data.step;
    var v_max =     blur_background_data.v_max;
    var border = {
        left:   blur_background_data.area.left,
        right:  blur_background_data.area.right,
        top:    blur_background_data.area.top,
        bottom: blur_background_data.area.bottom,
    };
    
    for (var i=0 ; i<particles.length ; i++) {//for each particle
		// UPDATE X
		if (Math.round(particles[i].vx) !== Math.round(particles[i].vx_ref)) {//if velocity not equal to reference, make it approach reference
            if (particles[i].vx > particles[i].vx_ref)   particles[i].vx = particles[i].vx - step;//if velocity > velocity_reference, decrease velocity (It's like a transition along frames, to approach slowly the reference value, make smooth accelerations and deccelerations.)
            if (particles[i].vx < particles[i].vx_ref)   particles[i].vx = particles[i].vx + step;//if velocity < velocity_reference, increase velocity
        
        } else if (Math.round(particles[i].vx) == Math.round(particles[i].vx_ref)) {//if velocity equal to reference, set a new reference
            if      (particles[i].x < border.left)       particles[i].vx_ref = Math.round(random(0, v_max)      * (1/step))   /   (1/step);//if to the left side, random number to the right (those 2 lines, akka this one and the line below, avoid the particles to go outside a set area)
			else if (particles[i].x > border.right)      particles[i].vx_ref = Math.round(random(-v_max, 0)     * (1/step))   /   (1/step);//if to the right side, random number to the left
            else                                         particles[i].vx_ref = Math.round(random(-v_max, v_max) * (1/step))   /   (1/step);//otherwise if it's not near the left or the right, a totally random value can be chosen
		}
        
        
        // UPDATE Y
		if (Math.round(particles[i].vy) !== Math.round(particles[i].vy_ref)) {//same logic than below, with top and bottom instead of left and right
            if (particles[i].vy > particles[i].vy_ref)   particles[i].vy = particles[i].vy - step;
            if (particles[i].vy < particles[i].vy_ref)   particles[i].vy = particles[i].vy + step;
        
        } else if (Math.round(particles[i].vy) == Math.round(particles[i].vy_ref)) {
            if      (particles[i].y < border.top)        particles[i].vy_ref = Math.round(random(0, v_max)      * (1/step))   /   (1/step);
			else if (particles[i].y > border.bottom)     particles[i].vy_ref = Math.round(random(-v_max, 0)     * (1/step))   /   (1/step);
            else                                         particles[i].vy_ref = Math.round(random(-v_max, v_max) * (1/step))   /   (1/step);
		}

		particles[i].x = particles[i].x + particles[i].vx;//apply new x to the particle
		particles[i].y = particles[i].y + particles[i].vy;//apply new y to the particle
	}
}

//#########################################################################################################################################################################################################################
//#########################################################################################################################################################################################################################



//#########################################################################################################################################################################################################################
//#########################################################################################################################################################################################################################
//FALLING PARTICLES
function falling_particle() {//function that create a particle object
    var gravity_range =          fall_ptcl_data.particle_style.animation.gravity_range;
    var rotation_factor =        fall_ptcl_data.particle_style.animation.rotation_factor;
    var size_range =             fall_ptcl_data.particle_style.size_range;
    var color =                  fall_ptcl_data.particle_style.color;
    
    var movement_width_range =   fall_ptcl_data.particle_style.animation.movement_width_range;
    var horizontal_speed_range = fall_ptcl_data.particle_style.animation.horizontal_speed_range;
    var horizontal_c =           fall_ptcl_data.particle_style.animation.horizontal_c;

    this.coef = getRandom(0,100);//random percent explained in GraphicInit() to fall_ptcl_data declaration
    
    //position
    this.x = random(0, window.innerWidth);//pos x
    this.vx = 0;//velocity x
    this.y = 0;//pos y
    this.vy = 0;//velocity y (This is NOT what makes the leave falling, vx and vy manage the oscillation movement ONLY)
    this.gravity = map(this.coef,0,100, gravity_range[0], gravity_range[1]);//gravity coefficient (the value that makes the leave falling.)

    //rotation
    this.rot = 0;//rotation in degrees
    this.rot_fctn_result = 0;//result of the function that define the rotation movement
    this.last_rot_ftcn_result = 0;//previous result of of the function that define the rotation movement
    this.rot_evolution_map = [1,-1,-1,1];//map of signs, looped. At each new function cycle (see this.update()), the rotation take the next sign. (+ or -). This gives a logic rotation movement depending of the particle (leave) movement
    this.rot_cycles_count = 0;//iterates at each new function cycle started, this count them.
    this.count_cycles = false;//if it should search for a new function cycle
    this.rot_factor = rotation_factor;//how intensively the rotation evolves. (Imagine it like how much you would like a boat to balance.)
    
    //style
    this.size = map(this.coef,0,100, size_range[0], size_range[1]);//particle size
    this.color = color;//particle color
    
    //horizontal movement
    this.movement_width =   map(this.coef,0,100, movement_width_range[0]  , movement_width_range[1]  ) / 10;//horizontal movement amplitude of the particle
    this.horizontal_speed = map(this.coef,0,100, horizontal_speed_range[0], horizontal_speed_range[1]) / 1000;//horizontal movement speed of the particle
    this.horizontal_c = horizontal_c;//see GraphicInit() ==> fall_ptcl_data.particle_style.animation.horizontal_c explanation
    this.horizontal_d = 2.5*Math.PI/2;//see GraphicInit() ==> fall_ptcl_data.particle_style.animation.vertical_d explanation

    //vertical movement
    this.movement_height = this.movement_width;//vertical movement amplitude of the particle
    this.vertical_speed = 2*this.horizontal_speed;//vertical movement speed of the particle
    this.vertical_c = this.horizontal_c;//see GraphicInit() ==> fall_ptcl_data.particle_style.animation.vertical_c explanation
    this.vertical_d = this.horizontal_d;//see GraphicInit() ==> fall_ptcl_data.particle_style.animation.vertical_d explanation

    this.time = 0;//iterates at each frame so the particle move along the fonction defining it's position. You can also use it to debug lifetime of the particle.
    this.time_rot = this.time;//NOTE : THIS IS NOW SIMPLY "THIS.TIME", THE FOLLOWING NOTE CONCERN AN OLD TRY FOR A MORE COMPLEX ROTATION MOVEMENT !!! | iterates at each frame to move along the fonction defining position, follow "this.time" but with accelerations and deccelerations to time correctly the rotation.

    
    
    
    
    this.update = function() {//update coordinates along time    
        //horizontal movement
        var ha = this.movement_width;
        var hb = this.horizontal_speed;
        var hc = this.horizontal_c;
        var hd = this.horizontal_d;
        var hn = this.time;
        this.vx = ha*Math.cos(hb*hn+hd)+hc;//see GraphicInit() ==> fall_ptcl_data.particle_style.animation
        this.x = this.x + this.vx;//apply oscillation
            
        //vertical movement
        var va = this.movement_height;
        var vb = this.vertical_speed;
        var vc = this.vertical_c;
        var vd = this.vertical_d;
        var vn = this.time;
        this.vy = va*Math.cos(vb*vn+vd)+vc;//see GraphicInit() ==> fall_ptcl_data.particle_style.animation
        this.y = this.y + this.vy;//apply oscillation
        
        //apply gravity
        this.y = this.y + this.gravity;//apply gravity
        
        



        //apply rotation
        var t = this.time_rot;
        this.last_rot_ftcn_result = this.rot_fctn_result;//save the last rotation function result
        this.rot_fctn_result = (va*Math.cos((2*vb)*t+vd)+va);//calculate the rotation movement. (*)
        //(NOTE n°1) horizontal velocity result, but use "va" as "vc" so it's always positive, with 0 as minimum (draw a.cos(x)+a on a graph to visualize). The function is quite the same as it follow the movement and must be coordinated;
        //(NOTE n°2) vb*2 because the vertical speed is *2 too. It's to give a logic rotation movement going at the right speed. (To visualize, if you remove the x2 speed, you will see the rotation being 2x slower than it should.);
        this.rot = this.rot_fctn_result * this.rot_factor/va;// Apply the rotation intensity factor. || the factor is constant, but 2 particles won't have the same movement properties (it is proportionally randomized). "/va" scale the factor to the movement amplitude, so it behaves the same no matter the parameters of the particle!
        if ( (this.rot_fctn_result > this.last_rot_ftcn_result)   &&   this.count_cycles) {//count function cycles (a cycle is a portion of funcion starting from 0 (minimum of the function) and stoping back to 0 (minimum of the function)). Each particle movement loop contains 4 cycles. See below.
            this.rot_cycles_count++;
            this.count_cycles = false;//disable the check of a new function cycle once a new one has started (avoid loop count, see below)
        }
        //##################################################################################################################################################################
        //NOTE ON CYCLES :
        //- A cycle start to the minimum of the function (0) and end to the minimum of the function (0). It's a complete cosinus pattern on the function graph.
        //- Each particle movement loop contains 4 cycles
        //- At the start, the cycle is increasing and, at the end, the cycle is decreasing. 
        //    ==> That's why a new cycle start when the function is increasing again (this.rot_fctn_result > this.last_rot_ftcn_result)
        //    ==> That's also why we can only listen back to find a new cycle when the function is decreasing :
        //        1) Because a cycle is detected when it first increase and the condition still validate during all the increasing phase, it avoid infinite triggering all the time it is increasing
        //        2) When it decreases, we know it will then increase back, so it's the best moment to listen back.
        //##################################################################################################################################################################        
        this.count_cycles = (this.rot_fctn_result < this.last_rot_ftcn_result)? true : false ;//reenable the check of a new function cycle once it cannot loop count anymore, also when a new cycle is coming (= When the maximum of the function is found and behind the progress, the function is at this moment going back to the minimum, so it will trigger a new cycle). See above.
        this.rot = this.rot  *  this.rot_evolution_map[this.rot_cycles_count % this.rot_evolution_map.length];//apply the rotation evolution map, ==> giving the final rotation angle.
        //final_rotation = rotation * rotation_direction[of the cycle]. (left or right direction). SEE BELOW
        // (NOTE) : the "modulo(%) length" selects the good sign (+ or -) depending of the actual cycle. SEE BELOW. (if we counted 10 cycles, and in a phase there are 4 cycles, then with 10%4 = 2 we know we must select map[2] so the 3rd cycle sign!)
        //################################################################################################################################################################################################################################################################################################################################################
        //HOW DOES THE EVOLUTION MAP WORKS ?
        //One movement loop contains 4 cycles : from (1) to (2), from (2) to (3), from (3) to (4) and from (4) to (1).
        // This is the function of the movement :
        //
        //          (START/END)
        //         /----(1)----\    /----(3)----\  
        //        /    <---     \  /    --->     \ 
        //       /               \/               \         ( <--- ) = particle (leave) direction
        //       \               /\               /
        //        \    --->     /  \    <---     / 
        //         \----(2)----/    \----(4)----/  
        //
        // ((--) ==> (\) ==> (--)) is RIGHT rotation when the cosinus function is POSITIVE; ((--) ==> (/) ==> (--)) is LEFT rotation when the cosinus function is NEGATIVE; (the lines in parenthesis are the different steps of the rotation))
        // The cosinus function make the rotation of the leave go right all the time (Because it's always positive as explained at "this.rot_fctn_result = formula" line below with "(*)" in comments).
        // But on this function it should do a rotation to : (1/2)right, (2/3)left, (3/4)left, (4/1)right, it do not match! (the particle (leave) movement would not make sense if we don't respect this!)
        // So to match, we must reverse the cosinus function on (2/3) and (3/4). To do so we multiply by -1 so it's negative. But we mustn't reverse on the rest so we should multiply by 1 this time.
        // It gives the following multiplication map : [1 ; -1 ; -1 ; 1] , so what sign should take each cycle. ==> var this.rot_evolution_map.
        //################################################################################################################################################################################################################################################################################################################################################
        

        this.time++;//increase the time of the particle
        this.time_rot++;//^^^^ see their definitions.
        //FAIL -> NEED REWORK (SHOULD CHANGE SPEED OF EACH CYCLE TO MAKE THE ROTATION CORRESPOND TO THE CURVE MOVEMENT LIKE TO MAKE A COHERENT LEAVE MOVEMENT)
        // if (this.rot_cycles_count % this.rot_evolution_map.length == 2 || this.rot_cycles_count % this.rot_evolution_map.length == 4) {
        //     this.time_rot = this.time_rot+0.9;
        // } else {this.time_rot = this.time_rot+0.73;}
        // if (this.time%100 == 0) console.log(this.time_rot);

        //delete the particles below the screen, now useless as they will never appear again.  
        var particles = fall_ptcl_data.particles;
        if (this.y > window.innerHeight+200) {//if below window :
            let index = particles.indexOf(this);//find it in the list,
            particles.splice(index, 1);// and delete it.
        }
    }

    
    
    
    
    this.display = function() {//display the particle
        var cvs = (this.size>30)? falling_particles_top : falling_particles_back;
        cvs.push();//push() and pop() make so the translation of the canvas is only applied to place that particle, and then it's reset to default. So it do not count in the placement of another particle.
        cvs.translate(this.x, this.y);//set origin to the particle's coordinates
        var src = cache_list[`fall_ptcl_${Math.round(this.rot)}`]//to use a pre-rotated cached texture.
        var img = {//texture data
            src: src,
            width: src.width,
            height: src.height,
        };
        cvs.imageMode(CENTER);//draw the image centered to the coordinates.
        cvs.image(img.src, 0, 0, this.size, (this.size*img.height)/img.width );//draw texture. (*height/width to scale without deforming)
        cvs.pop();

        //OLD WAY TO DISPLAY

        // if (this.size > 30) {
        //     falling_particles_top.push();//push() and pop() make so the translation and rotation of the canvas are only applied to place that particle, and then it's reset to default. So it do not count in the placement of another particle.
        //     //apply rotation
        //     falling_particles_top.translate(this.x, this.y);//set origin to the element's coordinates
        //     falling_particles_top.rotate(radians(this.rot));//rotate
        //     //draw
        //     var img_data = {
        //         src: fall_ptcl_data.particle_style.src,
        //         width: fall_ptcl_data.particle_style.src.width,
        //         height: fall_ptcl_data.particle_style.src.height,
        //     };
        //     falling_particles_top.image(img_data.src, -this.size/2, -this.size/2, this.size, (this.size*img_data.height)/img_data.width );//draw img to origin (the img coordinates) but centered. (*width/height to scale without deforming)
        //     falling_particles_top.pop();
        // } else {
        //     falling_particles_back.push();//push() and pop() make so the translation and rotation of the canvas are only applied to place that particle, and then it's reset to default. So it do not count in the placement of another particle.
        //     //apply rotation
        //     falling_particles_back.translate(this.x, this.y);//set origin to the element's coordinates
        //     falling_particles_back.rotate(radians(this.rot));//rotate
        //     //draw
        //     var img_data = {
        //         src: fall_ptcl_data.particle_style.src,
        //         width: fall_ptcl_data.particle_style.src.width,
        //         height: fall_ptcl_data.particle_style.src.height,
        //     };
        //     falling_particles_back.image(img_data.src, -this.size/2, -this.size/2, this.size, (this.size*img_data.height)/img_data.width );//draw img to origin (the img coordinates) but centered. (*height/width to scale without deforming)
        //     falling_particles_back.pop();
        // } 
    }
}




function FallingParticlesUpdate() {//update loop
    falling_particles_back.clear();//erase the canvas for a new draw
    falling_particles_top.clear();

    var particles = fall_ptcl_data.particles;

    var prob = fall_ptcl_data.spawn_probability;
    for (let i = prob; i > random(0,100); i--) {// i% of chance at each frame to spawn a new particle
        particles.push(new falling_particle());
    }
    //TO TEST AND STUDY THE CURVE MOVEMENT : put the "for" loop below in comments ; enable the line below ; disable the clear() action on canvas ; set this.y to 500 on init. Revert this to go back to normal (with this.y = 0)
    //if (frameCount == 30) for (var i=0;i<10;i++) fall_ptcl_data.particles.push(new falling_particle());
    
    for (var ptcl of particles) {//update all particles and their display
        ptcl.update();
        ptcl.display();
    }

    //security to avoid crash in case of bugs or unintended behavior
    if (particles.length > 500) particles = [];//kill on urgent situation
}
//#########################################################################################################################################################################################################################
//#########################################################################################################################################################################################################################



//#########################################################################################################################################################################################################################
//#########################################################################################################################################################################################################################
//FLOATING PARTICLES
function CreateFloatingParticles(count) {//FLOATING PARTICLES : function that creates all particles and their data.
    var step =        float_ptcl_data.step;
    var v_max =       float_ptcl_data.v_max;
    var size_range =  float_ptcl_data.particle_style.size_range;
    var speed_range = float_ptcl_data.particle_style.speed_range;
    
    for (var i=0 ; i<count ; i++) {
        // round(Rx*(1/step))/(1/step) to round in steps of "step" (use the reverse of it to round to it)
        // ==> ex: step=1 : x=1,2,3... ; ex2: step=5 : x=5,10,15...
        // ==> Rx=7;step=5 : round(7*(1/5))/(1/5) = round(7*0.2)/0.2 = round(1.4)/0.2 = 1/0.2 = 5
        var coefficient = getRandom(0,100);

        float_ptcl_data.particles.push({
            coef:coefficient,//random percent explained in GraphicInit() to float_ptcl_data declaration
            size: map(coefficient, 0, 100, size_range[0], size_range[1]),//size of the particle
            speed:map(coefficient, 0, 100, speed_range[0], speed_range[1]),//speed of the particle
			x:      Math.round( random(0,window.innerWidth)  * (1/step) )   /   (1/step),//random x of the particle
			y:      Math.round( random(0,window.innerHeight) * (1/step) )   /   (1/step),//random y of the particle
			vx:     Math.round( random(-v_max, v_max)        * (1/step) )   /   (1/step),//random x velocity of the particle
			vy:     Math.round( random(-v_max, v_max)        * (1/step) )   /   (1/step),//random y velocity of the particle
			vx_ref: Math.round( random(-v_max, v_max)        * (1/step) )   /   (1/step),//random value for the next x velocity to reach by the particle
			vy_ref: Math.round( random(-v_max, v_max)        * (1/step) )   /   (1/step),//random value for the next y velocity to reach by the particle
        });
	}
}
function FloatingParticlesUpdate() {//update loop
    FPUpdateCoordinates();//apply coordinates changes = movement
    floating_particles.clear();//clear last frame
    
    //draw particles
    var particles = float_ptcl_data.particles;
    var src =       float_ptcl_data.particle_style.src;
	for (var i=0 ; i<particles.length ; i++) {
        floating_particles.image(src,   particles[i].x,   particles[i].y,   particles[i].size,   particles[i].size);
        //OBSOLETE, OLD WAY TO CREATE PARTICLES :
        //RadialGradientCircle(particles[i].x,   particles[i].y,   float_ptcl_data.particle_style.size*3,   float_ptcl_data.particle_style.halo_gradient.center,   float_ptcl_data.particle_style.halo_gradient.corner);//particle halo
		//RadialGradientCircle(particles[i].x,   particles[i].y,   float_ptcl_data.particle_style.size,     float_ptcl_data.particle_style.gradient.center,          float_ptcl_data.particle_style.gradient.corner);//particle itself
	}
}
function FPUpdateCoordinates() {//update the coordinates of the particles. Velocities slowly try to approach a set vector reference (with x and y managed separately), and when they match (for x or y), the reference change (for x or y accordingly) and set a new value to approach. The slow random changes of velocity is what makes particles moving following some fictive curves.
    var particles = float_ptcl_data.particles;
    var step =      float_ptcl_data.step;
    var v_max =     float_ptcl_data.v_max;
    var border = {
        left:   float_ptcl_data.area.left,
        right:  float_ptcl_data.area.right,
        top:    float_ptcl_data.area.top,
        bottom: float_ptcl_data.area.bottom,
    };

    for (var i=0 ; i<particles.length ; i++) {//for each particle
		// UPDATE X
		if (Math.round(particles[i].vx) !== Math.round(particles[i].vx_ref)) {//if velocity not equal to reference, make it approach reference
            if (particles[i].vx > particles[i].vx_ref)   particles[i].vx = particles[i].vx - step;//if vel. > vel. reference, decrease vel. (It's like a transition along frames, to approach slowly the reference value, make smooth accelerations and deccelerations.)
            if (particles[i].vx < particles[i].vx_ref)   particles[i].vx = particles[i].vx + step;//if vel. < vel. reference, increase vel.
        
        } else if (Math.round(particles[i].vx) == Math.round(particles[i].vx_ref)) {//if velocity equal to reference, set a new reference
            if      (particles[i].x < border.left)       particles[i].vx_ref = Math.round(random(0, v_max)      * (1/step))   /   (1/step);//if to the left side, random number to the right (those 2 lines (<-- vvv) avoid the particles to go outside a set area)
			else if (particles[i].x > border.right)      particles[i].vx_ref = Math.round(random(-v_max, 0)     * (1/step))   /   (1/step);//if to the right side, random number to the left
            else                                         particles[i].vx_ref = Math.round(random(-v_max, v_max) * (1/step))   /   (1/step);//otherwise if it's not near the left or the right, a totally random value can be chosen
		}
        
        
        // UPDATE Y
		if (Math.round(particles[i].vy) !== Math.round(particles[i].vy_ref)) {//same logic than below, with top and bottom instead of left and right
            if (particles[i].vy > particles[i].vy_ref)   particles[i].vy = particles[i].vy - step;
            if (particles[i].vy < particles[i].vy_ref)   particles[i].vy = particles[i].vy + step;
        
        } else if (Math.round(particles[i].vy) == Math.round(particles[i].vy_ref)) {
            if      (particles[i].y < border.top)        particles[i].vy_ref = Math.round(random(0, v_max)      * (1/step))   /   (1/step);
			else if (particles[i].y > border.bottom)     particles[i].vy_ref = Math.round(random(-v_max, 0)     * (1/step))   /   (1/step);
            else                                         particles[i].vy_ref = Math.round(random(-v_max, v_max) * (1/step))   /   (1/step);
		}

		particles[i].x = particles[i].x + particles[i].vx*particles[i].speed;//apply new x to the particle
		particles[i].y = particles[i].y + particles[i].vy*particles[i].speed;//apply new y to the particle
	}
}

//OBSOLETE : OLD WAY TO CREATE PARTICLES
// function RadialGradientCircle(x,y,radius,rgba1,rgba2) {//function to draw a circular ellipse with a radial gradient as color. THIS FUNCTION IS RESOURCE TAKING, AVOID BIG RADIUS AS MUCH AS POSSIBLE
// 	var gradient_start = color(rgba1.r, rgba1.g, rgba1.b, rgba1.a);//color starting to the center
// 	var gradient_end = color(rgba2.r, rgba2.g, rgba2.b, rgba2.a);//color starting to the border
// 	for (var r=radius; r>0; r--) {//to apply gradient, an ellipse 1px smaller than previous is drawn on previous. Each new ellipse has it's interpolation color more far from the border collor, and more near the center color
// 		var interpolation_factor = map(r, 0, radius, 0, 1)//p5 method : Re-maps a number (r) from one range (0,radius) to another (0,1). (a less efficient equivalent is the formula : (r/radius)*100))
// 		var fill_color = lerpColor(gradient_start, gradient_end, interpolation_factor);//p5 method that find an interpolation between two colors, to the position of the factor (0<factor<1). ex: 0 is 1st color, 0.1 is very near 1st color, 0.5 is in between, etc...
// 		floating_particles.fill(fill_color);//apply interpolation color
// 		floating_particles.ellipse(x, y, r, r);//draw the ellipse, representing one of the gradient lines (by superposition of each others, each one 1px smaller than previous).
// 	} 
// }
//#########################################################################################################################################################################################################################
//#########################################################################################################################################################################################################################



//#########################################################################################################################################################################################################################
//#########################################################################################################################################################################################################################
//GOD RAYS
function CreateGodRays(count) {//RAYS : function that creates all rays and their data
    var rays = god_rays_data.rays;
    
    var movement_width_range = god_rays_data.rays_style.animation.movement_width_range;
    var speed_range =          god_rays_data.rays_style.animation.speed_range;
    var c_range =              god_rays_data.rays_style.animation.c_range

    var color =                god_rays_data.rays_style.color;
    var size_range =           god_rays_data.rays_style.size_range
    var random_rotations =     god_rays_data.rays_style.random_rotations

    var color_trensparency =   god_rays_data.rays_style.color.a         

    for (var i=0 ; i<count ; i++) {
        var coefficient = getRandom(0,100);//vvvvvvvvv
        rays.push({//see explanation in the init function GraphicInit to the var god_rays_data for different elements.
            coef: coefficient,
            x: 0,
            i: 0,//continual iteration to make the position x evolve depending of a function
            mov_range: map(coefficient, 0, 100, movement_width_range[0], movement_width_range[1]),
            speed:     map(coefficient, 0, 100, speed_range[0]         , speed_range[1]),
            c:         getRandom(c_range[0], c_range[1]),

            color:     JSON.parse(JSON.stringify(color)),//parse+stringify to create a new object instead of just linking dinamically (there was problems with the fact it was just linked)
            size:      map(coefficient, 0, 100, size_range[0]          , size_range[1]),
            rot:       random(random_rotations[0], random_rotations[1]),
        });
        rays[i].color.a = random(color_trensparency[0] ,color_trensparency[1]);
    }
}
function RaysUpdate() {//function that update rays position and draw them
    RaysUpdateCoordinates();
    god_rays.clear();
    
    //draw rays
    var rays = god_rays_data.rays;
    for (var i=0; i<god_rays_data.rays.length; i++) {
        //apply color
        god_rays.fill("rgba("+rays[i].color.r+","+rays[i].color.g+","+rays[i].color.b+","+rays[i].color.a+")");
        god_rays.push();//push pop make so the translation and rotation of the canvas is only applied to place that element with rotation, and then it's reset to default
        //apply rotation
        god_rays.translate(rays[i].x, -100);//set origin to rect coordinates
        god_rays.rotate(radians(rays[i].rot));
        //draw
        god_rays.rect(0, 0, rays[i].size, 2000);//draw rect on origin (which is placed to his coordinates where he should be drawn)
        god_rays.pop();
    }
}
function RaysUpdateCoordinates() {//function that update rays coordinates
    var rays = god_rays_data.rays;

    for (var i=0; i<rays.length; i++) {
        var a = rays[i].mov_range;
        var b = rays[i].speed;
        var c = rays[i].c;
        var n = rays[i].i;

        rays[i].x = a*Math.cos(b*n)+c;
        rays[i].i++;
    }
}
//#########################################################################################################################################################################################################################
//#########################################################################################################################################################################################################################
