import { System } from "../../ECS/system.js";
import { image } from "./basicShapes.js";
import { Camera } from "../../components/camera.js";
import { v2 } from "../../maths/v2.js";
import { rgb } from "../../util/colour.js";
import { getCanvasSize } from "../../util/general.js";
function orderSpritesForRender(sprites) {
    // sort the entities by their z position
    const zOrderedSprites = sprites.sort((a, b) => {
        return a.transform.position.z - b.transform.position.z;
    });
    // GUI elements appear always above normal entities,
    // so filter them out and put them last, still ordered by their z position
    let justSprites = [];
    let justGUI = [];
    for (let sprite of zOrderedSprites) {
        if (sprite.hasComponent('GUIElement'))
            justGUI.push(sprite);
        else
            justSprites.push(sprite);
    }
    return [...justSprites, ...justGUI];
}
export function renderBackground(ctx, canvasSize, backgroundTint, backgroundImage) {
    function fillBackground(alpha) {
        let bgColour = backgroundTint || rgb.parse('white');
        bgColour = bgColour.clone;
        bgColour.alpha = alpha;
        ctx.beginPath();
        ctx.rect(0, 0, canvasSize.x, canvasSize.y);
        ctx.fillStyle = bgColour.rgba;
        ctx.fill();
        ctx.closePath();
    }
    if (!backgroundImage) {
        fillBackground(1);
        return;
    }
    // if it can't use the image as a background, then just use the colour
    try {
        image(ctx, v2.zero, canvasSize, backgroundImage);
    }
    catch (_a) {
        fillBackground(0.1);
    }
}
export function renderAll(entities, canvas, ctx, backgroundTint, backgroundImage, cameraEntity = Camera.main) {
    // background
    const canvasSize = getCanvasSize(canvas);
    const mid = canvasSize.clone.scale(0.5);
    renderBackground(ctx, canvasSize, backgroundTint, backgroundImage);
    if (!entities)
        return;
    if (!cameraEntity) {
        console.error('Camera was not passed to renderAll function! Main camera: ' + Camera.main.name);
        return;
    }
    // camera
    const camera = cameraEntity
        .getComponent("Camera");
    if (!camera)
        return;
    const cameraPos = cameraEntity.transform.position.clone
        .sub(canvasSize
        .clone
        .scale(0.5).v3);
    // sub the screen size to put 0, 0 in the middle of the screen
    if (!cameraPos)
        return;
    // filter out entities that don't have render components
    entities = entities.filter((sprite) => (sprite.hasComponent('Renderer') ||
        sprite.hasComponent('GUIElement')));
    // call the draw function for each
    for (let sprite of orderSpritesForRender(entities)) {
        // deal with GUI and normal render components separately
        if (sprite.hasComponent('GUIElement')) {
            sprite.getComponent('GUIElement').draw(ctx, sprite.transform);
            continue;
        }
        const renderPos = sprite.transform.position.clone.sub(cameraPos);
        sprite.getComponent('Renderer').draw({
            position: renderPos,
            transform: sprite.transform,
            ctx,
            zoom: camera.zoom,
            center: mid,
            camera,
            cameraSprite: cameraEntity
        });
    }
}
// canvas util
System.systems.push(new System({
    name: 'Renderer',
    Start: (scene) => {
    },
    Update: (scene) => {
        const ctx = scene.settings.ctx;
        if (!ctx)
            return;
        renderAll(scene.entities, ctx.canvas, ctx, scene.settings.backgroundTint, scene.settings.backgroundImage);
    }
}));
