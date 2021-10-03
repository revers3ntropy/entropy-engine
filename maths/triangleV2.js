export class TriangleV2 {
    constructor(points) {
        this.points = points;
    }
    move(by) {
        for (const point of this.points) {
            point.add(by);
        }
    }
}
