import { Component } from '../ECS/component';
import type {Entity} from '../ECS/entity';
import { v2, v3 } from '../maths/maths';

import { Primitive, ESNamespace, ESFunction, ESJSBinding, ESString, Map } from 'entropy-script';
import { globalESContext } from "../scripting/scripts";

type NativeScript = {
    [k: string]: any,
};

export class Script extends Component {
    script?: ESNamespace | NativeScript;
    name = '';
    path = '';

    methodWarnings: Map<boolean> = {};

    constructor ({ path, script, name }: {
        path?: string,
        name?: string,
        script?: ESNamespace | NativeScript
    }={}) {
        super("Script", name || (path || '').split('/').pop() || 'noscript');
        if (path) {
            this.path = path;
        }
        this.name = name || this.path.split('/').pop() || 'noscript';

        this.script = script;
    }

    public jsonPublic (): object[] {
        let json: object[] = [];

        for (let field of this.public) {
            const fieldJSON: any = {};
            let field_: any = field;

            for (const prop in field) {
                if (prop !== 'value') {
                    fieldJSON[prop] = field_[prop];
                     continue;
                }

                if (field_[prop] instanceof v2 || field_[prop] instanceof v3) {
                    fieldJSON[prop] = field_[prop].array;
                } else {
                    fieldJSON[prop] = field_[prop];
                }
            }

            json.push(fieldJSON);
        }

        return json;
    }

    json () {
        return {
            'type': 'Script',
            'path': 'scripts.js',
            'name': this.name,
            'public': this.jsonPublic(),
        }
    }

    runMethod = (functionName: string, entity: Entity | undefined, args: Primitive[] = []) => {
        if (this.script instanceof ESNamespace) {
            args = [new ESJSBinding(entity), ...args];

            const method = this.script?.__get__({context: globalESContext},
                new ESString(functionName));

            if (!(method instanceof ESFunction)) {
                if (!(functionName in this.methodWarnings)) {
                    console.error(`Expected function on '${functionName}' in script ${this.name}`);
                    this.methodWarnings[functionName] = true;
                }
                return;
            }

            method.__call__({context: globalESContext}, ...args);

        } else if (this.script) {
            const func: any = this.script[functionName];

            if (typeof func !== 'function') {
                return;
            }

            func(entity, ...args);
        } else {
            console.error(`Cannot run method '${functionName}' - script not defined`);
        }
    }

    Update () {}
}