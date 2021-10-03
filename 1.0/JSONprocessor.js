var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Entity } from './ECS/entity.js';
import { v2, v3 } from "./maths/maths.js";
import { Script } from "./components/scriptComponent.js";
// all components
import { CircleCollider, RectCollider } from './components/colliders.js';
import { Body } from './components/body.js';
import { CircleRenderer, ImageRenderer2D, RectRenderer, MeshRenderer } from './components/renderComponents.js';
import { GUIBox, GUICircle, GUIImage, GUIPolygon, GUIRect, GUIText, GUITextBox } from './components/gui/gui.js';
import { Camera } from './components/camera.js';
import { Transform } from "./components/transform.js";
import { defaultSceneSettings, Scene } from './ECS/scene.js';
import { rgba } from "./util/colour.js";
import { nameFromScriptURL } from './util/general.js';
import { run } from "./scripting/EEScript/index.js";
import { ESBehaviourInstance } from "./scripting/EEScript/ESBehaviour.js";
// reference everything so the ts compiler will think that it is being used and wont delete the import
CircleCollider;
RectCollider;
Body;
CircleRenderer;
RectRenderer;
ImageRenderer2D;
MeshRenderer;
GUIBox;
GUIText;
GUITextBox;
GUIRect;
GUICircle;
GUIPolygon;
GUIImage;
Camera;
const cacheBust = Math.floor(Math.random() * 200001);
function isV2(o) {
    if (!o)
        return false;
    if (!Array.isArray(o))
        return false;
    return (o.length === 2 &&
        typeof o[0] === 'number' &&
        typeof o[1] === 'number');
}
function isV3(o) {
    if (!o)
        return false;
    if (!Array.isArray(o))
        return false;
    return (o.length === 3 &&
        typeof o[0] === 'number' &&
        typeof o[1] === 'number' &&
        typeof o[2] === 'number');
}
function isColour(o) {
    if (!o)
        return false;
    if (typeof o.r !== 'number')
        return false;
    if (typeof o.g !== 'number')
        return false;
    return typeof o.b === 'number';
}
function componentPropProcessor(propName, componentJSON, component) {
    // stop it overriding 'type'
    if (propName === 'type' || propName === 'subType')
        return;
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
    }
    else if (isV3(componentJSON[propName])) {
        component[propName] = v3.fromArray(componentJSON[propName]);
        return;
    }
    component[propName] = componentJSON[propName];
}
function dealWithTransform(transformJSON) {
    let parentInfo = transformJSON['parent'];
    const transform = new Transform({});
    if (transformJSON['position'])
        transform.position = v3.fromArray(transformJSON['position']);
    if (transformJSON['scale'])
        transform.scale = v3.fromArray(transformJSON['scale']);
    if (transformJSON['rotation'])
        transform.rotation = v3.fromArray(transformJSON['rotation']);
    return { parentInfo, transform };
}
function dealWithScriptComponent(componentJSON) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // two parts to a script: path and name
        const path = componentJSON['path'];
        // use either a specified name or the name of the file (found using some regex)
        const className = componentJSON['name'] || componentJSON['className'];
        // gets name of file
        let scriptNode;
        try {
            let scriptData = yield fetch(`${path}?${cacheBust}`);
            let scriptRaw = yield scriptData.text();
            let name = nameFromScriptURL(path);
            let res = run(scriptRaw);
            if (res.error) {
                console.log(res.error.str);
                return;
            }
            let node;
            for (let line of res.val) {
                if (!(line instanceof ESBehaviourInstance))
                    continue;
                if (line.name !== name)
                    continue;
                node = line;
                break;
            }
            if (!(node instanceof ESBehaviourInstance)) {
                console.error('Node not instance of N_ESBehaviour: ', node);
                return;
            }
            scriptNode = node;
        }
        catch (e) {
            console.error(`Script Error: ${e}`);
            return;
        }
        // evaluate the script name as JS code, like when instantiating the component
        try {
            const script = new Script({
                script: scriptNode
            });
            script.name = className;
            script.scriptName = className;
            // set the values from the temp created when initialising the script
            for (let field of ((_a = script === null || script === void 0 ? void 0 : script.script) === null || _a === void 0 ? void 0 : _a.tempPublic) || []) {
                script.public.push(field);
            }
            // then override them with the saved values
            if (Array.isArray(componentJSON['public'])) {
                for (let field of componentJSON['public']) {
                    if (!script.hasPublic(field['name']))
                        continue;
                    let value = field['value'];
                    if (field['type'] === 'v2')
                        value = v2.fromArray(field['value']);
                    else if (field['type'] === 'v3')
                        value = v3.fromArray(field['value']);
                    script.setPublic(field['name'], value);
                }
            }
            return script;
        }
        catch (E) {
            console.error(`Error initialising script '${componentJSON['name'] || 'unnamed script'}': ${E}`);
        }
        return;
    });
}
function componentProccessor(componentJSON) {
    return __awaiter(this, void 0, void 0, function* () {
        let component;
        if (componentJSON['type'] === 'Script') {
            // deal with scripts separately
            return yield dealWithScriptComponent(componentJSON);
        }
        // dynamically generate component from class
        try {
            component = new (eval(componentJSON['type']))({});
        }
        catch (E) {
            console.error(`Couldn't create component ${componentJSON}: ${E}`);
            return;
        }
        for (let prop in componentJSON) {
            if (!componentJSON.hasOwnProperty(prop))
                continue;
            componentPropProcessor(prop, componentJSON, component);
        }
        return component;
    });
}
export function getEntityFromJSON(JSON) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        /*
            Needs MUCH more error checking as you can pass anything as the JSON into it
         */
        const name = (_a = JSON['name']) !== null && _a !== void 0 ? _a : `entity ${Entity.entities.length}`;
        const tag = (_b = JSON['tag']) !== null && _b !== void 0 ? _b : 'entity';
        const Static = (_c = JSON['Static']) !== null && _c !== void 0 ? _c : false;
        const componentsJSON = (_d = JSON['components']) !== null && _d !== void 0 ? _d : [];
        let components = [];
        const transformJSON = JSON['transform'];
        const { parentInfo, transform } = dealWithTransform(transformJSON || {});
        // components
        for (let componentJSON of componentsJSON) {
            const component = yield componentProccessor(componentJSON);
            if (component)
                components.push(component);
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
    });
}
export function setParentFromInfo(parentInfo, child) {
    var _a;
    let parent;
    if (parentInfo.type === 'Transform') {
        parent = (_a = Entity.find(parentInfo.name)) === null || _a === void 0 ? void 0 : _a.transform;
    }
    else if (parentInfo.type === 'Scene') {
        parent = Scene.sceneByID(parseInt(parentInfo.name)).id;
    }
    if (parent == undefined) {
        parent = Scene.active;
    }
    child === null || child === void 0 ? void 0 : child.makeChildOf(parent);
}
export function entitiesFromJSON(JSON) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let parentPairs = {};
        if (!Array.isArray(JSON)) {
            console.error('Cannot initialise entities from JSON ', JSON);
            return;
        }
        for (let entityJSON of JSON) {
            let entity = yield getEntityFromJSON(entityJSON);
            parentPairs[entity.entity.name] = entity.parentInfo;
            Entity.entities.push(entity.entity);
        }
        // deal with parent-child stuff once all entities have been initialised
        for (let childName in parentPairs) {
            // no parent has been specified
            if (!parentPairs[childName])
                continue;
            setParentFromInfo(parentPairs[childName], (_a = Entity.find(childName)) === null || _a === void 0 ? void 0 : _a.transform);
        }
    });
}
export function initialiseScenes(JSON) {
    var _a;
    for (let scene of JSON) {
        const settings = defaultSceneSettings();
        const settingsJSON = (_a = scene['settings']) !== null && _a !== void 0 ? _a : {};
        for (let prop in settingsJSON) {
            componentPropProcessor(prop, scene['settings'] || {}, settings);
        }
        Scene.create({
            name: scene.name,
            settings
        });
    }
}
