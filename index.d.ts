// Generated by dts-bundle v0.7.3
// Dependencies for this module:
//   entropy-script
//   matter-js

declare module 'entropy-engine' {
    import { Entity } from "entropy-engine/src/ECS/entity";
    import { Script } from 'entropy-engine/src/components/scriptComponent';
    import { Collider } from 'entropy-engine/src/components/colliders';
    import { getMousePos, input } from 'entropy-engine/src/input';
    import { GUIElement, GUITextBox } from "entropy-engine/src/components/gui/gui";
    import { entitiesFromJSON, initialiseScenes } from 'entropy-engine/src/JSONprocessor';
    import { Camera } from "entropy-engine/src/components/camera";
    import { Scene } from 'entropy-engine/src/ECS/scene';
    import { Systems } from "entropy-engine/src/ECS/system";
    import { Transform } from "entropy-engine/src/components/transform";
    import { RectCollider, CircleCollider } from "entropy-engine/src/components/colliders";
    import { v2, TriangleV2, MeshV2, v3, TriangleV3, MeshV3 } from 'entropy-engine/src/maths/maths';
    import { Body } from "entropy-engine/src/components/body";
    import { CircleRenderer, RectRenderer, ImageRenderer2D } from 'entropy-engine/src/components/renderers2D';
    import { GUIBox, GUIText, GUIRect, GUICircle, GUIPolygon, GUIImage } from 'entropy-engine/src/components/gui/gui';
    import './systems/physics/physics';
    import './systems/rendering/renderer';
    import './systems/entities/entityController';
    export { Entity, Scene, Systems, Transform, Body, Script, Camera, CircleCollider, RectCollider, Collider, CircleRenderer, RectRenderer, ImageRenderer2D, GUIBox, GUIText, GUITextBox, GUIRect, GUICircle, GUIPolygon, GUIImage, GUIElement, getMousePos, input, entitiesFromJSON, initialiseScenes, v2, TriangleV2, MeshV2, v3, TriangleV3, MeshV3, };
    export { init as initialiseEntropyScript, scriptFromURL } from 'entropy-engine/src/scripting/scripts';
    export { entityConfig } from 'entropy-engine/src/ECS/entity';
    export { sceneSettings, defaultSceneSettings } from 'entropy-engine/src/ECS/scene';
    export type { System } from 'entropy-engine/src/ECS/system';
    export { rgbValToHex, rgb, rgba, colour } from 'entropy-engine/src/util/colour';
    export * from 'entropy-engine/src/util/general';
    export * from 'entropy-engine/src/systems/rendering/basicShapes';
    export * from 'entropy-engine/src/systems/rendering/debugRenderer';
    export * from 'entropy-engine/src/systems/rendering/renderer';
    export * from 'entropy-engine/src/systems/rendering/startAnimation';
    export function EntropyEngine({ canvasContainerID, performanceDebug }?: {
        canvasContainerID?: string | undefined;
        performanceDebug?: number | undefined;
    }): {
        run: () => Promise<void>;
    };
    export function runFromJSON(path: string, config?: any): Promise<{
        run: () => Promise<void>;
    }>;
}

declare module 'entropy-engine/src/ECS/entity' {
    import { Component } from 'entropy-engine/src/ECS/component';
    import { Transform } from 'entropy-engine/src/components/transform';
    export type entityConfig = {
        name?: string;
        components?: Component[];
        tag?: string | undefined;
        transform?: Transform;
        Static?: boolean;
    };
    export class Entity {
        name: string;
        components: Component[];
        id: number;
        tag: string;
        transform: Transform;
        Static: boolean;
        constructor(config: entityConfig);
        getComponent: <T extends Component>(type: string, subType?: string) => T;
        getSceneID: () => number;
        getClone: () => Promise<Entity>;
        addComponent: (toAdd: Component) => boolean;
        add: (toAdd: Component) => boolean;
        hasComponent: (type: string, subType?: string) => boolean;
        getComponents: <T extends Component>(type: string, subType?: string) => T[];
        get sceneID(): number;
        generateID: () => number;
        delete: () => void;
        json: () => any;
        static entities: Entity[];
        static newEntity(setup: entityConfig): Entity;
        static new: typeof Entity.newEntity;
        static add(entity: Entity): void;
        static find(name?: string): Entity | undefined;
        static findWithTag(tag: string): Entity[];
        static loop(handler: (entity: Entity) => void): void;
    }
}

