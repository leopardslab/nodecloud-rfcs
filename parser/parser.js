"use strict";
exports.__esModule = true;
exports.getAstTree = void 0;
var fs = require("fs");
var ts = require("typescript");
function getAstTree() {
    return new Promise(function (resolve, reject) {
        var fileName = 'aws-sdk/clients/SimpleDB.d.ts';
        var ast = ts.createSourceFile('node_modules/' + fileName, fs.readFileSync('node_modules/' + fileName).toString(), ts.ScriptTarget.Latest, true);
        ast.forEachChild(function (child) {
            if (ts.SyntaxKind[child.kind] === 'ClassDeclaration') {
                var cloned = Object.assign({}, child);
                return resolve(cloned);
            }
        });
    });
}
exports.getAstTree = getAstTree;
