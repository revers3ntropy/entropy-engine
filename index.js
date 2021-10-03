var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Entity } from "./ECS/entity.js";
import { startAnimation } from "./systems/rendering/startAnimation.js";
import { license } from "./license.js";
import { getMousePos, input, setMousePos } from "./input.js";
import { spritesFromJSON, initialiseScenes } from './JSONprocessor.js';
import { getCanvasStuff, setCanvasSize } from "./util/general.js";
import { Scene } from './ECS/scene.js';
import { System } from "./ECS/system.js";
import './systems/physics/physics.js';
import './systems/rendering/renderer.js';
import './systems/entities/entityController.js';
export { rgb } from './util/colour.js';
export { Entity } from "./ECS/entity.js";
export { Script } from './components/scriptComponent.js';
export { CircleCollider, RectCollider } from './components/colliders.js';
export { v2, TriangleV2, MeshV2, v3, TriangleV3, MeshV3 } from './maths/maths.js';
export { Body } from "./components/body.js";
export { CircleRenderer, RectRenderer, ImageRenderer2D, MeshRenderer } from './components/renderComponents.js';
export { GUIBox, GUIText, GUITextBox, GUIRect, GUICircle, GUIPolygon, GUIImage } from './components/gui/gui.js';
export { input } from './input.js';
export { Camera } from './components/camera.js';
export { spritesFromJSON } from './JSONprocessor.js';
export { Transform } from './components/transform.js';
export { JSBehaviour } from './scripting/scripts.js';
export { Scene } from './ECS/scene.js';
export { System } from './ECS/system.js';
/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
// keep as function(){} due to use of 'this'
// @ts-ignore
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};
export default function entropyEngine({ licenseKey = '', canvasID = "canvas", performanceDebug = 0, }) {
    var _a;
    // for the event listeners
    let isInitialised = false;
    const licenseLevel = license(licenseKey);
    const { canvas, ctx } = getCanvasStuff(canvasID);
    setCanvasSize(canvas);
    (_a = canvas === null || canvas === void 0 ? void 0 : canvas.parentNode) === null || _a === void 0 ? void 0 : _a.addEventListener('resize', () => {
        // TO-DO: this doesn't work
        setCanvasSize(canvas);
    });
    // make the Y axis go up rather than down - bit more intuitive
    ctx.transform(1, 0, 0, -1, 0, canvas.height);
    // for easy restoring
    ctx.save();
    // managers and constants
    canvas.addEventListener('mousemove', (evt) => {
        if (!isInitialised)
            return;
        setMousePos(evt, canvas);
        Entity.loop(sprite => {
            if (!(sprite.sceneID === Scene.active))
                return;
            for (const component of sprite.components) {
                if (component.type !== 'GUIElement')
                    return;
                const component_ = component;
                component_.hovered = component_.touchingPoint(input.cursorPosition, ctx, sprite.transform);
            }
        });
    }, false);
    canvas.addEventListener('mousedown', (evt) => {
        if (!isInitialised)
            return;
        input.mouseDown = true;
        setMousePos(evt, canvas);
        Scene.activeScene.loopThroughScripts((script, sprite) => {
            if (!(sprite.sceneID === Scene.active))
                return;
            if (!sprite.hasComponent('Collider'))
                return;
            let collider = sprite.getComponent('Collider');
            const mousePos = getMousePos(canvas, evt);
            if (!collider.overlapsPoint(sprite.transform, mousePos))
                return;
            script.runMethod('onMouseDown', []);
        });
    }, false);
    canvas.addEventListener('keydown', (event) => {
        setMousePos(event, canvas);
    });
    canvas.addEventListener('keyup', (event) => {
        setMousePos(event, canvas);
    });
    canvas.addEventListener('mouseup', (evt) => {
        if (!isInitialised)
            return;
        input.mouseDown = false;
        setMousePos(evt, canvas);
        Scene.activeScene.loopThroughScripts((script, sprite) => {
            if (!(sprite.sceneID === Scene.active))
                return;
            if (sprite.hasComponent('Collider')) {
                let collider = sprite.getComponent('Collider');
                const mousePos = getMousePos(canvas, evt);
                if (!collider.overlapsPoint(sprite.transform, mousePos))
                    return;
                script.runMethod('onMouseUp', []);
            }
            else if (sprite.hasComponent('GUIElement')) {
                const ui = sprite.getComponent('GUIElement');
                if (ui.hovered)
                    script.runMethod('onClick', []);
                if (ui.subtype !== 'GUITextBox')
                    return;
                // sets it to be selected if it is being hovered over,
                // and not selected if it is not hovered over
                let ui_ = ui;
                ui_.selected = ui_.hovered;
            }
        });
    }, false);
    function init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (licenseLevel < 2)
                yield startAnimation(canvasID);
            Scene.activeScene.findMainCamera();
            System.Start(Scene.activeScene);
            // for event listeners
            isInitialised = true;
        });
    }
    function tick() {
        return __awaiter(this, void 0, void 0, function* () {
            System.Update(Scene.activeScene);
            window.requestAnimationFrame(tick);
        });
    }
    function run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield init();
            window.requestAnimationFrame(tick);
        });
    }
    return {
        run
    };
}
// cache busting
const scriptFetchHeaders = new Headers();
scriptFetchHeaders.append('pragma', 'no-cache');
scriptFetchHeaders.append('cache-control', 'no-cache');
const scriptFetchInit = {
    method: 'GET',
    headers: scriptFetchHeaders,
};
export function runFromJSON(path, config = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // get and init the
        const data_ = yield fetch(path, scriptFetchInit);
        const data = yield data_.json();
        for (let key in data) {
            if (['sprites', 'scenes'].includes(key))
                continue;
            config[key] = data[key];
        }
        initialiseScenes(data['scenes']);
        const returns = entropyEngine(config);
        yield spritesFromJSON(data['sprites']);
        yield returns.run();
        return returns;
    });
}
