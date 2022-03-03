import {Scene} from "./scene";
import {canvases} from '../util/rendering';

export interface System {

    Start: (scene: Scene, canvases: canvases) => void;
    Update: (scene: Scene, canvases: canvases) => void;
    name: string;
    order: number;

    [k: string]: any;
}


export const Systems = new class {
    systems: System[] = [];

    sortByOrder () {
        Systems.systems = Systems.systems.sort((a: System, b: System) => a.order - b.order);
    }

    getByName (name: string): System | void {
        for (let system of Systems.systems) {
            if (system.name === name) {
                return system;
            }
        }
    }

    Start (scene: Scene, canvases: canvases) {
        Systems.sortByOrder();

        for (let system of Systems.systems) {
            system.Start(scene, canvases);
        }
    }

    Update (scene: Scene, canvases: canvases) {
        for (let system of Systems.systems) {
            system.Update(scene, canvases);
        }
    }
}