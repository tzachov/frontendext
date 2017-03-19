import * as vscode from 'vscode';

export class ModuleWithCommands {
    //registerCommands(context: vscode.ExtensionContext, namespace: string, options: { [key: string]: any });

    addCommand(context: vscode.ExtensionContext, name: string, command: (...args: any[]) => any, thisArg?: any) {
        context.subscriptions.push(vscode.commands.registerCommand(name, command, thisArg));
    }
}
