#!/bin/sh
#  build.sh - TerminalBox Build Utility
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

echo "\033[1;32m--- Welcome to the TerminalBox Build Utility ---\033[0m"

# Check if the Electron Packager isn't missing.
if [ ! -f node_modules/@electron/packager/bin/electron-packager.js ]; then
    echo "\033[1;31mError! Could not find electron-packager.js install directory. Terminating...\033[0m"
    exit 1
fi

# If Electron Packager was found, prompt the user to choose the platform to build TerminalBox for.
echo "Which platform do you want to build TerminalBox for?"
echo "1. Mac"
echo "2. Windows"
echo "3. Linux"

read -p "Choose a platform (1/2/3): " choice

# After choosing a valid platform, prompt the user to choose the architecture if needed.
case $choice in
    1)
        echo "Building for Mac with Universal architecture..."
        node_modules/@electron/packager/bin/electron-packager.js . TerminalBox --platform=darwin --arch=universal --icon=icon/terminalbox.icns --overwrite
        ;;
    2)
        echo "Choose architecture for Windows:"
        echo "1. x64"
        echo "2. arm64"
        echo "3. ia32"
        read -p "Choose an architecture (1/2/3): " arch_choice
        case $arch_choice in
            1) arch="x64" ;;
            2) arch="arm64" ;;
            3) arch="ia32" ;;
            *) echo "\033[1;31mError! Invalid architecture. Terminating...\033[0m"; exit 1 ;;
        esac
        echo "Building for Windows with $arch architecture..."
        node_modules/@electron/packager/bin/electron-packager.js . TerminalBox --platform=win32 --arch=$arch --icon=icon/terminalbox.ico --overwrite
        ;;
    3)
        echo "Choose architecture for Linux:"
        echo "1. x64"
        echo "2. arm64"
        read -p "Enter your choice (1/2): " arch_choice
        case $arch_choice in
            1) arch="x64" ;;
            2) arch="arm64" ;;
            *) echo "\033[1;31mError! Invalid architecture. Terminating...\033[0m"; exit 1 ;;
        esac
        echo "Building for Linux with $arch architecture..."
        node_modules/@electron/packager/bin/electron-packager.js . TerminalBox --platform=linux --arch=$arch --icon=icon/terminalbox.png --overwrite
        ;;
    *)
        echo "\033[1;31mError! Invalid platform. Terminating...\033[0m"
        exit 1
        ;;
esac
