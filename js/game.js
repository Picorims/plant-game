// Plant is a 2 players strategy game, where the goal is to take as much space as possible on the terrain with a plant by making it growing.
    
// Copyright (c) 2019 Picorims<picorims.contact@gmail.com> and Cirno, France. All rights reserved.

// Licensed under the GNU Affero General Public License version 3.0 (GNU AGPL v3.0).
// More information about the license at LICENSE.txt to the root of the program. If it is missing, see <https://www.gnu.org/licenses/>.
// A full notice can be found at NOTICE.txt to the root of the program,
// and you should see README.txt as well for other information.

//PLANT GAME PROCESS
var grid;//grid style database
var preview_line;//preview line style database
var start_point;//starting points displayed style database
var players_line_weight;//players line weight
var flower;//flower style database
var player1, player2;//object with players database;
var tilemap;//tilemap of draws and lines connection for each players
var turn;//infos about turn, value + who's turn to play
var rules;//rules parameters database
var can_test_event; //if key press can be analized. true if can, false if can't.
var game_init_ended = false;//if setup() and GameInit() has ended to init. true when done and ready.

var temp_load;//var that stores on preload() all textures etc so they can THEN BE REASSIGNED IN OTHER DATABASES. DO NOT USE AS A DATABASE ITSELF! (even if it is permanent)










//####################################################################################################################################################################################################################################################
//####################################################################################################################################################################################################################################################
//####################################################################################################################################################################################################################################################
//####################################################################################################################################################################################################################################################



//###############################
//#     GAME INITIALIZATION     #
//###############################




function GamePreInit() {//game initialization that only need one initialization and cannot support more than one initialization
    console.group("pre game init");
    console.info("%cpre game init...","color:darkorange; font-weight:bold");
    console.time("pre game init duration");
    

    get_players_data_interval = setInterval(GetPlayerData, framerate*5);//create interval for GetPlayerData()
    update_tabs_data_interval = setInterval(UpdateTabData, framerate*5);//create interval for UpdateTabData()


    document.dispatchEvent(event.pre_game_ready);
    console.timeEnd("pre game init duration");
    console.info("%cpre game init successfuly ended","color: darkorange; font-weight:bold");
    console.groupEnd("pre game init");
}








function GameInit() {//initialization of the game
    console.info("%cgame init...","color:orange; font-weight:bold");
    console.time("game init duration");
    
    
    
    
    //+------------------------------+
    //|  GAME VARIABLES DEFINITIONS  |
    //+------------------------------+

    //PLAYERS DATABASE
    player1 = {
        x:              (grid_size+1)/2,        //x pos
        y:              grid_size,              //y pos
        x_init:         (grid_size+1)/2,        //first starting x pos
        y_init:         grid_size,              //first starting y pos
        x_start:        0,                      //x pos of new line start
        y_start:        0,                      //y pos of new line start
        x_preview:      0,                      //x pos of preview
        y_preview:      0,                      //y pos of preview
        rgb:            {r:100,g:231,b:124},    //color theme (green)
        score:          0,                      //score in number of cases taken
        
        path: {//path to draw in grid
            preview:                [],             //path to show player what will he do/confirm. When he chooses the path, it's what shown
            last_preview_movement:  "unset",        //last movement used by preview var
            draw:                   [],             //path confirmed by the player, definitely added to the game
        },

        dice_count:     0,                      //movements available, given randomly on player's turn
        movements_left: "-",                    //count of movements left to do in the grid. "-" if not player's turn
        wins:           (
                            sessionStorage.getItem("player1.wins") == undefined) ?
                            0 : parseInt(sessionStorage.getItem("player1.wins")
                        ),                      //count of victories. Restore it if this function is executed from a reset.
        
        last_bonus:{//bonus got on the turn just ended for :
            flower:         0,                      //flower creation
            opponent_side:  0,                      //touching opponent side of the grid
            stolen_by_aura: 0,                      //stealing points by placing aura cases on the opponent's plant
        },
        
    };

    player2 = {
        x:              (grid_size+1)/2,            //x pos
        y:              1,                          //y pos
        x_init:         (grid_size+1)/2,            //first starting x pos
        y_init:         1,                          //first starting y pos
        x_start:        0,                          //x pos of new line start
        y_start:        0,                          //y pos of new line start
        x_preview:      0,                          //x pos of preview
        y_preview:      0,                          //y pos of preview
        rgb:            {r:100,g:217,b:231},        //color theme (blue)
        score:          0,                          //score in number of cases taken
        
        path: {//path to draw in grid
            preview:                [],                 //path to show player what will he do/confirm. When he chooses the path, it's what shown
            last_preview_movement:  "unset",            //last movement used by preview var
            draw:                   [],                 //path confirmed by the player, definitely added to the game
        },
        
        dice_count:     0,                          //movements available, given randomly on player's turn
        movements_left: "-",                        //count of movements left to do in the grid. "-" if not player's turn
        wins:           (
                            sessionStorage.getItem("player1.wins") == undefined) ?
                            0 : parseInt(sessionStorage.getItem("player1.wins")
                        ),                          //count of victories
        
        last_bonus:{//bonus got on the turn just ended for :
            flower:         0,                          //flower creation
            opponent_side:  0,                          //touching opponent side of the grid
            stolen_by_aura: 0,                          //stealing points by placing aura cases on the opponent's plant
        },

    };



    //INITIALIZATION OF THE POSITION OF PREVIEW LINES FOR EACH PLAYER TO THE POSITION OF THEIR MIDDLE START
    player1.x_preview = player1.x
    player1.y_preview = player1.y
    player2.x_preview = player2.x
    player2.y_preview = player2.y
    
    player1.x_start = player1.x
    player1.y_start = player1.y
    player2.x_start = player2.x
    player2.y_start = player2.y
    

    
    //GRID STYLR
    grid = {
        line_color:         200,    //color of the lines of the grid (rgb)
        background_color:   250,    //color of the background of the grid(rgb)
        //grid_size, grid_border, and case_size are appart because they've to be defined when p5 initialization run (setup() and draw()), but they relates to the same family of variables.
    };
    

    
    //LINES STYLE
    preview_line = {
        color:  150,    //preview line display color (rgb)
        weight: 4,      //weight of the line
    };
    player_line_weight = 4; //weight of the player stems
    

    
    //POSSIBLE START POINT INDICATOR STYLE
    start_point = {
        weight:     5,
        
        p1_color: {
            r: player1.rgb.r-50,
            g: player1.rgb.g-50,
            b: player1.rgb.b-50,
        },
        
        p2_color: {
            r: player2.rgb.r-50,
            g: player2.rgb.g-50,
            b: player2.rgb.b-50,
        },
    };
    

    
    //FLOWER STYLE
    flower = {
        radius:             18,                     //radius for the weight of petals and the center of the flower
        preview_rgb_center: {r:100,g:100,b:100},    //color of the center of the flower for preview
        preview_rgb_petal:  {r:200,g:200,b:200},    //color of the petals of the flower for preview
        draw_rgb_center:    {r:234,g:220,b:66},     //color of the center of the flower for drawing
        aura_opacity:       0.3,                    //opacity of the aura of the flower.
    }
    
    

    //TURNS DATA
    turn = {
        count:          1,  //actual turn || a turn is PLAYER1 + PLAYER2 play !
        max:            20, //total of turn
        player_turn:    1,  //1 or 2 (who starts) /!\ The game is considered ended when player 2 do the last turn. Meaning setting it to 2 will remove one turn to the first player unless the engine is changed.
    };
    

    
    //RULES VALUES
    rules = {
        max_stem_length:        8,              //maximum length that can be reached by a stem
        dice:                   {min:3,max:6},  //range of the dice. (dice.max <= max_stem_length-1) must be TRUE ! (all values not respecting that condition will not be fully used)
        
        bonus:{
            touching_opponent_side: 5,              //bonus when the player touch the opposite side of the grid
            flower_creation:        2,              //bonus when a flower is created
        },

        stolen_point_by_aura:   1,              //points stolen by the player per case where his aura touch the opponent stem
    };
    
    

    
    
    //MESSAGES TO SEND IN-GAME
    SendMessage = {//messages that can be sent by the game
        Bonus: function(player, flower_bonus, opponent_side_bonus, stolen_by_aura) {
            
            if (player!==1 && player!==2)               {console.error("[Plant]{SendMessage.Bonus} Invalid argument for parameter 'player' : expected 1 or 2, got "+player); return;}
            if (isFinite(flower_bonus)==false)          {console.error("[Plant]{SendMessage.Bonus} Invalid argument for parameter 'flower_bonus' : expected a number, got "+flower_bonus); return;}
            if (isFinite(opponent_side_bonus)==false)   {console.error("[Plant]{SendMessage.Bonus} Invalid argument for parameter 'opponent_side_bonus' : expected a number, got "+opponent_side_bonus); return;}
            if (isFinite(stolen_by_aura)==false)        {console.error("[Plant]{SendMessage.Bonus} Invalid argument for parameter 'stolen_by_aura' : expected a number, got "+stolen_by_aura); return;}
            
            var bonus_message_template = options.language.game_message.bonus;
            var bonus_message = bonus_message_template.replace("[PLAYER]",player).replace("[FLOWER_BONUS]",flower_bonus).replace("[OPPONENT_SIDE_BONUS]",opponent_side_bonus).replace("[STOLEN_BY_AURA]",stolen_by_aura);
            
            HTML.game.display.message.innerHTML = bonus_message;
        },
        ClearMessage:    function() {HTML.game.display.message.innerHTML = "";},
        DoubleLeftRight: function() {HTML.game.display.message.innerHTML = options.language.game_message.double_left_right;},
        FlowerStart:     function() {HTML.game.display.message.innerHTML = options.language.game_message.flower_start;},
        MaxStemLength:   function() {HTML.game.display.message.innerHTML = options.language.game_message.max_stem_length;},
        NoMovementsLeft: function() {HTML.game.display.message.innerHTML = options.language.game_message.no_movements_left;},
        NotPlayerCase:   function() {HTML.game.display.message.innerHTML = options.language.game_message.not_player_case;},
        OpponentCase:    function() {HTML.game.display.message.innerHTML = options.language.game_message.opponent_case;},
        OutsideLimits:   function() {HTML.game.display.message.innerHTML = options.language.game_message.outside_limits;},
        ProtectedArea:   function() {HTML.game.display.message.innerHTML = options.language.game_message.protected_area;},
    };
    
    SendMessage.ClearMessage();
    
    
    






    //+--------------------+
    //|  TILEMAP CREATION  |
    //+--------------------+
    
    CreateTilemap();
    
    //CREATE COLLISIONS FOR THE START POINTS
    //======================================

    //PLAYER 1
    //center
    tilemap[player1.x-1][player1.y-1].player =      1;
    tilemap[player1.x-1][player1.y-1].item_type =   "line";
    tilemap[player1.x-1][player1.y-1].connect.d =   1;
    //left
    tilemap[Math.floor(  player1.x * 1/2  )-1][player1.y-1].player =    1;
    tilemap[Math.floor(  player1.x * 1/2  )-1][player1.y-1].item_type = "line";
    tilemap[Math.floor(  player1.x * 1/2  )-1][player1.y-1].connect.d = 1;
    //right
    tilemap[Math.ceil(  player1.x * 3/2  )-1][player1.y-1].player = 1   ;
    tilemap[Math.ceil(  player1.x * 3/2  )-1][player1.y-1].item_type = "line";
    tilemap[Math.ceil(  player1.x * 3/2  )-1][player1.y-1].connect.d = 1;

    //FOR EVERY -1 IN TILEMAP : coordinates start from 1 while arrays starts from 0. -1 make so it goes from coordinates to the array index.



    //PLAYER 2
    //center
    tilemap[player2.x-1][player2.y-1].player =      2;
    tilemap[player2.x-1][player2.y-1].item_type =   "line";
    tilemap[player2.x-1][player2.y-1].connect.u =   1;
    //left
    tilemap[Math.floor(  player2.x * 1/2  )-1][player2.y-1].player =    2;
    tilemap[Math.floor(  player2.x * 1/2  )-1][player2.y-1].item_type = "line";
    tilemap[Math.floor(  player2.x * 1/2  )-1][player2.y-1].connect.u = 1;
    //right
    tilemap[Math.ceil(  player2.x * 3/2  )-1][player2.y-1].player =     2;
    tilemap[Math.ceil(  player2.x * 3/2  )-1][player2.y-1].item_type = "line";
    tilemap[Math.ceil(  player2.x * 3/2  )-1][player2.y-1].connect.u = 1;

    
    
    






    //+--------------------------------+
    //|  HTML ELEMENTS CSS DEFINITION  |
    //+--------------------------------+
    
    //ALL ELEMENTS BUT CANVAS
    HTML.game.layers_handler.style.width = canvas_width+"px";//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    HTML.game.layers_handler.style.height = canvas_height+"px";//HTML.game.layers_handler adapt it's size to main_layer_canvas
    
    HTML.game.player1_interface.style.height = canvas_height+"px";//vvvvvvvvvvvvvvvvvvvvvv
    HTML.game.player1_interface.className = HTML.game.player1_interface.className.replace(" player1_playing","");
    HTML.game.player1_interface.style.marginLeft = (   (window.innerWidth - HTML.game.player1_interface.offsetWidth*2 - canvas_width) / 2   ) + "px";

    HTML.game.player2_interface.style.height = canvas_height+"px";//same height as main_layer_canvas
    HTML.game.player2_interface.className = HTML.game.player2_interface.className.replace(" player2_playing","");
    
    HTML.game.button.start_game.style.display = "initial";
    HTML.game.button.player1.give_random_movement.style.display = "none";
    HTML.game.button.player2.give_random_movement.style.display = "none";
    
    HTML.game.display.player1.movements.style.display = "initial";
    HTML.game.display.player2.movements.style.display = "initial";
    HTML.game.button.new_game.style.display = "none";
    HTML.game.button.back_to_menu.style.display = "none";

    
    
    //CANVAS ELEMENTS CSS DEFINITION (children[0] is main_layer_canvas, children[1] is preview_graph, children[2] is starts_graph)
    
    //vvvvvvvvvvvvvvvvvvv main_layer_canvas css definition to be correctely displayed
    main_layer_canvas.elt.style.border =    `${(grid_border/2)}px solid rgb(${grid.line_color}, ${grid.line_color}, ${grid.line_color})`;//fixs cut lines on layer canvas border. set p5 layer canvas border to line_size/2 with grid rgb
    main_layer_canvas.elt.style.display =   "initial";
    main_layer_canvas.elt.style.position =  "absolute";
    main_layer_canvas.elt.style.top =       0+"px";
    main_layer_canvas.elt.style.left =      0+"px";
    
    //vvvvvvvvvvvvvvvvvvv preview_graph to be perfectly over main_layer_canvas
    preview_graph.elt.style.border =        `${(grid_border/2)}px solid rgb(${grid.line_color}, ${grid.line_color}, ${grid.line_color})`;//fixs cut lines on layer canvas border. set p5 layer canvas border to line_size/2 with grid rgb
    preview_graph.elt.style.display =       "initial";
    preview_graph.elt.style.position =      "absolute";
    preview_graph.elt.style.top =           0+"px";
    preview_graph.elt.style.left =          0+"px";
    
    //vvvvvvvvvvvvvvvvvvv starts_graph to be perfectly over main_layer_canvas
    starts_graph.elt.style.border =         `${(grid_border/2)}px solid rgb(${grid.line_color}, ${grid.line_color}, ${grid.line_color})`;//fixs cut lines on layer canvas border. set p5 layer canvas border to line_size/2 with grid rgb
    starts_graph.elt.style.display =        "initial";
    starts_graph.elt.style.position =       "absolute";
    starts_graph.elt.style.top =            0+"px";
    starts_graph.elt.style.left =           0+"px";

    









    //+--------------------------------+
    //|  HTML ELEMENTS CSS DEFINITION  |
    //+--------------------------------+
    
    //CANVAS ERASED
    main_layer_canvas.clear();
    preview_graph.clear();
    starts_graph.clear();

    //CANVAS ELEMENTS HTML EVENTS
    HTML.game.layers_handler.onclick = function(e) {if (can_test_event) PreviewClick(e);};

    //SET innerHTML OF ELEMENTS
    HTML.game.display.player1.game_result.innerHTML = "";
    HTML.game.display.player2.game_result.innerHTML = "";
    
    //CREATE KEYBOARD LISTENER
    can_test_event = false;
    document.addEventListener("keydown", OnKeyDown);//arrows and enter detection

    
    
    
    
    //END
    
    game_init_ended = true;
    console.timeEnd("game init duration");
    console.info("%cgame init successfuly ended","color:orange; font-weight:bold");
}