declare module 'entropy-engine/src/components/scriptComponent' {
    import { Component } from 'entropy-engine/src/ECS/component';
    import type { Entity } from 'entropy-engine/src/ECS/entity';
    import { Primitive, ESNamespace, Map } from 'entropy-script';
    type NativeScript = {
        [k: string]: any;
    };
    export class Script extends Component {
        script?: ESNamespace | NativeScript;
        name: string;
        path: string;
        methodWarnings: Map<boolean>;
        constructor({ path, script, name }?: {
            path?: string;
            name?: string;
            script?: ESNamespace | NativeScript;
        });
        jsonPublic(): object[];
        json(): {
            type: string;
            path: string;
            name: string;
            public: object[];
        };
        runMethod: (functionName: string, entity: Entity | undefined, args?: Primitive[]) => void;
        Update(): void;
    }
    export {};
}

declare module 'entropy-engine/src/components/colliders' {
    import * as Matter from 'matter-js';
    import { Component } from "entropy-engine/src/ECS/component";
    import { v2 } from "entropy-engine/src/maths/v2";
    import { Transform } from "entropy-engine/src/index";
    export abstract class Collider extends Component {
        offset: v2;
        solid: boolean;
        MatterBody: Matter.Body;
        protected constructor(subtype: string, solid: boolean, offset: v2, matterBody: Matter.Body);
        abstract overlapsPoint(transform: Transform, point: v2): boolean;
    }
    export class CircleCollider extends Collider {
        radius: number;
        constructor({ radius, solid, offset, }?: {
            radius?: number | undefined;
            solid?: boolean | undefined;
            offset?: v2 | undefined;
        });
        overlapsPoint(transform: Transform, point: v2): boolean;
        json(): {
            type: string;
            radius: number;
            solid: boolean;
            offset: number[];
        };
    }
    export class RectCollider extends Collider {
        width: number;
        height: number;
        constructor({ width, height, solid, offset }?: {
            width?: number | undefined;
            height?: number | undefined;
            solid?: boolean | undefined;
            offset?: v2 | undefined;
        });
        overlapsPoint(transform: Transform, point: v2): boolean;
        json(): {
            type: string;
            height: number;
            width: number;
            solid: boolean;
            offset: number[];
        };
    }
}

declare module 'entropy-engine/src/input' {
    import { v2 } from "entropy-engine/src/maths/v2";
    import { canvases } from 'entropy-engine/src/util/rendering';
    export function getMousePos(canvas: HTMLCanvasElement, event: MouseEvent): v2;
    export function getMousePosWorldSpace(canvas: HTMLCanvasElement, event: MouseEvent): v2;
    export const input: {
        [k: string]: any;
    };
    export function setMousePos(event: any, canvas: HTMLCanvasElement): void;
    export function addEventListeners(canvases: canvases, isInitialised: () => boolean): void;
}

declare module 'entropy-engine/src/components/gui/gui' {
    export * from 'entropy-engine/src/components/gui/guiElement';
    export * from 'entropy-engine/src/components/gui/box';
    export * from 'entropy-engine/src/components/gui/circle';
    export * from 'entropy-engine/src/components/gui/image';
    export * from 'entropy-engine/src/components/gui/polygon';
    export * from 'entropy-engine/src/components/gui/rect';
    export * from 'entropy-engine/src/components/gui/text';
    export * from 'entropy-engine/src/components/gui/textbox';
}

declare module 'entropy-engine/src/JSONprocessor' {
    import { Entity } from 'entropy-engine/src/ECS/entity';
    import { Transform } from "entropy-engine/src/components/transform";
    type json = any;
    export function getEntityFromJSON(JSON: json): Promise<{
        entity: Entity;
        parentInfo: any;
    }>;
    export function setParentFromInfo(parentInfo: {
        type: string;
        name: string;
    }, child: Transform | undefined): void;
    export function entitiesFromJSON(JSON: json): Promise<void>;
    export function initialiseScenes(JSON: json): void;
    export {};
}

