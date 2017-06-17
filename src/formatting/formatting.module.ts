import * as vscode from 'vscode';

import { ModuleWithCommands, CommandsContainer } from '../global';
<<<<<<< HEAD
import { formatJson, sortImports } from './commands';
=======
import { formatJson, createBarrel } from './commands';
>>>>>>> 01dd66183ed06ff22485fb7bbe523244dfd6222b

export class FormattingModule extends ModuleWithCommands implements CommandsContainer {
    registerCommands(context: vscode.ExtensionContext, namespace: string, options: { [key: string]: any; }) {
        this.addCommand(context, `${namespace}.formatJson`, formatJson);
<<<<<<< HEAD
        this.addCommand(context, `${namespace}.sortImports`, sortImports);
=======
        this.addCommand(context, `${namespace}.createBarrel`, createBarrel);
>>>>>>> 01dd66183ed06ff22485fb7bbe523244dfd6222b
    }
}
