'use strict';
import * as vscode from 'vscode';

import { CommandsContainer } from './global';
import { AngularCliModule } from './angular-cli/angular-cli.module';
import { TestingModule } from './testing/testing.module';
import { FormattingModule } from './formatting/formatting.module';

export function activate(context: vscode.ExtensionContext) {

    let terminal: vscode.Terminal = vscode.window.createTerminal('Front End Extension');
    terminal.sendText('cls');

    let modules: CommandsContainer[] = [
        new AngularCliModule(),
        new TestingModule(),
        new FormattingModule()
    ];

    let options = {
        terminal: terminal
    };

    modules.forEach((mod) => {
        mod.registerCommands(context, 'extension', options);
    });

    /*context.subscriptions.push(
        vscode.languages.registerDocumentRangeFormattingEditProvider(FILE_MODE, new JSONFormatter())
    );*/
}

export function deactivate() {
}

/*const FILE_MODE: vscode.DocumentFilter = { scheme: 'file' };

class JSONFormatter implements vscode.DocumentRangeFormattingEditProvider {
    public provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument,
        range: vscode.Range,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): Thenable<vscode.TextEdit[]> {
        const raw = document.getText(range);
        try {
        const json = JSON.parse(raw);
        let pretty = JSON.stringify(raw, null, options.tabSize);
        debugger
        } catch (e) {
            console.error(e);
            debugger
        }
        
        return new Promise((resolve, reject) => { });
    }
}*/