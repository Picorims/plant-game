// Plant is a 2 players strategy game, where the goal is to take as much space as possible on the terrain with a plant by making it growing.
    
// Copyright (c) 2020 Picorims<picorims.contact@gmail.com> and Cirno, France. All rights reserved.

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

//md file to html
var fs = require('fs');
var showdown  = require('showdown'),
    converter = new showdown.Converter(),
    readme_md, notice_md, license_md;
converter.setFlavor('github');



app.on('ready', ElectronInit);

function ElectronInit() {//initialization of the process
    main_window = new BrowserWindow({
        width: 1440,
        height: 810,
        show: false,
        //frame: false,
        resizable: false,
        maximizable: true,
        backgroundColor: "#222222",
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
        titles: 'README.md',
        frame: true,
        webPreferences:{
            nodeIntegration: false,
        },
    });

    //md to html
    fs.readFile("README.md", function(error, data) {
        if (error) throw error;
        readme_md = data.toString();

        var readme_html = converter.makeHtml(readme_md);

        var readme_html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>README.md</title>
            <link rel="stylesheet" type="text/css" href="../css/md.css" />
        </head>
        <body>
            ${readme_html}
        </body>
        </html>
        `;

        //disable links
        var readme_html = readme_html.replace(/<a/g, "<a class='disabled'"); //all "<a" in the file, not only the first one.

        fs.writeFile("tmp/md_to_html_readme.html", readme_html, function(error) {
            if (error) throw error;
            readme_window.loadFile("tmp/md_to_html_readme.html");
        });

    });

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
        titles: 'NOTICE.md',
        frame: true,
        webPreferences:{
            nodeIntegration: false,
        },
    });

    //md to html
    fs.readFile("NOTICE.md", function(error, data) {
        if (error) throw error;
        notice_md = data.toString();

        var notice_html = converter.makeHtml(notice_md);

        var notice_html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>NOTICE.md</title>
            <link rel="stylesheet" type="text/css" href="../css/md.css" />
        </head>
        <body>
            ${notice_html}
        </body>
        </html>
        `;

        //disable links
        var notice_html = notice_html.replace(/<a/g, "<a class='disabled'"); //all "<a" in the file, not only the first one.

        fs.writeFile("tmp/md_to_html_notice.html", notice_html, function(error) {
            if (error) throw error;
            notice_window.loadFile("tmp/md_to_html_notice.html");
        });

    });

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
        titles: 'LICENSE.md',
        frame: true,
        webPreferences:{
            nodeIntegration: false,
        },
    });

    //md to html
    fs.readFile("LICENSE.md", function(error, data) {
        if (error) throw error;
        license_md = data.toString();

        var license_html = converter.makeHtml(license_md);

        var license_html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>LICENSE.md</title>
            <link rel="stylesheet" type="text/css" href="../css/md.css" />
        </head>
        <body>
            ${license_html}
        </body>
        </html>
        `;

        //disable links
        var license_html = license_html.replace(/<a/g, "<a class='disabled'"); //all "<a" in the file, not only the first one.

        fs.writeFile("tmp/md_to_html_license.html", license_html, function(error) {
            if (error) throw error;
            license_window.loadFile("tmp/md_to_html_license.html");
        });

    });
    
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