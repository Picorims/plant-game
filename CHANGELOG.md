# CHANGELOGS ( v0.1.0(b6) )

    Plant is a 2 players strategy game, where the goal is to take as much space as possible on the terrain with a plant by making it growing.
    
    Copyright (c) 2019 Picorims<picorims.contact@gmail.com> and Cirno, France. All rights reserved.
    
    Licensed under the GNU Affero General Public License version 3.0 (GNU AGPL v3.0).
    More information about the license at LICENSE.md to the root of the program. If it is missing, see <https://www.gnu.org/licenses/>.
    A full notice can be found at NOTICE.md to the root of the program,
    and you should see README.md as well for other information.



## WHAT IS THIS CHANGELOG IT ABOUT ?

This changelog is giving you all the information about all the changes until this build, internally and externally. You can find when and
where something appeared. However changes are summarized to what changed globally, for more detail you should go explore the concerned build.



## HOW DOES IT WORKS ?

The changes are classificated by version, from alpha to release, in the chronological order. The latest changelogs are to the bottom of the
file! Bugs are indicated by the "BUG FIX" keywords.



## HOW DOES VERSIONING WORKS ?

Version starting by "a" is an alpha. Version starting by "0." is a beta. Otherwise it's a release.

The alpha syntax is   : a0.{version}b{build}
ex : a0.1b1
The beta syntax is    : 0.{big_version}.{small/sub_version)(b{build})
ex : 0.1.2(b8)
The release syntax is : {giant_version}.{big_update}.{small_update}(b{build})
ex : 1.2.1(b7)



# ALPHA

## a0.1b1 | August, 31st 2018

- First build of the game
- Contains :
	- HTML base structure :
		- Title
		- Canvas
		- Left and right tab for players
		- Bottom tab, for additional informations and buttons
	- CSS file and some basic design, based on white, gray, green and blue.
	- JS base structure :
		- (librairy) jQuery-3.3.1.min.js loaded
		- (librairy) p5.min.js loaded. Other p5 files are available in "p5" folder.
		- main.js, empty, for electron program
		- program.js, managing the overall app, and display
		- canvas.js, managing the canvas for game display, and run the game itself.
	- Rules in Plant Rules.html
	- LICENSE.txt, README.txt, NOTICE.txt.
- Objective and rules of the game (may change in the future and become obsolete ==> check Plant Rules.html):
	- Players : 2
	- Terrain grid size : 25x25
	- Dice : 3,4,5,6,7,8 (each has the same probability to be taken)
	- Start : top center & bottom center
	- Rules of moving :
		- Players plays after each other.
		- 20 turns. (1 turn = p1+p2 play)
		- Once dice dropped, the player choose the start of his stem, then make it grow as much as the number allow.
		- Moving :
		  `___________________________________________________________________`
		  `| Moving Direction | .Top Player (Blue) . | Bottom Player (Green) |`
		  `|==================|======================|=======================|`
		  `| . . .TOP . . . . | . . .impossible. . . | . . . no limit. . . . |`
		  `| . . .BOTTOM. . . | . . . no limit . . . | . . .impossible . . . |`
		  `| . . .LEFT. . . . | cannot be twice done | cannot be twice done. |`
		  `| . . .RIGHT . . . | cannot be twice done | cannot be twice done. |`
		  `|==================|======================|=======================|`
		- A stem cannot do more than 8 cases.
		- When a stem is 8 cases long, a flower appear on the 8th case of the stem, keeping safe for the player cases arround
		  (Those cases are reserved but not counted into the score, those still has to be taken by the plant !).
		  This is done using this pattern :
		  `OO#OO`
		  `O###O`
		  `##F##`
		  `O###O`
		  `OO#OO`
		  Where F is the flower, # is reserved, O a classic case.
		- It is possible to start a new stem from another stem (not a flower !) (to the start of the turn only).
		- A case cannot contain the 2 players. If one player take that case, the other cannot access this one anymore.
		- A stem cannot be continued if no others moves are available. If while moving the player used all it's moves,
		  the other moves left cannot be used.
		- If all the turns are ended, or if one of the players is completely stuck at his turn, the game is ended.
		- The player who taken the most cases win.
	- The player choose it's moving before validating.
