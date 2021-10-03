import { System } from "../../ECS/system.js";
import { Scene } from "../../ECS/scene.js";
import { Script } from "../../components/scriptComponent.js";
System.systems.push(new System({
    name: 'Scripts',
    Start: (scene) => {
        Script.runStartMethodOnInit = true;
        Scene.loopThroughAllScripts((script, sprite) => {
            if (script.script === undefined)
                return;
            // assign properties from a Entity instance to be accessible by 'this' in scripts
            script.script.entity = sprite;
            script.script.name = sprite.name;
            script.script.transform = sprite.transform;
            let thisComponent = null;
            Scene.loopThroughAllScripts((script_, sprite) => {
                if (Object.is(script.script, script_.script))
                    thisComponent = script_;
            });
            if (!(thisComponent instanceof Script))
                throw `Cannot find self on script with name ${script.script.name}!`;
            script.script.component = thisComponent;
            script.script.started = true;
            script.runMethod('Start', []);
        });
    },
    Update: (scene) => {
        scene.broadcast('Update', []);
    }
}));