function CreateTilemap() {//setup the tilemap database
    tilemap = [];   //tilemap x is the array[x], tilemap y is the array[x][y]. ==> There is "width" arrays of "height" items.
                    //the syntax is the following: tilemap[x][y] = data of case with coordinates: (x,y).
                    
                    //NOTE FOR EVERY -1 IN TILEMAP:
                    //coordinates start from 1 while arrays starts from 0. -1 make so it goes from coordinates to the array index.
    
    
    for (var x = 0; x < grid_size; x++) {
        tilemap[x] = [];
        
        for (var y = 0; y < grid_size; y++) {
            
            tilemap[x][y] = {
                x:              x+1,                    //DEBUG ONLY - coordinates
                y:              y+1,                    //DEBUG ONLY - coordinates
                player:         0,                      //case owner
                item_type:      "none",                 //case type
                connect:        {u:0,d:0,l:0,r:0},      //stems connections with other cases
                analyzed:       false,                  //analyzed for collisions
                forbidden:      {p1:false,p2:false},    //unaccessible to a player
                
                available_movement:{
                    p1: {global:true, up:true,   left:true, right:true}, //set to true because if this is initially to false,
                    p2: {global:true, down:true, left:true, right:true}  //the game didn't even started to analyze that he see
                                                                         //no movements possible anywhere and drop a game end with draw as a result.
                                                                         //Instead on first time each case is analyzed to see if
                                                                         //it has not been taken. Then it will correct to false. 
                }
            };

        }


    }

}





function OnKeyDown(e) {//On key down, if the event can be tested (events not bloqued), execute the function that will use it.
    if (can_test_event) Preview(e);
}








function FirstTerrainDraw() {//what to draw on the first frame of a new game
    //DRAW GRID
    main_layer_canvas.stroke(grid.line_color);//color grid
    main_layer_canvas.strokeWeight(grid_border);//border of grid width
    main_layer_canvas.fill(grid.background_color,grid.background_color,grid.background_color);//background color
    main_layer_canvas.rect(0,0,canvas_width,canvas_height);//background with anti-aliasing
    
    for (line1=0; line1<canvas_width; line1=line1+(canvas_width/grid_size)){//horizontal lines
        main_layer_canvas.line(0,line1,canvas_width,line1);
    }
    
    for (line2=0; line2<canvas_width; line2=line2+(canvas_width/grid_size)){//vertical lines
        main_layer_canvas.line(line2,0,line2,canvas_width);
    }
        

    
    
    
    //INITIAL LINES FOR THE PLAYERS
    main_layer_canvas.strokeWeight(player_line_weight);
            
    //p1
    main_layer_canvas.stroke(player1.rgb.r, player1.rgb.g, player1.rgb.b);//player 1 color
    player1.score = player1.score + 3;
    main_layer_canvas.line( x(player1.x),                         y(player1.y+1),   x(player1.x),                          y(player1.y));//center ||| initial line from outside the canvas to initial pos
    main_layer_canvas.line( x(Math.floor(  player1.x * 1/2  )),   y(player1.y+1),   x(Math.floor(  player1.x * 1/2  )),    y(player1.y));//left
    main_layer_canvas.line( x(Math.ceil(  player1.x * 3/2  )),    y(player1.y+1),   x(Math.ceil(  player1.x * 3/2  )),     y(player1.y));//right
    
    //p2
    main_layer_canvas.stroke(player2.rgb.r, player2.rgb.g, player2.rgb.b);//player 2 color
    player2.score = player2.score + 3;
    main_layer_canvas.line( x(player2.x),                         y(player2.y-1),   x(player2.x),                          y(player2.y));//center ||| initial line from outside the canvas to initial pos
    main_layer_canvas.line( x(Math.floor(  player2.x * 1/2  )),   y(player2.y-1),   x(Math.floor(  player2.x * 1/2  )),    y(player2.y));//left
    main_layer_canvas.line( x(Math.ceil(  player2.x * 3/2  )),    y(player2.y-1),   x(Math.ceil(  player2.x * 3/2  )),     y(player2.y));//right

    
    
    
    
    first_draw = false;//exit first terrain drawing
}

