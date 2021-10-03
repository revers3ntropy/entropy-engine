import { rgb } from "../../util/colour.js";
import { roundedRect } from "../../systems/rendering/basicShapes.js";
import { GUIElement } from "./gui.js";
import { v2 } from "../../maths/v2.js";
export class GUIBox extends GUIElement {
    constructor({ height = 30, width = 60, radius = 0, innerColour = rgb(230, 230, 230), outerColour = rgb(90, 90, 90), borderThickness = 1, zLayer = 1, }) {
        super('GUIBox', zLayer);
        this.addPublic({
            name: 'height',
            value: height,
            default: 30
        });
        this.addPublic({
            name: 'width',
            value: width,
            default: 60
        });
        this.addPublic({
            name: 'radius',
            value: Math.min(radius, width / 2, height / 2),
            description: 'Radius of the bod - maxed at (size of smaller dimension)/2',
            default: 0,
            overrideSet: (value) => {
                // limit value
                const r = Math.min(value, this.width / 2, this.height / 2);
                this.setPublic('radius', r);
            }
        });
        this.addPublic({
            name: 'innerColour',
            value: innerColour,
            description: 'Colour of background of box',
            type: 'rgb'
        });
        this.addPublic({
            name: 'outerColour',
            value: outerColour,
            description: 'Colour of border of box',
            type: 'rgb'
        });
        this.addPublic({
            name: 'borderThickness',
            value: borderThickness,
            default: 1
        });
    }
    Start(transform) { }
    draw(ctx, transform) {
        if (this.width === 0 || this.height === 0)
            return;
        if (this.borderThickness > 0)
            roundedRect(ctx, this.width * transform.scale.x, this.height * transform.scale.y, transform.position.v2, this.outerColour.rgba, this.radius);
        const s = this.borderThickness;
        roundedRect(ctx, (this.width * transform.scale.x) - s * 2, (this.height * transform.scale.y) - s * 2, transform.position.v2.add(new v2(s, s)), this.innerColour.rgba, this.radius - s);
    }
    touchingPoint(point, ctx, transform) {
        return point.isInRect(transform.position.v2, new v2(this.width * transform.scale.x, this.height * transform.scale.y));
    }
}
