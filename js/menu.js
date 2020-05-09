// Plant is a 2 players strategy game, where the goal is to take as much space as possible on the terrain with a plant by making it growing.
    
// Copyright (c) 2019 Picorims<picorims.contact@gmail.com> and Cirno, France. All rights reserved.

// Licensed under the GNU Affero General Public License version 3.0 (GNU AGPL v3.0).
// More information about the license at LICENSE.txt to the root of the program. If it is missing, see <https://www.gnu.org/licenses/>.
// A full notice can be found at NOTICE.txt to the root of the program,
// and you should see README.txt as well for other information.

//JS THAT HANDLE THE MENU AND OTHER SUB MENUS
const { remote } = require('electron');
var CreateRulesWindow = remote.require('./main').CreateRulesWindow;
var CreateReadMeWindow = remote.require('./main').CreateReadMeWindow;
var CreateNoticeWindow = remote.require('./main').CreateNoticeWindow;
var CreateLicenseWindow = remote.require('./main').CreateLicenseWindow;
var fs = require('fs');

var languages;//list of available languages
var listener;//boolean to select which control should be changed when a key is entered.
var options;//all options available for the game
var tuto_slide_page;//slide shown by the tutorial slideshow

//LOADING SCREEN
function WaitForInitFinished() {//function that launch the game when the initialization is ended.
    if(event.main_init_finished
    && event.graphism_init_finished
    && event.tutorial_init_finished
    && event.options_init_finished
    && event.pre_game_init_finished
    && event.audio_init_finished) 
    {
        console.log("%cinitialization finished!","color:red; font-weight:bold; font-size: 20px");
        HTML.loading_screen.loading_item.style.opacity = 0;
        LoadingScreen();//launches the game
        //remove unused listeners.
        document.removeEventListener("main_ready", MainReady);
        document.removeEventListener("graphism_ready", GraphismReady);
        document.removeEventListener("tutorial_ready", TutorialReady);
        document.removeEventListener("options_ready", OptionsReady);
        document.removeEventListener("pre_game_ready", PreGameReady);
        document.removeEventListener("audio_ready", AudioReady);
        return;
    } else {//listen back later if the initialization isn't finished
        setTimeout(function() {WaitForInitFinished()}, 1000);
    }
}











//#################################################################################################################################################################################
//#################################################################################################################################################################################
//+================+
//| LOADING SCREEN |
//+================+

function LoadingScreen() {//function that handle all the starting process of the game
    //launch music
    LoopMusic();

    //delays for the animations and transitions
    var animation_start_wait = 1000;
    var animation_delay_between_letters = 40;
    var animation_length = 7000; 
    var delay_after_transition = 1000;
    var transition_length_fadein = 2000;
    var transitioon_length_in_between = 1000;
    var transition_length_fadeout = 5000;

    //defining needed HTML elements
    var init_message = options.language.UI.init_msg;//message displayed on load
    var init_message_decomposed = [];
    var top_under_window = window.innerHeight+100+"px";

    //update css to fit the variables.
    HTML.loading_screen.init_message.opacity = 0;
    HTML.loading_screen.init_message.style.setProperty('--top-under-window', top_under_window);
    HTML.loading_screen.init_message.style.setProperty('--animation-length', animation_length+"ms");


    
    
    
    //TEXT ANIMATION
    setTimeout(function() 
    {
        init_message_decomposed = init_message.split("");
        var delay = animation_delay_between_letters;
        
        //gives the animation with the right delay for each character. Each of those is an animated <span> element.
        for (var character=0; character<init_message_decomposed.length; character++) {
            
            //prepare the HTML element.
            var character_container = document.createElement("SPAN");
            HTML.loading_screen.init_message.appendChild(character_container);
            character_container.innerHTML               = init_message_decomposed[character];
            character_container.style.position          = "relative";
            character_container.style.top               = 0;
            character_container.style.transform         = "translate(0,"+top_under_window+")";//hides the character under the screen.
            
            //prepare the animation
            character_container.style.animation         = animation_length+"ms LetterAnimation "+delay+"ms";
            character_container.style.cssPropertyName   = "--animation-delay";
            character_container.style.setProperty('--animation-delay', delay+"ms");
            
            if (init_message_decomposed[character] !== " ") character_container.className = "character_animated_shadow";
            
            delay += animation_delay_between_letters;//each character has an increased delay which creates the wavy effect.
        }
        
        HTML.loading_screen.init_message.opacity = 1;

        
        
        
        
        
        //FADE IN
        setTimeout(function()
        {
            scene.loading_screen.style.animation = transition_length_fadein+"ms FadeIn";
            scene.loading_screen.style.backgroundColor = "#eeeeee";
            PrepareMainMenuAnimation();

            
            
            //FADE OUT
            setTimeout(function ()
            {
                scene.loading_screen.style.animation = transition_length_fadeout+"ms FadeOut cubic-bezier(0.66, 0, 0.51, 1)";
                scene.loading_screen.style.opacity = 0;
                MainMenuAnimation();

                
                
                //END ANIMATION
                setTimeout(function ()
                {
                    HideLoadingScreen();
                },transition_length_fadeout);
            
            
            
            },transition_length_fadein + transitioon_length_in_between);
        
        
        
        }, animation_length + delay_after_transition);
    
    
    
    }, animation_start_wait);
}