declare module 'entropy-engine/src/components/camera' {
    import { Component } from "entropy-engine/src/ECS/component";
    import { v2, v3 } from "entropy-engine/src/maths/maths";
    import type { Entity } from "entropy-engine/src/ECS/entity";
    export class Camera extends Component {
        zoom: number;
        far: number;
        near: number;
        fov: number;
        constructor({ zoom, far, near, fov }?: {
            zoom?: number | undefined;
            far?: number | undefined;
            near?: number | undefined;
            fov?: number | undefined;
        });
        json(): any;
        screenSpaceToWorldSpace(point: v2, canvas: HTMLCanvasElement, cameraPos: v3): v2;
        worldSpaceToScreenSpace(point: v2, canvas: HTMLCanvasElement, cameraPos: v3): v2;
        static main: Entity;
    }
}

declare module 'entropy-engine/src/ECS/scene' {
    import { Entity } from 'entropy-engine/src/ECS/entity';
    import { v3 } from "entropy-engine/src/maths/v3";
    import { colour } from "entropy-engine/src/util/colour";
    import { Script } from "entropy-engine/src/components/scriptComponent";
    export interface sceneSettings {
        license: string;
        version: string;
        gameName: string;
        maxFrameRate: number;
        timeScale: number;
        backgroundTint: colour;
        backgroundImage?: string;
        globalGravity: v3;
        collisionIterations: number;
        globalVolume: number;
    }
    export const defaultSceneSettings: () => sceneSettings;
    export class Scene {
        id: number;
        name: string;
        settings: sceneSettings;
        constructor(name: string, settings: sceneSettings);
        json(): {
            name: string;
            settings: {
                license: string;
                version: string;
                gameName: string;
                maxFrameRate: number;
                timeScale: number;
                backgroundTint: {
                    r: number;
                    g: number;
                    b: number;
                    a: number;
                };
                backgroundImage: string | undefined;
                globalGravity: number[];
                collisionIterations: number;
                globalVolume: number;
            };
        };
        get entities(): Entity[];
        findMainCamera(): void;
        loopThroughScripts(handler: (script: Script, entity: Entity) => void): void;
        broadcast(funcName: string, params?: any[]): void;
        static loopThroughAllScripts(handler: (script: Script, entity: Entity) => void): void;
        static scenes: Scene[];
        static active: number;
        static get activeScene(): Scene;
        static set activeScene(to: Scene);
        static sceneByName(name: string): Scene;
        static sceneExistsWithID(id: number): boolean;
        static sceneByID(id: number): Scene;
        static create(config: {
            name?: string;
            settings?: sceneSettings;
        }): Scene;
        static next(persists: Entity[]): void;
        static previous(persists: Entity[]): void;
        static get sceneCount(): number;
    }
}

declare module 'entropy-engine/src/ECS/system' {
    import { Scene } from "entropy-engine/src/ECS/scene";
    import { canvases } from 'entropy-engine/src/util/rendering';
    export interface System {
        Start: (scene: Scene, canvases: canvases) => void;
        Update: (scene: Scene, canvases: canvases) => void;
        name: string;
        order: number;
        [k: string]: any;
    }
    export const Systems: {
        systems: System[];
        sortByOrder(): void;
        getByName(name: string): System | void;
        Start(scene: Scene, canvases: canvases): void;
        Update(scene: Scene, canvases: canvases): void;
    };
}

declare module 'entropy-engine/src/components/transform' {
    import { v2, v3 } from "entropy-engine/src/maths/maths";
    import { Component } from "entropy-engine/src/ECS/component";
    import { Entity } from "entropy-engine/src/ECS/entity";
    import { Scene } from "entropy-engine/src/ECS/scene";
    export class Transform extends Component {
        position: v3;
        scale: v3;
        rotation: v3;
        parent: Transform | number;
        constructor({ position, scale, rotation, parent }?: {
            position?: v3;
            scale?: v3;
            rotation?: v3;
            parent?: Transform | number;
        });
        setParentDirty(val: Transform | number): void;
        json(): {
            type: string;
            position: number[];
            scale: number[];
            rotation: number[];
            parent: {
                type: string;
                name: string;
            };
        };
        Update(): void;
        get localRotation(): v3;
        set localRotation(v: v3);
        get localPosition(): v3;
        set localPosition(v: v3);
        get localScale(): v3;
        set localScale(v: v3);
        detachFromParent(): void;
        get children(): Entity[];
        get recursiveChildren(): Entity[];
        get childCount(): number;
        makeChildOf(t: Transform | number): void;
        makeParentOf(transforms: Transform[]): void;
        isRoot(): boolean;
        isChild(): boolean;
        get sprite(): Entity;
        get root(): Transform;
        get scene(): Scene;
        get forwards(): v3;
        get right(): v2;
        getChild(name: string): Entity | undefined;
    }
}

