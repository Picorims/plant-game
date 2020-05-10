// Plant is a 2 players strategy game, where the goal is to take as much space as possible on the terrain with a plant by making it growing.
    
// Copyright (c) 2020 Picorims<picorims.contact@gmail.com> and Cirno, France. All rights reserved.

// Licensed under the GNU Affero General Public License version 3.0 (GNU AGPL v3.0).
// More information about the license at LICENSE.txt to the root of the program. If it is missing, see <https://www.gnu.org/licenses/>.
// A full notice can be found at NOTICE.txt to the root of the program,
// and you should see README.txt as well for other information.

//ALL EVENTS TRACKING THE INITIALIZATION
function MainReady()        { event.main_init_finished = true;      }
function GraphismReady()    { event.graphism_init_finished = true;  }
function TutorialReady()    { event.tutorial_init_finished = true;  }
function OptionsReady()     { event.options_init_finished = true;   }
function PreGameReady()     { event.pre_game_init_finished = true;  }
function AudioReady()       { event.audio_init_finished = true;     }