import {Component} from '../ECS/component';
import { v2, v3 } from '../maths/maths';

export class Script extends Component {
    static runStartMethodOnInit = false;

    script: undefined;
    name = '';

    constructor(config: {
        script: undefined,
    }) {
        super("Script", 'noscript')
        this.script = config.script;

        if (Script.runStartMethodOnInit) {
            //this.runMethod('Start', []);
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
            // assume that the script src is in scripts.js
            'path': 'scripts.js',
            'name': this.name,
            'public': this.jsonPublic(),
        }
    }

    setScript (script: undefined) {
        this.script = script;
        this.subtype = this.name;

        if (Script.runStartMethodOnInit) {
            //this.runMethod('Start', []);
        }
    }

    /*
    genContext (file: string): Context | ESError {
        let context = new Context(file);

        context.parent = global;
        let setRes = context.setOwn(this.script, 'this');
        if (setRes instanceof ESError) return setRes;

        if (this?.script?.entity) {
            setRes = context.setOwn(this?.script?.entity, 'entity');
            if (setRes instanceof ESError) return setRes;

            setRes = context.setOwn(this?.script?.entity.transform, 'transform');
            if (setRes instanceof ESError) return setRes;
        }

        setRes = context.setOwn(Scene.activeScene.broadcast, 'broadcast');
        if (setRes instanceof ESError) return setRes;

        setRes = context.setOwn(Entity, 'Entity');
        if (setRes instanceof ESError) return setRes;
        setRes = context.setOwn(Scene, 'Scene');
        if (setRes instanceof ESError) return setRes;

        return context;
    }

    runMethod (functionName: string, args: Node[] = []) {
        for (let method of this?.script?.methods ?? []) {
            if (method.name !== functionName) continue;

            const caller = new N_functionCall(Position.unknown, Position.unknown, method, args);
            let context = this.genContext(method.startPos.file);
            if (context instanceof ESError)
                return console.error(context.str);

            const res = caller.interpret(context);
            if (res.error) console.error(res.error.str);
            return;
        }
    }
     */

    Update () {}
}