declare module 'entropy-engine/src/maths/maths' {
    import { v2 } from "entropy-engine/src/maths/v2";
    export * from 'entropy-engine/src/maths/matrix';
    export * from 'entropy-engine/src/maths/v2';
    export * from 'entropy-engine/src/maths/v3';
    export * from 'entropy-engine/src/maths/meshV2';
    export * from 'entropy-engine/src/maths/meshV3';
    export * from 'entropy-engine/src/maths/triangleV2';
    export * from 'entropy-engine/src/maths/triangleV3';
    export function polygonCollidingWithPoint(polygonPoints: v2[], point: v2): boolean;
}

declare module 'entropy-engine/src/components/body' {
    import { v3 } from "entropy-engine/src/maths/v3";
    import { Component } from "entropy-engine/src/ECS/component";
    export class Body extends Component {
        velocity: v3;
        mass: number;
        friction: number;
        airResistance: number;
        bounciness: number;
        constructor({ velocity, mass, friction, airResistance, bounciness, }?: {
            velocity?: v3 | undefined;
            mass?: number | undefined;
            friction?: number | undefined;
            airResistance?: number | undefined;
            bounciness?: number | undefined;
        });
        json(): any;
        applyForce(force: v3): v3;
    }
}

declare module 'entropy-engine/src/components/renderers2D' {
    import { v2 } from "entropy-engine/src/maths/v2";
    import { colour } from "entropy-engine/src/util/colour";
    import { Transform } from "entropy-engine/src/components/transform";
    import { Renderer } from "entropy-engine/src/components/renderer";
    type drawArgs = {
        position: v2;
        transform: Transform;
        ctx: CanvasRenderingContext2D;
        zoom: number;
        center: v2;
    };
    export abstract class Renderer2D extends Renderer {
        abstract draw(arg: drawArgs): void;
        offset: v2;
        protected constructor(type: string, offset: v2);
        Update(): void;
        json(): any;
    }
    export class CircleRenderer extends Renderer2D {
        radius: number;
        colour: colour;
        constructor({ radius, offset, colour }?: {
            radius?: number | undefined;
            offset?: v2 | undefined;
            colour?: colour | undefined;
        });
        draw({ zoom, transform, ctx, position, center }: drawArgs): void;
    }
    export class RectRenderer extends Renderer2D {
        height: number;
        width: number;
        colour: colour;
        constructor({ height, offset, width, colour, }?: {
            height?: number | undefined;
            offset?: v2 | undefined;
            width?: number | undefined;
            colour?: colour | undefined;
        });
        Start(): void;
        draw(arg: drawArgs): void;
    }
    export class ImageRenderer2D extends Renderer2D {
        height: number;
        width: number;
        url: string;
        constructor({ height, offset, width, url }?: {
            height?: number | undefined;
            offset?: v2 | undefined;
            width?: number | undefined;
            url?: string | undefined;
        });
        Start(): void;
        draw(arg: drawArgs): void;
    }
    export {};
}

declare module 'entropy-engine/src/scripting/scripts' {
    import { Script } from "entropy-engine/src/components/scriptComponent";
    import * as es from 'entropy-script';
    export let globalESContext: es.Context;
    export function init(): Promise<void>;
    export function scriptFromURL(path: string): Promise<void | Script>;
}

declare module 'entropy-engine/src/util/colour' {
    export class colour {
        red: number;
        green: number;
        blue: number;
        alpha: number;
        isColour: boolean;
        constructor(red?: number, green?: number, blue?: number, alpha?: number);
        get hex(): string;
        get rgb(): string;
        get rgba(): string;
        get clone(): colour;
        get json(): {
            r: number;
            g: number;
            b: number;
            a: number;
        };
        static parse(val: string): colour;
        fromJSON({ r, g, b }: {
            r: number;
            g: number;
            b: number;
        }): colour;
    }
    export function rgb(red?: number, green?: number, blue?: number): colour;
    export namespace rgb {
        var parse: typeof colour.parse;
    }
    export function rgba(red: number, green: number, blue: number, alpha: number): colour;
    export function rgbValToHex(val: number | string): string;
}

