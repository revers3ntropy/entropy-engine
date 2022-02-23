import {v2} from "./v2";

export class TriangleV2 {

    points: [v2, v2, v2];

    constructor (points: [v2, v2, v2]) {
        this.points = points;
    }

    move (by: v2) {
        for (const point of this.points) {
            point.add(by);
        }
    }
}