import { Component } from '../ECS/component.js';
import { global } from '../scripting/EEScript/constants.js';
import { v2, v3 } from '../maths/maths.js';
import { N_functionCall } from '../scripting/EEScript/nodes.js';
import { Position } from "../scripting/EEScript/position.js";
import { Context } from "../scripting/EEScript/context.js";
import { ESError } from "../scripting/EEScript/errors.js";
import { Scene } from "../ECS/scene.js";
import { Entity } from "../ECS/entity.js";
export class Script extends Component {
    constructor(config) {
        var _a, _b;
        super("Script", (_b = (_a = config.script) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'noscript');
        // only used in the visual editor for downloading the script name
        this.scriptName = '';
        this.name = '';
        this.script = config.script;
        if (Script.runStartMethodOnInit) {
            this.runMethod('Start', []);
        }
    }
    jsonPublic() {
        let json = [];
        for (let field of this.public) {
            const fieldJSON = {};
            let field_ = field;
            for (const prop in field) {
                if (prop !== 'value') {
                    fieldJSON[prop] = field_[prop];
                    continue;
                }
                if (field_[prop] instanceof v2 || field_[prop] instanceof v3) {
                    fieldJSON[prop] = field_[prop].array;
                }
                else {
                    fieldJSON[prop] = field_[prop];
                }
            }
            json.push(fieldJSON);
        }
        return json;
    }
    json() {
        var _a, _b, _c, _d;
        return {
            'type': 'Script',
            // assume that the script src is in scripts.js
            'path': 'scripts.js',
            'name': ((_a = this === null || this === void 0 ? void 0 : this.script) === null || _a === void 0 ? void 0 : _a.name) || (this === null || this === void 0 ? void 0 : this.scriptName) || ((_b = this.script) === null || _b === void 0 ? void 0 : _b.constructor.name),
            'scriptName': ((_c = this === null || this === void 0 ? void 0 : this.script) === null || _c === void 0 ? void 0 : _c.name) || (this === null || this === void 0 ? void 0 : this.scriptName) || ((_d = this.script) === null || _d === void 0 ? void 0 : _d.constructor.name),
            'public': this.jsonPublic(),
        };
    }
    setScript(script) {
        this.script = script;
        this.subtype = this.script.name;
        if (Script.runStartMethodOnInit)
            this.runMethod('Start', []);
    }
    genContext(file) {
        var _a, _b, _c;
        let context = new Context(file);
        context.parent = global;
        let setRes = context.setOwn(this.script, 'this');
        if (setRes instanceof ESError)
            return setRes;
        if ((_a = this === null || this === void 0 ? void 0 : this.script) === null || _a === void 0 ? void 0 : _a.entity) {
            setRes = context.setOwn((_b = this === null || this === void 0 ? void 0 : this.script) === null || _b === void 0 ? void 0 : _b.entity, 'entity');
            if (setRes instanceof ESError)
                return setRes;
            setRes = context.setOwn((_c = this === null || this === void 0 ? void 0 : this.script) === null || _c === void 0 ? void 0 : _c.entity.transform, 'transform');
            if (setRes instanceof ESError)
                return setRes;
        }
        setRes = context.setOwn(Scene.activeScene.broadcast, 'broadcast');
        if (setRes instanceof ESError)
            return setRes;
        setRes = context.setOwn(Entity, 'Entity');
        if (setRes instanceof ESError)
            return setRes;
        setRes = context.setOwn(Scene, 'Scene');
        if (setRes instanceof ESError)
            return setRes;
        return context;
    }
    runMethod(functionName, args = []) {
        var _a, _b;
        for (let method of (_b = (_a = this === null || this === void 0 ? void 0 : this.script) === null || _a === void 0 ? void 0 : _a.methods) !== null && _b !== void 0 ? _b : []) {
            if (method.name !== functionName)
                continue;
            const caller = new N_functionCall(Position.unknown, Position.unknown, method, args);
            let context = this.genContext(method.startPos.file);
            if (context instanceof ESError)
                return console.error(context.str);
            const res = caller.interpret(context);
            if (res.error)
                console.error(res.error.str);
            return;
        }
    }
    Update() { }
}
Script.runStartMethodOnInit = false;