declare module 'entropy-engine/src/util/general' {
    import { v2 } from "entropy-engine/src/maths/maths";
    export function sleep(ms: number): Promise<unknown>;
    export function JSONifyComponent(component: any, type?: string): any;
    export function scaleMeshV2(mesh: v2[], factor: v2): v2[];
    export function cullString(str: string, cutoff: number): string;
    export function nameFromScriptURL(path: string): string;
    export function genCacheBust(): number;
    export const scriptFetchHeaders: Headers;
    export const scriptFetchInit: {
        method: string;
        headers: Headers;
    };
}

declare module 'entropy-engine/src/systems/rendering/basicShapes' {
    import { v2 } from "entropy-engine/src/maths/v2";
    export function rotateAroundPointWrapper(ctx: CanvasRenderingContext2D, p: v2, theta: number, cb: () => void): void;
    export function roundedRect(ctx: CanvasRenderingContext2D, width: number, height: number, pos: v2, colour: string, radius: number, rotDeg?: number): void;
    export function circle(ctx: CanvasRenderingContext2D, pos: v2, radius: number, colour: string, angleRad?: number, rotDeg?: number): void;
    export function rect(ctx: CanvasRenderingContext2D, position: v2, width: number, height: number, colour: string, rotDeg?: number): void;
    export function polygon(ctx: CanvasRenderingContext2D, points: v2[], fillColour: string, fill?: boolean, rotDeg?: number): void;
    export function text(ctx: CanvasRenderingContext2D, text: string, fontSize: number, font: string, colour: string, position: v2, alignment?: string, rotDeg?: number): void;
    export function image(ctx: CanvasRenderingContext2D, position: v2, size: v2, src: string, rotDeg?: number): void;
}

declare module 'entropy-engine/src/systems/rendering/debugRenderer' {
    import { Entity } from 'entropy-engine/src/ECS/entity';
    export function drawCameras(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, camera: Entity, sprites: Entity[]): void;
    export function drawCameraViewArea(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, camera: Entity, cameraToDraw: Entity, colour: string): void;
    export function renderDebug(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, camera: Entity, entities: Entity[]): void;
    export function renderSelectedOutline(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, camera: Entity, selected: Entity): void;
}

declare module 'entropy-engine/src/systems/rendering/renderer' {
    import { Entity } from "entropy-engine/src/ECS/entity";
    import { colour } from "entropy-engine/src/util/colour";
    import { canvases } from 'entropy-engine/src/util/rendering';
    export function clearCanvas(canvas: HTMLCanvasElement): void;
    export function renderBackground(ctx: CanvasRenderingContext2D, backgroundTint: colour, backgroundImage: string | undefined): void;
    export function renderAll(entities: Entity[], canvases: canvases, backgroundTint: colour, backgroundImage?: string, cameraEntity?: Entity): void;
}

declare module 'entropy-engine/src/systems/rendering/startAnimation' {
    export function startAnimation(canvas: HTMLCanvasElement): Promise<void>;
}

declare module 'entropy-engine/src/ECS/component' {
    import { publicField, publicFieldConfig } from "entropy-engine/src/publicField";
    export abstract class Component {
        type: string;
        subtype: string;
        public: publicField<any>[];
        protected constructor(type: string, subtype?: string);
        abstract json(): any;
        addPublic<T>(config: publicFieldConfig<T>): publicField<T> | void;
        getPublic<T>(name: string): T | undefined;
        getPublicField<T>(name: string): publicField<T> | undefined;
        hasPublic(name: string): boolean;
        setPublic(name: string, value: any): void;
        setPublicTypeCheck(name: string, value: any): void;
    }
}

