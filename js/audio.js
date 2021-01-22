// Plant is a 2 players strategy game, where the goal is to take as much space as possible on the terrain with a plant by making it growing.
    
// Copyright (c) 2018-2021 Picorims<picorims.contact@gmail.com> and Cirno, France. All rights reserved.

// Licensed under the GNU Affero General Public License version 3.0 (GNU AGPL v3.0).
// More information about the license at LICENSE.md to the root of the program. If it is missing, see <https://www.gnu.org/licenses/>.
// A full notice can be found at NOTICE.md to the root of the program,
// and you should see README.md as well for other information.

//SOUND MANAGEMENT
var audio;//all audio files

function AudioInit() {//initialization of the audio part of the game
    console.group("audio init");
    console.info("%caudio init...","color:purple; font-weight:bold");
    console.time("audio init duration");
    
    audio = temp_load.audio;
    audio.song1.setVolume(options.volume.music);//audio.song1.setVolume(1);
    console.log(audio);

    console.timeEnd("audio init duration");
    console.info("%caudio init successfully ended","color:purple; font-weight:bold");
    console.groupEnd("audio init");
    document.dispatchEvent(event.audio_ready);
}


function LoopMusic() {//loop the music
    audio.song1.loop();
}


function UpdateVolumeMusic() {//updates the music volume.
    var vol = parseFloat(HTML.options.music_slider.value);
    options.volume.music = vol;
    audio.song1.setVolume(vol);//THIS IS NOT WORKING AND MUST BE INSPECTED WHEN CHANGING THE VOLUME IN THE OPTION MENU.
}


function UpdateVolumeSound() {//updates the sounds volume.
    //sound = sound_slider.value
}