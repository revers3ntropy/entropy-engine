import {v2} from "../maths/v2";
import {circle, image, rect} from "../systems/rendering/basicShapes";
import {JSONifyComponent} from '../util/general'
import {getZoomScaledPosition} from '../util/rendering';
import {colour, rgb, rgba} from "../util/colour";
import { Transform } from "./transform";
import { Renderer } from "./renderer";

type drawArgs = {
    position: v2,
    transform: Transform,
    ctx: CanvasRenderingContext2D,
    zoom: number,
    center: v2
};

export abstract class Renderer2D extends Renderer {
    abstract override draw (arg: drawArgs): void;

    offset: v2 = v2.zero;
    
    protected constructor(type: string, offset: v2) {
        super(type);

        this.addPublic({
            name: 'offset',
            value: offset,
            type: 'v2',
            description: 'offset from entity\'s transform\s position'
        });
    }

    override Update () {}

    override json () {
        return JSONifyComponent(this);
    }
}

export class CircleRenderer extends Renderer2D {
    radius = 1;
    colour = rgb();

    constructor ({
         radius = 1,
         offset = new v2(0, 0),
         colour = rgb()
    }={}) {
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

    draw ({zoom, transform, ctx, position, center}: drawArgs): void {
        const radius = this.radius * zoom * transform.scale.x;
        if (radius <= 0) return;

        circle(ctx, getZoomScaledPosition(position.clone.add(this.offset), zoom, center), radius, this.colour.rgb);
    }
}

export class RectRenderer extends Renderer2D {
    height = 1;
    width = 1;
    colour = rgb();

    constructor ({
         height = 1,
         offset = new v2(0, 0),
         width= 1,
         colour = rgb(0, 0, 0),
    }={}) {
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
            overrideSet: (value: string | colour | any) => {
                if (typeof value === 'string') {
                    this.setPublic('colour', rgb.parse(value));
                    return;
                } else if (typeof value.r === 'number') {
                    // raw json, so do last step of parsing it
                    this.setPublic('colour', rgba(value.r, value.g, value.b, value.a));
                    return;
                }

                this.setPublic('colour', value);
            }
        });
    }

    Start() {}

    draw (arg: drawArgs): void {
        const width = this.width * arg.transform.scale.x * arg.zoom;
        const height = this.height * arg.transform.scale.y * arg.zoom;

        if (height <= 0 || width <= 0) return;

        let renderPos = this.offset.clone
            .add(arg.position);

        renderPos.sub(new v2(
            width / (arg.zoom * 2),
            height / (arg.zoom * 2)
        ));

        rect (arg.ctx,
            getZoomScaledPosition(renderPos, arg.zoom, arg.center),
            width, height, this.colour.rgb,
            arg.transform.rotation.z
        );
    }
}

export class ImageRenderer2D extends Renderer2D {

    height = 1;
    width = 1;
    url = '';

    constructor ({
         height = 1,
         offset = new v2(0, 0),
         width= 1,
         url= ''
    }={}) {
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

    Start () {}

    draw (arg: drawArgs): void {
        if (!this.url) {
            return;
        }
        const width = this.width * arg.transform.scale.x * arg.zoom;
        const height = this.height * arg.transform.scale.y * arg.zoom;

        if (height <= 0 || width <= 0) return;

        let renderPos = this.offset.clone
            .add(arg.position);

        renderPos.sub(new v2(
            width / (arg.zoom * 2),
            height / (arg.zoom * 2)
        ));

        image (
            arg.ctx,
            getZoomScaledPosition(renderPos, arg.zoom, arg.center),
            new v2(width, height),
            this.url,
            arg.transform.rotation.z
        );
    }
}