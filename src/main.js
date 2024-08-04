/*  main.js - TerminalBox Launcher
*
*  This file is part of the TerminalBox open-source project.
*
*  Copyright (c) 2024 Impact Tiling Group Pty Ltd. All rights reserved. All external libraries
*  used in TerminalBox (c) their respective owners.
*
*  TerminalBox is free software: you can redistribute it and/or modify it under the terms of
*  the GNU General Public License as published by the Free Software Foundation, either version
*  of the License, or (at your option) any later version.
*
*  TerminalBox is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
*  without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See
*  the GNU General Public License for more details.
*
*  You should have received a copy of the GNU General Public License along with this program. If
*  not, see https://www.gnu.org/licenses. For inquiries, contact us at support@mytestapp.me.
*/

const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
