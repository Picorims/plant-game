// Plant is a 2 players strategy game, where the goal is to take as much space as possible on the terrain with a plant by making it growing.
    
// Copyright (c) 2019 Picorims<picorims.contact@gmail.com> and Cirno, France. All rights reserved.

// Licensed under the GNU Affero General Public License version 3.0 (GNU AGPL v3.0).
// More information about the license at LICENSE.txt to the root of the program. If it is missing, see <https://www.gnu.org/licenses/>.
// A full notice can be found at NOTICE.txt to the root of the program,
// and you should see README.txt as well for other information.

//ELECTRON MAIN JS OF PLANT GAME
const electron = require('electron');//import electron
const url = require('url');//import url system
const path = require('path');//import path system
const ipcMain = require('electron').ipcMain;//import electron ipcMain
const ipcRenderer = require('electron').ipcRenderer;//import electron ipcRenderer
const {
    app,
    BrowserWindow,
    Menu,
    globalShortcut
} = electron;
process.env.NODE_ENV = 'development';//development||production
let main_window;//game window
let rules_window;//window for rules
let readme_window;//window for README.txt
let notice_window;//window for NOTICE.txt
let license_window;//window for LICENSE.txt

app.on('ready', ElectronInit);

function ElectronInit() {//initialization of the process
    main_window = new BrowserWindow({
        width: 1440,
        height: 810,
        show: false,
        //frame: false,
        resizable: false,
        maximizable: true,
        webPreferences:{
            nodeIntegration: true,
        },
    });
    main_window.on('ready-to-show', () => {
        main_window.show();
    });
    main_window.on('closed', function () {
        app.quit();
    });
    main_window.loadFile('index.html');
    main_window.setMenu(null)
    main_window.setFullScreen(true);
    main_window.setFullScreenable(false);
    
    if (process.env.NODE_ENV==="development") {//toggle development tools
        main_window.webContents.openDevTools();
        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        Menu.setApplicationMenu(mainMenu);
    }
    
    globalShortcut.register('CommandOrControl+Q', () => {
        app.quit();
    });
}

function CreateRulesWindow() {//creates a window displaying rules
    rules_window = new BrowserWindow({
        width: 1440,
        height: 810,
        titles: 'Règles',
        frame: true,
        webPreferences:{
            nodeIntegration: false,
        },
    });
    rules_window.loadFile('html/Plant Rules.html');
    rules_window.on('close', function () {
        rules_window = null;
    });
}
exports.CreateRulesWindow = CreateRulesWindow;
ipcMain.on('rules_window', function(){
    rules_window.show()
})

function CreateReadMeWindow() {//creates a window displaying README.txt
    readme_window = new BrowserWindow({
        width: 1440,
        height: 810,
        titles: 'README.txt',
        frame: true,
        webPreferences:{
            nodeIntegration: false,
        },
    });
    readme_window.loadFile('README.txt');
    readme_window.on('close', function () {
        readme_window = null;
    });
}
exports.CreateReadMeWindow = CreateReadMeWindow;
ipcMain.on('readme_window', function(){
    readme_window.show()
})

function CreateNoticeWindow() {//creates a window displaying NOTICE.txt
    notice_window = new BrowserWindow({
        width: 1440,
        height: 810,
        titles: 'NOTICE.txt',
        frame: true,
        webPreferences:{
            nodeIntegration: false,
        },
    });
    notice_window.loadFile('NOTICE.txt');
    notice_window.on('close', function () {
        notice_window = null;
    });
}
exports.CreateNoticeWindow = CreateNoticeWindow;
ipcMain.on('notice_window', function(){
    notice_window.show()
})

function CreateLicenseWindow() {//creates a window displaying LICENSE.txt
    license_window = new BrowserWindow({
        width: 1440,
        height: 810,
        titles: 'LICENSE.txt',
        frame: true,
        webPreferences:{
            nodeIntegration: false,
        },
    });
    license_window.loadFile('LICENSE.txt');
    license_window.on('close', function () {
        license_window = null;
    });
}
exports.CreateLicenseWindow = CreateLicenseWindow;
ipcMain.on('license_window', function(){
    license_window.show()
})



const mainMenuTemplate = [{//top bar menu
    label: 'File',
    submenu: [{
            label: 'Rules',
            accelerator: process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
            click() {
                CreateRulesWindow();
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click() {
                app.quit();
            }
        }
    ]
}];    

if (process.platform == 'darwin') {//fix for darwin
    main_window.unshift({});
}