- Features :
	- Canvas initialization, drawing grid, and with arrows can draw lines of players (directional arrows and Enter on keyboard).
	- Score depending of player's cases taken.
	- Preview canvas on the game canvas to draw gray lines, they show the path the player will select.
	- Players database display auto updated for selected variables.**(1)**
	- Event that listen the keyboard.
	- A function to know if a number is odd (isOdd();).
	- 2 functions x() and y() to convert a coordinate to top/left in pixels.
	- Movements :
		- Does not contain turn, dice, length limitation, point of start of the stem, players' collision, border collision,
		  game end, option to restart.
		- Contain score count, moving limitations reguarding the direction, order to play (the green always start), player path
		  preview.

**(1)** In UpdateTabData(), a line is needed to update a variable to an attributed HTML element, the variable must be into player1 and player2
object, otherwise it needs additional data transfer using sessionStorage().



## a0.1b2 | October, 20th 2018

- Movement :
	- Added turn, dice, length limitation, players' collision, border collision, game end.
	- Still not contain point of start of the stem (in work, with the function SetLineStart(player,X,Y)).
- Added a tilemap database saving for each case the item type (line, flower), the player owner of the case, and if it's connected to
  top/bottom/left/right.
- Added the bottom interface :
	- Button to start the game
	- Dice and random value
	- Turn count
	- End of the game with winner, looser and draw for turn count end only. **(1)**
	- Message explaining why the player can't perform a move when it's the case.
	- Button to restart. No need for a refresh anymore, with the result of a much more optimized restart !
- Now the player that must play has an overlay to his tab.
- BUG FIX : Cleaned initialization, deleted double var declaration. **(2)**

**(1)** The game won't detect if both players are stuck, and this will result in a need to skip all turns until the last one.
**(2)** No variable from another file can be accessible directly "as is" in p5.js function such as setup() and draw(). We recommend using
external functions call if such variables need an interaction with p5.js functions. 



## a0.1b3 | December, 21st 2018

- Movement :
	- Added point of start of the stem. The player can also restart it's preview to do a new preview.
	- Added limitation for stem length
	- Added the flower and their aura blocking cases for the opponent.
- The game now ends if one of the players is bloqued at the end of a player turn.
- Added a very early and simple way to visualize where the player can start from depending of available movements from these cases.
- BUG FIX : On the start of the stem connected to the left or the right, you could again draw preview in the same direction, whereas it is
  forbidden in the rules.
- BUG FIX : Small fixes in the calcul of the stem length.



## a0.2b1 | December, 26th 2018

- Some cleaning in variables and functions **(1)** :
	- Fixed the wrong traduction of "move(s)" and replaced it by "movement(s)".
	- All variables related to html display have been grouped in the object "display".
	- All variables related to preview line style have been grouped in the object "preview_line".
	- All variables containing an html button element have been grouped in the object "button".
	- Cleaned the html elements IDs and classes to fit these changes.
	- Moved mathematical methods not specific to the game into the file "mathematical_methods.js". (ex: IsOdd(); and GetRandom();)
	- Better support of errors : for functions handling parameters, these parameters are verified to fit the intended form in the
	  function **(2)**.
	- Some functions didn't have comments explaining what they do.
	- max stem length and dice range are now easily customizable rules by only changing the value of their respective variables
	  in the object "rules".
