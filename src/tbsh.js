/*  tbsh.js - TerminalBox Shell
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

    const terminal = document.getElementById('terminal');
    const output = document.getElementById('output');
    const input = document.getElementById('input');
    const codeEditorWindow = document.getElementById('code-editor-window');
    const executeButton = document.getElementById('execute-button');
    const saveExecuteButton = document.getElementById('save-execute-button');

    let editor = null;
    let currentFilename = null;
    let inputCallback = null;
    let isRunningPythonScript = false;
    
    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const command = input.value;
            input.value = '';

            const commandElement = document.createElement('div');
            commandElement.textContent = '$ ' + command;
            output.appendChild(commandElement);

            if (!isRunningPythonScript) {
                processCommand(command);
            }

            handleUserInput(command);
        }
    });
    
    function processCommand(command) {
        const args = command.split(' ');
        const cmd = args[0];

        switch (cmd) {
            case 'help':
               outputCommandOutput('For available commands and other help info, see <a href="https://terminalbox.mytestapp.me/documentation.html" target="_blank">this URL.</a>');
                break;
            case 'date':
                const currentDate = new Date().toDateString();
                outputCommandOutput(currentDate);
                break;
            case 'echo':
                const outputText = args.slice(1).join(' ');
                outputCommandOutput(outputText);
                break;
            case 'touch':
                const filename = args[1];
                const contentIndex = args.findIndex(arg => arg.startsWith('?content='));
                if (contentIndex !== -1) {
                    const contentArg = args[contentIndex];
                    const content = contentArg.substring(contentArg.indexOf('=') + 1);
                    createFile(filename, content);
                } else {
                    createFile(filename);
                }
                break;
            case 'open':
                openFile();
                break;
            case 'dump':
                const rootNodeSelector = args[1] || 'html';
                const rootNode = getRootNode(rootNodeSelector);
                if (rootNode) {
                    const htmlTree = generateHTMLTree(rootNode);
                    outputCommandOutput(htmlTree);
                } else {
                    outputCommandOutput('Invalid node: ' + rootNodeSelector);
                }
                break;
            case 'clear':
                output.innerHTML = 'TerminalBox v2.1. Copyright (c) <script type="text/javascript">document.write(new Date().getFullYear());</script> Impact Tiling Group Pty Ltd. All rights reserved. All external libraries used (c) their respective owners.';
                break;
            default:
                outputCommandOutput("tbsh: command not found.");
        }
    }

    function outputCommandOutput(outputText, isError = false) {
                const outputElement = document.createElement('div');
                outputElement.innerHTML = outputText;
                if (isError) {
                    outputElement.classList.add('error-message');
                }
                output.appendChild(outputElement);
                terminal.scrollTop = terminal.scrollHeight;
            }
    
    function runHTMLCode(code) {
        const outputWindow = window.open('', '_blank');
        outputWindow.document.write(code);
        outputWindow.document.close();
    }

    function runJavaScriptCode(code) {
        try {
            const result = eval(code);
            if (result !== undefined) {
                outputCommandOutput(result.toString());
            }
        } catch (error) {
            outputCommandOutput('Error: ' + error.message, true);
        }
    }

    // This function handles the user input during Python script execution.
    function handleUserInput(inputValue) {
        if (inputCallback) {
            inputCallback(inputValue);
            inputCallback = null;
        }
    }
    
    function runPythonCode(code) {
        isRunningPythonScript = true;

        Sk.configure({
            output: (text) => outputCommandOutput(text),
            __future__: Sk.python3,
            read: (x) => {
                if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                    throw "File not found: '" + x + "'";
                return Sk.builtinFiles["files"][x];
            },
            inputfun: function(prompt) {
                return new Promise(function(resolve) {
                    inputCallback = resolve;
                });
            }
        });

        Sk.misceval.asyncToPromise(() => {
            return Sk.importMainWithBody("<stdin>", false, code, true);
        }).then(() => {
            isRunningPythonScript = false;
        }, (error) => {
            outputCommandOutput('Error: ' + error.toString(), true);
            isRunningPythonScript = false;
        });
    }

        function getRootNode(selector) {
            if (selector === 'document') {
                return document.documentElement;
            } else {
                return document.querySelector(selector);
            }
        }

function generateHTMLTree(node, indent = 0) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        let html = '  '.repeat(indent) + '&lt;' + tagName;

        for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            html += ' ' + attr.name + '="' + attr.value + '"';
        }

        html += '&gt;\\n';

        for (let child = node.firstChild; child; child = child.nextSibling) {
            html += generateHTMLTree(child, indent + 1);
        }

        html += '  '.repeat(indent) + '&lt;/' + tagName + '&gt;\\n';
        return html;
    } else if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue.trim();
        if (text) {
            return '  '.repeat(indent) + text + '\\n';
        }
    }
    return '';
}

    function createFile(filename, content = '') {
        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }


    function openFile() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.html,.css,.js,.ts,.xml,.swift,.py,.sh,.bash,.zsh,.csh,.tcsh,.ps1,.m,.mm,.c,.h,.cpp,.hpp,.inl,.def,.cc,.cxx,.cs,.java,.s,.asm,.nasm,.wasm,.json,.yml,.yaml,.kt,.kts';

        fileInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = function (event) {
                const content = event.target.result;
                codeEditorWindow.style.display = 'block';
                terminal.style.height = '50%';
                currentFilename = file.name;

                if (editor === null) {
                    editor = ace.edit("ace-editor");
                    editor.setTheme("ace/theme/chrome");
                }

                const mode = getFileMode(file.name);
                editor.getSession().setMode("ace/mode/" + mode);
                editor.setValue(content);
                editor.clearSelection();

                
                if (mode === 'javascript' || mode === 'html' || mode === 'python') {
                    executeButton.style.display = 'inline-block';
                    saveExecuteButton.style.display = 'inline-block';
                } else {
                    executeButton.style.display = 'none';
                    saveExecuteButton.style.display = 'none';
                }
            };

            reader.readAsText(file);
        });

        fileInput.click();
    }
    
    function closeCodeEditorWindow() {
        codeEditorWindow.style.display = 'none';
        terminal.style.height = '100%';
        if (editor !== null) {
            editor.setValue('');
        }
    }


    function saveFile() {
        if (editor !== null && currentFilename) {
            const content = editor.getValue();
            const blob = new Blob([content], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = currentFilename;
            link.click();
        }
    }


    function executeCode() {
        if (editor !== null && currentFilename) {
            const code = editor.getValue();
            const mode = getFileMode(currentFilename);

            if (mode === 'javascript') {
                runJavaScriptCode(code);
            } else if (mode === 'html') {
                runHTMLCode(code);
            } else if (mode === 'python') {
                runPythonCode(code);
            }
        }
    }


    function saveAndExecuteCode() {
        saveFile();
        executeCode();
    }

    function getFileMode(fileName) {
        const fileExtension = fileName.split('.').pop();
        switch (fileExtension) {
            case 'js':
                return 'javascript';
            case 'ts':
                return 'typescript';
            case 'html':
                return 'html';
            case 'xml':
                return 'xml';
            case 'css':
                return 'css';
            case 'swift':
                return 'swift';
            case 'py':
                return 'python';
            case 'sh', 'bash', 'zsh', 'csh', 'tcsh':
                return 'sh';
            case 'ps1':
                return 'powershell';
            case 'm', 'mm':
                return 'objectivec';
            case 'c', 'h', 'cpp', 'hpp', 'cc', 'cxx', 'inl', 'def':
                return 'c_cpp';
            case 'cs':
                return 'csharp';
            case 'json':
                return 'json';
            case 'yml', 'yaml':
                return 'yaml';
            case 'java':
                return 'java';
            case 'kt', 'kts':
                return 'kotlin';
            default:
                return 'text';
        }
    }
