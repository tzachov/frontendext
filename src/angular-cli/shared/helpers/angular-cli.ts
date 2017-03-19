import * as vscode from 'vscode';

export class AngularCliHelper {
    public static runNgCliCommand(terminal: vscode.Terminal, command: string) {
        terminal.sendText(`npm run ng -- ${command}`);
    }
}