//####################################################################################################################################################################################################################################################
//####################################################################################################################################################################################################################################################
//####################################################################################################################################################################################################################################################
//####################################################################################################################################################################################################################################################






//######################
//#     GAME START     #
//######################

function StartGame() {//starts the game with a display change
    HTML.game.button.start_game.style.display = "none";
    ChangeTurn(1,true);//true means ignore turn count
}












function GetRandomMovement(player) {//give a random value which is the quantity of movements the player can do
    //CHECK ERRORS
    if (player!==1 && player!==2) {console.error("[Plant]{GetRandomMovement} Invalid argument for parameter 'player' : expected 1 or 2, got "+player); return;}
    
    
    if (player==1) {
        player1.dice_count = getRandom(rules.dice.min, rules.dice.max);
        player1.movements_left = player1.dice_count;

        SetLineStart(player1, player1.x, player1.y);

    }
    else if (player==2) {
        player2.dice_count = getRandom(rules.dice.min, rules.dice.max);
        player2.movements_left = player2.dice_count;

        SetLineStart(player2, player2.x, player2.y);

    }
    can_test_event = true;
}









function SetLineStart(player,X,Y) {//set the new line start being drawed in preview. X and Y ARE case coordinates AND ARE NOT PIXEL COORDINATES
    //CHECK ERRORS
    if (typeof player !== 'object'||player==null||player.constructor === Array) {console.error("[Plant]{SetLineStart} Invalid argument for parameter 'player' : expected player1 or player2 database object, got :"); console.log(player); return;}
    if (isFinite(X)==false) {console.error("[Plant]{SetLineStart} Invalid argument for parameter 'X' : expected a number, got "+X); return;}
    if (isFinite(Y)==false) {console.error("[Plant]{SetLineStart} Invalid argument for parameter 'Y' : expected a number, got "+Y); return;}
    
    
    //update coordinates to the new starting point
    player.x = X;
    player.y = Y;
    player.x_start = X;
    player.y_start = Y;
    player.x_preview = X;
    player.y_preview = Y;

    //give movements available
    player.movements_left = player.dice_count;
    
    //erase movements cache
    player.path.preview = [];
    player.path.draw = [];
    player.path.last_preview_movement = "unset";
    
    //prepare for preview line drawing, and place a point where the preview start
    preview_graph.clear();
    preview_graph.stroke(preview_line.color);
    preview_graph.strokeWeight(preview_line.weight*3);
    preview_graph.point(x(X),y(Y));
    
    //enable movement listener
    can_test_event = true;
}










function ChangeTurn(player,ignore_turn) {//switch turn to the player "player". 'ignore_turn' is optional, false by default.
    //CHECK ERRORS
    if (player!==1 && player!==2) {console.error("[Plant]{ChangeTurn} Invalid argument for parameter 'player' : expected 1 or 2, got "+player); return;}
    if (ignore_turn!=undefined && typeof ignore_turn !== "boolean") {console.error("[Plant]{ChangeTurn} Invalid argument for parameter 'ignore_turn' : expected boolean value, got "+ignore_turn); return;}
    if (ignore_turn==undefined) ignore_turn = false;
    
    
    //save the player who it is the turn to play
    turn.player_turn = player;
    
    //update display, roll dice
    if (player==1) {

        HTML.game.player1_interface.className = HTML.game.player1_interface.className+" player1_playing";//add overlay showing it's to that player to play
        HTML.game.player2_interface.className = HTML.game.player2_interface.className.replace(" player2_playing","");//remove that overlay for the other player.
        GetRandomMovement(1);
        if(!ignore_turn) turn.count++;//player 1 toggle turn incrementation, as he plays first.

    }
    else if (player==2) {
        
        HTML.game.player2_interface.className = HTML.game.player2_interface.className+" player2_playing";
        HTML.game.player1_interface.className = HTML.game.player1_interface.className.replace(" player1_playing","");
        GetRandomMovement(2);

    }
    
    //check if the game is ended before the player tries to play
    IsGameEnded(((turn.count == turn.max)&&(ignore_turn)));//set to true if it is the last turn
}








function DisplayStarts() {//displays where the player can start from at his turn
    //erase old points
    starts_graph.clear();

    //draw all points
    for (var i=0; i<grid_size; i++) {
        for (var j=0; j<grid_size; j++) {
            
            //depending of the player who will play, points are drawn accordingly
            if (turn.player_turn == 1     &&     tilemap[i][j].available_movement.p1.global==true) {//if a movement is possible on this case
                starts_graph.stroke( start_point.p1_color.r,  start_point.p1_color.g,  start_point.p1_color.b );
                starts_graph.strokeWeight(start_point.weight);
                starts_graph.point(x(i+1),y(j+1));

            }
            if (turn.player_turn == 2     &&     tilemap[i][j].available_movement.p2.global==true) {
                starts_graph.stroke( start_point.p2_color.r,  start_point.p2_color.g,  start_point.p2_color.b );
                starts_graph.strokeWeight(start_point.weight);
                starts_graph.point(x(i+1),y(j+1));
            
            }



        }
    }


}







//####################################################################################################################################################################################################################################################
//####################################################################################################################################################################################################################################################
//####################################################################################################################################################################################################################################################
//####################################################################################################################################################################################################################################################

//#################################################
//#     MOVEMENT VERIFICATION, AND VALIDATION     #
//#################################################



