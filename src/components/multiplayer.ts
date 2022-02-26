import {Component} from '../ECS/component';

export interface webAPIToken {
    projectID: number;
    isBuild: boolean;
    valid: boolean;
}

export type eventCallback = () => void;

export class multiplayer extends Component {
    token: webAPIToken;
    fetching: boolean;

    constructor(token: webAPIToken) {
        super('multiplayer');
        this.token = token;
        this.fetching = false;
    }

    json () {
        return {

        }
    }
}