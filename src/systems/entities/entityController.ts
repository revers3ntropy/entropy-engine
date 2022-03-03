import {Systems} from "../../ECS/system";
import {Scene} from "../../ECS/scene";

Systems.systems.push({
    name: 'Scripts',
    Start: (scene, canvases) => {
        scene.broadcast('Start', []);
    },

    Update: (scene, canvases) => {
        scene.broadcast('Update', []);
    },

    order: 0
});