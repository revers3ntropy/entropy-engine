import { Component } from "../../ECS/component.js";
import { JSONifyComponent } from "../../util/general.js";
export class GUIElement extends Component {
    constructor(subtype, zLayer) {
        super('GUIElement', subtype);
        this.hovered = false;
        this.addPublic({
            name: 'zLayer',
            value: zLayer,
            description: 'Determines what appears on top of what in the GUI',
        });
    }
    json() {
        return JSONifyComponent(this);
    }
}
