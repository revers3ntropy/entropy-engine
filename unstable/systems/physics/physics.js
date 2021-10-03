import { Systems } from "../../ECS/system.js";
import { CircleCollider, RectCollider } from "../../components/colliders";
import { v3 } from "../../maths/v3";
// function called when two sprites collide to trigger the onCollision event in all scripts
/*
function collideSprites (sprite1: Entity, sprite2: Entity) {
    for (let component of sprite1.components)
        if (component.type === 'Script')
            (component as Script).runMethod('onCollision', [new N_any(sprite2)]);


    for (let component of sprite2.components)
        if (component.type === 'Script')
            (component as Script).runMethod('onCollision', [new N_any(sprite1)]);
}
 */
Systems.systems.push({
    name: 'Physics',
    order: 0,
    time: performance.now(),
    Start: function () {
        this.time = performance.now();
    },
    genOptions: (collider, entity, body) => {
        return {
            angle: entity.transform.rotation.z,
            friction: body.friction,
            velocity: body.velocity,
            frictionAir: body.airResistance,
            isStatic: entity.Static,
            mass: body.mass,
            restitution: body.bounciness.clamp(0, 1),
            collisionFilter: {
                group: collider.solid ? 1 : -1
            },
            // reference fto track object in unbuilding
            EEInstance: entity
        };
    },
    buildSim: function (scene) {
        const engine = Matter.Engine.create();
        for (let entity of scene.entities) {
            if (!entity.hasComponent('Body'))
                continue;
            if (!entity.hasComponent('Collider'))
                continue;
            let collider = entity.getComponent('Collider');
            let body = entity.getComponent('Body');
            let MatterBody;
            if (collider instanceof RectCollider) {
                MatterBody = Matter.Bodies.rectangle(entity.transform.position.x, entity.transform.position.y, collider.width, collider.height, this.genOptions(collider, entity, body));
            }
            else if (collider instanceof CircleCollider) {
                MatterBody = Matter.Bodies.circle(entity.transform.position.x, entity.transform.position.y, collider.radius, this.genOptions(collider, entity, body));
            }
            if (!MatterBody)
                continue;
            Matter.World.addBody(engine.world, MatterBody);
        }
        return engine;
    },
    Update: function (scene) {
        const engine = this.buildSim(scene);
        const delta = this.time - performance.now();
        Matter.Engine.update(engine, delta);
        this.time = performance.now();
        this.unbuildSim(scene, engine);
    },
    unbuildSim: function (scene, engine) {
        for (const mBody of engine.world.bodies) {
            const entity = mBody === null || mBody === void 0 ? void 0 : mBody.EEInstance;
            if (!entity.hasComponent('Body'))
                continue;
            if (!entity.hasComponent('Collider'))
                continue;
            //let collider = entity.getComponent<Collider>('Collider');
            let body = entity.getComponent('Body');
            if (!entity) {
                console.error('EEInstance not attached to Matter.Body instance');
                continue;
            }
            entity.transform.rotation.z = mBody.angle;
            body.velocity = new v3(mBody.velocity.x, mBody.velocity.y, 0);
        }
    },
});