- Added victories counting
- Added an how to play tutorial in README.txt
- Improved turn display (now display actual turn from the max of turns : (actual turn)/(max_turn)
- BUG FIX : Sometime at the very start of the runtime it were possible that an error where trown (player1_collected==null) because the game
  try to display data whereas there is nothing to display yet.

**(1)** WARNING : Meaning from a0.1 to a0.2 lot of variables and functions have changed of name to include these changes!
**(2)** For every new function handling parameters is it highly recommended to support this, using the following format (can fit in a single
line of code) :

```js
if (("parameters to verify are false") /*(type, allowed values, defined or not, optional or not, etc))*/ {
	console.error("[<domain>]{<function>} Invalid argument for parameter '<parameter>' : expected <what was expected>, got"+"<parameter>");
	return;
}
//if the error should drop a structure (array, object, table, etc...), instead of using the format "console.error(""+var)",
//it is recommended to use the more appropriated format "console.error("");console.log(var);"
```



## a0.2b2 | December, 28th 2018

- Improved radically the display of cases where a player can start from (added in a0.1b3). This is now correctly implemented,
  use the colors of the player, and now only shows the available movements for the player who is playing, but during the whole turn
  (not cleared anymore once dice is dropped ! Also fixed the bug when you validate without any movement making black dots very big.
  Finally now it uses it's own canvas instead of using the preview graph which was the reason of the erasement on dice drop.).
- balancing :
	- Reduced grid size from 25x25 to 21x21.
	- Changed dice range from 3-8 to 3-6 (8 movements dropped by dice were actually impossible to fully do before this version,
	  this change aim to fix that).
	- Added bonus (to remove the dependance of luck in scores) :
		- Added a bonus of 2 points when creating a flower
		- Added a bonus of 1 point for each stem case touching the opposite side of the grid.
		- Added a bonus of 1 point for each aura case touching the opponent's plant. This point is stolen from the opponent!
		- When the player turn is ended the bonus optained is displayed in the bottom tab
		  (internally : moved "SendMessage.ClearMessage();" from "ChangeTurn();" function to "GetRandomMovement();" function, so
		  the bonus can be displayed, and it's erased when the next player drop the dice)
- Updated Plant Rules.html to apply balancing.
- The bottom tab height has been increased (120px -> 200px) to handle more information.
- BUG FIX : The initial stem from players were not counted in score.
- BUG FIX : The data about cases containing initial starts weren't accurate : movements from the opponent of the player who own that
  start case were stored as possible whereas it's fully false.
- BUG FIX : Sometime the game ended when the player 2 were bloqued but when it was not it's turn and the other player could still play.
- BUG FIX : Link of the licence were not appearing in the header of Plant Rules.html although this were written in the code.



## a0.2b3 | December, 29th 2018

- Added advices in "Plant Rules.html".



## a0.3b1 | February, 23th 2019

- Integration of Electron.js for creating executables **(1)**
- Added loading screen **(2)**
- Added main menu **(2)**
	- play : play the game.
	- tutorial and rules : access to those, tutorial not added yet.
	- options : option menu, with sound and music volume, plus high or low quality option. Missing other options, and not functional.
	- credits : full credits, with link to README.txt, LICENSE.txt, NOTICE.txt.
	- quit : quit button, same as quit to the top tab but with warning. Top tab is meant to disappear.
- Of course you can go back to menu, once a game is launched, with the new go back to menu button on game end.
- New key bindings : replaced arrows by ZQSD and Enter by spacebar.
- Updated Plant Rules.html to explain better how to play.
- Updated README.txt to make some fixs (grammar, more readable, fixed some wrong infos...)
- Removed the get button to obtain the movements. It's now directly given on turn change.
- Removed in app notice display in Plant Rules.html.
- changed some ID names :
	- (div) : "canvas_handler" --> "game_layers_handler"
	- var : "canvas" --> "main_layer_canvas" **(3)**
- Updated copyright to 2019.
- Prepared the graphism processing for the coming beta cycle :
	- Reorganized p5 main functions in canvas.js (setup, preload, draw), they stay in that file but are clearly separated from
	  the game process.
	- Added the div that will handle most of the graphical process.
	- Prepared canvas corresponding to the graphical structure of the background and the main graphical effects.
	- Prepared the file (background.js) handling the process, with functions called and ready, but empty.
	- All these changes are not visible at all by the user, and do not have a big impact on performance, so the code is kept functional.
	- Some graphism work as started, but this time it is hidden, puting the code in comment. It includes :
		- shadow_effect : done trough div+css with this ID, ellipse gradient from alpha 0 at center to a semi-transparent color
		  in corners,
		  one black and one yellow, creating depth.
		- floating_particles : a canvas layer displaying floating yellow particles, like fireflies for ambience.
		- leaves button on main menu : button redesigned as leaves using pure css, without image.
- BUG FIX : Flower aura bonus was sometime displaying a wrong value, but graphically only, not affecting the gameplay.

**(1)** When opening the project in git, the command to run the game is "npm start". Also the compiler is not final, we actually integrated
a compiler. Finally we will consider security for the public beta, and isn't in work for alpha. So we won't make any external link
accessible directly from the app.
to get an executable directly, but we plan on maybe setup an installer which will be more user friendly.
**(2)** The game has been splitted into scenes, annd the main game is now one of those scenes.
**(3)** There is no more reason having a main process canvas, as now there's different layers for the main game display, and also other canvas
for graphism in the future. Although it is still the most important one, so it has been renamed in consequence. But we've applied the
following change to get less ambiguity in the code :
- main_layer_canvas is now a CreateGraphics() process and no more a CreateCanvas() process.
- all actions from p5 related to main_layer_canvas has, as it's the case for all other canvas, a prefix like the following :
"main_layer_canvas.(action)"
ex : main_layer_canvas.line(args...);



# BETA

## 0.1.0(b1) | March, 28th 2019

- Big graphical revamp started **(1)** :
	- Everything is themed on nature.
	- Disabled graphical features from the alpha a0.3b1 are enabled back.
		- The floating_particle system has slightly changed : improved performances
		  (using a .svg image instead of an intensive dynamic draw), reviewed style a bit, and finally they've dynamic position,
		  by this understand a random proportional speed and size to make a feel of 3D/depth.
	- A new fancy dynamic background, only missing falling leaves.
	- Removed the header.
	- A new font is used for every text in the game.
	- A new "assets" folder has been created where you can find all required resources relative to graphism and sound.
	- That's the only changes for now, and still a lot of progress is needed, the UI is not finished yet too.
- Added FPS display in top left corner.
- The version now appear in the credits menu.
- Canvas elements are no more called using "div.children[i]" but using "p5_canvas.elt", avoiding possible bugs if the canvas
  order change in the future.
- Removed jQuery which was completely useless.

**(1)** This introduced performances problems, so be sure to run the app without too much process behind from other apps!



## 0.1.0(b2) | July, 23rd 2019

- Graphic changes :
	- Added falling leaves to the background
	- The loading screen message is now animated.
	- Added a transition between the loading screen and the main menu.
	- The low graphics option is now functional, and can boost a bit the performances.
	- background.js is now more readable, with a lot of aliases used for variables in most of the functions.
	  Some parts got some better explanation as well.
	- As the main game UI isn't started, the transparent colors has less opacity so it's more visible with the new dynamic background.
	- Added the game logo on the main menu, not final design, not fully animated.
- Added music, started audio "engine".
- The game isn't launched before the initialization has finished.
	- Initialization information is better displayed in the logs.
- Plant b0.1b1 may contain some false version numerotation at some places (a0.3b2 instead of b0.1b1)
- Renamed scene.game_menu into scene.main_menu
- BUG FIX : The grid wasn't reseted when quiting and launching a new game.



## 0.1.0(b3) | October, 22nd 2019

- Now each player have 3 start points, to increase fight between plants.
- Graphic changes :
    - The game logo is now animated, as a "drawn" animation. Missing the leaves animation, and the base.
    - Changes to the falling leaves particles :
  		- The spawn probability of the falling leave particle can now be changed in fall_ptcl_data.
		- Decreased the ammount of leaves spawned per frame, to increase performances.
		- Changed the leave texture
		- changed the way the display of these particles works to improve FPS. But may be rewritten again due to a higher ammount
		  of resources used.
- Added the tutorial menu, but the tutorial menu itself isn't ready.
- Options are now automatically saved in user_data/options.json
- Added support for French language. Other languages can now be added easily using a JSON file.
- Numerous HTML elements now have an ID.
- Started moving all HTML variables into an "HTML" object.
- BUG FIX : The loading animation when the game loads wasn't horizontally centered.
- BUG FIX : The music volume range bar were not working.



## 0.1.0(b4) | December, 1st 2019

- Gameplay changes:
	- Grid size: 21 ==> 17
	- Bonus point for opposite cases: 1 ==> 5
- Source code structure changes:
	- Moved all html files into a new folder called "html", with the exception of index.html.
	- Moved css file into a new folder called "css".
	- Moved all js files into a new folder called "js", with the exception of main.js.
	- p5 is now found in "js/libraries/p5".
	- js restructuration:
		- Renamed "program.js" into "sub_main.js"
		- Splitted "canvas.js" into "game.js" and "p5_canvas.js". (functions and variables reorganized accordingly).
		  Game process contained in draw() is now called trough a function in game.js.
		- SendMessage() has been moved from sub_main.js to game.js.
- BUG FIX: When starting a new game after having played one, the grid wasn't displayed, and only the first player could play.
  it could behave more and more strangely if we continued restarting games.
- BUG FIX: Player 2 bonus for opposite cases were wrongly counted.
- BUG FIX: Missing translations for game messages.



## 0.1.0(b5) | May, 9th 2020

- Big code clean up (refactoring):
	- All HTML elements excluding scenes, classes and some exceptions have been organized in the "HTML" object.
		- Some elements have by the same way changed of ID to get a more suitable name.
	- New functions created to wrap up the code into more clear sections and simplify code modification.
	- Created ShowScene() and HideScene() to simplify scene management
	- Removed useless "zombie code" in comments (kept some debug parts).
	- Tilemap now contains the coordinates of the targeted case for debug purpose.
- Temporary css to improve controls settings display, and avoid the overlap with the button to go back to main menu.



## 0.1.0(b6) | ?

- Graphical changes:
	- Buttons redesign.
	- Options menu improvements.
	- Tutorial menu improvements.
	- Credits menu improvements.
	- Quit menu improvements.
	- Changelog improvements.
	- Small loading screen improvements.
	- Customized scroll bars.
	- New textures.
	- Decreased the leaves particles spawn rate.
	- Small color changes.
- Internal updates:
	- Updated Electron.js to v8.5.0:
		- Upgraded to Chromium 80.0.3987.86;
		- Upgraded to Node 12.13.0;
		- Upgraded to V8 8.0;
- The quit warning menu is now a scene.
- README.txt, NOTICE.txt, LICENSE.txt CHANGELOG.txt have been converted to README.md, NOTICE.md, LICENSE.md CHANGELOG.md
	- The license content remained untouched.
- Markdown support in-game to match github markdown, with custom css themed with the game.
	- The license do not receive mardown flavor, and is displayed as a text file only.
- Added in-game access to these changelogs, using a new "changelogs" button in the main menu.
- Detached windows now have size limits.
- Removed unused fonts.
- Added missing credits.
- Small CSS clean-up.
	- Main colors now use css variables, to have a more consistent palette. (CSS only)
	- Scenes now have a common class that reduces duplicates.
- Translation fixes.
- range_bar_track.svg has been renamed to wood_stick.svg.
- Small SVG filters improvement in the HTML layout.
- BUG FIX: The winner was not displayed at the end of a game.
- BUG FIX: No grid was displayed when going back to main menu, then launching a new game.
- BUG FIX: The flower aura bonus wasn't accurate.
- BUG FIX: Translations not properly updated on game launch if the language json files have been updated.



# RELEASE

Mmmmmmh... soon ?