import {rgb} from "../../util/colour";
import {Transform} from "../transform";
import {GUIElement} from "./gui";
import {text} from '../../systems/rendering/basicShapes'
import {v2} from "../../maths/v2";

export class GUIText extends GUIElement {
    text = '';
    fontSize = 0;
    font = '';
    colour = rgb();
    alignment = '';
    fill = false;

    constructor ({
         text = '',
         fontSize = 12,
         font = 'Arial',
         colour = rgb(0, 0, 0),
         alignment = 'center',
         fill = true,
         zLayer = 1,
     }) {
        super('GUIText', zLayer);

        this.addPublic({
            name: 'text',
            value: text,
            default: ''
        });
        this.addPublic({
            name: 'fontSize',
            value: fontSize,
            description: 'In px',
            default: 12
        });
        this.addPublic({
            name: 'font',
            value: font,
            default: 'Arial'
        });
        this.addPublic({
            name: 'colour',
            value: colour,
            type: 'rgb',
        });
        this.addPublic({
            name: 'alignment',
            value: alignment,
            description: 'Center, left or right. Default center',
            type: 'string',
            default: 'center'
        });
        this.addPublic({
            name: 'fill',
            value: fill,
            description: 'Should the text be filled or hollow',
            type: 'boolean',
            default: true
        });

    }

    draw (ctx: CanvasRenderingContext2D, transform: Transform) {
        text(ctx, this.text, this.fontSize * transform.scale.x, this.font, this.colour.rgba, transform.position.v2);
    }

    touchingPoint (point: v2, ctx: CanvasRenderingContext2D, transform: Transform) {
        ctx.font = `${this.fontSize}px ${this.font}`;
        const textSize = ctx.measureText(this.text)
        return point.isInRect(transform.position.v2, new v2(
            textSize.width,
            this.fontSize * transform.scale.x
        ));
    }
}