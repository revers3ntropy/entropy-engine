﻿import { Component } from './component'
import { Body} from "../components/body"
import {Script} from "../components/scriptComponent"
import {getEntityFromJSON, setParentFromInfo} from "../JSONprocessor";
import { Transform } from '../components/transform';

export type entityConfig = {
    name?: string
    components?: Component[]
    tag?: string | undefined
    transform?: Transform
    Static?: boolean
};

export class Entity {
    name: string;
    components: Component[];
    id: number;
    tag: string;
    transform: Transform;
    Static: boolean;

    constructor (config: entityConfig) {
        this.tag = config.tag ?? 'entity';
        this.name = config.name ?? 'new entity';
        this.components = config.components ?? [];
        this.transform = config.transform ?? new Transform({})
        this.Static = config.Static ?? false

        this.id = this.generateID();
    }

    getComponent = <T extends Component> (type: string, subType = ''): T => {

        if (!(this instanceof Entity)) {
            throw `Running getComponent method in invalid context. this: ${this}`;
        }

        if (type.toLowerCase() === 'transform') {
            return this.transform as unknown as T;
        }

        // returns the first component of passed type
        let component: any = this.components.find(c => (
            c.type === type &&
            (c.subtype === subType || subType === '')
        ) || c.subtype === type);

        // as scripts are going to be handled differently, check them next
        if (component === undefined) {
            component = this.getComponents('Script')
                .find(c => c.subtype === subType || c.subtype === type)
        }

        if (component === undefined) {
            throw `Cannot find component of type ${type} on entity ${this.name}`;
        }

        return component as T;
    };

    getSceneID = () => this.sceneID;

    getClone = async () => {
        const {entity, parentInfo} = await getEntityFromJSON(this.json());
        setParentFromInfo(parentInfo, entity.transform);
        return entity;
    };

    addComponent = (toAdd: Component) => {
        /*
            Checks if the component is viable on the entity, and if it is not,
            then refuses to add it or overrides the problematic component.
            For example, if you try to add a rectRenderer while a CircleRenderer already exists,
            the CircleRenderer will be deleted and then the RectRenderer will be added
         */
        if (toAdd.type === 'transform') {
            return false;
        }

        for (const component of this.components) {

            if (component.type === 'GUIElement'){
                if (toAdd.type !== 'Renderer') {
                    continue;
                }

                if (!['Renderer', 'Body', 'Camera'].includes(toAdd.type)) {
                    continue;
                }
            }

            if (toAdd.type === 'GUIElement') {
                // favour the listed types rather than a GUIElement
                if (['Renderer', 'Body', 'Camera', 'Collider'].includes(component.type)) {
                    return false;
                }
            }

            if (component.type !== toAdd.type) {
                continue;
            }

            if (component.subtype !== toAdd.subtype) {
                continue;
            }

            // remove offending component
            this.components.splice(this.components.indexOf(component),1);
        }
        this.components.push(toAdd);
        return true;
    };
    add = this.addComponent;

    hasComponent = (type: string, subType = ''): boolean => {
        if (type.toLowerCase() === 'transform') return true;

        for (let c of this.components) {
            if (c.type === type && (c.subtype === subType || subType === '')) {
                return true;
            }
            if (c.subtype === type) {
                return true;
            }
        }

        return false;
    };

    getComponents = <T extends Component> (type: string, subType=''): T[] => {
        // returns all components of that type
        let components: T[] = [];

        for (const component of this.components) {
            if (component.type === type && (component.subtype === subType || subType === '')){
                components.push(component as T);
            }
        }

        return components;
    };

    get sceneID (): number {
        let root: Transform | number = this.transform;

        while (typeof root !== 'number') {
            root = root.parent;
        }

        return root;
    }

    generateID = (): number => {
        let id = 0;

        let idsInUse = Entity.entities.map(entity => entity.id);

        function getID () {
            return Math.floor(Math.random() * 10**5);
        }

        while (idsInUse.indexOf(id) > -1)
            id = getID();

        return id;
    }

    delete = () => {
        for (let i = 0; i < Entity.entities.length; i++) {
            const entity = Entity.entities[i];

            if (!Object.is(entity, this)) {
                continue;
            }

            delete Entity.entities.splice(i, 1)[0];
        }
    }

    json = (): any => {
        return {
            'name': this.name,
            'tag': this.tag,
            'Static': this.Static,
            'transform': this.transform.json(),
            'components': this.components.map(c => c.json())
        }
    }

    // -------------- static stuff ------------
    static entities: Entity[] = [];

    static newEntity(setup: entityConfig) {
        const newEntity = new Entity(setup);
        Entity.entities.push(newEntity);
        return newEntity;
    }
    static new = Entity.newEntity;

    static add (entity: Entity) {
        Entity.entities.push(entity);
    }

    static find (name = "") {
        const entity = Entity.entities.find((entity: Entity) => entity.name === name);

        if (!entity)
            return undefined;

        return entity as Entity;
    }

    static findWithTag (tag: string) {
        let entities: Entity[] = [];
        Entity.loop((entity: Entity) => {
            if (entity.tag === tag) {
                entities.push(entity);
            }
        });
        return entities;
    }

    static loop (handler: (entity: Entity) => void) {
        for (const entity of Entity.entities) {
            handler(entity);
        }
    }
}