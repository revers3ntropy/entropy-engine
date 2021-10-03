import { publicField } from "../../publicField.js";
import { v2 } from "../../maths/v2.js";
import { v3 } from "../../maths/v3.js";
import { N_function, Node } from "./nodes.js";
export class N_ESBehaviour extends Node {
    constructor(startPos, endPos, methods, init, name = '<anon ESBehaviour>', publicVariables = [], entityNode) {
        super(startPos, endPos);
        this.init = init;
        this.methods = methods;
        this.name = name;
        this.publicVariables = publicVariables;
        this.entityNode = entityNode;
    }
    interpret_(context) {
        var _a, _b, _c, _d, _e, _f, _g;
        let entity = undefined;
        if (this.entityNode) {
            let res = this.entityNode.interpret(context);
            if (res.error)
                return res;
            entity = res.val;
        }
        const instance = new ESBehaviourInstance(this.name, this.methods, entity);
        for (let method of this.methods) {
            // @ts-ignore
            instance[method.name] = new N_function(method.startPos, method.endPos, method.body, method.arguments, method.name);
        }
        for (let publicVarRaw of this.publicVariables) {
            let res = publicVarRaw.interpret(context);
            if (res.error)
                return res;
            let type = ((_a = res === null || res === void 0 ? void 0 : res.val) === null || _a === void 0 ? void 0 : _a.type) || undefined;
            let value = (_b = res === null || res === void 0 ? void 0 : res.val) === null || _b === void 0 ? void 0 : _b.value;
            if (value instanceof v2)
                type = 'v2';
            else if (value instanceof v3)
                type = 'v3';
            instance.addPublic({
                name: ((_c = res === null || res === void 0 ? void 0 : res.val) === null || _c === void 0 ? void 0 : _c.name) || '',
                value,
                type,
                array: ((_d = res === null || res === void 0 ? void 0 : res.val) === null || _d === void 0 ? void 0 : _d.array) || '',
                assetType: ((_e = res === null || res === void 0 ? void 0 : res.val) === null || _e === void 0 ? void 0 : _e.assetType) || '',
                description: ((_f = res === null || res === void 0 ? void 0 : res.val) === null || _f === void 0 ? void 0 : _f.description) || '',
                default: ((_g = res === null || res === void 0 ? void 0 : res.val) === null || _g === void 0 ? void 0 : _g.default) || ''
            });
        }
        return instance;
    }
}
export class ESBehaviourInstance {
    constructor(name, methods, entity) {
        var _a;
        this.tempPublic = [];
        // these are not used internally, but by the user when creating scripts
        this.addPublic = (config) => {
            if (!config.name) {
                console.error(`Public fields must have 'name' property`);
                return;
            }
            if (this.hasPublic(config.name)) {
                console.error('Cannot add property with existing name: ' + config.name);
                return;
            }
            // @ts-ignore - doesn't like comparison to string
            if (config.value === undefined && config.default === undefined) {
                console.error(`Public fields must have 'value' property`);
                return;
            }
            // @ts-ignore - doesn't like comparison to string
            if (config.value === undefined)
                config.value = config.default;
            const field = new publicField(config);
            if (!this.component) {
                this.tempPublic.push(field);
            }
            else {
                this.component.public.push(field);
            }
            Object.defineProperty(this, config.name, {
                // so you can loop over it
                enumerable: true,
                get() {
                    if (config.overrideGet === undefined)
                        return this.getPublic(config.name);
                    return config.overrideGet();
                },
                set(value) {
                    if (config.overrideSet === undefined) {
                        this.setPublic(config.name, value);
                        return;
                    }
                    config.overrideSet(value);
                }
            });
            return field;
        };
        this.getPublic = (name) => {
            var _a;
            return (_a = this.component) === null || _a === void 0 ? void 0 : _a.getPublic(name);
        };
        this.setPublic = (name, value) => {
            var _a;
            return (_a = this.component) === null || _a === void 0 ? void 0 : _a.setPublic(name, value);
        };
        this.hasPublic = (name) => {
            var _a;
            return !!((_a = this.component) === null || _a === void 0 ? void 0 : _a.hasPublic(name));
        };
        this.name = name;
        this.methods = methods;
        (_a = this.entity) !== null && _a !== void 0 ? _a : (this.entity = entity);
    }
    get public() {
        var _a;
        return ((_a = this === null || this === void 0 ? void 0 : this.component) === null || _a === void 0 ? void 0 : _a.public) || [];
    }
}
