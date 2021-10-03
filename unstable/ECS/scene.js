import { Entity } from './entity.js';
import { Camera } from "../components/camera.js";
import { v3 } from "../maths/maths.js";
import { colour, rgb } from "../util/colour.js";
import { getCanvasStuff } from "../util/general.js";
export const defaultSceneSettings = () => ({
    license: '0000',
    version: '0.0.0',
    gameName: 'my game',
    canvasID: 'myCanvas',
    maxFrameRate: 60,
    timeScale: 1,
    backgroundTint: rgb.parse('white'),
    globalGravity: new v3(0, -9.8, 0),
    collisionIterations: 5,
    globalVolume: 1
});
export class Scene {
    constructor(name, settings) {
        this.id = Scene.scenes.length;
        this.name = name;
        this.settings = settings;
        if (!settings.ctx) {
            const { ctx } = getCanvasStuff(settings.canvasID);
            settings.ctx = ctx;
        }
    }
    json() {
        var _a;
        return {
            name: this.name,
            settings: {
                license: this.settings.license,
                version: this.settings.version,
                gameName: this.settings.gameName,
                canvasID: this.settings.canvasID,
                maxFrameRate: this.settings.maxFrameRate,
                timeScale: this.settings.timeScale,
                backgroundTint: ((_a = this.settings.backgroundTint) === null || _a === void 0 ? void 0 : _a.json) || rgb.parse('white').json,
                backgroundImage: this.settings.backgroundImage,
                globalGravity: this.settings.globalGravity.array,
                collisionIterations: this.settings.collisionIterations,
                globalVolume: this.settings.globalVolume
            }
        };
    }
    get entities() {
        const queue = [];
        const entities = [];
        for (const entity of Entity.entities) {
            if (entity.transform.isChild())
                continue;
            if (entity.transform.parent !== this.id)
                continue;
            queue.push(entity);
        }
        while (queue.length > 0) {
            for (let child of queue[0].transform.children) {
                queue.push(child);
            }
            // there must be an element so shift can't return undefined, but ts doesn't kow that
            entities.push(queue.shift());
        }
        return entities;
    }
    findMainCamera() {
        for (const entity of this.entities) {
            if (!entity.hasComponent('Camera'))
                continue;
            Camera.main = entity;
            return;
        }
        console.error(`
            No sprites with component of type 'camera' can be found. 
            Make sure that there is at least one sprite in the scene '${Scene.activeScene.name}' with a 'Camera' component attached
        `);
    }
    loopThroughScripts(handler) {
        for (const entity of this.entities) {
            for (const script of entity.getComponents('Script'))
                handler(script, entity);
        }
    }
    broadcast(funcName, params) {
        this.loopThroughScripts((script, entity) => {
            script.runMethod(funcName, params);
        });
    }
    static loopThroughAllScripts(handler) {
        Entity.loop(entity => {
            for (const script of entity.getComponents('Script'))
                handler(script, entity);
        });
    }
    // @ts-ignore
    static set active(val) {
        if (val instanceof Scene)
            Scene.active_ = val.id;
        else
            Scene.active_ = val;
    }
    // @ts-ignore
    static get active() {
        return Scene.active_;
    }
    static get activeScene() {
        if (this.scenes.length < 1)
            throw 'No scenes found';
        return Scene.sceneByID(Scene.active);
    }
    static set activeScene(to) {
        Scene.active = to.id;
    }
    static sceneByName(name) {
        const scene = Scene.scenes.filter(scene => scene.name === name);
        if (scene === undefined || !scene[0] || !(scene[0] instanceof Scene)) {
            console.error(`Cannot find scene name: ${name}`);
            throw Error();
        }
        return scene[0];
    }
    static sceneExistsWithID(id) {
        const scene = Scene.scenes.filter(scene => scene.id === id)[0];
        return scene !== undefined;
    }
    static sceneByID(id) {
        const scene = Scene.scenes.filter(scene => scene.id === id)[0];
        if (scene === undefined) {
            console.error(`Cannot find scene ID: ${id} of type ${typeof id}. Creating empty scene to compensate. Scenes: ${Scene.scenes}`);
            const newScene = new Scene('Example Scene', defaultSceneSettings());
            Scene.scenes.push(newScene);
            return newScene;
        }
        return scene;
    }
    static create(config) {
        const scene = new Scene(config.name || 'Scene', config.settings || defaultSceneSettings());
        Scene.scenes.push(scene);
        if (Scene.scenes.length > 0 && !config.settings) {
            const defaultSettings = Scene.scenes[Scene.scenes.length - 1].json().settings;
            defaultSettings.backgroundTint = new colour(255, 255, 255);
            defaultSettings.globalGravity = v3.fromArray(defaultSettings.globalGravity);
            scene.settings = defaultSettings;
        }
        return scene;
    }
    static next(persists) {
        // @ts-ignore
        Scene.active++;
        if (Scene.active > Scene.scenes.length - 1) {
            Scene.active = 0;
        }
        // move entities to current scene
        for (let sprite of persists) {
            if (typeof sprite.transform.parent === 'number') {
                sprite.transform.parent = Scene.active;
            }
        }
        Scene.activeScene.findMainCamera();
    }
    static previous(persists) {
        // @ts-ignore
        Scene.active--;
        if (Scene.active < 0) {
            Scene.active = Scene.scenes.length - 1;
        }
        // move entities to current scene
        for (let sprite of persists) {
            if (typeof sprite.transform.parent === 'number') {
                sprite.transform.parent = Scene.active;
            }
        }
        Scene.activeScene.findMainCamera();
    }
    static get sceneCount() {
        return Scene.scenes.length;
    }
}
//      STATIC
Scene.scenes = [];
Scene.active_ = 0;
