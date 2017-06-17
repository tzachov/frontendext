import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { CommandArgs } from '../../global';

export function createBarrel(args: CommandArgs) {
    const fsPath = args && args.fsPath ? args.fsPath : vscode.window.activeTextEditor.document.uri.fsPath;
    if (!fsPath) {
        vscode.window.setStatusBarMessage('Could not find path to create barrel', 3000);
        return;
    }

    vscode.window.setStatusBarMessage(`Creating barrel for ${fsPath}`, 3000);

    const f = listFiles(fsPath, '');
    console.log('Result', f);

    /*fs.readdir(fsPath, (error, files) => {
        if (!!error) {
            vscode.window.showErrorMessage(`Could not create barrel: ${error}`);
            return;
        }

        console.log('Files', files);
        const ts = files
            .filter((filename) => new RegExp(/^(?!.*spec\.ts?$)(.*\.ts)?$/m).test(filename));
        const folders = files.filter((filename: string) => fs.lstatSync(path.join(fsPath, filename)).isDirectory());
        console.log('TS Files', ts);
        console.log('Folders', folders)
    });;*/
}

export function listFiles(basePath: string, folder: string, indexFiles: string[] = []): string[] {
    console.log('listFiles', { basePath, folder, indexFiles });

    const allItems = fs.readdirSync(path.join(basePath, folder));
    console.log('allItems', allItems);

    const folders = allItems.filter((filename: string) => fs.lstatSync(path.join(basePath, folder, filename)).isDirectory());
    console.log('Folders', folders);

    if (folders && folders.length > 0) {
        folders.forEach((f) => listFiles(basePath, f, indexFiles));
    }

    const tsFiles = allItems
        .filter((filename) => new RegExp(/^(?!.*spec\.ts?$)(.*\.ts)?$/mi).test(filename) && filename.toLowerCase() !== 'index.ts')
        .filter((filename) => fs.lstatSync(path.join(basePath, folder, filename)).isFile())
        .map((filename) => path.join(filename));

    const indexFilename = path.join(basePath, folder, 'index.ts');
    let content = toExportExpression(tsFiles);
    const formattedIndexFiles = toExportExpression(indexFiles);
    content = [...formattedIndexFiles, ...content, ''];
    fs.writeFileSync(indexFilename, content.join('\n'));

    indexFiles.push(path.join(folder).replace(/\\/g, () => '/'));
    return indexFiles;
}

export function toExportExpression(files: string[]) {
    return files.map((filename) => `export * from './${filename.replace(/\\/g, () => '/').replace('.ts', '')}';`);
}