import { JSONifyComponent } from '../util/general';
import {Component} from '../ECS/component';

export abstract class Renderer extends Component {
    abstract draw (...args: any[]): any;

    protected constructor(type: string, is2D: boolean) {
        super(`Renderer`, type);
    }

    Update () {}

    json () {
        return JSONifyComponent(this);
    }
}