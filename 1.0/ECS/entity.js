var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Component } from './component.js';
import { Script } from "../components/scriptComponent.js";
import { getEntityFromJSON, setParentFromInfo } from "../JSONprocessor.js";
import { Transform } from '../components/transform.js';
import { ESBehaviourInstance } from "../scripting/EEScript/ESBehaviour.js";
export class Entity {
    constructor(config) {
        var _a, _b, _c, _d, _e;
        this.getComponent = (type, subType = '') => {
            if (!(this instanceof Entity))
                throw new Error(`Running getComponent method in invalid context. this: ${this}`);
            if (type.toLowerCase() === 'transform')
                return this.transform;
            // returns the first component of passed type
            let component = this.components.find(c => (c.type === type &&
                (c.subtype === subType || subType === '')) || c.subtype === type);
            // as scripts are going to be handled differently, check them next
            if (component === undefined)
                component = this.getComponents('Script').find(c => c.subtype === subType || c.subtype === type);
            if (component === undefined)
                throw new Error(`Cannot find component of type ${type} on entity ${this.name}`);
            return component;
        };
        this.getSceneID = () => this.sceneID;
        this.getClone = () => __awaiter(this, void 0, void 0, function* () {
            const { entity, parentInfo } = yield getEntityFromJSON(this.json());
            setParentFromInfo(parentInfo, entity.transform);
            return entity;
        });
        this.addComponent = (toAdd) => {
            /*
                Checks if the component is viable on the entity, and if it is not,
                then refuses to add it or overrides the problematic component.
                For example, if you try to add a rectRenderer while a CircleRenderer already exists,
                the CircleRenderer will be deleted and then the RectRenderer will be added
             */
            if (!(toAdd instanceof Component)) {
                if (toAdd instanceof ESBehaviourInstance) {
                    for (let component of this.components)
                        if (Object.is(component, toAdd))
                            return false;
                    toAdd.entity = this;
                    this.components.push(new Script({
                        script: toAdd
                    }));
                    return true;
                }
                console.error(`Cannot add component: `, toAdd);
                return false;
            }
            if (toAdd.type === 'transform')
                return false;
            for (const component of this.components) {
                if (component.type === 'GUIElement') {
                    if (toAdd.type !== 'Renderer')
                        continue;
                    if (!['Renderer', 'Body', 'Camera'].includes(toAdd.type))
                        continue;
                }
                if (toAdd.type === 'GUIElement') {
                    // favour the listed types rather than a GUIElement
                    if (['Renderer', 'Body', 'Camera', 'Collider'].includes(component.type))
                        return false;
                }
                if (component.type !== toAdd.type)
                    continue;
                if (component.subtype !== toAdd.subtype)
                    continue;
                // remove offending component
                this.components.splice(this.components.indexOf(component), 1);
            }
            this.components.push(toAdd);
            return true;
        };
        this.add = this.addComponent;
        this.hasComponent = (type, subType = '') => {
            if (type.toLowerCase() === 'transform')
                return true;
            for (let c of this.components)
                if ((c.type === type &&
                    (c.subtype === subType || subType === '')) || c.subtype === type)
                    return true;
            return false;
        };
        this.getComponents = (type, subType = '') => {
            // returns all components of that type
            let components = [];
            for (const component of this.components)
                if (component.type === type &&
                    (component.subtype === subType || subType === ''))
                    components.push(component);
            return components;
        };
        this.generateID = () => {
            let id = 0;
            let idsInUse = Entity.entities.map(entity => entity.id);
            function getID() {
                return Math.floor(Math.random() * Math.pow(10, 5));
            }
            while (idsInUse.indexOf(id) > -1)
                id = getID();
            return id;
        };
        this.delete = () => {
            for (let i = 0; i < Entity.entities.length; i++) {
                const entity = Entity.entities[i];
                if (!Object.is(entity, this))
                    continue;
                delete Entity.entities.splice(i, 1)[0];
            }
        };
        this.json = () => {
            return {
                'name': this.name,
                'tag': this.tag,
                'Static': this.Static,
                'transform': this.transform.json(),
                'components': this.components.map(c => c.json())
            };
        };
        this.tag = (_a = config.tag) !== null && _a !== void 0 ? _a : 'entity';
        this.name = (_b = config.name) !== null && _b !== void 0 ? _b : 'new entity';
        this.components = (_c = config.components) !== null && _c !== void 0 ? _c : [];
        this.transform = (_d = config.transform) !== null && _d !== void 0 ? _d : new Transform({});
        this.Static = (_e = config.Static) !== null && _e !== void 0 ? _e : false;
        this.id = this.generateID();
    }
    get sceneID() {
        let root = this.transform;
        while (true) {
            if (typeof root == 'number') {
                break;
            }
            root = root.parent;
        }
        return root;
    }
    static newEntity(setup) {
        const newEntity = new Entity(setup);
        Entity.entities.push(newEntity);
        return newEntity;
    }
    static add(entity) {
        Entity.entities.push(entity);
    }
    static find(name = "") {
        const entity = Entity.entities.find((entity) => entity.name === name);
        if (!entity)
            return undefined;
        return entity;
    }
    static findWithTag(tag) {
        let entities = [];
        Entity.loop((entity) => {
            if (entity.tag === tag)
                entities.push(entity);
        });
        return entities;
    }
    static loop(handler) {
        for (const entity of Entity.entities)
            handler(entity);
    }
}
// -------------- static stuff ------------
Entity.entities = [];
Entity.new = Entity.newEntity;
