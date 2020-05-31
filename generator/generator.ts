import * as ts from 'typescript';
import * as fs from 'fs';
import * as yaml from "js-yaml";
import { getAstTree } from "../parser/parser";
import { transform } from "./transformer";

interface FunctionData {
    functionName: string,
    SDKFunctionName: string,
    hasParams: boolean
}

interface ClassData {
    className: string,
    functions: FunctionData[]
}

const dummyFile = 'generator/dummyClass.js';
const dummyAst = ts.createSourceFile(dummyFile, fs.readFileSync(dummyFile).toString(), ts.ScriptTarget.Latest, true);
let sdkClassAst;
const functions = [];
const methods: FunctionData[] = [];

export function generate() {
    getAstTree().then(result => {
        sdkClassAst = result;
        try {
            const services = yaml.safeLoad(fs.readFileSync('node-cloud.yml', 'utf8'));
            Object.keys(services.noSqlIndexed.AWS).map((key, index) => {
                functions.push(services.noSqlIndexed.AWS[key].split(' ')[1]);
            });

            sdkClassAst.members.map(method => {
                if (method.name && functions.includes(method.name.text)) {
                    let name;
                    Object.keys(services.noSqlIndexed.AWS).map((key, index) => {
                        if (services.noSqlIndexed.AWS[key].split(' ')[1] === method.name.text) {
                            name = key;
                        }
                    });
                    methods.push({ functionName: name.toString(), SDKFunctionName: method.name.text.toString(), hasParams: method.parameters.length > 1 });
                }
            });
            const classData: ClassData = { className: sdkClassAst.name.text, functions: methods };
            const output = transform(dummyAst, classData);
            console.log(output);
        } catch (e) {
            console.log(e);
        }
    });
}

