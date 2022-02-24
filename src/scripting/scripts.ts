import * as es from 'entropy-script/src';

import { CircleCollider, RectCollider } from "../components/colliders.js";
import { Script } from "../components/scriptComponent.js";
import { TriangleV2 } from "../maths/triangleV2.js";
import { TriangleV3 } from "../maths/triangleV3.js";
import { MeshV2 } from "../maths/meshV2.js";
import { MeshV3 } from "../maths/meshV3.js";
import { Body } from "../components/body.js";
import { CircleRenderer, ImageRenderer2D, RectRenderer } from "../components/renderers2D.js";
import { MeshRenderer } from "../components/renderers3D.js";
import { GUIBox } from "../components/gui/box.js";
import { GUIText } from "../components/gui/text.js";
import { GUITextBox } from "../components/gui/textbox.js";
import { GUIRect } from "../components/gui/rect.js";
import { GUICircle } from "../components/gui/circle.js";
import { GUIPolygon } from "../components/gui/polygon.js";
import { GUIImage } from "../components/gui/image.js";
import { Camera } from "../components/camera.js";
import { Transform } from "../components/transform.js";


export async function init () {

    await es.init(console.log, () => {}, false, {
        print: console.log,
        ee: {
            CircleCollider,
            RectCollider,
            Script,
            TriangleV2,
            TriangleV3,
            MeshV2,
            MeshV3,
            Body,
            CircleRenderer,
            ImageRenderer2D,
            RectRenderer,
            MeshRenderer,
            GUIBox,
            GUIText,
            GUITextBox,
            GUIRect,
            GUICircle,
            GUIPolygon,
            GUIImage,
            Camera,
            Transform,
        }
    });
}