import * as vscode from 'vscode';
import { readdirSync, readFileSync } from 'fs';
import { CommandArgs } from '../../global';
import { clearText } from './clear-text';

const exp = /(?:\/\/|\/\*)[ ]?(?<type>[A-Z]+)(?:\:|\((?<name>[a-z\/\d]+)\)\:)[ ]?(?<text>.*)/g;

interface ActionComment {
    text: string;
    position: number;
    commentType: string;
    uri: vscode.Uri;
}

interface ActionCommentCollection {
    [file: string]: Array<ActionComment>;
}

export function readComments() {
    return new Promise<ActionCommentCollection>((resolve, reject) => {
        const result: ActionCommentCollection = {};
        vscode.workspace.findFiles('**/*.ts', '**/node_modules/**').then(files => {
            files.forEach(file => {

                const key = vscode.workspace.asRelativePath(file, true);
                const fileContent = readFileSync(file.fsPath, 'utf-8');
                let res: RegExpExecArray;
                const currentFileActions: Array<ActionComment> = [];
                while (res = exp.exec(fileContent)) {
                    const groups = res['groups'];
                    const text = groups.text.replace(/[ ]?\*\/$/, '');
                    const commentType = groups.type;
                    const tooltip = [];
                    if (groups.name) {
                        tooltip.push(`Created by ${groups.name}`);
                    }
                    tooltip.push(file.fsPath);

                    currentFileActions.push({
                        text,
                        commentType,
                        position: exp.lastIndex - res[0].length,
                        uri: file,
                        type: 'Action',
                        contextValue: commentType,
                        tooltip: tooltip.join('\n'),
                        length: res[0].length,
                        id: `${encodeURIComponent(file.path)}_${exp.lastIndex - res[0].length}`
                    });
                }
                if (currentFileActions.length > 0) {
                    result[key] = currentFileActions.sort((a, b) => a.uri.path > b.uri.path ? 1 : ((b.uri.path > a.uri.path) ? -1 : 0));
                }
            });

            resolve(result);
        });
    });
}



export class ActionCommentTreeViewProvider implements vscode.TreeDataProvider<ActionComment> {
    private _onDidChangeTreeData: vscode.EventEmitter<ActionComment> = new vscode.EventEmitter<ActionComment>();
    readonly onDidChangeTreeData: vscode.Event<ActionComment> = this._onDidChangeTreeData.event;

    tree: any;

    constructor() {
        vscode.commands.registerCommand('readComments.openFile', (uri, position) => this.openResource(uri, position));
        vscode.commands.registerCommand('extension.refreshActionComments', () => this.refresh());
        vscode.commands.registerCommand('extension.removeActionComment', (item: ActionComment) => this.removeItem(item.uri, item.position, item.length));
        vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => this.refresh());
    }

    getTreeItem(element: ActionComment): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: ActionComment): vscode.ProviderResult<ActionComment[]> {
        if (this.tree && element) {
            return Promise.resolve(this.tree[element.label]);
        }

        return readComments().then((data: ActionCommentCollection) => {
            const { actions, items } = this.createTree(data);
            this.tree = actions;
            return Promise.resolve(items);
        });
    }

    getParent?(element: ActionComment): vscode.ProviderResult<ActionComment> {
        console.log('getParent', { element });
        // return this.comments[element.label].;
        return null;
    }

    private refresh() {
        readComments().then(c => {
            const { actions } = this.createTree(c);
            this.tree = actions;
            this._onDidChangeTreeData.fire();
        });
    }

    private removeItem(resource: vscode.Uri, start: number, length: number) {
        vscode.window.showTextDocument(resource).then((editor) => {
            let startPosition = editor.document.positionAt(start);
            editor.edit(eb => {
                const endPosition = startPosition.with(startPosition.line, start + length);
                
                // Check if line will become empty after remove
                // TODO: clear white spaces if comment is inline (e.g. hello(); // TODO: ...)
                const beforeContent = editor.document.getText(new vscode.Range(startPosition.with(startPosition.line, 0), startPosition));
                if (beforeContent.trim() === '') {
                    // Update start position to remove the line completely
                    startPosition = editor.document.positionAt(start - beforeContent.length - 1);
                }
                eb.delete(new vscode.Range(startPosition, endPosition));
            }).then(() => {
                editor.document.save().then(() => this.refresh());
            });
        });
    }

    private createTree(comments: ActionCommentCollection) {
        const actions: ActionCommentCollection = {};

        Object.keys(comments)
            .map(filename => comments[filename].forEach(actionComment => {
                if (!actions[actionComment.commentType]) {
                    actions[actionComment.commentType] = [];
                }
                actionComment.uri = actionComment.uri.with({ query: 'line=' + actionComment.position });
                actionComment.command = {
                    command: 'readComments.openFile',
                    title: "Open File",
                    arguments: [actionComment.uri, actionComment.position]
                };
                actionComment.label = actionComment.text;
                actionComment.type = 'Value';
                actions[actionComment.commentType].push(actionComment);
            }));
        const topLevel = Object.keys(actions)
            .map(action => new ActionComment(action, vscode.TreeItemCollapsibleState.Expanded, 'Action'));
        return { items: topLevel, actions };
    }

    private openResource(resource: vscode.Uri, position: number): void {
        vscode.window.showTextDocument(resource).then((editor) => {
            const pos = editor.document.positionAt(position);
            editor.revealRange(new vscode.Range(pos, pos.with({ line: pos.line + editor.document.lineCount })));
            editor.selection = new vscode.Selection(pos, pos);
        });
    }
}

class ActionComment extends vscode.TreeItem {
    contextValue = 'action';
    type: 'Action' | 'Value';
    length: number;

    constructor(actionName: string, collapsibleState?: vscode.TreeItemCollapsibleState, type: 'Action' | 'Value' = 'Value') {
        super(actionName, collapsibleState);
        this.type = type;
    }
}