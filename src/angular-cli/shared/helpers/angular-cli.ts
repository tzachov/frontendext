import * as vscode from 'vscode';

export class AngularCliHelper {
    public static runNgCliCommand(terminal: vscode.Terminal, command: string) {
        terminal.show(true);
        terminal.sendText(`npm run ng -- ${command}`);
        setTimeout(() => terminal.hide(), 5000);
    }
}