function Preview(e) {//manage previewing by receiving key event data (e). when valided, draw the final choice and change turn
    can_test_event = false;//disable listener
    
    
    
    
    //+-------------------------+
    //|  PLAYER 1 VERIFICATION  |
    //+-------------------------+
    
    if ( turn.player_turn == 1 ) {//if it's turn to player 1
        if ( isKey(options.controls.up, e.key) ) {//if arrow up
            if ( player1.movements_left !== 0 ) {//if player still have movements available
                if ( GetStemLength(player1) < rules.max_stem_length ) {//if the stem isn't to it's max allowed length
                    if ( !OnFlower(player1.x_preview, player1.y_preview) ) {//if the player is not trying to start from a flower
                        if ( !OnBorder("top", player1.y_preview) ) {//cannot go outside the grid
                            if ( !CaseTaken(player1.x_preview, player1.y_preview, "to_top") ) {//tile not taken
                                if ( !CaseForbiddenTo(1, player1.x_preview, player1.y_preview, "to_top") ) {//if the case isn't forbidden to the player because of opponent flower aura.
                                
                                    DoPreviewMovement(player1, "U1");
                                    SendMessage.ClearMessage();//erase obsolete information in the bottom interface

                                } else {
                                    can_test_event = true;//enable listener
                                    SendMessage.ProtectedArea();
                                }
                            } else {
                                can_test_event = true;//enable listener
                                SendMessage.OpponentCase();
                            }
                        } else {
                            can_test_event = true;//enable listener
                            SendMessage.OutsideLimits();
                        }
                    } else {
                        can_test_event = true;//enable listener
                        SendMessage.FlowerStart();
                    }
                } else {
                    can_test_event = true;//enable listener
                    SendMessage.MaxStemLength();
                }
            } else {
                can_test_event = true;//enable listener
                SendMessage.NoMovementsLeft();
            }
        } else if ( isKey(options.controls.left, e.key) ) {//if arrow left
            if ( player1.movements_left !== 0 ) {//if player still have movements available
                if ( GetStemLength(player1) < rules.max_stem_length ) {//if the stem isn't to it's max allowed length
                    if ( !OnFlower(player1.x_preview, player1.y_preview) ) {//if the player is not trying to start from a flower
                        if ( !TwiceHorizontalFor(player1) ) {//cannot draw on him, cannot draw twice left
                            if ( !OnBorder("left", player1.x_preview) ) {//cannot go outside the grid
                                if ( !CaseTaken(player1.x_preview, player1.y_preview, "to_left") ) {//tile not taken
                                    if ( !CaseForbiddenTo(1, player1.x_preview, player1.y_preview, "to_left") ) {//if the case isn't forbidden to the player because of opponent flower aura.

                                        DoPreviewMovement(player1, "L1");
                                        SendMessage.ClearMessage();//erase obsolete information in the bottom interface

                                    } else {
                                        can_test_event = true;//enable listener
                                        SendMessage.ProtectedArea();
                                    }
                                } else {
                                    can_test_event = true;
                                    SendMessage.OpponentCase();
                                }
                            } else {
                                can_test_event = true;
                                SendMessage.OutsideLimits();
                            }
                        } else {
                            can_test_event = true;//enable listener
                            SendMessage.DoubleLeftRight();
                        }
                    } else {
                        can_test_event = true;//enable listener
                        SendMessage.FlowerStart();
                    }
                } else {
                    can_test_event = true;
                    SendMessage.MaxStemLength();
                }
            } else {
                can_test_event = true;
                SendMessage.NoMovementsLeft();
            }
        } else if ( isKey(options.controls.right, e.key) ) {//if arrow right
            if ( player1.movements_left !== 0 ) {//if player still have movements available
                if ( GetStemLength(player1) < rules.max_stem_length ) {//if the stem isn't to it's max allowed length
                    if ( !OnFlower(player1.x_preview, player1.y_preview) ) {//if the player is not trying to start from a flower
                        if ( !TwiceHorizontalFor(player1) ) {//cannot draw on him, cannot draw twice right
                            if ( !OnBorder("right", player1.x_preview) ) {//cannot go outside the grid
                                if ( !CaseTaken(player1.x_preview, player1.y_preview, "to_right") ) {//tile not taken
                                    if ( !CaseForbiddenTo(1, player1.x_preview, player1.y_preview, "to_right") ) {//if the case isn't forbidden to the player because of opponent flower aura.

                                        DoPreviewMovement(player1, "R1");
                                        SendMessage.ClearMessage();//erase obsolete information in the bottom interface

                                    } else {
                                        can_test_event = true;//enable listener
                                        SendMessage.ProtectedArea();
                                    }
                                } else {
                                    can_test_event = true;
                                    SendMessage.OpponentCase();
                                }
                            } else {
                                can_test_event = true;
                                SendMessage.OutsideLimits();
                            }
                        } else {
                            can_test_event = true;//enable listener
                            SendMessage.DoubleLeftRight();
                        }
                    } else {
                        can_test_event = true;//enable listener
                        SendMessage.FlowerStart();
                    }
                } else {
                    can_test_event = true;
                    SendMessage.MaxStemLength();
                }
            } else {
                can_test_event = true;
                SendMessage.NoMovementsLeft();
            }
        } else if ( isKey(options.controls.validate, e.key) ) {//if enter

            can_test_event = false;//disable listener
            DoMovement(player1);
            ChangeTurn(2);

        } else {
            can_test_event = true;
        }
    }
    
    
    
    
    
    
    //+-------------------------+
    //|  PLAYER 2 VERIFICATION  |
    //+-------------------------+
    
    else if ( turn.player_turn == 2 ) {//if it's turn to player 2
        if ( isKey(options.controls.down, e.key) ) {//if arrow down
            if ( player2.movements_left !== 0 ) {//if player still have movements available
                if ( GetStemLength(player2) < rules.max_stem_length ) {//if the stem isn't to it's max allowed length
                    if ( !OnFlower(player2.x_preview, player2.y_preview) ) {//if the player is not trying to start from a flower
                        if ( !OnBorder("bottom", player2.y_preview) ) {//cannot go outside the grid
                            if ( !CaseTaken(player2.x_preview, player2.y_preview, "to_bottom") ) {//tile not taken
                                if ( !CaseForbiddenTo(2, player2.x_preview, player2.y_preview, "to_bottom") ) {//if the case isn't forbidden to the player because of opponent flower aura.

                                    DoPreviewMovement(player2, "D2");
                                    SendMessage.ClearMessage();//erase obsolete information in the bottom interface

                                } else {
                                    can_test_event = true;//enable listener
                                    SendMessage.ProtectedArea();
                                }
                            } else {
                                can_test_event = true;
                                SendMessage.OpponentCase();
                            }
                        } else {
                            can_test_event = true;
                            SendMessage.OutsideLimits();
                        }
                    } else {
                        can_test_event = true;//enable listener
                        SendMessage.FlowerStart();
                    }
                } else {
                    can_test_event = true;//enable listener
                    SendMessage.MaxStemLength();
                }
            } else {
                can_test_event = true;
                SendMessage.NoMovementsLeft();
            }
        } else if ( isKey(options.controls.left, e.key) ) {//if arrow left
            if ( player2.movements_left !== 0 ) {//if player still have movements available
                if ( GetStemLength(player2) < rules.max_stem_length ) {//if the stem isn't to it's max allowed length
                    if ( !OnFlower(player2.x_preview, player2.y_preview) ) {//if the player is not trying to start from a flower
                        if ( !TwiceHorizontalFor(player2) ) {//cannot draw on him, cannot draw twice left
                            if ( !OnBorder("left", player2.x_preview) ) {//cannot go outside the grid
                                if ( !CaseTaken(player2.x_preview, player2.y_preview, "to_left") ) {//tile not taken
                                    if ( !CaseForbiddenTo(2, player2.x_preview, player2.y_preview, "to_left") ) {//if the case isn't forbidden to the player because of opponent flower aura.

                                        DoPreviewMovement(player2, "L2");
                                        SendMessage.ClearMessage();//erase obsolete information in the bottom interface

                                    } else {
                                        can_test_event = true;//enable listener
                                        SendMessage.ProtectedArea();
                                    }
                                } else {
                                    can_test_event = true;
                                    SendMessage.OpponentCase();
                                }
                            } else {
                                can_test_event = true;
                                SendMessage.OutsideLimits();
                            }
                        } else {
                            can_test_event = true;//enable listener
                            SendMessage.DoubleLeftRight();
                        }
                    } else {
                        can_test_event = true;//enable listener
                        SendMessage.FlowerStart();
                    }
                } else {
                    can_test_event = true;
                    SendMessage.MaxStemLength();
                }
            } else {
                can_test_event = true;
                SendMessage.NoMovementsLeft();
            }
        } else if ( isKey(options.controls.right, e.key) ) {//if arrow right
            if ( player2.movements_left !== 0 ) {//if player still have movements available
                if ( GetStemLength(player2) < rules.max_stem_length ) {//if the stem isn't to it's max allowed length
                    if ( !OnFlower(player2.x_preview, player2.y_preview) ) {//if the player is not trying to start from a flower
                        if (  !TwiceHorizontalFor(player2) ) {//cannot draw on him, cannot draw twice right
                            if ( !OnBorder("right", player2.x_preview) ) {//cannot go outside the grid
                                if ( !CaseTaken(player2.x_preview, player2.y_preview, "to_right") ) {//tile not taken
                                    if ( !CaseForbiddenTo(2, player2.x_preview, player2.y_preview, "to_right") ) {//if the case isn't forbidden to the player because of opponent flower aura.

                                        DoPreviewMovement(player2, "R2");
                                        SendMessage.ClearMessage();//erase obsolete information in the bottom interface

                                    } else {
                                        can_test_event = true;//enable listener
                                        SendMessage.ProtectedArea();
                                    }
                                } else {
                                    can_test_event = true;
                                    SendMessage.OpponentCase();
                                }
                            } else {
                                can_test_event = true;
                                SendMessage.OutsideLimits();
                            }
                        } else {
                            can_test_event = true;//enable listener
                            SendMessage.DoubleLeftRight();
                        }
                    } else {
                        can_test_event = true;//enable listener
                        SendMessage.FlowerStart();
                    }
                } else {
                    can_test_event = true;
                    SendMessage.MaxStemLength();
                }
            } else {
                can_test_event = true;
                SendMessage.NoMovementsLeft();
            }
        } else if ( isKey(options.controls.validate, e.key) ) {//if enter

            can_test_event = false;
            DoMovement(player2);
            ChangeTurn(1, !(turn.count < turn.max) );//if not last turn, run as normal (1,false), but if last turn, does not increment (1,true)
        
        } else {
            can_test_event = true;
        }
    }else{
        can_test_event = true;
    }
}




//SOME OF THE FUNCTIONS FOR THE CONDITIONS (used by OnePlayerBloqued() too)
//=========================================================================

function isKey(key, event) {//returns if the event matches the asked key on the keyboard
    return (   (event === key) || (event === key.toLowerCase() ) || (event === key.toUpperCase() )   );
}



function OnFlower(X, Y) {//returns if there is a flower on the given case
    return tilemap[X-1][Y-1].item_type == "flower";
}



function TwiceHorizontalFor(player) {//returns if the given player tries to do 2 horizontal movements one next to each other
    var x = player.x_preview;
    var y = player.y_preview;
    return (
        player.path.last_preview_movement == "L1"//verification on preview
        || player.path.last_preview_movement == "L2"
        || player.path.last_preview_movement == "R1"
        || player.path.last_preview_movement == "R2"
        || TwiceHorizontalAt(x,y)//verification on existing movements
    )
}



function TwiceHorizontalAt(X,Y) {//returns if the given case is connected to the left or the right
    return (tilemap[X-1][Y-1].connect.l == 1   ||   tilemap[X-1][Y-1].connect.r == 1);
}



function OnBorder(side, value) {//returns if the coordinate is on the specified side of the grid (on the border)
    //console.log(`On ${side} side, with the coordinate ${value}, if top/left, onBorder=${(value <= 1)}; if bottom/right, onBorder=${(value >= grid_size)}`);
    switch (side) {
        case "top":
        case "left": return (value <= 1);
        case "bottom":
        case "right": return (value >= grid_size);
        default: throw `OnBorder: ${side} isn't a known side of the grid (top, bottom, left, right)`;
    }
}



function CaseTaken(x, y, side) {//returns if the case to the side of the coordinate is taken or not (given that the case exists, or it will crash the game)
    var grid_case = Case(side, x, y);
    
    return ( (grid_case.player==1) || (grid_case.player==2) );
}

function CaseForbiddenTo(player_id, x, y, side) {//returns if the case to the side of the coordinates is taken by the opponent aura. (given that the case exists, or it will crash the game)
    var grid_case = Case(side, x, y);
    
    switch (player_id) {
        case 1:
            return (grid_case.forbidden.p1);

        case 2:
            return (grid_case.forbidden.p2);
    }
}

function Case(side, x, y) {//returns the case to the side given from the given coordinates (tilemap data)
    switch (side) {
        case "to_top":
            return tilemap[x-1]    [y-1 -1];

        case "to_left":
            return tilemap[x-1 -1] [y-1];  

        case "to_bottom":
            return tilemap[x-1]    [y-1 +1];

        case "to_right":
            return tilemap[x-1 +1] [y-1];

    }
}



//MOVEMENT EXECUTION
//==================


function DoPreviewMovement(player, movement) {//do the movement in preview mode requested by the player in the given direction

    //set stroke
    preview_graph.strokeWeight(preview_line.weight);//set preview line weight
    preview_graph.stroke(preview_line.color);//set preview line color

    //add the movement in the database
    player.path.preview.push(movement);//set in which direction to draw preview
    player.path.last_preview_movement = movement;
    player.path.draw.push(movement);//add movement to final draw list
    
    //draw the movement
    Move(player.path.preview, "preview");//draw preview
    
    //clear the movement from the cache, and remove one movement from the movements left.
    player.path.preview = [];//clear preview movement
    player.movements_left--;//reduce from one the count of movements left

    //re-enable listener now that the event has been processed (action speed is limited to framerate speed)
    setTimeout(function() {can_test_event = true;},framerate);

}



function DoMovement(player) {//draw the final player action that have been previewed.
    
    //erase preview
    preview_graph.clear();//clear preview line from grid

    //set stroke
    main_layer_canvas.strokeWeight(player_line_weight);//set line stroke weight
    main_layer_canvas.stroke(player.rgb.r,  player.rgb.g,  player.rgb.b);//set line color
    
    //do movement
    Move(player.path.draw, "draw");//draw final path
    
    //update player database
    player.path.draw = [];//clear path for next run
    player.x_preview = player.x;//reset x_preview to new pos
    player.y_preview = player.y;//reset y_preview to new pos
    player.movements_left = "-";//reset movements left
}



//####################################################################################################################################################################################################################################################
//####################################################################################################################################################################################################################################################
//####################################################################################################################################################################################################################################################
//####################################################################################################################################################################################################################################################












//CLICK EVENT ON GRID
//===================


