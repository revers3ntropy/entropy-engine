var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { builtInArgs, builtInFunctions } from "./builtInFunctions.js";
import { N_builtInFunction } from "./nodes.js";
import { Context } from "./context.js";
import { ImportError } from "./errors.js";
import { Position } from "./position.js";
import { run } from "./index.js";
import { globalConstants } from "./constants.js";
import { nameFromScriptURL, str } from "./util.js";
export function initialise(globalContext, printFunc) {
    builtInFunctions['import'] = (context) => __awaiter(this, void 0, void 0, function* () {
        const url = context.get('url');
        function error(detail = 'Import Failed') {
            return new ImportError(Position.unknown, Position.unknown, url, detail + '. Remember that relative URLs are only allowed with node.js');
        }
        if (!url)
            return error('No URL given');
        let result;
        result = yield fetch(url);
        let newContext = new Context(nameFromScriptURL(url));
        return yield run(yield result.text(), {
            env: newContext
        });
    });
    builtInArgs['import'] = ['url'];
    builtInFunctions['print'] = (context) => __awaiter(this, void 0, void 0, function* () {
        let output = '> ';
        if (context instanceof Context) {
            for (let arg of context.get('args'))
                output += str(arg);
        }
        else {
            output += str(context);
        }
        printFunc(output);
    });
    for (let builtIn in builtInFunctions) {
        const node = new N_builtInFunction(builtInFunctions[builtIn], builtInArgs[builtIn] || []);
        globalContext.set(builtIn, node, {
            global: true,
            isConstant: true
        });
    }
    for (let constant in globalConstants) {
        globalContext.set(constant, globalConstants[constant], {
            global: true,
            isConstant: true
        });
    }
    globalContext.initialisedAsGlobal = true;
}
