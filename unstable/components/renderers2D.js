import { v2 } from "../maths/maths.js";
import { circle, image, rect } from "../systems/rendering/basicShapes.js";
import { getZoomScaledPosition, JSONifyComponent } from '../util/general.js';
import { rgb, rgba } from "../util/colour.js";
import { Renderer } from "./renderer.js";
export class Renderer2D extends Renderer {
    constructor(type, offset) {
        super(type, true);
        this.addPublic({
            name: 'offset',
            value: offset,
            type: 'v2',
            description: 'offset from entities transform'
        });
    }
    Update() { }
    json() {
        return JSONifyComponent(this);
    }
}
export class CircleRenderer extends Renderer2D {
    constructor({ radius = 1, offset = new v2(0, 0), colour = rgb(0, 0, 0) }) {
        super("CircleRenderer", offset);
        this.addPublic({
            name: 'radius',
            value: radius,
            type: 'number',
            array: false
        });
        this.addPublic({
            name: 'colour',
            value: colour,
            type: 'rgb',
            overrideSet: (value) => {
                if (typeof value === 'string') {
                    this.setPublic('colour', rgb.parse(value));
                    return;
                }
                this.setPublic('colour', value);
            }
        });
    }
    draw(arg) {
        const radius = this.radius * arg.zoom * arg.transform.scale.x;
        if (radius <= 0)
            return;
        circle(arg.ctx, getZoomScaledPosition(arg.position.clone.add(this.offset), arg.zoom, arg.center), radius, this.colour.rgb);
    }
}
export class RectRenderer extends Renderer2D {
    constructor({ height = 1, offset = new v2(0, 0), width = 1, colour = rgb(0, 0, 0), }) {
        super("RectRenderer", offset);
        this.addPublic({
            name: 'height',
            value: height,
        });
        this.addPublic({
            name: 'width',
            value: width,
        });
        this.addPublic({
            name: 'colour',
            value: colour,
            type: 'rgb',
            overrideSet: (value) => {
                if (typeof value === 'string') {
                    this.setPublic('colour', rgb.parse(value));
                    return;
                }
                else if (typeof value.r === 'number') {
                    // raw json, so do last step of parsing it
                    this.setPublic('colour', rgba(value.r, value.g, value.b, value.a));
                    return;
                }
                this.setPublic('colour', value);
            }
        });
    }
    Start() { }
    draw(arg) {
        const width = this.width * arg.transform.scale.x * arg.zoom;
        const height = this.height * arg.transform.scale.y * arg.zoom;
        if (height <= 0 || width <= 0)
            return;
        let renderPos = this.offset.clone
            .add(arg.position);
        rect(arg.ctx, getZoomScaledPosition(renderPos, arg.zoom, arg.center), width, height, this.colour.rgb, arg.transform.rotation.z);
    }
}
export class ImageRenderer2D extends Renderer2D {
    constructor({ height = 1, offset = new v2(0, 0), width = 1, url = '', }) {
        super("ImageRenderer2D", offset);
        this.addPublic({
            name: 'height',
            value: height,
        });
        this.addPublic({
            name: 'width',
            value: width,
        });
        this.addPublic({
            name: 'url',
            value: url,
            type: 'string',
            description: 'The path to the image to be rendered - always start with ../projects/{yourProjectID}/assets/',
        });
    }
    Start() { }
    draw(arg) {
        const width = this.width * arg.transform.scale.x * arg.zoom;
        const height = this.height * arg.transform.scale.y * arg.zoom;
        if (height <= 0 || width <= 0)
            return;
        let renderPos = this.offset.clone
            .add(arg.position);
        image(arg.ctx, getZoomScaledPosition(renderPos, arg.zoom, arg.center), new v2(width, height), this.url, arg.transform.rotation.z);
    }
}