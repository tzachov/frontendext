import * as vscode from 'vscode';

export function clearText(location: vscode.Range | vscode.Selection) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        return;
    }
    editor.edit((eb) => {
        eb.delete(location);
    });
}