function PrepareMainMenuAnimation() {//prepare everything for the animation of the main menu
    // parameters
    HTML.main_menu.game_logo_container.style.opacity = 0;
}





function MainMenuAnimation() {//main menu animation
    //defs
    var game_logo_object = document.getElementById("game_logo_object").contentDocument;
    var letter_path = {
        p:{
            _stem1:game_logo_object.getElementById("p_stem1"),
        },
        l:{
            _stem1:game_logo_object.getElementById("l_stem1"),
            _stem2:game_logo_object.getElementById("l_stem2"),
        },
        a:{
            _stem1:game_logo_object.getElementById("a_stem1"),
            _stem2:game_logo_object.getElementById("a_stem2"),
            _stem3:game_logo_object.getElementById("a_stem3"),
        },
        n:{
            _stem1:game_logo_object.getElementById("n_stem1"),
            _stem2:game_logo_object.getElementById("n_stem2"),
            _stem3:game_logo_object.getElementById("n_stem3"),
        },
        t:{
            _stem1:game_logo_object.getElementById("t_stem1"),
            _stem2:game_logo_object.getElementById("t_stem2"),
        },
    }
    var stroke_width = 0.5;
    
    //delays
    var size_reduction_animation_length = 7000;
    var letter_animation_length = {
        p: 8000,
        l: 6000,
        a: 7000,
        n: 6500,
        t: 7500,
    }
    var letter_animation_delay = {
        p: 400,
        l: 1200,
        a: 900,
        n: 500,
        t: 1400,
    }

    //logo preparation
    game_logo_object.getElementById("img_size_point1").style.opacity = 0;
    game_logo_object.getElementById("img_size_point2").style.opacity = 0;
    
    
    
    
    
    
    //full animation for each letter
    HTML.main_menu.game_logo_container.style.opacity = 0;

    for (let name in letter_path) {//for all paths of the svg.
        if (letter_path.hasOwnProperty(name)) {//ignore properties not explicitely created in the code, used by the system.
            for (let value in letter_path[name]) {
                if (letter_path[name].hasOwnProperty(value)) {
                    
                    
                    
                    
                    //path style + preparation for animation of the path.
                    let path = letter_path[name][value];
                    var path_length = path.getTotalLength();
                    //############################################################
                    path.style.fill             = "transparent";
                    path.style.stroke           = "#fff";
                    path.style.strokeWidth      = stroke_width+"px";
                    path.style.strokeLinecap    = "round";
                    path.style.strokeLinejoin   = "round";
                    path.style.strokeDasharray  = path_length+" "+path_length;
                    path.style.strokeDashoffset = path_length;
                    //############################################################


                    //specific animation for each path, per letter (just duration changes.)
                    if (path.id==="p_stem1") {//P
                        LetterAnimation({
                            path:               path,
                            animation_length:   letter_animation_length.p,
                            animation_delay:    letter_animation_delay.p,
                        });
                    }


                    if (path.id==="l_stem1"||path.id==="l_stem2") {//L
                        LetterAnimation({
                            path:               path,
                            animation_length:   letter_animation_length.l,
                            animation_delay:    letter_animation_delay.l,
                        });
                    }


                    if (path.id==="a_stem1"||path.id==="a_stem2"||path.id==="a_stem3") {//A
                        LetterAnimation({
                            path:               path,
                            animation_length:   letter_animation_length.a,
                            animation_delay:    letter_animation_delay.a,
                        });
                    }


                    if (path.id==="n_stem1"||path.id==="n_stem2"||path.id==="n_stem3") {//N
                        LetterAnimation({
                            path:               path,
                            animation_length:   letter_animation_length.n,
                            animation_delay:    letter_animation_delay.n,
                        });
                    }


                    if (path.id==="t_stem1"||path.id==="t_stem2") {//T
                        LetterAnimation({
                            path:               path,
                            animation_length:   letter_animation_length.t,
                            animation_delay:    letter_animation_delay.t,
                        });
                    }
                
                
                
                
                }
            }
        }
    }
    
    //size reducing animation
    HTML.main_menu.game_logo_container.style.opacity = 1;//show the logo after it's animation has started to avoid clipping.
    HTML.main_menu.game_logo_container.style.animation = size_reduction_animation_length+"ms LogoSizeReduction cubic-bezier(0.22, 0.61, 0.36, 1)";
}




