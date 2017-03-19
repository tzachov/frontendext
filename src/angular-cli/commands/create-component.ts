import * as vscode from 'vscode';

import { AngularCliHelper } from '../shared';
import { CommandArgs } from '../../global';

const genratedTypes = ['Component', 'Directive', 'Pipe', 'Service', 'Class', 'Guard', 'Interface', 'Enum', 'Module'];

export function createComponent(args: CommandArgs, terminal: vscode.Terminal) {
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
                    AngularCliHelper.runNgCliCommand(terminal, `generate ${itemType.label.toLowerCase()} ${itemName}`);
                });
        })
}