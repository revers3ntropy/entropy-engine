import { rgb } from "../../util/colour.js";
import { circle } from "../../systems/rendering/basicShapes.js";
import { GUIElement } from "./gui.js";
export class GUICircle extends GUIElement {
    constructor({ zLayer = 1, colour = rgb(150, 150, 150), radius = 1 }) {
        super('GUIRect', zLayer);
        this.addPublic({
            name: 'colour',
            value: colour,
            type: 'rgb'
        });
        this.addPublic({
            name: 'radius',
            value: radius,
        });
    }
    draw(ctx, transform) {
        const radius = this.radius * transform.scale.x;
        if (radius <= 0)
            return;
        circle(ctx, transform.position.v2, radius, this.colour);
    }
    touchingPoint(point, ctx, transform) {
        return point.clone.distTo(transform.position.v2) <= this.radius * transform.scale.x;
    }
}