function PreviewClick(e) {//verify if where the player clicked can be a stem start and if it is, run the function to set the start here.
    
    can_test_event = false;//disable event listener while this event is applied
    
    //VARIABLES
    //get the top layer canvas html element (all canvas have the same size), then get the position of it in the window
    var cvs = HTML.game.layers_handler.children[0];
    var cvs_rect = cvs.getBoundingClientRect();

    //calculate the click position in pixels
    var mouse_click_x = e.clientX - cvs_rect.left;
    var mouse_click_y = e.clientY - cvs_rect.top;

    //get the click coordinates on the grid
    var mouse_click_case_x = Math.round(toX(mouse_click_x));
    var mouse_click_case_y = Math.round(toY(mouse_click_y));
    
    //event verification
    switch (turn.player_turn) {
        case 1: 
            CheckClickValidityFor(player1, 1, mouse_click_case_x, mouse_click_case_y); break;
        case 2:
            CheckClickValidityFor(player2, 2, mouse_click_case_x, mouse_click_case_y); break;
        default:
            can_test_event = true;

    }
}



function CheckClickValidityFor(player,  player_id, case_x,  case_y) {//verify if the given click is valid for the given player, and act the position change if it is valid

    if ( CaseBelongsTo( case_x, case_y, player_id) ) {//placing the player on the given case only if this case already belong to the player
        SendMessage.ClearMessage();
        SetLineStart(player, case_x, case_y);
    } else {
        SendMessage.NotPlayerCase();
        can_test_event = true;
    }

}



function CaseBelongsTo(X, Y, player_id) {//returns if the given case belongs to the given player
    return (tilemap[X-1][Y-1].player == player_id);
}



















//EXECUTE MOVEMENT
//================

function Move(path, type) {//draw the path as a stem starting from the player coordinates on the terrain
    
    if (path.constructor !== Array) {console.error("[Plant]{Move} Invalid argument for parameter 'player' : expected Array, got "+player); return;}
    if (!(type=="draw"||type=="preview")) {console.error("[Plant]{Move} Invalid argument for parameter 'type' : expected string 'draw' or 'preview', got "+type); return;}
    
    
    if (path.length==0) return;
    //That means the function were called whereas there is no action to do
    //("path" don't have any stored movements), so it cancels the function.
    
    //get owner
    var is_player1_path = (path[0].split("")[1] == 1); //take the first action of the path, look at his second character which gives
    var is_player2_path = (path[0].split("")[1] == 2); //the player acting this action, and see to who it belongs


    //UPDATE DATA
    //===========

    if (type === "draw") {

        //Reset data about the player preview start, because at this point,
        //it becomes obsolete and can create problems for further analysis (on stem length count for example)
                
        if (is_player1_path) {//path belongs to player 1
            //reset preview start coordinates, and last bonus data
            ResetPreviewAndBonusFor(player1);

        } else if (is_player2_path) {//path belongs to player 2
            ResetPreviewAndBonusFor(player2);
        }
    
    }
    




    //DRAW THE PATH
    //=============
    
    for (var i=0; i<path.length; i++) {

        //UPDATE SCORE
        if (is_player1_path && type === "draw") player1.score++;
        if (is_player2_path && type === "draw") player2.score++;


        //CREATE STEM PART
        //NOTE : player 1 CAN'T go DOWN, player 2 CAN'T go UP !
        switch (path[i]) {
            case "U1"://player 1 up
                CreateStemPartFor(player1, 1, "up", type);
                break
            
            case "L1"://player 1 left
                CreateStemPartFor(player1, 1, "left", type);
                break

            case "R1"://player 1 right
                CreateStemPartFor(player1, 1, "right", type);
                break

            case "L2"://player 2 left
                CreateStemPartFor(player2, 2, "left", type);
                break

            case "R2"://player 2 right
                CreateStemPartFor(player2, 2, "right", type);
                break

            case "D2"://player 2 down;
                CreateStemPartFor(player2, 2, "down", type);
                break

        }
            
        

        //FLOWER CREATION IF STEM LENGHT = rules.max_stem_length 
        var use_preview = (type === "preview")? true : false;

        if (is_player1_path    &&    (GetStemLength(player1, use_preview) == rules.max_stem_length) ) { //false => do not take preview in count
            CreateFlowerFor(player1, type);
        }

        if (is_player2_path    &&    (GetStemLength(player2, use_preview) == rules.max_stem_length) ) {
            CreateFlowerFor(player2, type);
        }

        
        
        //COUNT OPPONENT SIDE BONUS IF THE STEM IS NOW TOUCHING THIS SIDE 
        if (type === "draw") {
            
            if (is_player1_path && player1.y==1) {

                player1.score += rules.bonus.touching_opponent_side;
                player1.last_bonus.opponent_side += rules.bonus.touching_opponent_side;

            }

            if (is_player2_path && player2.y==grid_size) {

                player2.score += rules.bonus.touching_opponent_side;
                player2.last_bonus.opponent_side += rules.bonus.touching_opponent_side;

            }

        }
        
    
    
    }




    //DISPLAY BONUS OBTAINED
    //======================

    //inform the player about the bonus he got
    if (type === "draw") {
        
        if (is_player1_path) {
            SendMessage.Bonus(
                1,
                player1.last_bonus.flower,
                player1.last_bonus.opponent_side,
                player1.last_bonus.stolen_by_aura
            );
        }

        if (is_player2_path) {
            SendMessage.Bonus(
                2,
                player2.last_bonus.flower,
                player2.last_bonus.opponent_side,
                player2.last_bonus.stolen_by_aura
            );
        }

    }



}



function ResetPreviewAndBonusFor(player) {//reset preview starting point and the last bonus values for the given player
    player.x_start = 0;
    player.y_start = 0;

    player.last_bonus.flower = 0;
    player.last_bonus.opponent_side = 0;
    player.last_bonus.stolen_by_aura = 0;
}



function CreateStemPartFor(player, player_id, direction, type) {//do one movement of the path from Move(), for the given player in the given direction
    //get starting point and use the right canvas
    var X, Y;
    var new_X, new_Y;
    var cvs;
    if (type === "draw") {
        X = player.x;
        Y = player.y;
        cvs = main_layer_canvas;

    }else if (type === "preview") {
        X = player.x_preview;
        Y = player.y_preview;
        cvs = preview_graph;
    }
    

    //apply the action to the database and get new coordinates
    switch (direction) {
        
        case "up":
            //get new coordinates
            new_X = X;
            new_Y = Y-1;
            if (type === "draw") {
                //set new connection on starting case
                tilemap[X-1][Y-1].connect.u = 1;
                //update the player coordinates
                player.y--;
                //set new connection on destination case
                tilemap[new_X-1][new_Y-1].connect.d = 1;
            }
            //update the player preview coordinates if in preview mode
            if (type === "preview") {player.y_preview--};
            break

        
        case "down":
            new_X = X;
            new_Y = Y+1;
            if (type === "draw") {
                tilemap[X-1][Y-1].connect.d = 1;
                player.y++;
                tilemap[new_X-1][new_Y-1].connect.u = 1;
            }
            if (type === "preview") {player.y_preview++};
            break
            
        
        case "left":
            new_X = X-1;
            new_Y = Y;
            if (type === "draw") {
                tilemap[X-1][Y-1].connect.l = 1;
                player.x--;
                tilemap[new_X-1][new_Y-1].connect.r = 1;
            }
            if (type === "preview") {player.x_preview--};
            break

        
        case "right":
            new_X = X+1;
            new_Y = Y;
            if (type === "draw") {
                tilemap[X-1][Y-1].connect.r = 1;
                player.x++;
                tilemap[new_X-1][new_Y-1].connect.l = 1;
            }
            if (type === "preview") {player.x_preview++};
            break

    }

    //draw the stem
    cvs.line(x(X), y(Y), x(new_X), y(new_Y));
    
    //claim the destination case
    if (type === "draw") {
        tilemap[new_X-1][new_Y-1].player = player_id;
        tilemap[new_X-1][new_Y-1].item_type = "line";
    }

}




function CreateFlowerFor(player, type) {//creates a flower for the given player in the given condition (type)
    
    //DEFINITIONS
    var cvs;
    var center_color;
    var petal_color;
    var X, Y;

    //adapt the process to the given type
    if (type === "draw") {
        cvs = "draw_canvas";
        center_color = flower.draw_rgb_center;
        petal_color = player.rgb;
        X = player.x;
        Y = player.y

    } else if (type === "preview") {
        cvs = "preview_graph";
        center_color = flower.preview_rgb_center;
        petal_color = flower.preview_rgb_petal;
        X = player.x_preview;
        Y = player.y_preview;
    }
    

    //CREATION
    //create the flower
    DrawFlower(x(X), y(Y), flower.radius, center_color, petal_color, cvs);
    SetFlowerAura(player, X, Y, cvs);
    
    if (type === "draw") {
        //update tilemap
        tilemap[X-1][Y-1].item_type = "flower";

        //update player database
        player.score += rules.bonus.flower_creation;
        player.last_bonus.flower += rules.bonus.flower_creation;
    }
}