declare module 'entropy-engine/src/maths/v2' {
    import { v3 } from "entropy-engine/src/maths/v3";
    export class v2 {
        x: number;
        y: number;
        constructor(x: number, y?: number);
        add(v: v2): v2;
        sub(v: v2): v2;
        mul(v: v2): v2;
        scale(factor: number): v2;
        div(v: v2): v2;
        distTo(v: v2): number;
        diff(v: v2): v2;
        get magnitude(): number;
        normalise(): v2;
        get clone(): v2;
        get angle(): number;
        get str(): string;
        equals(v: v2): boolean;
        isInRect(rectPos: v2, rectDimensions: v2): boolean;
        set(to: v2): v2;
        apply(m: (v: number) => number): void;
        dot(v: v2): number;
        cross(v: v2): number;
        get negative(): v2;
        toInt(): v2;
        get v3(): v3;
        get array(): number[];
        static fromAngleMagnitude(theta: number, m: number): v2;
        static fromArray(arr: any): v2;
        static get up(): v2;
        static get down(): v2;
        static get right(): v2;
        static get left(): v2;
        static get zero(): v2;
        static avPoint(points: v2[]): v2;
    }
}

declare module 'entropy-engine/src/util/rendering' {
    import { v2 } from 'entropy-engine/src/maths/v2';
    export function getCanvasSize(canvas: HTMLCanvasElement): v2;
    export function getZoomScaledPosition(pos: v2, zoom: number, center: v2): v2;
    export function resetCanvasRot(canvas: HTMLCanvasElement): void;
    export type canvases = {
        GUI: HTMLCanvasElement;
        input: HTMLCanvasElement;
        render: HTMLCanvasElement;
        background: HTMLCanvasElement;
    };
    export function setCanvasesSizes(canvases: canvases): void;
    export function generateCanvas(divID: string): canvases;
    export function getCTX(canvas: HTMLCanvasElement): CanvasRenderingContext2D;
}

declare module 'entropy-engine/src/components/gui/guiElement' {
    import { Component } from "entropy-engine/src/ECS/component";
    import { Transform } from "entropy-engine/src/components/transform";
    import { v2 } from "entropy-engine/src/maths/v2";
    export abstract class GUIElement extends Component {
        abstract draw(ctx: CanvasRenderingContext2D, transform: Transform): void;
        abstract touchingPoint(point: v2, ctx: CanvasRenderingContext2D, transform: Transform): boolean;
        hovered: boolean;
        zLayer: number;
        protected constructor(subtype: string, zLayer: number);
        json(): any;
    }
}

declare module 'entropy-engine/src/components/gui/box' {
    import { Transform } from "entropy-engine/src/components/transform";
    import { GUIElement } from "entropy-engine/src/components/gui/gui";
    import { v2 } from "entropy-engine/src/maths/v2";
    export class GUIBox extends GUIElement {
        height: number;
        width: number;
        radius: number;
        innerColour: import("../../util/colour").colour;
        outerColour: import("../../util/colour").colour;
        borderThickness: number;
        constructor({ height, width, radius, innerColour, outerColour, borderThickness, zLayer, }: {
            height?: number | undefined;
            width?: number | undefined;
            radius?: number | undefined;
            innerColour?: import("../../util/colour").colour | undefined;
            outerColour?: import("../../util/colour").colour | undefined;
            borderThickness?: number | undefined;
            zLayer?: number | undefined;
        });
        Start(): void;
        draw(ctx: CanvasRenderingContext2D, transform: Transform): void;
        touchingPoint(point: v2, ctx: CanvasRenderingContext2D, transform: Transform): boolean;
    }
}

declare module 'entropy-engine/src/components/gui/circle' {
    import { Transform } from "entropy-engine/src/components/transform";
    import { GUIElement } from "entropy-engine/src/components/gui/gui";
    import { v2 } from "entropy-engine/src/maths/v2";
    export class GUICircle extends GUIElement {
        colour: import("../../util/colour").colour;
        radius: number;
        constructor({ zLayer, colour, radius }: {
            zLayer?: number | undefined;
            colour?: import("../../util/colour").colour | undefined;
            radius?: number | undefined;
        });
        draw(ctx: CanvasRenderingContext2D, transform: Transform): void;
        touchingPoint(point: v2, ctx: CanvasRenderingContext2D, transform: Transform): boolean;
    }
}

declare module 'entropy-engine/src/components/gui/image' {
    import { Transform } from "entropy-engine/src/components/transform";
    import { GUIElement } from "entropy-engine/src/components/gui/gui";
    import { v2 } from "entropy-engine/src/maths/v2";
    export class GUIImage extends GUIElement {
        width: number;
        height: number;
        url: string;
        constructor({ zLayer, width, height, url, }: {
            zLayer?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
            url?: string | undefined;
        });
        draw(ctx: CanvasRenderingContext2D, transform: Transform): void;
        touchingPoint(point: v2, ctx: CanvasRenderingContext2D, transform: Transform): boolean;
    }
}

