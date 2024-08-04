#  build.ps1 - TerminalBox Build Utility
#
#  This file is part of the TerminalBox open-source project.
#
#  Copyright (c) 2024 Impact Tiling Group Pty Ltd. All rights reserved. All external libraries
#  used in TerminalBox (c) their respective owners.
#
#  TerminalBox is free software: you can redistribute it and/or modify it under the terms of
#  the GNU General Public License as published by the Free Software Foundation, either version
#  of the License, or (at your option) any later version.
#
#  TerminalBox is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
#  without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See
#  the GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License along with this program. If
#  not, see https://www.gnu.org/licenses. For inquiries, contact us at support@mytestapp.me.
#

Write-Host "--- Welcome to the TerminalBox Build Utility ---" -ForegroundColor Green

# Check if Electron is installed.
if (-Not (Test-Path "node_modules/electron")) {
    Write-Host "Error! Electron is not installed. Installing..." -ForegroundColor Red
    & npm install electron
}

# If Electron Packager was found, prompt the user to choose the platform to build TerminalBox for.
Write-Host "Which platform do you want to build TerminalBox for?"
Write-Host "1. Mac"
Write-Host "2. Windows"
Write-Host "3. Linux"

$choice = Read-Host "Enter an available option (1/2/3)"

# After choosing a valid platform, prompt the user to choose the architecture if needed.
switch ($choice) {
    1 {
        Write-Host "Building for Mac with Universal architecture..."
        & node_modules/@electron/packager/bin/electron-packager.js . TerminalBox --platform=darwin --arch=universal --icon=icon/terminalbox.icns --overwrite
    }
    2 {
        Write-Host "Select architecture for Windows:"
        Write-Host "1. x64"
        Write-Host "2. arm64"
        Write-Host "3. ia32"
        $arch_choice = Read-Host "Enter an available option (1/2/3)"
        
        switch ($arch_choice) {
            1 { $arch = "x64" }
            2 { $arch = "arm64" }
            3 { $arch = "ia32" }
            default {
                Write-Host "Error! Invalid architecture. Terminating..." -ForegroundColor Red
                exit
            }
        }
        Write-Host "Building for Windows with $arch architecture..."
        & node_modules/@electron/packager/bin/electron-packager.js . TerminalBox --platform=win32 --arch=$arch --icon=icon/terminalbox.ico --overwrite
    }
    3 {
        Write-Host "Select architecture for Linux:"
        Write-Host "1. x64"
        Write-Host "2. arm64"
        $arch_choice = Read-Host "Enter an available option (1/2)"
        
        switch ($arch_choice) {
            1 { $arch = "x64" }
            2 { $arch = "arm64" }
            default {
                Write-Host "Error! Invalid architecture. Terminating..." -ForegroundColor Red
                exit
            }
        }
        Write-Host "Building for Linux with $arch architecture..."
        & node_modules/@electron/packager/bin/electron-packager.js . TerminalBox --platform=linux --arch=$arch --icon=icon/terminalbox.png --overwrite
    }
    default {
        Write-Host "Error! Invalid platform. Terminating..." -ForegroundColor Red
        exit
    }
}