function SetFlowerAura(player,X,Y,cvs) {//(WARNING : reset stroke !!!) set flower aura, in tilemap, and graphically, to block opponent from taking these cases.
    
    //error checking
    if (typeof player !== 'object' || player==null || player.constructor === Array) {console.error("[Plant]{SetFlowerAura} Invalid argument for parameter 'player' : expected player1 or player2 database object, got :"); console.log(player); return;}
    if (isFinite(X) == false)                                                       {console.error("[Plant]{SetFlowerAura} Invalid argument for parameter 'X' : expected a number, got "+X); return;}
    if (isFinite(Y) == false)                                                       {console.error("[Plant]{SetFlowerAura} Invalid argument for parameter 'Y' : expected a number, got "+Y); return;}
    if (!(cvs=="draw_canvas" || cvs=="preview_graph"))                              {console.error("[Plant]{SetFlowerAura} Invalid argument for parameter 'cvs' : expected string 'draw_canvas' or 'preview_graph', got "+cvs); return;}
    
    
    var aura = [".",".","#",".",".",
                ".","#","#","#",".",
                "#","#","#","#","#",
                ".","#","#","#",".",
                ".",".","#",".",".",];//drawn aura
    var aura_settings = {
        weight:5,
        r_from_center:2,//grid r, not counting center itself.
    };


    //AURA CREATION
    for (var i=0; i<aura.length; i++) {//for each case of the aura map


        var aura_x = i % aura_settings.weight             - aura_settings.r_from_center;//from aura center
        var aura_y = Math.floor(i / aura_settings.weight) - aura_settings.r_from_center;//from aura center
        
        if (aura[i]=="#" && WithinTerrain(X+aura_x,Y+aura_y) == true) {//if there is an aura to the map index AND if it's coordinate is within the terrain limits
            
            if (cvs=="draw_canvas") {

                //forbid case to opponent
                if (player == player1) {tilemap[X+aura_x-1][Y+aura_y-1].forbidden.p2 = true;}
                else {tilemap[X+aura_x-1][Y+aura_y-1].forbidden.p1=true;}
                
                //if the aura touch the opponent's plant he steal points as defined by rules.stolen_point_by_aura.
                if (tilemap[X+aura_x-1][Y+aura_y-1].player==2) {
                    player1.score                     += rules.stolen_point_by_aura;
                    player1.last_bonus.stolen_by_aura += rules.stolen_point_by_aura;
                    player2.score                     -= rules.stolen_point_by_aura;
                }
                else if (tilemap[X+aura_x-1][Y+aura_y-1].player==1) {
                    player2.score                     += rules.stolen_point_by_aura;
                    player2.last_bonus.stolen_by_aura += rules.stolen_point_by_aura;
                    player1.score                     -= rules.stolen_point_by_aura;
                }

                //draw aura tile.
                push();
                main_layer_canvas.strokeWeight(0.5);
                main_layer_canvas.fill(`rgba(${player.rgb.r}, ${player.rgb.g}, ${player.rgb.b},${flower.aura_opacity})`);
                main_layer_canvas.rect(x(X+aura_x-0.5), y(Y+aura_y-0.5), case_size, case_size);//-0.5 to draw rect from top-left-corner
                pop();

            } else if (cvs=="preview_graph") {
                
                //draw aura tile.
                push();
                preview_graph.strokeWeight(0.5);
                preview_graph.fill("rgba("+preview_line.color+","+preview_line.color+","+preview_line.color+",0.4)");
                preview_graph.rect(x(X+aura_x-0.5), y(Y+aura_y-0.5), case_size, case_size);//-0.5 to draw rect from top-left-corner
                pop();

            }
        }


    }
}




function WithinTerrain(X,Y) {//verify if the specified coordinate is within the terrain limits (if it is not it can lead to errors, which is the reason to add this function)
    //error check
    if (isFinite(X)==false) {console.error("[Plant]{WithinTerrain} Invalid argument for parameter 'X' : expected a number, got "+X); return;}
    if (isFinite(Y)==false) {console.error("[Plant]{WithinTerrain} Invalid argument for parameter 'Y' : expected a number, got "+Y); return;}
    
    return (X>0   &&   X<=grid_size   &&   Y>0   &&   Y<=grid_size)?   true : false;
}


























//STEM LENGTH CALCULATION
//=======================

function GetConnectionsCount(X,Y) {//count connections for a specified case and return the result.
    //error checking
    if (isFinite(X)==false) {console.error("[Plant]{GetConnectionsCount} Invalid argument for parameter 'X' : expected a number, got "+X); return;}
    if (isFinite(Y)==false) {console.error("[Plant]{GetConnectionsCount} Invalid argument for parameter 'Y' : expected a number, got "+Y); return;}
    
    //counting
    var connections = 0;
    if (tilemap[X-1][Y-1].connect.u == 1) connections++;
    if (tilemap[X-1][Y-1].connect.d == 1) connections++;
    if (tilemap[X-1][Y-1].connect.l == 1) connections++;
    if (tilemap[X-1][Y-1].connect.r == 1) connections++;
    
    return connections;
}



function GetStemLength(player,use_preview,forced_X,forced_Y) {//return length of the stem drawn or continued. 'use_preview', 'forced_X' and 'forced_y' are optional. Their default are respectively : true, player.x, player.y .
    
    //error checking
    if (typeof player !== 'object' || player == null || player.constructor === Array)   {console.error("[Plant]{GetStemLength} Invalid argument for parameter 'player' : expected player1 or player2 database object, got :"); console.log(player); return;}
    if (use_preview != undefined && typeof use_preview !== "boolean")                   {console.error("[Plant]{GetStemLength} Invalid argument for parameter 'use_preview' : expected boolean value, got "+use_preview); return;}
    if (forced_X != undefined && isFinite(forced_X) == false)                           {console.error("[Plant]{GetStemLength} Invalid argument for parameter 'forced_X' : expected a number, got "+forced_X); return;}
    if (forced_Y != undefined && isFinite(forced_Y) == false)                           {console.error("[Plant]{GetStemLength} Invalid argument for parameter 'forced_Y' : expected a number, got "+forced_Y); return;}
    
    //default values
    if (use_preview == undefined) use_preview = true;
    





    //initialisation of the variables
    var stem_count = (use_preview)?  player.path.draw.length : 0;//length, take in count the preview length if needed.
    var x_search = forced_X || player.x;//x analyzed
    var y_search = forced_Y || player.y;//y analyzed
    
    var x_search_last;//last x analyzed
    switch (player.path.draw[0]) {
        case "L1" : x_search_last = x_search-1; break;
        case "R1" : x_search_last = x_search+1; break;
        case "L2" : x_search_last = x_search-1; break;
        case "R2" : x_search_last = x_search+1; break;
        default :   x_search_last = x_search;   break;
    }

    var y_search_last;//last y analyzed
    switch (player.path.draw[0]) {
        case "U1" : y_search_last = y_search-1;
        case "D2" : y_search_last = y_search+1;
        default : y_search_last = y_search;
    }

    var connections_count = 0;//count of connections of a case (counting possible top/bottom/left/right connections)
    var search_moved = false;//if the case to search has been changed and moved (x_search = -- or ++ / y_search = -- or ++)
    var i_safe = 0;//while iterations. A security to prevent hard crash.
    
    //FOR DEBUG
    //console.log(x_search,y_search, "stem =", stem_count);






    //#########
    //FIND PATH
    //#########

    while (connections_count<3 && i_safe<200) {
        i_safe++;
        stem_count++;
        connections_count = 0;

        //COUNT CONNECTIONS
        connections_count = GetConnectionsCount(x_search,y_search);

        //UPDATE SEARCH COORDINATES
        var x_temp = x_search;//saves temporarily the actual x and y to then update x_search_last
        var y_temp = y_search;
        var x_compare = x_search;//saves the x and y coordinates separately, so "?_search" changes if a "if" is true doesn't affect others "if".
        var y_compare = y_search;
        tilemap[x_search-1][y_search-1].analyzed = true;
        



        //FOR DEBUG
        //FROM HERE
        // if (tilemap[x_compare-1] !== undefined) {
        //     if (tilemap[x_compare-1][y_compare-1 -1] !== undefined) {
                
        //         console.log(
        //             (tilemap[x_compare-1][y_compare-1 -1] !== undefined),
        //             (!search_moved),
        //             (tilemap[x_compare-1][y_compare-1].connect.u == 1),
        //             (!tilemap[x_compare-1][y_compare-1 -1].analyzed),
        //             (y_compare<=25)
        //         );

        //     }
        // }

        // if (tilemap[x_compare-1] !== undefined) {
        //     if (tilemap[x_compare-1][y_compare-1 +1] !== undefined) {

        //         console.log(
        //             (tilemap[x_compare-1][y_compare-1 +1] !== undefined),
        //             (!search_moved),
        //             (tilemap[x_compare-1][y_compare-1].connect.d == 1),
        //             (!tilemap[x_compare-1][y_compare-1 +1].analyzed),
        //             (y_compare<=25)
        //         );

        //     }
        // }

        // if (tilemap[x_compare-1 -1] !== undefined) {
        //     if (tilemap[x_compare-1 -1][y_compare-1] !== undefined) {
                
        //         console.log(
        //             (tilemap[x_compare-1 +1][y_compare-1] !== undefined),
        //             (!search_moved),
        //             (tilemap[x_compare-1][y_compare-1].connect.l == 1),
        //             (!tilemap[x_compare-1 +1][y_compare-1].analyzed),
        //             (x_compare<=25)
        //         );
            
        //     }
        // }
        
        // if (tilemap[x_compare-1 +1] !== undefined) {
        //     if (tilemap[x_compare-1 +1][y_compare-1] !== undefined) {

        //         console.log(
        //             (tilemap[x_compare-1 -1][y_compare-1] !== undefined),
        //             (!search_moved),
        //             (tilemap[x_compare-1][y_compare-1].connect.r == 1),
        //             (!tilemap[x_compare-1 -1][y_compare-1].analyzed),
        //             (x_compare<=25)
        //         );

        //     }
        // }

        // console.log("about the start : ",
        //     (x_compare !== player.x_start && y_compare !== player.y_start),
        //     (connections_count<2),
        //     (x_compare !== player.x_init && y_compare !== player.y_init)
        // );
        
        //TO HERE



        //IF MOVING IS POSSIBLE
        if (!( (x_compare == player.x_start && y_compare == player.y_start) && connections_count >= 2)
            && !(x_compare == player.x_init
            && y_compare == player.y_init)
            ) {
            



            //STEM DIRECTION SEEKING
            //avoid crash for non existing case
            if (tilemap[x_compare-1] !== undefined) {
                //same as below, but also verify that no connection has been found yet (to not trigger the 3 other blocks below)
                if (tilemap[x_compare-1][y_compare-1 -1] !== undefined && !search_moved) {
                    
                    //if the case have a connection to the top, the connected case hasn't been analyzed (to not go backward) and it's not outside the grid
                    if (tilemap[x_compare-1][y_compare-1].connect.u == 1    &&    !tilemap[x_compare-1][y_compare-1 -1].analyzed    &&    y_compare<=25) {
                        y_search--;             //move analysis
                        search_moved = true;    //prevent other blocks to give any positive results
                        /*console.log("y-")*/
                    }

                }
            }
            
            if (tilemap[x_compare-1] !== undefined) {
                if (tilemap[x_compare-1][y_compare-1 +1] !== undefined && !search_moved) {
                    
                    if (tilemap[x_compare-1][y_compare-1].connect.d == 1    &&    !tilemap[x_compare-1][y_compare-1 +1].analyzed    &&    y_compare<=25) {
                        y_search++;
                        search_moved = true;
                        /*console.log("y+")*/
                    }

                }
            }
            
            if (tilemap[x_compare-1 -1] !== undefined) {
                if (tilemap[x_compare-1 -1][y_compare-1] !== undefined && !search_moved) {
                    
                    if (tilemap[x_compare-1][y_compare-1].connect.l == 1    &&    !tilemap[x_compare-1 -1][y_compare-1].analyzed    &&    x_compare<=25) {
                        x_search--;
                        search_moved = true;
                        /*console.log("x-")*/
                    }

                }
            }
            
            if (tilemap[x_compare-1 +1] !== undefined) {
                if (tilemap[x_compare-1 +1][y_compare-1] !== undefined && !search_moved) {
                    
                    if (tilemap[x_compare-1][y_compare-1].connect.r == 1    &&    !tilemap[x_compare-1 +1][y_compare-1].analyzed    &&    x_compare<=25) {
                        x_search++;
                        search_moved = true;
                        /*console.log("x+")*/
                    }

                }
            }
            
            //FOR DEBUG
            //console.log("I went into the condition, that accepted to check if moving is possible");
        }




        //FOR DEBUG
        //console.log("search moved : ",search_moved);

        //UPDATE LAST SEARCH
        x_search_last = x_temp;//save actual coordinates for a comparison in the next iteration
        y_search_last = y_temp;
        search_moved = false;

        //IF NO NEW DIRECTION HAS BEEN FOUND (THE SEEKER IS ON A CASE WITH 3 OR 4 CONNECTIONS), STOP SEEKING
        if (x_search == x_search_last && y_search == y_search_last) {break;}
        
        //FOR DEBUG
        //console.log(connections_count,"x=",x_search,",y=",y_search,",x_last=",x_search_last,",y_last=",y_search_last);
    }
    if (i_safe >= 200) {console.error("WARNING : Infinite while stopped (>200 = not normal) ! Please, verify the loop to avoid any damage.");};
    
    //FOR DEBUG
    //console.log(i_safe);
    
    //################
    //END OF FIND PATH
    //################







    //CLEAN UP THE DATABASE BY REMOVING THE ANALYZED NODE

    //debug variable
    var console_analyzed = [];

    for (var i=0; i<tilemap.length; i++) {
        for (var j=0; j<tilemap[i].length; j++) {
            
            if (tilemap[i][j].analyzed == true) console_analyzed.push([i,j]);
            tilemap[i][j].analyzed = false;

        }
    }






    //THE FOLLOWING CODE IS USEFUL TO DEBUG THE STEM COUNTER, SHOWING THE PATH DONE BY THE PROGRAM.
    //THE PATH IS SHOWN USING P5.JS, BUT THE SAME CAN BE DONE BY REPLACING THE P5 FUNCTIONS BY THE JS CANVAS METHODS
    
    // for (var i=0; i<console_analyzed.length; i++) {
    //     push();
    //     preview_graph.stroke(250,20,20);
    //     preview_graph.strokeWeight(10);
    //     preview_graph.point(x(console_analyzed[i][0]+1),y(console_analyzed[i][1]+1));
    //     pop();
    // }
    // console.table(console_analyzed);
    // console.log("returned stem count : ",stem_count);








    //**END**//
    return stem_count;
}




















