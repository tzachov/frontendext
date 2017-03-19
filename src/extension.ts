'use strict';
import * as vscode from 'vscode';

import { CommandsContainer } from './global';
import { AngularCliModule } from './angular-cli/angular-cli.module';
import { TestingModule } from './testing/testing.module';

export function activate(context: vscode.ExtensionContext) {

    let terminal: vscode.Terminal = vscode.window.createTerminal('Front End Extension');
    terminal.sendText('cls');

    let modules: CommandsContainer[] = [
        new AngularCliModule(),
        new TestingModule()
    ];

    let options = {
        terminal: terminal
    };

    modules.forEach((mod) => {
        mod.registerCommands(context, 'extension', options);
    });
}

export function deactivate() {
}