function LetterAnimation(data) {//animation for one letter with the given parameters.
    data.path.style.animation = `${data.animation_length}ms LetterDraw ${data.animation_delay}ms ease-in-out`;
    setTimeout(function() {
        
        data.path.style.strokeDashoffset = 0;
        data.path.style.fill             = "#fff";
        data.path.style.strokeWidth      = "0px";

    }, (data.animation_delay + data.animation_length - 100) );//-100 to avoid the letter to clip for a split second.
}




function HideLoadingScreen() {//hide the loading screen so the player can finally interact with the game (the loadinc screen element cover the screen, so buttons aren't triggerable even if it is invisble).
    scene.loading_screen.style.left = window.innerWidth+"px";
}

//#################################################################################################################################################################################
//#################################################################################################################################################################################






//############################
//#     SCENE MANAGEMENT     #
//############################

function ShowScene(scene, offset) {
    scene.style.left = (offset !== undefined) ?    offset : 0;
}
function HideScene(scene) {
    scene.style.left = `${window.innerWidth}px`
}










//#######################
//#     PLAY BUTTON     #
//#######################

function Play() {//play button that launch the game
    HideScene(scene.main_menu);
    ShowScene(scene.game_content);
    GameInit();
}










//##############################
//#     TUTORIAL AND RULES     #
//##############################

function TutorialAndRules() {//tutorial and rules button that lead to tutorial and rules menu
    HideScene(scene.main_menu);
    ShowScene(scene.tutorial);
}


function TutorialInit() {//initialization of the tutorial slider
    console.group("tutorial init");
    console.info("%ctutorial init...","color:brown; font-weight:bold");
    console.time("tutorial init duration");
    
    
    tuto_slide_page = 1;//page shown when opening up the tutorial (starts at 1)
    ShowSlide(tuto_slide_page);


    console.timeEnd("tutorial init duration");
    console.info("%ctutorial init successfully ended","color:brown; font-weight:bold");
    console.groupEnd("tutorial init");
    document.dispatchEvent(event.tutorial_ready);
}


function NextSlide(n) { //Function to switch to next or previous page
    ShowSlide(tuto_slide_page += n);
}


function SelectSlide(n) { //Function to switch to selected page
    ShowSlide(tuto_slide_page = n);
}


function ShowSlide(n) { //Function to show the page of index "n"
    var slides = document.getElementsByClassName("slide");
    var dots = document.getElementsByClassName("slide_dot");
    
    //SHOW BUTTONS ACCORDINGLY
    if (n == 1) { //Disable Previous button on first page
        HTML.tutorial.button.previous_slide.style.display = "none";
    } else {
        HTML.tutorial.button.previous_slide.style.display = "block";
    }

    if (n == slides.length) { //Disable Next button on last page
        HTML.tutorial.button.next_slide.style.display = "none";
    } else {
        HTML.tutorial.button.next_slide.style.display = "block";
    }

    //HIDE ALL SLIDES
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    //SHOW THE ASKED SLIDE
    for (i = 0; i < dots.length; i++) { //Set default background color on change
        dots[i].style.backgroundColor = "#eeeeee";
    }
    slides[tuto_slide_page - 1].style.display = "block"; //Show the current slide / -1 is to get the good page index (page counts start from 1 and not 0)
    dots[tuto_slide_page - 1].style.backgroundColor = "#777777"; //Indicates the dot corresponding to the selected slide
}


