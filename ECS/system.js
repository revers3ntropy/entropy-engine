export class System {
    constructor({ Start, Update, order, name }) {
        this.Start = Start;
        this.Update = Update;
        this.name = name;
        // higher numbers get executed first
        this.order = order || 0;
    }
    static sortByOrder() {
        System.systems = System.systems.sort((a, b) => a.order - b.order);
    }
    static getByName(name) {
        for (let system of System.systems) {
            if (system.name === name) {
                return system;
            }
        }
    }
    static Start(scene) {
        System.sortByOrder();
        for (let system of System.systems) {
            system.Start(scene);
        }
    }
    static Update(scene) {
        for (let system of System.systems) {
            system.Update(scene);
        }
    }
}
System.systems = [];