declare module 'entropy-engine/src/components/gui/polygon' {
    import { Transform } from "entropy-engine/src/components/transform";
    import { v2 } from "entropy-engine/src/maths/maths";
    import { GUIElement } from "entropy-engine/src/components/gui/gui";
    export class GUIPolygon extends GUIElement {
        colour: import("../../util/colour").colour;
        points: v2[];
        constructor({ zLayer, colour, points }: {
            zLayer?: number | undefined;
            colour?: import("../../util/colour").colour | undefined;
            points?: v2[] | undefined;
        });
        draw(ctx: CanvasRenderingContext2D, transform: Transform): void;
        touchingPoint(point: v2, ctx: CanvasRenderingContext2D, transform: Transform): boolean;
    }
}

declare module 'entropy-engine/src/components/gui/rect' {
    import { Transform } from "entropy-engine/src/components/transform";
    import { GUIElement } from "entropy-engine/src/components/gui/gui";
    import { v2 } from "entropy-engine/src/maths/v2";
    export class GUIRect extends GUIElement {
        width: number;
        height: number;
        colour: import("../../util/colour").colour;
        radius: number;
        constructor({ zLayer, width, height, colour, radius }: {
            zLayer?: number | undefined;
            width?: number | undefined;
            height?: number | undefined;
            colour?: import("../../util/colour").colour | undefined;
            radius?: number | undefined;
        });
        draw(ctx: CanvasRenderingContext2D, transform: Transform): void;
        touchingPoint(point: v2, ctx: CanvasRenderingContext2D, transform: Transform): boolean;
    }
}

declare module 'entropy-engine/src/components/gui/text' {
    import { Transform } from "entropy-engine/src/components/transform";
    import { GUIElement } from "entropy-engine/src/components/gui/gui";
    import { v2 } from "entropy-engine/src/maths/v2";
    export class GUIText extends GUIElement {
        text: string;
        fontSize: number;
        font: string;
        colour: import("../../util/colour").colour;
        alignment: string;
        fill: boolean;
        constructor({ text, fontSize, font, colour, alignment, fill, zLayer, }: {
            text?: string | undefined;
            fontSize?: number | undefined;
            font?: string | undefined;
            colour?: import("../../util/colour").colour | undefined;
            alignment?: string | undefined;
            fill?: boolean | undefined;
            zLayer?: number | undefined;
        });
        draw(ctx: CanvasRenderingContext2D, transform: Transform): void;
        touchingPoint(point: v2, ctx: CanvasRenderingContext2D, transform: Transform): boolean;
    }
}

declare module 'entropy-engine/src/components/gui/textbox' {
    import { Transform } from "entropy-engine/src/components/transform";
    import { GUIElement } from "entropy-engine/src/components/gui/gui";
    import { GUIText } from "entropy-engine/src/components/gui/text";
    import { v2 } from "entropy-engine/src/maths/v2";
    export class GUITextBox extends GUIElement {
        text: GUIText;
        selected: boolean;
        limiter: (val: string) => string;
        maxLength: number;
        constructor({ zLayer, initialText, fontSize, font, textColour, textAlignment, fillText, limiter, maxLength }: {
            zLayer?: number | undefined;
            initialText?: string | undefined;
            fontSize?: number | undefined;
            font?: string | undefined;
            textColour?: import("../../util/colour").colour | undefined;
            textAlignment?: string | undefined;
            fillText?: boolean | undefined;
            limiter?: ((val: string) => string) | undefined;
            maxLength?: number | undefined;
        });
        draw(ctx: CanvasRenderingContext2D, transform: Transform): void;
        touchingPoint(point: v2, ctx: CanvasRenderingContext2D, transform: Transform): boolean;
        limit(): void;
        keyPress(event: KeyboardEvent): void;
        backspace(): void;
        get innerText(): string;
        set innerText(val: string);
    }
}