//COORDINATES MANIPULATION
//========================

//x(x) and y(y) return the pos left(x)/top(y) in the main_layer_canvas in pixel depending of the x/y of a case given. The returned value is the center of a case in pixels from top/left.
//  ###################################################################################################################################################
//  # canvas_width/grid_size : the pos to 1st case to it's right limit                                                                                      #
//  # /2 : to center the pos to the middle of 1st case                                                                                                #
//  # + (x or y)*(canvas_width/grid_size) : to move x/y times to the right/bottom. No /2 because it adds a case size so still centered !                    #
//  # (x or y)-1 : because if 1 it doesn't have to add anything so give 0*(canvas_width/grid_size)=0. same for each number we remove the count of 1st case. #
//  ###################################################################################################################################################

// GRID => PIXEL

function x(X) {
    if (isFinite(X)==false) {console.error("[Plant]{x} Invalid argument for parameter 'X' : expected a number, got "+X); return;}
    var case_size = canvas_width / grid_size;
    return (case_size/2) + (X-1) * case_size;
}

function y(Y) {
    if (isFinite(Y)==false) {console.error("[Plant]{y} Invalid argument for parameter 'Y' : expected a number, got "+Y); return;}
    var case_size = canvas_height / grid_size;
    return (case_size/2) + (Y-1) * case_size;
}





//toX() et toY() return a x/y pos in the grid, depending of a top/left pixel length given (from the main_layer_canvas)
//  ############################################################################
//  # this is the reverse of the function x() and y() (see explanation below). #
//  # explanation :                                                            #
//  # As f(x) |--> ((canvas_width/grid_size)/2)+(X-1)*(canvas_width/grid_size) #
//  # As X a real, and the searched value. As a;b and c reals defined as :     #
//  # a = canvas_width;                                                        #
//  # b = grid_size;                                                           #
//  # c = f(x);                                                                #
//  # ((a/b)/2)+(X-1)*(a/b) = c                                                #
//  # (X-1)*(a/b) = c-((a/b)/2)                                                #
//  # X-1 = (c-((a/b)/2))/(a/b)                                                #
//  # X = (c-((a/b)/2))/(a/b)+1                                                #
//  #                                                                          #
//  # And so : X = (X-((canvas_width/grid_size)/2))/(canvas_width/grid_size)+1 #
//  ############################################################################

// PIXEL => GRID

function toX(X) {
    if (isFinite(X)==false) {console.error("[Plant]{toX} Invalid argument for parameter 'X' : expected a number, got "+X); return;}
    
    var case_size = canvas_width / grid_size;
    return (X - (case_size/2)) / case_size+1;
}

function toY(Y) {
    if (isFinite(Y)==false) {console.error("[Plant]{toY} Invalid argument for parameter 'Y' : expected a number, got "+Y); return;}
    
    var case_size = canvas_height / grid_size;
    return (Y - (case_size/2)) / case_size+1;
}












// FLOWER SHAPE
//=============

function DrawFlower(X,Y,r,rgb1,rgb2,cvs) {//(WARNING : reset stroke and strokeWeight !!!) draw a flower to pos (x;y) with r radius, with rgb1 as center color and rgb2 as colors of the petals.
    
    //error checking
    if (isFinite(X)==false) {console.error("[Plant]{DrawFlower} Invalid argument for parameter 'X' : expected a number, got "+X); return;}
    if (isFinite(Y)==false) {console.error("[Plant]{DrawFlower} Invalid argument for parameter 'Y' : expected a number, got "+Y); return;}
    
    if (typeof rgb1 !== 'object'
        || rgb1==null
        || rgb1.constructor === Array
        || Object.keys(rgb1).length!=3
        || isFinite(rgb1.r)==false
        || isFinite(rgb1.g)==false
        || isFinite(rgb1.b)==false
        ) {
            console.error("[Plant]{DrawFlower} Invalid argument for parameter 'rgb1' : expected an object as following : '{r:number,g:number,b:number}', got ");
            console.log(rgb1);
            return;
    }

    if (typeof rgb2 !== 'object'
        || rgb2==null
        || rgb2.constructor === Array
        || Object.keys(rgb2).length!=3
        || isFinite(rgb2.r)==false
        || isFinite(rgb2.g)==false
        || isFinite(rgb2.b)==false
        ) {
            console.error("[Plant]{DrawFlower} Invalid argument for parameter 'rgb2' : expected an object as following : '{r:number,g:number,b:number}', got ");
            console.log(rgb2);
            return;
    }
    
    if (!(cvs=="draw_canvas"||cvs=="preview_graph")) {console.error("[Plant]{DrawFlower} Invalid argument for parameter 'cvs' : expected string 'draw_canvas' or 'preview_graph', got "+cvs); return;}
    
    


    //GET THE RIGHT CANVAS
    var cvs;
    if (cvs == "draw_canvas")           {cvs = main_layer_canvas;}
    else if (cvs == "preview_graph")    {cvs = preview_graph;}
    


    //DRAW THE FLOWER
    push();

    cvs.noStroke();

    //petals
    cvs.fill(rgb2.r,rgb2.g,rgb2.b);
    cvs.ellipse(X-(r/4),Y-(r/4),r/2,r/2);
    cvs.ellipse(X-(r/4),Y+(r/4),r/2,r/2);
    cvs.ellipse(X+(r/4),Y-(r/4),r/2,r/2);
    cvs.ellipse(X+(r/4),Y+(r/4),r/2,r/2);

    //center
    cvs.fill(rgb1.r,rgb1.g,rgb1.b);
    cvs.ellipse(X,Y,r/1.5,r/1.5);

    pop();

}














// SEND DATA TO DISPLAY
// ====================

function SendPlayerData() {//update sessionStorage database about players
        sessionStorage.setItem("player1", JSON.stringify(player1));
        sessionStorage.setItem("player2", JSON.stringify(player2));
}//why ? the goal is to separate the process data from the display data. Display data is updated from the last process data state.

function GetPlayerData() {//get players database in sessionStorage sent by canvas.js
    player1_collected = JSON.parse(sessionStorage.getItem("player1"));
    player2_collected = JSON.parse(sessionStorage.getItem("player2"));
}//why ? the goal is to separate the process data from the display data. Display data is updated from the last process state.



function UpdateTabData() {//update data displayed into the tabs
    if (!(player1_collected==undefined||player2_collected==undefined)) {
       
        //score
        HTML.game.display.player1.score.innerHTML = player1_collected.score;
        HTML.game.display.player2.score.innerHTML = player2_collected.score;

        //movements left
        HTML.game.display.player1.movements.innerHTML = player1_collected.movements_left;
        HTML.game.display.player2.movements.innerHTML = player2_collected.movements_left;

        //wins
        HTML.game.display.player1.wins.innerHTML = player1_collected.wins;
        HTML.game.display.player2.wins.innerHTML = player2_collected.wins;

        //turns count
        HTML.game.display.turn.innerHTML = turn.count+" / "+turn.max;
    }
}














// VICTORY DETECTION AND ATTRIBUTION
//==================================


