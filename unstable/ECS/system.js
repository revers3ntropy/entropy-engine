export const Systems = {
    systems: [],
    sortByOrder() {
        Systems.systems = Systems.systems.sort((a, b) => a.order - b.order);
    },
    getByName(name) {
        for (let system of Systems.systems) {
            if (system.name === name) {
                return system;
            }
        }
    },
    Start(scene) {
        Systems.sortByOrder();
        for (let system of Systems.systems) {
            system.Start(scene);
        }
    },
    Update(scene) {
        for (let system of Systems.systems) {
            system.Update(scene);
        }
    }
};
