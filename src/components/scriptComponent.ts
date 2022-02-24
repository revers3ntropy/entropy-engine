import {Component} from '../ECS/component';
import type {Entity} from '../ECS/entity.js';
import { v2, v3 } from '../maths/maths';
import {global} from 'entropy-script/src/constants';

import {Primitive, ESNamespace, ESFunction} from 'entropy-script/src/runtime/primitiveTypes';
import {ESJSBinding} from 'entropy-script/src/runtime/primitives/esjsbinding';
import {ESString} from 'entropy-script/src/runtime/primitiveTypes';

export class Script extends Component {
    static runStartMethodOnInit = false;

    script: ESNamespace | undefined;
    name = '';
    path: string;

    constructor ({path, name, entity, script}: {
        path: string,
        name: string,
        entity?: Entity,
        script?: ESNamespace
    }) {
        super("Script", name || 'noscript')
        this.path = path;

        this.script = script;

        if (Script.runStartMethodOnInit) {
            this.runMethod('Start', entity, []);
        }
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
        args = [new ESJSBinding(entity), ...args];
        const method = this.script?.__getProperty__({context: global}, new ESString(functionName));

        if (!(method instanceof ESFunction)) {
            console.error(`Cannot run method '${functionName}'`);
            return;
        }

        method.__call__({context: global}, ...args);
    }

    Update () {}
}