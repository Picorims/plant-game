// Plant is a 2 players strategy game, where the goal is to take as much space as possible on the terrain with a plant by making it growing.
    
// Copyright (c) 2018-2021 Picorims<picorims.contact@gmail.com> and Cirno, France. All rights reserved.

// Licensed under the GNU Affero General Public License version 3.0 (GNU AGPL v3.0).
// More information about the license at LICENSE.md to the root of the program. If it is missing, see <https://www.gnu.org/licenses/>.
// A full notice can be found at NOTICE.md to the root of the program,
// and you should see README.md as well for other information.

//>>>P5 MAIN PROCESS, WHICH CREATES AS WELL THE NECESSARY CANVAS FOR :<<<
// - TITLE ANIMATION
// - BACKGROUND
// - LAYERS SUPERPOSED TO THE MAIN CANVAS, THAT ACT FOR DISPLAYING GAME ELEMENTS, OR VISUALS... (main = "main_layer_canvas", then preview_graph, start_graph are for gameplay. Others are graphical only)
var main_layer_canvas;//p5 main layer canvas for the game. ALSO PRINCIPAL CANVAS OF P5
var aura_canvas;//p5 canvas for aura display
//THE VARIABLE BELOW IS DEFINED HERE BECAUSE IT NEEDS TO BE SETUP BEFORE GAME INITIALISATION !
var preview_graph;//p5 canvas over the first one to draw previews without overwriting grid.
//THE VARIABLE BELOW IS DEFINED HERE BECAUSE IT NEEDS TO BE SETUP BEFORE GAME INITIALISATION !
var starts_graph;//p5 canvas over the preview_graph to show where the player can start from.
//THE VARIABLE BELOW IS DEFINED HERE BECAUSE IT NEEDS TO BE SETUP BEFORE GAME INITIALISATION !
var canvas_width, canvas_height;//canvas size
var grid_size;// (grid_size x grid_size) number of cases
var grid_border;//grid border size;
var case_size; //(case_size x case_size) case size
var framerate;//game framerate
var first_draw;//if draw run first time



//NOTE: case means tile in variable names most of the time, I made an english mistake when I started the project out at high school. Sorry!



function setup() {//p5 setup, canvas related init
    //FRAMERATE DEFINITION
    framerate = 30;//displaying and updating framerate
    sessionStorage.setItem("framerate",framerate);
    frameRate(framerate);//p5 canvas framerate
    
    //GRID DEFINITION
    grid_size = 17;//must be odd (odd=impair | even=pair)
    grid_border = 2; //taken on case_size (case_size - grid_border), so it won't interact in any way with any algorithm, it's the esthetic border of cases.
    case_size = 2*Math.floor( window.innerWidth/3 / grid_size / 2); // 2*... /2 -> round to even
    first_draw = true;
    
    //GAME CANVAS CREATION
    canvas_width = (grid_size*case_size);//width and height for canvas being layers on the main_layer_canvas
    canvas_height = (grid_size*case_size);
    main_layer_canvas = createGraphics(canvas_width, canvas_height);
    aura_canvas = createGraphics(canvas_width, canvas_height);
    preview_graph = createGraphics(canvas_width, canvas_height);
    starts_graph = createGraphics(canvas_width, canvas_height);
    
    // Move the canvas to their destination (<div>)
    main_layer_canvas.parent('game_layers_handler');
    aura_canvas.parent('game_layers_handler');
    preview_graph.parent('game_layers_handler');
    starts_graph.parent('game_layers_handler');
    
    //BACKGROUND CANVAS CREATION
    blur_background = createGraphics(window.innerWidth, window.innerHeight);
    falling_particles_back = createGraphics(window.innerWidth, window.innerHeight);
    floating_particles = createGraphics(window.innerWidth, window.innerHeight);
    god_rays = createGraphics(window.innerWidth, window.innerHeight);
    falling_particles_top = createGraphics(window.innerWidth, window.innerHeight);
    
    // Move the canvas to their destination (<div>)
    blur_background.parent("background_graphism_handler");
    falling_particles_back.parent("background_graphism_handler");
    floating_particles.parent("background_graphism_handler");
    god_rays.parent("background_graphism_handler");
    falling_particles_top.parent("background_graphism_handler");

    //GRAPHIC PROCESS FOR ANIMATED BACKGROUND INITIALIZATION
    GraphicInit();
}
function preload() {//p5 preload (ex : for images)
    temp_load = {
        floating_particle: loadImage("assets/textures/floating_particle.svg"),
        leave_particle: loadImage("assets/textures/leave_particle_rotated.svg"),
        audio: {
            song1: loadSound('assets/music/Geoplex - Drift.mp3'),
        },
    };
}
function draw() {//p5 draw (in canvas)   
    if (game_init_ended) {
        if (first_draw) FirstTerrainDraw();//draw terrain on first call, but not then to not overwrite.
        SendPlayerData();//cf function
    }
    
    
    GraphicUpdate();
}