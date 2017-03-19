import * as vscode from 'vscode';

export interface CommandsContainer {
    registerCommands(context: vscode.ExtensionContext, namespace: string, options: { [key: string]: any });
}
