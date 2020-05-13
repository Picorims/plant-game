// Plant is a 2 players strategy game, where the goal is to take as much space as possible on the terrain with a plant by making it growing.
    
// Copyright (c) 2020 Picorims<picorims.contact@gmail.com> and Cirno, France. All rights reserved.

// Licensed under the GNU Affero General Public License version 3.0 (GNU AGPL v3.0).
// More information about the license at LICENSE.md to the root of the program. If it is missing, see <https://www.gnu.org/licenses/>.
// A full notice can be found at NOTICE.md to the root of the program,
// and you should see README.md as well for other information.

//JS THAT HANDLE THE GLOBAL PLANT GAME PROGRAM (/!\ NOT GAME ITSELF !). CONTAINS GLOBAL INITIALISATION WITH CALLS TO SUB INITIALISATIONS.
var scene;//all html scenes of the game
var get_players_data_interval;//interval to get players data
var update_tabs_data_interval;//interval to update informations in player1/2tab and bottom tab
var player1_collected, player2_collected;//object with players database collected from sessionStorage
var HTML;//html elements, excluding scenes
var event;//all variables for events
var player1_random_movements_button, player2_random_movements_button;
var SendMessage;//a list of messages that can be sent in the bottom tab

function GlobalInit() {//initialization
    console.group("init");
    console.info("%cglobal init...","color:blue; font-weight:bold");
    console.time("init duration");
    sessionStorage.clear();
    
    
    
    //HTML definition tree
    //exceptions not present: game_logo_object and all the svg objects contained in it; classes.
    HTML = {
        fps_display: document.getElementById("fps_display"),
        
        background_graphism_handler: document.getElementById("background_graphism_handler"),//div that handle all canvas and div related to background graphism and other overal graphism
        svg_filter: {
            horizontal_blur: document.getElementById("horizontal_blur"),
        },
        shadow_effect: document.getElementById("shadow_effect"),//div handling the shadow effect in corners for depth
        
        loading_screen: {
            init_message: document.getElementById("init_message"),
            loading_item: document.getElementById("loading_item"),
        },

        main_menu: {
            game_logo_container: document.getElementById("game_logo_container"),
            button: {
                play:               document.getElementById("play_button"),
                tutorial_and_rules: document.getElementById("tutorial_and_rules_button"),
                options:            document.getElementById("options_button"),
                credits:            document.getElementById("credits_button"),
                exit:               document.getElementById("exit_button"),
            },
        },

        quit_warning_menu: {
            container: document.getElementById("quit_warning_menu"),//small menu that appear to confirm game quit
            msg:       document.getElementById("quit_msg"),
            button: {
                confirm: document.getElementById("quit_confirm_button"),
                cancel:  document.getElementById("quit_cancel_button"),
            },
        },
        
        tutorial: {
            button: {
                previous_slide:    document.getElementById("prev_slide_button"),
                next_slide:        document.getElementById("next_slide_button"),
                back_to_main_menu: document.getElementById("tutorial_to_main_button"),
            },
        },
        
        credits:{
            window:       document.getElementById("credits_window"),
            close_button: document.getElementById("close_credits_button"),
            title: {
                dev:            document.getElementById("credits_dev"),
                graphism:       document.getElementById("credits_graphism"),
                music:          document.getElementById("credits_music"),
                music_content:  document.getElementById("credits_music_content"),
                sfx:            document.getElementById("credits_sfx"),
                libraries:      document.getElementById("credits_libraries"),
                notice:         document.getElementById("credits_notice"),
            },
        },
        
        options: {
            language_option_title:      document.getElementById("language_option_title"),
            low_graphics_option_title:  document.getElementById("low_graphics_option_title"),
            music_option_title:         document.getElementById("music_option_title"),
            sound_option_title:         document.getElementById("sound_option_title"),
            controls_option_title:      document.getElementById("controls_option_title"),
            controls: {
                left:         document.getElementById("control_left"),
                left_msg:     document.getElementById("control_left_msg"),
                right:        document.getElementById("control_right"),
                right_msg:    document.getElementById("control_right_msg"),
                up:           document.getElementById("control_up"),
                up_msg:       document.getElementById("control_up_msg"),
                down:         document.getElementById("control_down"),
                down_msg:     document.getElementById("control_down_msg"),
                validate:     document.getElementById("control_validate"),
                validate_msg: document.getElementById("control_validate_msg"),
                default:      document.getElementById("default_controls"),
            },
            graphics_checkbox: document.getElementById("graphics_mode"),
            language_selector: document.getElementById('select_language'),
            music_slider: document.getElementById('music_slider'),
            sound_slider: document.getElementById('sound_slider'),
            button: {
                back_to_main_menu: document.getElementById("options_to_main_button"),
            },
        },
        
        game:{
            player1_interface:       document.getElementById("player1_interface"),
            player1_interface_title: document.getElementById("interface1_title"),
            player2_interface:       document.getElementById("player2_interface"),
            player2_interface_title: document.getElementById("interface2_title"),
            display:{
                player1:{
                    score:       document.getElementById("player1_score"),//displays score
                    movements:   document.getElementById('player1_movements'),//displays movements left
                    game_result: document.getElementById('player1_game_result'),//displays the results of the game (win,loose,draw)
                    wins:        document.getElementById("player1_wins"),//displays the count of victories
                },
                player2:{
                    score:       document.getElementById("player2_score"),
                    movements:   document.getElementById('player2_movements'),
                    game_result: document.getElementById('player2_game_result'),
                    wins:        document.getElementById("player2_wins"),//displays the count of victories
                },
                turn:    document.getElementById("turn"),//displays turn count
                message: document.getElementById("message"),//displays messages sent from SendMessage to the players.
            },
            button: {
                player1:{
                    give_random_movement: document.getElementById('player1_movements_button'),//button to get a random quantity of movements available.
                },
                player2:{
                    give_random_movement: document.getElementById('player2_movements_button'),
                },
                start_game:   document.getElementById("start_game_button"),//button to start the first game
                new_game:     document.getElementById("new_game_button"),//button to start a new game
                back_to_menu: document.getElementById("back_to_menu_button"),//button to go back to main menu
            },
            layers_handler: document.getElementById("game_layers_handler"),// html element that contains all canvas layers for the game only
        }
    };



    //body initialization
    document.body.style.width = window.innerWidth+"px";
    document.body.style.height = window.innerHeight+"px";
    //scenes
    scene = {
        loading_screen: document.getElementById("loading_screen"),//loading screen on program load
        main_menu: document.getElementById("main_menu"),//game main menu
        tutorial: document.getElementById("tutorial"),//tutorial slideshow
        options_menu: document.getElementById("options_menu"),//options menu with all parameters
        credits: document.getElementById("credits"),//credits display
        game_content: document.getElementById("game_content"),//game itself
    }

    //loading_screen
    scene.loading_screen.style.width = window.innerWidth+"px";
    scene.loading_screen.style.height = window.innerHeight+"px";
    HTML.loading_screen.init_message.style.marginTop = ( (window.innerHeight/2)-(HTML.loading_screen.init_message.offsetHeight/2) )+"px";
    //stuff to track the initialization
    event = {
        main_ready: new Event("main_ready"),
        main_init_finished: false,
        graphism_ready: new Event("graphism_ready"),
        graphism_init_finished: false,
        tutorial_ready: new Event("tutorial_ready"),
        tutorial_init_finished: false,
        options_ready: new Event("options_ready"),
        options_init_finished: false,
        pre_game_ready: new Event("pre_game_ready"),
        pre_game_init_finished: false,
        audio_ready: new Event("audio_ready"),
        audio_init_finished: false,
    };
    document.addEventListener("main_ready", MainReady);
    document.addEventListener("graphism_ready", GraphismReady);
    document.addEventListener("tutorial_ready", TutorialReady);
    document.addEventListener("options_ready", OptionsReady);
    document.addEventListener("pre_game_ready", PreGameReady);
    document.addEventListener("audio_ready", AudioReady);
    WaitForInitFinished();

    //background_graphic_handler
    //GraphicInit(); ==> DONE IN SETUP FUNCTION OF P5

    //main_menu
    scene.main_menu.style.width = window.innerWidth+"px";
    scene.main_menu.style.height = window.innerHeight+"px";
    scene.main_menu.style.paddingTop = (window.innerHeight/40)+"px";
    scene.main_menu.style.left = 0+"px";
    HTML.quit_warning_menu.container.style.top = ( (window.innerHeight/2)-(HTML.quit_warning_menu.container.offsetHeight/2) )+"px";
    HTML.quit_warning_menu.container.style.left = window.innerWidth+"px";

    //tutorial
    scene.tutorial.style.width = window.innerWidth+"px";
    scene.tutorial.style.height = window.innerHeight+"px";
    scene.tutorial.style.left = window.innerWidth+"px";
    TutorialInit();
    
    //options_menu
    scene.options_menu.style.width = window.innerWidth+"px";
    scene.options_menu.style.height = window.innerHeight+"px";
    scene.options_menu.style.left = window.innerWidth+"px";
    OptionsInit();
    
    //credits
    scene.credits.style.width = window.innerWidth+"px";
    scene.credits.style.height = window.innerHeight+"px";
    scene.credits.style.left = window.innerWidth+"px";
    HTML.credits.window.style.top = (window.innerHeight - HTML.credits.window.offsetHeight)/2 + "px";
    HTML.credits.window.style.left = (window.innerWidth - HTML.credits.window.offsetWidth)/2 + "px";
    HTML.credits.window.css_padding = window.getComputedStyle(HTML.credits.window).padding.replace("px","");
    HTML.credits.close_button.style.marginLeft = HTML.credits.window.offsetWidth - HTML.credits.window.css_padding*2 - HTML.credits.close_button.offsetWidth + "px";

    //game_content
    scene.game_content.style.width = window.innerWidth+"px";
    scene.game_content.style.height = window.innerHeight+"px";
    scene.game_content.style.left = window.innerWidth+"px";
    GamePreInit();

    //audio
    AudioInit();
    console.timeEnd("init duration");
    console.info("%cglobal init successfully ended","color:blue; font-weight:bold");
    console.groupEnd("init");
    document.dispatchEvent(event.main_ready);
    setInterval(fpsDisplay, 1000);
}
function fpsDisplay() { //display the average FPS to the top left screen
    HTML.fps_display.innerHTML= Math.round(frameRate())+"fps";
}

