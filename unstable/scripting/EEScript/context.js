import { initialise } from "./init.js";
import { ESError, TypeError } from "./errors.js";
import { Position } from "./position.js";
export class ESSymbol {
    constructor(value, identifier, options = {}) {
        var _a, _b;
        this.value = value;
        this.identifier = identifier;
        this.isConstant = (_a = options.isConstant) !== null && _a !== void 0 ? _a : false;
        this.isAccessible = (_b = options.isAccessible) !== null && _b !== void 0 ? _b : true;
    }
}
export class Context {
    constructor(fileName = '__main__') {
        this.initialisedAsGlobal = false;
        this.deleted = false;
        this.symbolTable = {
            __name__: new ESSymbol(fileName, '__name__', {
                isConstant: true,
                isAccessible: true,
                global: true
            }),
        };
    }
    has(identifier) {
        return this.getSymbol(identifier) !== undefined;
    }
    hasOwn(identifier) {
        return this.symbolTable[identifier] instanceof ESSymbol;
    }
    get(identifier) {
        let symbol = this.getSymbol(identifier);
        if (symbol instanceof ESError || symbol == undefined)
            return symbol;
        return symbol.value;
    }
    getSymbol(identifier) {
        let symbol = this.symbolTable[identifier];
        if (symbol !== undefined && !symbol.isAccessible)
            return new TypeError(Position.unknown, Position.unknown, 'assessable', 'inaccessible', symbol.identifier);
        if (symbol === undefined && this.parent) {
            let res = this.parent.getSymbol(identifier);
            if (res instanceof ESError)
                return res;
            symbol = res;
        }
        return symbol;
    }
    set(identifier, value, options = {}, position = Position.unknown) {
        let context = this;
        if (options.global) {
            context = this.root;
        }
        else {
            // searches upwards to find the identifier, and if none can be found then it assigns it to the current context
            while (!context.hasOwn(identifier) && context.parent !== undefined) {
                context = context.parent;
            }
            if (!context.hasOwn(identifier))
                context = this;
        }
        return context.setOwn(value, identifier, options, position);
    }
    setOwn(value, identifier, options = {}, position = Position.unknown) {
        // is not global
        if (options.global && !this.initialisedAsGlobal)
            options.global = false;
        let symbol = this.getSymbol(identifier);
        if (symbol instanceof ESError)
            return symbol;
        if (symbol === null || symbol === void 0 ? void 0 : symbol.isConstant) {
            return new TypeError(position, position, 'dynamic', 'constant', identifier);
        }
        this.symbolTable[identifier] = new ESSymbol(value, identifier, options);
        return value;
    }
    remove(identifier) {
        delete this.symbolTable[identifier];
    }
    /*
        delete () {
            for (let symbol in this.symbolTable)
                this.remove(symbol);
    
            this.parent = undefined;
            this.deleted = true;
        }
    
     */
    get root() {
        let parent = this;
        while (parent.parent)
            parent = parent.parent;
        return parent;
    }
    resetAsGlobal() {
        if (!this.initialisedAsGlobal)
            return;
        const printFunc = this.root.get('print');
        this.symbolTable = {};
        this.initialisedAsGlobal = false;
        initialise(this, (printFunc === null || printFunc === void 0 ? void 0 : printFunc.func) || console.log);
    }
}