function QuitTutorialAndRules() {//go back to main menu
    HideScene(scene.tutorial);
    ShowScene(scene.main_menu);
}











//###################
//#     OPTIONS     #
//###################

function OptionsInit() {//initialization of the options menu.
    console.group("options init");
    console.info("%coptions init...","color:red; font-weight:bold");
    console.time("options init duration");

    //PREPARATION
    listener = {//boolean to select which control should be changed when a key is entered, in controls settings.
        left: false,
        right: false,
        up: false,
        down: false,
        validate: false,
    }
    //language database
    languages = {
        en_us: JSON.parse(fs.readFileSync("assets/languages/en_us.json")),
        fr_fr: JSON.parse(fs.readFileSync("assets/languages/fr_fr.json")),
    }

    
    
    //LOAD SETTINGS
    options = JSON.parse(fs.readFileSync("user_data/options.json"));
    LoadSettings();



    //HTML PROCESS
    //elements centering
    var option_container_list = document.getElementsByClassName("option_container");
    for (var elm=0; elm<option_container_list.length; elm++) {
        option_container_list[elm].style.marginLeft = (window.innerWidth/2)-(option_container_list[elm].offsetWidth/2)+"px";
    }

    //bind to each option their function
    HTML.options.language_selector.onchange = function() {SelectLanguage(); SaveOptions();}
    HTML.options.graphics_checkbox.onchange = function() {SwitchGraphics(); SaveOptions()};
    HTML.options.music_slider.oninput       = function() {UpdateVolumeMusic(); SaveOptions()};
    HTML.options.sound_slider.oninput       = function() {UpdateVolumeSound(); SaveOptions()};
    HTML.options.controls.left.onclick      = function() {ChangeControl("left");}
    HTML.options.controls.right.onclick     = function() {ChangeControl("right");}
    HTML.options.controls.up.onclick        = function() {ChangeControl("up");}
    HTML.options.controls.down.onclick      = function() {ChangeControl("down");}
    HTML.options.controls.validate.onclick  = function() {ChangeControl("validate");}
    HTML.options.controls.default.onclick   = function() {ResetKeys(); SaveOptions();}
    
    

    console.timeEnd("options init duration");
    console.info("%coptions init successfully ended","color:red; font-weight:bold");
    console.groupEnd("options init");
    document.dispatchEvent(event.options_ready);
}


function LoadSettings() {//loads the settings from JSON user file, or load default options and generate the user file if it has no data (node "empty":"true").
    
    //IF THE OPTIONS HAVE NEVER BEEN INITIALIZATED
    if (options.empty) {
        console.log("options.json empty, writing file...");
        
        options = {
            empty:false,//to recognize the json validity
            controls: {//keybindings for game controls
                left:"Q",
                right:"D",
                up:"Z",
                down:"S",
                validate:" ",//" " MEANS SPACE BAR !
            },
            language: null,//contains all the translations of the language selected by the user.
            low_graphics_enabled: false,//if low graphics are enabled for performance gain.
            volume:{//game volume
                music: 1,
                sound: 1,
            }
        };

        ApplyLanguage(languages.en_us);//default language
        SaveOptions();
    }
    
    //IF OPTIONS FROM THE USER HAVE ALREADY BEEN SAVED
    else {//load saved options
        console.log("options.json not empty, loading it's data...");
        
        ApplyLanguage(options.language);

        
        //UPDATE VISUALLY THE OPTIONS
        //language
        console.log("loading language: ",options.language.language_id)
        if      (options.language.language_id == "en_us") {HTML.options.language_selector.value = 1}
        else if (options.language.language_id == "fr_fr") {HTML.options.language_selector.value = 2}
        
        //graphics checkbox
        if (options.low_graphics_enabled) HTML.options.graphics_checkbox.checked = true;
        
        //volume ranges
        HTML.options.music_slider.value = options.volume.music;
        HTML.options.sound_slider.value = options.volume.sound;
        
        //controls
        HTML.options.controls.left.value        = options.controls.left;
        HTML.options.controls.right.value       = options.controls.right;
        HTML.options.controls.up.value          = options.controls.up;
        HTML.options.controls.down.value        = options.controls.down;
        HTML.options.controls.validate.value    = options.controls.validate;
    }

}


function Options() {//options button for options menu
    HideScene(scene.main_menu);
    ShowScene(scene.options_menu);
}


