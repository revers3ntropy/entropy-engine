import { JSONifyComponent } from '../util/general.js';
import { Component } from '../ECS/component.js';
export class Renderer extends Component {
    constructor(type, is2D) {
        super(`Renderer`, type);
    }
    Update() { }
    json() {
        return JSONifyComponent(this);
    }
}
