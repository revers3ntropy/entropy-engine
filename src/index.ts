import { Entity } from "./ECS/entity";
import { startAnimation } from "./systems/rendering/startAnimation";
import { Script } from './components/scriptComponent';
import {Collider} from './components/colliders';
import license from "./license";
import {getMousePos, input, setMousePos} from "./input";
import { GUIElement, GUITextBox } from "./components/gui/gui";
import { entitiesFromJSON, initialiseScenes } from './JSONprocessor';
import {Camera} from "./components/camera";
import {getCanvasStuff, setCanvasSize} from "./util/general";
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

export {init as initialiseEntropyScript } from './scripting/scripts';

export {
    rgb,
    Entity,
    Script,
    CircleCollider, RectCollider, Collider,
    v2, TriangleV2, MeshV2, v3, TriangleV3, MeshV3,
    Body,
    CircleRenderer, RectRenderer, ImageRenderer2D,
    GUIBox, GUIText, GUITextBox, GUIRect, GUICircle, GUIPolygon, GUIImage, GUIElement,
    getMousePos,
    input,
    Camera,
    entitiesFromJSON, initialiseScenes,
    Transform,
    Scene,
    Systems
};

export * from './ECS/entity';
export * from './ECS/component';
export * from './ECS/scene';
export * from './ECS/system';
export * from './util/colour';
export * from './util/general';

export * from './systems/rendering/basicShapes';
export * from './systems/rendering/debugRenderer';
export * from './systems/rendering/renderer';
export * from './systems/rendering/startAnimation';

/**
 * Initialises Entropy Engine
 * @param {string} [canvasID="canvas"] ID of the canvas HTML element being drawn to
 * @param {number} [performanceDebug=0] Level of timings logged to JS console
 * @param {boolean} [shouldInitEES=true] Only set to false if Entropy Engine Script has already been initialised
 * @returns { { run: () => Promise<void> } } Contains run function which starts the game loop
 */
export function EntropyEngine ({
    canvasID= "canvas",
    performanceDebug = 0
}) {

    // for the event listeners
    let isInitialised = false;

    const licenseLevel = license('');
    const { canvas, ctx } = getCanvasStuff(canvasID);
    
    setCanvasSize(canvas);
    
    canvas?.parentNode?.addEventListener('resize', () => {
        // TO-DO: this doesn't work
        setCanvasSize(canvas);
    });

    
    // make the Y axis go up rather than down - bit more intuitive
    ctx.transform(1, 0, 0, -1, 0, canvas.height);
    // for easy restoring
    ctx.save();

    // managers and constants
    canvas.addEventListener('mousemove', (evt: any) => {
        if (!isInitialised) return;

        setMousePos(evt, canvas);

        Entity.loop(sprite => {
            if (!(sprite.sceneID === Scene.active)) return;
            
            for (const component of sprite.components) {
                if (component.type !== 'GUIElement') return;

                const component_ = (<unknown>component) as GUIElement;
                component_.hovered = component_.touchingPoint(input.cursorPosition, ctx, sprite.transform);
            }
        });
    }, false);

    canvas.addEventListener('mousedown', (evt: any) => {
        if (!isInitialised) return;
        input.mouseDown = true;

        setMousePos(evt, canvas);

        Scene.activeScene.loopThroughScripts((script, sprite) => {
            if (!(sprite.sceneID === Scene.active)) return;
            if (!sprite.hasComponent('Collider')) return;

            let collider = sprite.getComponent<Collider>('Collider');
            const mousePos = getMousePos(canvas, evt);

            if (!collider.overlapsPoint(sprite.transform, mousePos)) {
                return;
            }

            //script.runMethod('onMouseDown', []);
        });
    }, false);

    canvas.addEventListener('keydown', (event) => {
        setMousePos(event, canvas);
    });
    canvas.addEventListener('keyup', (event) => {
        setMousePos(event, canvas);
    });

    canvas.addEventListener('mouseup', (evt) => {
        if (!isInitialised) return;

        input.mouseDown = false;
        setMousePos(evt, canvas);

        Scene.activeScene.loopThroughScripts((script, entity) => {
            if (!(entity.sceneID === Scene.active)) return;
            if (entity.hasComponent('Collider')){

                let collider = entity.getComponent<Collider>('Collider');
                const mousePos = getMousePos(canvas, evt);

                if (!collider.overlapsPoint(entity.transform, mousePos)) {
                    return;
                }

                script.runMethod('onMouseUp', entity, []);

            } else if (entity.hasComponent('GUIElement')) {
                const ui = entity.getComponent<GUIElement>('GUIElement');
                if (ui.hovered) {
                    script.runMethod('onClick', entity, []);
                }

                if (ui.subtype !== 'GUITextBox') return;

                // sets it to be selected if it is being hovered over,
                // and not selected if it is not hovered over
                let ui_ = ui as GUITextBox;
                ui_.selected = ui_.hovered;
            }
        });
    }, false);

    async function init () {

        if (licenseLevel < 2) {
            await startAnimation(canvasID);
        }

        await initEES();

        Scene.activeScene.findMainCamera();

        Systems.Start(Scene.activeScene);

        // for event listeners
        isInitialised = true;
    }

    async function tick () {
        Systems.Update(Scene.activeScene);
        window.requestAnimationFrame(tick);
    }

    async function run () {
        await init();
        window.requestAnimationFrame(tick);
    }

    return { run };
}

// cache busting
const scriptFetchHeaders = new Headers();
scriptFetchHeaders.append('pragma', 'no-cache');
scriptFetchHeaders.append('cache-control', 'no-cache');

const scriptFetchInit = {
    method: 'GET',
    headers: scriptFetchHeaders,
};

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

    for (let key in data) {
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