function SelectLanguage() {
    var selector = HTML.options.language_selector;
    var selected_language = selector.options[selector.selectedIndex].value;
    
    switch (selected_language) {
        case "1": ApplyLanguage(languages.en_us); break;//en_us
        case "2": ApplyLanguage(languages.fr_fr); break;//fr_fr
    }
    console.log(selected_language);
}


function ApplyLanguage(selected_language) {
    options.language = selected_language;//change language setting

    //APPLY LANGUAGE TO ALL ELEMENTS
    //init_message translation from screen load is applied in the function displaying this message (LoadingScreen();)
    //game messages translation is applied in SendMessage(); object of functions.
    
    //main menu
    HTML.main_menu.button.play.innerHTML                    = options.language.UI.main_menu.button.play;
    HTML.main_menu.button.tutorial_and_rules.innerHTML      = options.language.UI.main_menu.button.tutorial;
    HTML.main_menu.button.options.innerHTML                 = options.language.UI.main_menu.button.options;
    HTML.main_menu.button.credits.innerHTML                 = options.language.UI.main_menu.button.credits;
    HTML.main_menu.button.exit.innerHTML                    = options.language.UI.main_menu.button.exit;
    
    //quit menu
    HTML.quit_warning_menu.msg.innerHTML                    = options.language.UI.main_menu.quit.msg;
    HTML.quit_warning_menu.button.confirm.innerHTML         = options.language.UI.main_menu.quit.confirm;
    HTML.quit_warning_menu.button.cancel.innerHTML          = options.language.UI.main_menu.quit.cancel;
    
    //tutorial
    HTML.tutorial.button.back_to_main_menu.innerHTML        = options.language.UI.tutorial.back;

    //options
    HTML.options.language_option_title.innerHTML            = options.language.UI.options.language2;
    HTML.options.low_graphics_option_title.innerHTML        = options.language.UI.options.lqg;
    HTML.options.music_option_title.innerHTML               = options.language.UI.options.music;
    HTML.options.sound_option_title.innerHTML               = options.language.UI.options.sound;
    HTML.options.controls_option_title.innerHTML            = options.language.UI.options.controls.msg;
        //controls
        //##########################################################################################################
        HTML.options.controls.left_msg.innerHTML                = options.language.UI.options.controls.left;
        HTML.options.controls.right_msg.innerHTML               = options.language.UI.options.controls.right;
        HTML.options.controls.down_msg.innerHTML                = options.language.UI.options.controls.down;
        HTML.options.controls.up_msg.innerHTML                  = options.language.UI.options.controls.up;
        HTML.options.controls.validate_msg.innerHTML            = options.language.UI.options.controls.validate;
        HTML.options.controls.default.innerHTML                 = options.language.UI.options.controls.default;
        //##########################################################################################################

    HTML.options.button.back_to_main_menu.innerHTML         = options.language.UI.options.back;
    
    //credits
    HTML.credits.title.dev.innerHTML                        = options.language.UI.credits.development;
    HTML.credits.title.graphism.innerHTML                   = options.language.UI.credits.graphism;
    HTML.credits.title.music.innerHTML                      = options.language.UI.credits.music2;
    HTML.credits.title.music_content.innerHTML              = options.language.UI.credits.music2_content;
    HTML.credits.title.sfx.innerHTML                        = options.language.UI.credits.sfx;
        //##########################################################################################################
        HTML.credits.title.libraries.innerHTML                  = options.language.UI.credits.libraries;
        //##########################################################################################################
    HTML.credits.title.notice.innerHTML                     = options.language.UI.credits.notice;

    //game
        //tabs
        HTML.game.player1_interface_title.innerHTML             = options.language.UI.game.player1;
        HTML.game.player2_interface_title.innerHTML             = options.language.UI.game.player2;
        for (let i=0; i<2; i++) {
            document.getElementsByClassName("score_subtitle")[i].innerHTML      = options.language.UI.game.score;
            document.getElementsByClassName("movements_subtitle")[i].innerHTML  = options.language.UI.game.movements;
            document.getElementsByClassName("get_button")[i].innerHTML          = options.language.UI.game.get;
            document.getElementsByClassName("victories_subtitle")[i].innerHTML  = options.language.UI.game.victories;
        }
        //bottom tab
        HTML.game.button.start_game.innerHTML               = options.language.UI.game.start;
        HTML.game.button.new_game.innerHTML                 = options.language.UI.game.new;
        HTML.game.button.back_to_menu.innerHTML             = options.language.UI.game.go_back;
        document.getElementsByClassName("turn_subtitle")[0].innerHTML   = options.language.UI.game.turn;
        document.getElementsByClassName("msg_subtitle")[0].innerHTML    = options.language.UI.game.msg;

}


