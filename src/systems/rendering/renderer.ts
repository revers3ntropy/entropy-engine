import {Systems} from "../../ECS/system";
import {image} from "./basicShapes";
import {Camera} from "../../components/camera";
import {Entity} from "../../ECS/entity";
import {v2} from "../../maths/v2";
import {colour, rgb} from "../../util/colour";
import {canvases, getCanvasSize, getCTX, resetCanvasRot} from '../../util/rendering';
import {GUIElement} from "../../components/gui/guiElement";
import {Renderer} from '../../components/renderer';
import { Scene } from "../../ECS/scene";

function orderSpritesForRender (sprites: Entity[]): Entity[] {
    // sort the entities by their z position
    const zOrderedSprites = sprites.sort((a: Entity, b: Entity) => {
        return a.transform.position.z - b.transform.position.z;
    })

    // GUI elements appear always above normal entities,
    // so filter them out and put them last, still ordered by their z position
    let justSprites = [];
    let justGUI = [];
    for (let sprite of zOrderedSprites) {
        if (sprite.hasComponent('GUIElement')) {
            justGUI.push(sprite);
        } else {
            justSprites.push(sprite);
        }
    }

    return [...justSprites, ...justGUI];
}

export function clearCanvas (canvas: HTMLCanvasElement) {
    getCTX(canvas).clearRect(0, 0, canvas.width, canvas.height);
}

export function renderBackground (ctx: CanvasRenderingContext2D, backgroundTint: colour, backgroundImage: string | undefined) {

    function fillBackground (alpha: number) {
        let bgColour = backgroundTint || rgb.parse('white');
        bgColour = bgColour.clone;
        bgColour.alpha = alpha;

        ctx.beginPath();

        ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = bgColour.hex;

        ctx.fill();
        ctx.closePath();
    }

    if (!backgroundImage) {
        fillBackground(1);
        return;
    }
    // if it can't use the image as a background, then just use the colour
    try {
        image(ctx, v2.zero, getCanvasSize(ctx.canvas), backgroundImage);
    } catch {
        fillBackground(0.1);
    }
}


export function renderAll (entities: Entity[], canvases: canvases, backgroundTint: colour, backgroundImage?: string, cameraEntity: Entity = Camera.main) {

    // background
    const canvasSize = getCanvasSize(canvases.render);
    const mid = canvasSize.clone.scale(0.5);

    clearCanvas(canvases.render);
    clearCanvas(canvases.background);
    clearCanvas(canvases.GUI);

    renderBackground(getCTX(canvases.background), backgroundTint, backgroundImage);

    if (!entities) return;

    if (!cameraEntity) {
        console.error('Camera was not passed to renderAll function! Main camera: ' + Camera.main.name);
        return;
    }

    // camera
    const camera = cameraEntity
        .getComponent<Camera>("Camera");

    if (!camera) return;

    const cameraPos = cameraEntity.transform
        .position.clone
        .sub(canvasSize
            .clone
            .scale(0.5).v3
        );
    // sub the screen size to put 0, 0 in the middle of the screen

    if (!cameraPos) return;

    // filter out entities that don't have render components
    entities = entities.filter((sprite) => (
        sprite.hasComponent('Renderer') ||
        sprite.hasComponent('GUIElement')
    ));


    // call the draw function for each
    for (let sprite of orderSpritesForRender(entities)) {
        // deal with GUI and normal render components separately
        if (sprite.hasComponent('GUIElement')) {
            sprite.getComponent<GUIElement>('GUIElement')
                .draw(getCTX(canvases.GUI), sprite.transform);
            continue;
        }

        const renderPos = sprite.transform.position.clone.sub(cameraPos);

        // passes through more arguments than any draw function needs, as they require different data
        sprite.getComponent<Renderer>('Renderer').draw({
            position: renderPos,
            transform: sprite.transform,
            ctx: getCTX(canvases.render),
            zoom: camera.zoom,
            center: mid,
            camera,
            cameraSprite: cameraEntity
        });
    }
}

Systems.systems.push({
    name: 'Renderer',

    Start: (scene: Scene, canvases: canvases) => {
        resetCanvasRot(canvases.render);
        resetCanvasRot(canvases.input);
        resetCanvasRot(canvases.GUI);

        clearCanvas(canvases.GUI);
        clearCanvas(canvases.input);
        clearCanvas(canvases.render);
    },

    Update: (scene: Scene, canvases: canvases) => {
        renderAll(scene.entities, canvases, scene.settings.backgroundTint, scene.settings.backgroundImage);
    },

    order: 10
});