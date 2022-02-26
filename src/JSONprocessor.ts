import { Entity } from './ECS/entity';
import {v2, v3} from "./maths/maths";
import {Component} from "./ECS/component";
import {Script} from "./components/scriptComponent";

import {Context} from 'entropy-script/src/runtime/context';
import {global} from 'entropy-script/src/constants';
import {ESNamespace, ESString} from 'entropy-script/src/runtime/primitiveTypes';
import {run} from 'entropy-script/src';
import {ESError} from 'entropy-script/src/errors';

// all components
import {CircleCollider, RectCollider} from './components/colliders';
import {Body} from './components/body';
import {CircleRenderer, ImageRenderer2D, RectRenderer} from './components/renderers2D';
import {GUIBox, GUICircle, GUIImage, GUIPolygon, GUIRect, GUIText, GUITextBox} from './components/gui/gui';
import {Camera} from './components/camera';
import { Transform} from "./components/transform";
import {defaultSceneSettings, Scene, sceneSettings} from './ECS/scene';
import {rgba} from "./util/colour";

type json = any;

const components: {[k: string]: new (...args: any[]) => Component} = {
    CircleCollider, RectCollider,
    Body,
    CircleRenderer, RectRenderer, ImageRenderer2D,
    GUIBox, GUIText, GUITextBox, GUIRect, GUICircle, GUIPolygon, GUIImage,
    Camera
}

const cacheBust = Math.floor(Math.random() * 200001);

function isV2(o: any) {
    if (typeof o !== 'object') return false;

    if (!Array.isArray(o)) return false;

    return (o.length === 2 &&
        typeof o[0] === 'number' &&
        typeof o[1] === 'number'
    );
}

function isV3(o: any) {
    if (typeof o !== 'object') return false;
    if (!Array.isArray(o)) return false;

    return (o.length === 3 &&
        typeof o[0] === 'number' &&
        typeof o[1] === 'number' &&
        typeof o[2] === 'number')
}

function isColour (o: any) {
    if (typeof o !== 'object') return false;
    if (typeof o.r !== 'number') return false;
    if (typeof o.g !== 'number') return false;
    return typeof o.b === 'number';
}

function componentPropProcessor (propName: string, componentJSON: json, component: Component | json) {
    // stop it overriding 'type'
    if (propName === 'type' || propName === 'subType') return;

    if (isColour(componentJSON[propName])) {
        const c = componentJSON[propName];
        component[propName] = rgba(c.r, c.g, c.b, c.a);
        return;
    }

    if (!Array.isArray(componentJSON[propName])) {
        component[propName] = componentJSON[propName];
        return;
    }

    // checks arrays two layers deep
    if (isV2(componentJSON[propName])) {
        component[propName] = v2.fromArray(componentJSON[propName]);
        return;

    } else if (isV3(componentJSON[propName])) {
        component[propName] = v3.fromArray(componentJSON[propName]);
        return;
    }

    component[propName] = componentJSON[propName];
}

function dealWithTransform (transformJSON: json) {
    let parentInfo = transformJSON['parent'];

    const transform = new Transform({});

    if (transformJSON['position']) {
        transform.position = v3.fromArray(transformJSON['position']);
    }
    if (transformJSON['scale']) {
        transform.scale = v3.fromArray(transformJSON['scale']);
    }
    if (transformJSON['rotation']) {
        transform.rotation = v3.fromArray(transformJSON['rotation']);
    }

    return {parentInfo, transform};
}

