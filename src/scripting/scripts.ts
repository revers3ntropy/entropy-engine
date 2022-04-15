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
import { input } from "../input";

import * as es from 'entropy-script';

export let globalESContext: es.Context;

let initialised = false;
export async function init () {
    if (initialised) return;
    initialised = true;

    let globalCTX = await es.init({
        print: console.log,
        input: () => {},
        libs: {
            ee: [{
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
                input
            }, true]
        }
    });
    if (globalCTX instanceof es.Error) {
        console.log('Error initialing EntropyScript runtime: ', globalCTX.str);
        return;
    }
    if (globalCTX) {
        es.setGlobalContext(globalCTX);
        globalESContext = globalCTX;
    }
}

const cacheBust = Math.floor(Math.random() * 200001);

export async function scriptFromURL (path: string) {
    if (!initialised) {
        await init();
    }

    const data = await fetch(`${path}?${cacheBust}`).catch((e: any) => {
        console.log(`Error fetching script at ${path}: ${e}`);
    });
    if (!data) {
        return console.log(`Error fetching script at ${path}: No response received`);
    }

    const rawTxt = await data.text().catch((e: any) => {
        console.log(`Error fetching script at ${path}: ${e}`);
    });
    if (typeof rawTxt !== 'string') {
        return console.log(`Error fetching script at ${path}`);
    }

    const env = new es.Context();
    env.parent = globalESContext;
    env.path = path;

    env.set('__main__', new es.ESBoolean(), {
        isConstant: true,
        forceThroughConst: true,
        global: true
    });

    const n = new es.ESNamespace(new es.ESString(path), {});

    const res: es.InterpretResult = es.run(rawTxt, {
        env,
        fileName: path,
        currentDir: path,
        measurePerformance: false
    });

    if (res.error) {
        return console.log(res.error.str);
    }

    n.__value__ = env.getSymbolTableAsDict();

    return new Script({
        script: n,
        path,
        name: path
    });
}