declare module 'entropy-engine/src/maths/v3' {
    import { v2 } from "entropy-engine/src/maths/v2";
    export class v3 {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(x: number, y?: number, z?: number, w?: number);
        add: (v: v3) => v3;
        sub: (v: v3) => v3;
        mul: (v: v3) => v3;
        scale: (factor: number) => v3;
        div: (v: v3) => v3;
        distTo: (v: v3) => number;
        diff: (v: v3) => v3;
        get magnitude(): number;
        normalise: () => v3;
        get clone(): v3;
        get str(): string;
        equals: (v: v3) => boolean;
        isInCuboid: (rectPos: v3, rectDimensions: v3) => boolean;
        set: (to: v3) => v3;
        apply: (m: (v: number) => number) => void;
        dot: (v: v3) => number;
        cross: (v: v3) => number;
        get negative(): v3;
        toInt: () => v3;
        get v2(): v2;
        get array(): number[];
        static get up(): v3;
        static get down(): v3;
        static get right(): v3;
        static get left(): v3;
        static get forward(): v3;
        static get back(): v3;
        static get zero(): v3;
        static avPoint(points: v3[]): v3;
        static fromArray(arr: any): v3;
    }
}

declare module 'entropy-engine/src/maths/matrix' {
    import { v3 } from "entropy-engine/src/maths/v3";
    export class Matrix {
        m: number[][];
        constructor(n: number, m: number, _?: number);
        at(x: number, y: number): number;
        set(x: number, y: number, to: number): void;
    }
    export class Mat4 extends Matrix {
        constructor(fill?: number);
        timesMat(mat: Mat4): Mat4;
        transformV3(v: v3): v3;
        static unit(): Mat4;
    }
}

declare module 'entropy-engine/src/maths/meshV2' {
    import { TriangleV2 } from "entropy-engine/src/maths/triangleV2";
    import { v2 } from "entropy-engine/src/maths/v2";
    export class MeshV2 {
        triangles: TriangleV2[];
        constructor(Triangles: TriangleV2[]);
        move(by: v2): void;
    }
}

declare module 'entropy-engine/src/maths/meshV3' {
    import { TriangleV3 } from "entropy-engine/src/maths/triangleV3";
    import { v3 } from "entropy-engine/src/maths/v3";
    export type PointArr = [number, number, number, number?];
    export type TriangleArr = [PointArr, PointArr, PointArr];
    export type MeshArr = TriangleArr[];
    export class MeshV3 {
        triangles: TriangleV3[];
        constructor(Triangles: TriangleV3[]);
        move(by: v3): void;
        get json(): any;
        get clone(): MeshV3;
        static fromArray(arr: MeshArr): MeshV3;
        static get cube(): MeshV3;
    }
}

declare module 'entropy-engine/src/maths/triangleV2' {
    import { v2 } from "entropy-engine/src/maths/v2";
    export class TriangleV2 {
        points: [v2, v2, v2];
        constructor(points: [v2, v2, v2]);
        move(by: v2): void;
    }
}

declare module 'entropy-engine/src/maths/triangleV3' {
    import { v3 } from "entropy-engine/src/maths/v3";
    import { TriangleV2 } from "entropy-engine/src/maths/triangleV2";
    export class TriangleV3 {
        points: [v3, v3, v3];
        constructor(p1: v3, p2: v3, p3: v3);
        move(by: v3): void;
        apply(cb: (point: v3) => v3): void;
        get clone(): TriangleV3;
        get triangleV2(): TriangleV2;
        get json(): number[][];
    }
}

declare module 'entropy-engine/src/components/renderer' {
    import { Component } from 'entropy-engine/src/ECS/component';
    export abstract class Renderer extends Component {
        abstract draw(...args: any[]): any;
        protected constructor(type: string);
        Update(): void;
        json(): any;
    }
}

declare module 'entropy-engine/src/publicField' {
    export type publicFieldType = 'string' | 'number' | 'Asset' | 'Transform' | 'boolean' | 'json' | 'rgb' | 'v2' | 'v3';
    export type publicFieldAssetTypes = 'any' | 'image' | 'text' | 'json' | 'entity';
    export interface publicFieldConfig<T> {
        name: string;
        value?: T;
        type?: publicFieldType;
        array?: boolean;
        assetType?: publicFieldAssetTypes;
        description?: string;
        default?: T;
        overrideGet?: () => T;
        overrideSet?: (val: T) => void;
    }
    export class publicField<T> {
        type: publicFieldType;
        assetType: publicFieldAssetTypes | undefined;
        value: any;
        name: string;
        description: string;
        array: boolean;
        default: any;
        constructor(config: publicFieldConfig<T>);
    }
}