async function dealWithScriptComponent (componentJSON: json): Promise<Script | void> {
    // two parts to a script: path and name
    const path = componentJSON['path'];

    let scriptNode: ESNamespace | undefined;

    const fileName: string = path.split('/').pop();
    
    let scriptData = await fetch(`${path}?${cacheBust}`);
    let code = await scriptData.text();

    const env = new Context();
    env.parent = global;
    env.path = path;


    const n = new ESNamespace(new ESString(fileName), {});

    const res = run(code, {
        env,
        measurePerformance: false,
        fileName,
        currentDir: path,
    });

    n.__value__ = env.getSymbolTableAsDict();

    if (res.error) {
        console.log(res.error.str);
        return;
    }

    scriptNode = n;
    
    // evaluate the script name as JS code, like when instantiating the component
    try {
        const script = new Script({
            script: scriptNode,
            path
        });

        // then override them with the saved values
        if (Array.isArray(componentJSON['public'])) {
            for (let field of componentJSON['public']) {
                if (!script.hasPublic(field['name'])) continue;

                let value = field['value'];

                if (field['type'] === 'v2') {
                    value = v2.fromArray(field['value']);
                } else if (field['type'] === 'v3') {
                    value = v3.fromArray(field['value']);
                }

                script.setPublic(field['name'], value);

            }
        }

        return script;

    } catch (E) {
        throw `Error initialising script '${fileName}': ${E}`;
    }
}

async function componentProcessor(componentJSON: json): Promise<Component|void> {
    let component;
    if (componentJSON['type'] === 'Script') {
        // deal with scripts separately
        return dealWithScriptComponent(componentJSON);
    }

    const componentType = components[componentJSON['type']];
    if (!componentType) {
        throw `No component of type '${componentJSON['type']}' found`;
    }
    component = new (componentType)({});

    for (let prop in componentJSON) {
        if (!componentJSON.hasOwnProperty(prop)) {
            continue;
        }

        componentPropProcessor(prop, componentJSON, component);
    }

    return component;
}

export async function getEntityFromJSON (JSON: json) {
    /*
        Needs MUCH more error checking as you can pass jsonthing as the JSON into it
     */
    const name: string = JSON['name'] ?? `entity ${Entity.entities.length}`;
    const tag: string = JSON['tag'] ?? 'entity';
    const Static: boolean = JSON['Static'] ?? false;

    const componentsJSON = JSON['components'] ?? [];
    let components: Component[] = [];

    const transformJSON = JSON['transform'];
    const {parentInfo, transform} = dealWithTransform(transformJSON || {});
    // components
    for (let componentJSON of componentsJSON) {
        const component = await componentProcessor(componentJSON);

        if (component) {
            components.push(component);
        }
    }

    return {
        entity: new Entity({
            name,
            components,
            transform,
            tag,
            Static
        }),
        parentInfo
    };
}

export function setParentFromInfo (parentInfo: {type: string, name: string}, child: Transform | undefined) {

    let parent: Transform | number | undefined;

    if (parentInfo.type === 'Transform') {
        parent = Entity.find(parentInfo.name)?.transform;

    } else if (parentInfo.type === 'Scene') {
        parent = Scene.sceneByID(parseInt(parentInfo.name)).id;
    }

    if (parent == undefined) {
        parent = Scene.active;
    }

    child?.makeChildOf(parent);
}


export async function entitiesFromJSON (JSON: json) {

    let parentPairs: {[key: string]: {type: string, name: string}} = {};
    if (!Array.isArray(JSON)) {
        console.error('Cannot initialise entities from JSON ', JSON);
        return;
    }

    for (let entityJSON of JSON) {
        let entity = await getEntityFromJSON(entityJSON);
        parentPairs[entity.entity.name] = entity.parentInfo;
        Entity.entities.push(entity.entity);
    }

    // deal with parent-child stuff once all entities have been initialised
    for (let childName in parentPairs) {
        // no parent has been specified
        if (!parentPairs[childName]) continue;

        setParentFromInfo(parentPairs[childName], Entity.find(childName)?.transform);
    }
}

export function initialiseScenes (JSON: json) {
    for (let scene of JSON) {
        const settings: sceneSettings = defaultSceneSettings();
        const settingsJSON = scene['settings'] ?? {};
        for (let prop in settingsJSON) {
            componentPropProcessor(prop, scene['settings'] || {}, settings);
        }
        Scene.create({
            name: scene.name,
            settings
        });
    }
}