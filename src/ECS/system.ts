import {Scene} from "./scene";

export interface System {
    Start: (scene: Scene) => void;
    Update: (scene: Scene) => void;
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

    Start (scene: Scene) {
        Systems.sortByOrder();

        for (let system of Systems.systems) {
            system.Start(scene);
        }
    }

    Update (scene: Scene) {
        for (let system of Systems.systems) {
            system.Update(scene);
        }
    }
}