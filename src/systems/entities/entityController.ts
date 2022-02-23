import {Systems} from "../../ECS/system";
import {Scene} from "../../ECS/scene";
import {Script} from "../../components/scriptComponent";
import {Entity} from "../../ECS/entity";

Systems.systems.push({
    name: 'Scripts',
    Start: (scene: Scene) => {
        Script.runStartMethodOnInit = true;

        Scene.loopThroughAllScripts((script: Script, sprite: Entity) => {
            if (script.script === undefined) return;
            // assign properties from a Entity instance to be accessible by 'this' in scripts

            /*
            script.script.entity = sprite;
            script.script.name = sprite.name;
            script.script.transform = sprite.transform;

             */

            let thisComponent: any = null;

            Scene.loopThroughAllScripts(script_ => {
                if (Object.is(script.script, script_.script))
                    thisComponent = script_;
            });

            if (!(thisComponent instanceof Script)) {
                throw new Error(`Cannot find self on script with name ${script.name}!`);
            }

            /*
            script.script.component = thisComponent;

            script.runMethod('Start', []);

             */
        });
    },

    Update: (scene: Scene) => {
        scene.broadcast('Update', []);
    }
});