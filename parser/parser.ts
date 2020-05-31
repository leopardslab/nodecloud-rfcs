
import * as fs from 'fs';
import * as ts from 'typescript';

export function getAstTree() {
    return new Promise((resolve, reject) => {
        const fileName = 'aws-sdk/clients/SimpleDB.d.ts';
        const ast = ts.createSourceFile('node_modules/' + fileName,
            fs.readFileSync('node_modules/' + fileName).toString(), ts.ScriptTarget.Latest, true);
        ast.forEachChild(child => {
            if (ts.SyntaxKind[child.kind] === 'ClassDeclaration') {
                let cloned = Object.assign({}, child);
                return resolve(cloned);
            }
        });
    })
}
