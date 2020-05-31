"use strict";
exports.__esModule = true;
exports.generate = void 0;
var ts = require("typescript");
var fs = require("fs");
var yaml = require("js-yaml");
var parser_1 = require("../parser/parser");
var transformer_1 = require("./transformer");
var dummyFile = 'generator/dummyClass.js';
var dummyAst = ts.createSourceFile(dummyFile, fs.readFileSync(dummyFile).toString(), ts.ScriptTarget.Latest, true);
var sdkClassAst;
var functions = [];
var methods = [];
function generate() {
    parser_1.getAstTree().then(function (result) {
        sdkClassAst = result;
        try {
            var services_1 = yaml.safeLoad(fs.readFileSync('node-cloud.yml', 'utf8'));
            Object.keys(services_1.noSqlIndexed.AWS).map(function (key, index) {
                functions.push(services_1.noSqlIndexed.AWS[key].split(' ')[1]);
            });
            sdkClassAst.members.map(function (method) {
                if (method.name && functions.includes(method.name.text)) {
                    var name_1;
                    Object.keys(services_1.noSqlIndexed.AWS).map(function (key, index) {
                        if (services_1.noSqlIndexed.AWS[key].split(' ')[1] === method.name.text) {
                            name_1 = key;
                        }
                    });
                    methods.push({ functionName: name_1.toString(), SDKFunctionName: method.name.text.toString(), hasParams: method.parameters.length > 1 });
                }
            });
            var classData = { className: sdkClassAst.name.text, functions: methods };
            var output = transformer_1.transform(dummyAst, classData);
            console.log(output);
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.generate = generate;
