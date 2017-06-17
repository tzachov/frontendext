import * as vscode from 'vscode';

import { ModuleWithCommands, CommandsContainer } from '../global';
import { formatJson, sortImports } from './commands';

export class FormattingModule extends ModuleWithCommands implements CommandsContainer {
    registerCommands(context: vscode.ExtensionContext, namespace: string, options: { [key: string]: any; }) {
        this.addCommand(context, `${namespace}.formatJson`, formatJson);
        this.addCommand(context, `${namespace}.sortImports`, sortImports);
    }
}