function IsGameEnded(last_player_turn_occured) {//verify if the game is ended
    //error check
    if (typeof last_player_turn_occured !== "boolean") {console.error("[Plant]{IsGameEnded} Invalid argument for parameter 'last_player_turn_occured' : expected boolean value, got "+last_player_turn_occured); return;}
    
    //check if one player is bloqued
    var bloqued = OnePlayerBloqued();

    //if all turns are finished or a player is bloqued
    if (last_player_turn_occured || (bloqued.one_player_bloqued && BloquedOnTurn(bloqued)) ) {
        FindWinner();
        
        //clear display
        HTML.game.button.player1.give_random_movement.style.display = "none";
        HTML.game.display.player1.movements.style.display = "initial";
        HTML.game.button.player2.give_random_movement.style.display = "none";
        HTML.game.display.player2.movements.style.display = "initial";

        //display bottom UI to quit or restart
        HTML.game.button.new_game.style.display = "initial";
        HTML.game.button.back_to_menu.style.display = "initial";
        
        //disable the events
        can_test_event = false;
        starts_graph.clear();

        //DEBUG
        //console.log (BloquedOnTurn(bloqued));
    }
    
    //if the game is not ended
    else { DisplayStarts(); }

}







function OnePlayerBloqued() {//detect if a player is bloqued by checking for each player all the cases they've taken, and return the result. From each of these case, it test if for each direction a movement is available. Database is updated in consequence. If it is false everywhere, the player is bloqued
    
    //INITIALISATION

    var one_player_bloqued = true;
    var player_bloqued = {//if it is possible to move somewhere, will change to false, meaning it'll stay to true if it is impossible to move for the specified player. if both are true (=both players bloqued) the var below will stay true. Otherwise it'll change to false
        p1:true,
        p2:true,
    }







    //PROCESSING

    for (var case_count=0; case_count<grid_size*grid_size; case_count++) {
        
        //convert iteration to coordinates in grid. +1 to convert to coordinates starting from 1, because conditions are based on that.
        var case_x = (case_count%grid_size)+1;
        var case_y = (Math.floor(case_count/grid_size))+1;

        //case shortcut
        var this_case = tilemap[case_x-1][case_y-1];

        //where the game stores if a movement is possible
        var available_movement_for = this_case.available_movement;
        
        
        
        
        //STEP 1 : CHECK POSSIBLE MOVEMENTS
        //########################################################################################################
        //# NOTE : conditions explained in Preview() :                                                           #
        //# working exactly the same way as checking if an arrow action is possible,                             #
        //# expect that "player.?_preview" are replaced by cases where the loop check : "case_?""                #
        //# ==> if all is respected a movement is possible : set to true in database,                            #
        //# otherwise if one of the conditions don't match the movement is impossible, set to false in database. #
        //########################################################################################################
        
        //########
        //PLAYER 1
        //########

        if (this_case.player == 1) {
            
            //######
            //STEP 1
            //######
            
            //up check
            if (   (GetStemLength(player1, false, case_x, case_y) < rules.max_stem_length)
                && (!OnFlower(case_x, case_y))
                && (!OnBorder("top", case_y))
                && (!CaseTaken(case_x, case_y, "to_top"))
                && (!CaseForbiddenTo(1, case_x, case_y, "to_top"))
                ) {

                available_movement_for.p1.up = true;

            } else {
                available_movement_for.p1.up = false;
            }



            //left check
            if (   (!TwiceHorizontalAt(case_x, case_y))
                && (GetStemLength(player1, false, case_x, case_y) < rules.max_stem_length)
                && (!OnFlower(case_x, case_y))
                && (!OnBorder("left", case_x))
                && (!CaseTaken(case_x, case_y, "to_left"))
                && (!CaseForbiddenTo(1, case_x, case_y, "to_left"))
                ) {

                available_movement_for.p1.left = true;

            } else {
                available_movement_for.p1.left = false;
            }



            //right check
            if (   (!TwiceHorizontalAt(case_x, case_y))
                && (GetStemLength(player1, false, case_x, case_y) < rules.max_stem_length)
                && (!OnFlower(case_x, case_y))
                && (!OnBorder("right", case_x))
                && (!CaseTaken(case_x, case_y, "to_right"))
                && (!CaseForbiddenTo(1, case_x, case_y, "to_right"))
                ) {

                available_movement_for.p1.right = true;

            } else {
                available_movement_for.p1.right = false;
            }

            
            
            


            //######
            //STEP 2 : CHECK IF THE PLAYER CAN MOVE SOMEWHERE
            //######

            //global check
            if (   !available_movement_for.p1.up
                && !available_movement_for.p1.left
                && !available_movement_for.p1.right
                ) {

                available_movement_for.p1.global = false;
            }
            
            else {
                available_movement_for.p1.global = true;
                player_bloqued.p1 = false;
                
                //DEBUG
                //console.log("green",case_x,case_y);
            }

            //it's player 1's case so the player 2 can't move here
            available_movement_for.p2.down = false;
            available_movement_for.p2.left = false;
            available_movement_for.p2.right = false;
            available_movement_for.p2.global = false;
        }



        //########
        //PLAYER 2
        //########

        else if (this_case.player == 2) {
            
            //######
            //STEP 1
            //######

            //down check
            if (   (GetStemLength(player2, false, case_x, case_y) < rules.max_stem_length)
                && (!OnFlower(case_x, case_y))
                && (!OnBorder("bottom", case_y))
                && (!CaseTaken(case_x, case_y, "to_bottom"))
                && (!CaseForbiddenTo(2, case_x, case_y, "to_bottom"))
                ) {

                available_movement_for.p2.down = true;

            } else {
                available_movement_for.p2.down = false;
            }
            


            //left check
            if (   (!TwiceHorizontalAt(case_x, case_y))
                && (GetStemLength(player2, false, case_x, case_y) < rules.max_stem_length)
                && (!OnFlower(case_x, case_y))
                && (!OnBorder("left", case_x))
                && (!CaseTaken(case_x, case_y, "to_left"))
                && (!CaseForbiddenTo(2, case_x, case_y, "to_left"))
                ) {
                
                available_movement_for.p2.left = true;

            } else {
                available_movement_for.p2.left = false;
            }
            


            //right check
            if (   (!TwiceHorizontalAt(case_x, case_y))
                && (GetStemLength(player2, false, case_x, case_y) < rules.max_stem_length)
                && (!OnFlower(case_x, case_y))
                && (!OnBorder("right", case_x))
                && (!CaseTaken(case_x, case_y, "to_right"))
                && (!CaseForbiddenTo(2, case_x, case_y, "to_right"))
                ) {
                
                available_movement_for.p2.right = true;

            } else {
                available_movement_for.p2.right = false;
            }
            
            
            
            


            //######
            //STEP 2 : CHECK IF THE PLAYER CAN MOVE SOMEWHERE
            //######

            //global check
            if (   !available_movement_for.p2.down
                && !available_movement_for.p2.left
                && !available_movement_for.p2.right
                ) {

                available_movement_for.p2.global = false;
            }
            
            else {
                available_movement_for.p2.global = true;
                player_bloqued.p2 = false;
                
                //DEBUG
                //console.log("blue",case_x,case_y);
            }

            //it's player 2's case so the player 1 can't move here
            available_movement_for.p1.down = false;
            available_movement_for.p1.left = false;
            available_movement_for.p1.right = false;
            available_movement_for.p1.global = false;
        }



        //NO PLAYER

        else if (this_case.player == 0) {

            //no movement available for both players
            available_movement_for.p1.global = false;
            available_movement_for.p1.up = false;
            available_movement_for.p1.left = false;
            available_movement_for.p1.right = false;

            available_movement_for.p2.global = false;
            available_movement_for.p2.down = false;
            available_movement_for.p2.left = false;
            available_movement_for.p2.right = false;

        } 
    }






    //FINALIZATION

    if (player_bloqued.p1 || player_bloqued.p2) {   //if both player are bloqued
        one_player_bloqued = true;                  //return true
    } else { one_player_bloqued = false; }          //otherwise return false
    
    //DEBUG ONLY
    //console.log(player_bloqued,one_player_bloqued);
    
    
    return {
        one_player_bloqued: one_player_bloqued,
        player_bloqued: player_bloqued
    };
}









function BloquedOnTurn(bloqued) {//return if the player bloqued is the one who it's the turn to play
    return  (  (bloqued.player_bloqued.p1==true && turn.player_turn==1)
            || (bloqued.player_bloqued.p2==true && turn.player_turn==2)
            )?  true : false;   
}










function FindWinner() {//find who's the winner of the game by comparing it's score
    
    //shortcuts
    var game_result_p1 = HTML.game.display.player1.game_result.innerHTML;
    var game_result_p2 = HTML.game.display.player2.game_result.innerHTML;

    var p1_classes = HTML.game.player1_interface.className;
    var p2_classes = HTML.game.player2_interface.className;

    //PLAYER 1
    if (player1.score > player2.score) {
        //text display
        game_result_p1 = "YOU WIN";
        game_result_p2 = "YOU LOOSE";

        //visuals
        p1_classes += " player1_playing";//add overlay showing it's the winner
        p2_classes = p2_classes.replace(" player2_playing","");//remove that overlay for the other player.
        
        //update data
        player1.wins++;
    }

    //PLAYER 2
    else if (player2.score > player1.score) {
        game_result_p2 = "YOU WIN";
        game_result_p1 = "YOU LOOSE";
        
        p2_classes += " player2_playing";
        p1_classes = p1_classes.replace(" player1_playing","");
        
        player2.wins++;
    }

    //DRAW
    else if (player1.score == player2.score) {
        game_result_p1 = "DRAW";
        game_result_p2 = "DRAW";
        
        p1_classes = p1_classes.replace(" player1_playing","");
        p2_classes = p2_classes.replace(" player2_playing","");
        
        player1.wins++;
        player2.wins++;
    }
}













// RESET AND QUIT FUNCTIONS
//=========================


function ResetGame() {//reset the game for a new game
    
    //SAVE SCORE
    sessionStorage.setItem("player1.wins", player1.wins);//saves the victory counts on reset. In GameInit() it will detect if it has been stored and restore it if it does exist.
    sessionStorage.setItem("player2.wins", player2.wins);
    
    //CLEAR CANVAS
    main_layer_canvas.clear();
    preview_graph.clear();
    starts_graph.clear();
    
    //REINIT
    document.removeEventListener("keydown", OnKeyDown);//remove existing listener so they do not stack.
    game_init_ended = false;
    first_draw = true;
    GameInit();
}



function ToMenu() {//go back to main menu
    scene.game_content.style.left = window.innerWidth+"px";
    scene.main_menu.style.left = 0;
}