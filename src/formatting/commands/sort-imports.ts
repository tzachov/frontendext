import * as vscode from 'vscode';

import { CommandArgs } from '../../global';

export function sortImports(args: CommandArgs) {
    const editor = vscode.window.activeTextEditor;
    const document = editor.document;

    const raw = document.getText();

    let arr: Array<{ key: string; value: string }> = [];

    const v = raw.replace(/^(import)[\s]*\{[\s]*([\w+*\s*|\,*]*)*[\s]*\}[\s]*from[\s]*['|"]([^']*)['|"|\s]?;/gm, (original, statement, importList, libLocation) => {
        const imports = importList.split(',')
            .map((item) => item.trim())
            .sort()
            .join(', ');
        const newImport = `import { ${imports} } from '${libLocation}';`;
        arr.push({ key: libLocation, value: newImport });
        return undefined;
    });

    const importsBlock = arr
        .map((item) => item.key)
        .sort()
        .map((key) => arr.find(item => item.key === key).value)
        .join('\r\n');

    editor.edit((eb: vscode.TextEditorEdit) => {
        eb.replace(new vscode.Range(0, 0, document.lineCount, 0), importsBlock + v);
    })
    //debugger
}

const FILE_MODE: vscode.DocumentFilter = { scheme: 'file' };

class SortFormatter implements vscode.DocumentRangeFormattingEditProvider {
    public provideDocumentRangeFormattingEdits(
        document: vscode.TextDocument,
        range: vscode.Range,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): Thenable<vscode.TextEdit[]> {

        return new Promise((resolve, reject) => { });
    }
}