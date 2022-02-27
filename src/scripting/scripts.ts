import { CircleCollider, RectCollider } from "../components/colliders";
import { Script } from "../components/scriptComponent";
import { TriangleV2 } from "../maths/triangleV2";
import { TriangleV3 } from "../maths/triangleV3";
import { MeshV2 } from "../maths/meshV2";
import { MeshV3 } from "../maths/meshV3";
import { Body } from "../components/body";
import { CircleRenderer, ImageRenderer2D, RectRenderer } from "../components/renderers2D";
import { GUIBox } from "../components/gui/box";
import { GUIText } from "../components/gui/text";
import { GUITextBox } from "../components/gui/textbox";
import { GUIRect } from "../components/gui/rect";
import { GUICircle } from "../components/gui/circle";
import { GUIPolygon } from "../components/gui/polygon";
import { GUIImage } from "../components/gui/image";
import { Camera } from "../components/camera";
import { Transform } from "../components/transform";

import * as es from 'entropy-script';

let initialised = false;

export async function init () {
    if (initialised) return;
    initialised = true;

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
    }, es.global);
}