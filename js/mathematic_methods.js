// Plant is a 2 players strategy game, where the goal is to take as much space as possible on the terrain with a plant by making it growing.
    
// Copyright (c) 2018-2021 Picorims<picorims.contact@gmail.com> and Cirno, France. All rights reserved.

// Licensed under the GNU Affero General Public License version 3.0 (GNU AGPL v3.0).
// More information about the license at LICENSE.md to the root of the program. If it is missing, see <https://www.gnu.org/licenses/>.
// A full notice can be found at NOTICE.md to the root of the program,
// and you should see README.md as well for other information.

//ALL MATHEMATICAL METHODS USED IN THE GAME THAT IS NOT SPECIFIC TO THAT GAME
function getRandom(min, max) {//return a random integer number between min and max
    if (isFinite(min)==false) {console.error("[Math Method]{getRandom} Invalid argument for parameter 'min' : expected a number, got "+min); return;}
    if (isFinite(max)==false) {console.error("[Math Method]{getRandom} Invalid argument for parameter 'max' : expected a number, got "+max); return;}
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function isOdd(X) {//return if the integer is even or not (if false -> odd)
    if (isFinite(min)==false) {console.error("[Math Method]{isOdd} Invalid argument for parameter 'X' : expected a number, got "+X); return;}
    var modulo = X%2;
    return (modulo==0)? true:false ;
}