import {Systems} from "../../ECS/system";

Systems.systems.push({
    name: 'Scripts',
    Start: (scene) => {
        scene.broadcast('Start', []);
    },

    Update: (scene) => {
        scene.broadcast('Update', []);
    },

    order: 0
});