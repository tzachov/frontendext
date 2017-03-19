import * as vscode from 'vscode';
import * as fs from 'fs';

import { CommandArgs } from '../../global';

export function addTestMethod(args: CommandArgs) {
    // todo: add test method in proper spec file (check if already exists)
    var selectedText = vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection);
    console.log('extension.addTestMethod selectedText', selectedText);

    let withoutExt = args.fsPath.substr(0, args.fsPath.lastIndexOf('.ts'));
    let specFilename = withoutExt + '.spec.ts';
    console.log('specFilename', specFilename);

    let testMethod = `\n  describe('${selectedText}', () => {\n    it('should...', () => {\n      expect(true).toBe(true);\n    });\n  });\n`;

    if (fs.existsSync(specFilename)) {
        let specFileContent = fs.readFileSync(specFilename, 'utf-8');
        
        let closingTagIndex = specFileContent.lastIndexOf('}');
        let content = specFileContent.substr(0, closingTagIndex);

        let newContent = content + testMethod + specFileContent.substr(closingTagIndex);

        fs.writeFile(specFilename, newContent, (error) => {
            if (error) {
                console.error('could not append spec file', error);
            }
        });
    }
}

function createSpecFile() {
    let imports = `import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestComponent } from './test.component';`


}