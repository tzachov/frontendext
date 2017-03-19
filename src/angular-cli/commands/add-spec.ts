import * as vscode from 'vscode';
import { exists } from 'fs';

import { CommandArgs } from '../../global';

export function addSpec(args: CommandArgs) {
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
}

function createSpecFile(filename: string) {

}