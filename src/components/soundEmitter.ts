import {Component} from "../ECS/component";

export class soundEmitter extends Component {
    src = '';
    sound: HTMLAudioElement;

    constructor ({
        src = ''
    }={}) {
        super('soundEmitter');

        this.addPublic({
            name: 'src',
            value: src,
        });

        this.sound = document.createElement<'audio'>("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    json(): any {

    }

    Update (): void {}

    play () {
        this.sound.play();
    }

    stop () {
        this.sound.pause();
    }

}