function SwitchGraphics() {//function to control low/high graphics option
    options.low_graphics_enabled = HTML.options.graphics_checkbox.checked;
    request_clear = HTML.options.graphics_checkbox.checked;
}


function ChangeControl(control) {//select the control to change
    console.log(`Changing control key to the following : ${control}`);

    for (let event in listener) {//for all controls
        if ( listener.hasOwnProperty(event) ) {

            if (event === control) listener[event] = true;//only change the control we want
            else listener[event] = false;//not the others
                    
        }
    }

    ApplyKey(control);//bind the key now that the control is selected
    SaveOptions();
}


function ApplyKey(control) {//bind the new key to the appropriate control
    document.getElementById(`control_${control}`).value = "Select a key";
    
    //waiting for the user to select a key. Apply it when it is selected
    document.onkeydown = function (e) {
        var key_to_bind = e.key;
        console.log("selected key for the control: ",key_to_bind);
        
        //apply to the right control
        if (listener.left) {
            options.controls.left = key_to_bind;//change key
            HTML.options.controls.left.value = key_to_bind;//update display

        } else if (listener.right) {
            options.controls.right = key_to_bind;
            HTML.options.controls.right.value = key_to_bind;

        } else if (listener.down) {
            options.controls.down = key_to_bind;
            HTML.options.controls.down.value = key_to_bind;

        } else if (listener.up) {
            options.controls.up = key_to_bind;
            HTML.options.controls.up.value = key_to_bind;

        } else if (listener.validate) {
            options.controls.validate = key_to_bind;
            HTML.options.controls.validate.value = key_to_bind;
        }

        //disable the control listener (to not change it by inadvertance when quitting the menu for example).
        for (let event in listener) {//for all controls
            if ( listener.hasOwnProperty(event) ) {
                
                listener[event] = false;//deselect it
                console.log(event, listener[event]);
            
            }
        }
        
        //unload the key listener
        document.onkeydown = null;
    }
}


function ResetKeys() {//reset controls to default
    //internal change
    options.controls.left       = "Q";
    options.controls.right      = "D";
    options.controls.down       = "S";
    options.controls.up         = "Z";
    options.controls.validate   = " ";
    //update display
    HTML.options.controls.left.value        = options.controls.left.toUpperCase();
    HTML.options.controls.right.value       = options.controls.right.toUpperCase();
    HTML.options.controls.down.value        = options.controls.down.toUpperCase();
    HTML.options.controls.up.value          = options.controls.up.toUpperCase();
    HTML.options.controls.validate.value    = options.controls.validate.toUpperCase();
}


function SaveOptions() {//save options into a file
    fs.writeFileSync("user_data/options.json", JSON.stringify(options));
    console.log("options.json has been updated.");
}


function QuitOptions() {//function to quit the options menu to go back to the main menu.
    HideScene(scene.options_menu);
    ShowScene(scene.main_menu);
}












//CREDITS
function Credits() {//credits button to show full credits
    ShowScene(scene.credits);
}


function DispReadMe() {//open README.txt in a window
    CreateReadMeWindow();
}


function DispNotice() {//open NOTICE.txt in a window
    CreateNoticeWindow();
}


function DispLicense() {//open LICENCE.txt in a window
    CreateLicenseWindow();
}


function CloseCredits() {//close credits menu to go back to main menu
   HideScene(scene.credits); 
}












//QUIT
function ConfirmQuit() {//quit button to show a window that confirms quit. 2 buttons are displayed to confirm quit or cancel it, corresponding to the 2 functions below.
    ShowScene(HTML.quit_warning_menu.container,   ((window.innerWidth/2)-(HTML.quit_warning_menu.container.offsetWidth/2))+"px");
}


function Quit() {//quit confirmed, quit and stop proccess
    remote.app.quit();
}


function CancelQuit() {//quit canceled, the window is closed, and the player is back to the menu.
    HideScene(HTML.quit_warning_menu.container);
}