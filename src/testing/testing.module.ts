import * as vscode from 'vscode';

import { ModuleWithCommands, CommandsContainer } from '../global';
import { addTestMethod } from './commands';

export class TestingModule extends ModuleWithCommands implements CommandsContainer {
    registerCommands(context: vscode.ExtensionContext, namespace: string, options: { [key: string]: any; }) {
        this.addCommand(context, `${namespace}.addTestMethod`, addTestMethod);
    }
}