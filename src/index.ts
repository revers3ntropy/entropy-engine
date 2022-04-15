import { Entity } from "./ECS/entity";
import { startAnimation } from "./systems/rendering/startAnimation";
import { Script } from './components/scriptComponent';
import {Collider} from './components/colliders';
import license from "./license";
import {addEventListeners, getMousePos, input} from './input';
import { GUIElement, GUITextBox } from "./components/gui/gui";
import { entitiesFromJSON, initialiseScenes } from './JSONprocessor';
import {Camera} from "./components/camera";
import {scriptFetchInit} from './util/general';
import {generateCanvas, getCTX, setCanvasesSizes} from './util/rendering';
import {rgb} from './util/colour';
import {Scene} from './ECS/scene';
import {Systems} from "./ECS/system";
import {Transform} from "./components/transform";
import {RectCollider, CircleCollider} from "./components/colliders";
import { v2, TriangleV2, MeshV2, v3, TriangleV3, MeshV3 } from './maths/maths';
import { Body } from "./components/body";
import { CircleRenderer, RectRenderer, ImageRenderer2D } from './components/renderers2D';
import { GUIBox, GUIText, GUIRect, GUICircle, GUIPolygon, GUIImage } from './components/gui/gui';

import {init as initEES} from './scripting/scripts';

import './systems/physics/physics';
import './systems/rendering/renderer';
import './systems/entities/entityController';

export {
    Entity, Scene, Systems,
    Transform, Body,
    Script,
    Camera,
    CircleCollider, RectCollider, Collider,
    CircleRenderer, RectRenderer, ImageRenderer2D,
    GUIBox, GUIText, GUITextBox, GUIRect, GUICircle, GUIPolygon, GUIImage, GUIElement,
    getMousePos,
    input,
    entitiesFromJSON, initialiseScenes,
    v2, TriangleV2, MeshV2, v3, TriangleV3, MeshV3,
};

export { init as initialiseEntropyScript, scriptFromURL } from './scripting/scripts';

export {entityConfig} from './ECS/entity';
export {sceneSettings, defaultSceneSettings} from './ECS/scene';
export type {System} from './ECS/system';
export {rgbValToHex, rgb, rgba, colour} from './util/colour';
export * from './util/general';

export * from './systems/rendering/basicShapes';
export * from './systems/rendering/debugRenderer';
export * from './systems/rendering/renderer';
export * from './systems/rendering/startAnimation';

/**
 * Initialises Entropy Engine
 * @param {string} [canvasID="canvas"] ID of the canvas HTML element being drawn to
 * @param {number} [performanceDebug=0] Level of timings logged to JS console
 * @returns { { run: () => Promise<void> } } Contains run function which starts the game loop
 */
export function EntropyEngine ({
    canvasContainerID= "entropy-engine",
    performanceDebug = 0
} = {}) {

    // for the event listeners
    let isInitialised = false;

    const licenseLevel = license('');
    const canvases = generateCanvas(canvasContainerID);
    const { GUI: guiCanvas } = canvases;

    addEventListeners(canvases, () => isInitialised);

    async function init () {

        if (licenseLevel < 2) {

            const ctx = getCTX(canvases.GUI);

            ctx.transform(1, 0, 0, -1, 0, canvases.GUI.height);
            await startAnimation(guiCanvas);
        }

        await initEES();

        Scene.activeScene.findMainCamera();

        Systems.Start(Scene.activeScene, canvases);

        // for event listeners
        isInitialised = true;
    }

    async function tick () {
        Systems.Update(Scene.activeScene, canvases);
        window.requestAnimationFrame(tick);
    }

    async function run () {
        setCanvasesSizes(canvases);
        await init();
        setCanvasesSizes(canvases);
        window.requestAnimationFrame(tick);
    }

    return { run };
}

/**
 * Initialise and run Entropy Engine from the URL of a JSON file
 * @param {string} path - path to JSON file
 * @param {object} config - passed to entropyEngine function
 */
export async function runFromJSON (path: string, config: any = {}) {

    await initEES();

    // get and init the
    const data_: any = await fetch(path, scriptFetchInit);
    const data = await data_.json();

    for (let key of Object.keys(data)) {
        if (['entities', 'scenes'].includes(key)) {
            continue;
        }

        config[key] = data[key];
    }

    config.shouldInitEES = false;

    initialiseScenes(data['scenes']);

    const returns = EntropyEngine(config);
    
    await entitiesFromJSON(data['entities']);

    await returns.run();

    return returns;
}