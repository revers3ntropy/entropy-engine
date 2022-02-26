import {Systems} from "../../ECS/system";
import {Scene} from "../../ECS/scene";

Systems.systems.push({
    name: 'Scripts',
    Start: (scene: Scene) => {
        scene.broadcast('Start', []);
    },

    Update: (scene: Scene) => {
        scene.broadcast('Update', []);
    },

    order: 0
});