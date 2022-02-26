import {rgb} from "../../util/colour";
import {Transform} from "../transform";
import {roundedRect} from "../../systems/rendering/basicShapes";
import {GUIElement} from "./gui";
import {v2} from "../../maths/v2";

export class GUIRect extends GUIElement {
    width = 0;
    height = 0;
    colour = rgb();
    radius = 0;

    constructor ({
         zLayer = 1,
         width = 10,
         height = 10,
         colour = rgb(150, 150, 150),
         radius = 1
     }) {
        super('GUIRect', zLayer);

        this.addPublic({
            name: 'height',
            value: height,
        });

        this.addPublic({
            name: 'width',
            value: width,
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
            name: 'colour',
            value: colour,
            type: 'rgb'
        });
    }


    draw(ctx: CanvasRenderingContext2D, transform: Transform): void {
        const width = this.width * transform.scale.x;
        const height = this.height * transform.scale.y;

        if (height <= 0 || width <= 0) return;

        roundedRect (
            ctx,
            width,
            height,
            transform.position.v2,
            this.colour.hex,
            this.radius
        );
    }

    touchingPoint(point: v2, ctx: CanvasRenderingContext2D, transform: Transform): boolean {
        const width = this.width * transform.scale.x;
        const height = this.height * transform.scale.y;

        return point.isInRect(transform.position.v2, new v2(width, height));
    }
}