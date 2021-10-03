import { Component } from "../ECS/component";
export class soundEmitter extends Component {
    constructor(config) {
        super('soundEmitter');
        this.addPublic({
            name: 'src',
            value: config.src,
        });
        this.sound = document.createElement("audio");
        this.sound.src = config.src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }
    json() {
    }
    Update(transform) {
    }
    play() {
        this.sound.play();
    }
    stop() {
        this.sound.pause();
    }
}
