'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { exists } from 'fs';

const genratedTypes = ['Component', 'Directive', 'Pipe', 'Service', 'Class', 'Guard', 'Interface', 'Enum', 'Module'];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let terminal: vscode.Terminal = vscode.window.createTerminal('Angular CLI Extension');
    terminal.sendText('cls');



    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    addCommand(context, 'extension.createComponent', (args: CommandArgs) => {
        let blueprints = genratedTypes.map((item) => <vscode.QuickPickItem>{ label: item, description: `Generates ${item} blueprint` });

        vscode.window.showQuickPick(blueprints)
            .then((itemType) => {
                if (!itemType) {
                    return;
                }

                vscode.window.showInputBox({ prompt: 'Name', placeHolder: `my-${itemType.label.toLowerCase()}` })
                    .then((name) => {
                        if (!name) {
                            return;
                        }

                        let rootFolder = 'src'; // TODO: read from .angular-cli.json\apps[0]
                        let appFolder = 'app';

                        let appBase = args.fsPath.substring(args.fsPath.indexOf(rootFolder + '\\' + appFolder));
                        let itemPath = appBase.substring((rootFolder + '\\' + appFolder).length + 1);

                        let itemName = (itemPath ? itemPath + '\\' : '') + name;
                        runNgCliCommand(terminal, `generate ${itemType.label.toLowerCase()} ${itemName}`);
                    });
            })
    });

    addCommand(context, 'extension.addSpec', (args: CommandArgs) => {
        //vscode.window.showInformationMessage(`Adding spec file for ${args.fsPath}`);
        let withoutExt = args.fsPath.substr(0, args.fsPath.lastIndexOf('.ts'));
        let specFilename = withoutExt + '.spec.ts';
        console.log('specFilename', specFilename);

        if (exists(specFilename)) {
            vscode.window.showWarningMessage(`Override ${specFilename}?`, 'Yes', 'No')
                .then((result) => {
                    if (result !== 'Yes') {
                        return;
                    }

                    createSpecFile(specFilename);
                });
        } else {
            createSpecFile(specFilename);
        }
    });


    addCommand(context, 'extension.addTestMethod', (args) => {
        // todo: add test method in proper spec file (check if already exists)
        var selectedText = vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection);
        console.log('extension.addTestMethod selectedText', selectedText);
    });
}

function addCommand(context: vscode.ExtensionContext, name: string, command: (...args: any[]) => any, thisArg?: any) {
    context.subscriptions.push(vscode.commands.registerCommand(name, command, thisArg));
}

function runNgCliCommand(terminal: vscode.Terminal, command: string) {
    terminal.sendText(`npm run ng -- ${command}`);
}

function createSpecFile(filename: string) {

}

// this method is called when your extension is deactivated
export function deactivate() {
}

class CommandArgs {
    fsPath: string;
    external: string;
    $mid: number;
    path: string;
    scheme: string;
}