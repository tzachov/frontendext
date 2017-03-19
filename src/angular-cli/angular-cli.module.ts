import * as vscode from 'vscode';

import { CommandsContainer, ModuleWithCommands } from '../global';
import { createComponent, addSpec } from './commands';

export class AngularCliModule extends ModuleWithCommands implements CommandsContainer {
    registerCommands(context: vscode.ExtensionContext, namespace: string, options: { [key: string]: any }) {
        this.addCommand(context, `${namespace}.createComponent`, (args) => createComponent(args, options.terminal));
        this.addCommand(context, `${namespace}.addSpec`, addSpec);
    }
}
