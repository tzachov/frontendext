import * as vscode from 'vscode';
import * as fs from 'fs';
import * as stripComments from 'strip-json-comments';

import { CommandArgs } from '../../global';

const jsonlint = require('jsonlint');
const LINE_SEPERATOR = /\n|\r\n/;

// TODO: make this configurable.
const JSON_SPACE = 4;
export function formatJson(args: CommandArgs) {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        return;
    }

    const raw = editor.document.getText(editor.selection);
    let json = null;

    try {
        json = (new Function("return " + raw))();
        //json = jsonlint.parse(stripComments(raw));
    } catch (jsonLintError) {
        const message: string = jsonLintError.message;
        const lineNumber = parseInt(message.substring(message.indexOf('line ') + 5, message.indexOf(':')), 10);


        return;
    }

    let pretty = JSON.stringify(json, null, JSON_SPACE);

    editor.edit(builder => {
        const start = editor.selection.start;
        //const lines = raw.split(LINE_SEPERATOR);
        const end = editor.selection.end; //  new vscode.Position(lines.length, lines[lines.length - 1].length);
        const allRange = new vscode.Range(start, end);
        builder.replace(allRange, pretty);
    }).then(success => {
        const position = editor.selection.active;

        var newPosition = position.with(position.line, 0);
        var newSelection = new vscode.Selection(newPosition, newPosition);
        editor.selection = newSelection;
    });
}
