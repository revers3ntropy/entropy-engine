import {v3} from "../maths/v3";
import {Component} from "../ECS/component";
import {JSONifyComponent} from "../util/general";

export class Body extends Component {

    velocity = v3.zero;
    mass = 0;
    friction = 0;
    airResistance = 0;
    bounciness = 0;

    constructor({
        velocity = v3.zero,
        mass = 1,
        friction = 0.1,
        airResistance = 0.1,
        bounciness = 0.2,
    }={}) {
        super("Body");

        this.addPublic({
            name: 'velocity',
            value: velocity,
            description: 'The speed and direction of the object at the first frame',
            type: 'v3'
        });

        this.addPublic({
            name: 'mass',
            value: mass,
            description: 'The mass of the object affects collisions, forces and more.'
        });

        this.addPublic({
            name: 'friction',
            value: friction,
            description: 'When colliding, this is applied to the velocity. Higher values slow it down more.'
        });

        this.addPublic({
            name: 'airResistance',
            value: airResistance,
            description: 'Velocity is scaled by this every Update. Larger values give higher resistance and more slowing'
        });

        this.addPublic({
            name: 'bounciness',
            value: bounciness,
            description: 'When dynamically colliding, the velocity is reversed and multiplied by this. Higher values give a higher bounce.'
        });
    }
    
    json () {
        return JSONifyComponent(this, 'Body');
    }

    applyForce (force: v3) {
        this.velocity.add(force.clone.scale(1/this.mass));
        return this.velocity;
    }
}