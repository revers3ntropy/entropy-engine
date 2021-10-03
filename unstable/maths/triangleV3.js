import { TriangleV2 } from "./triangleV2.js";
export class TriangleV3 {
    constructor(p1, p2, p3) {
        this.points = [p1, p2, p3];
    }
    move(by) {
        for (const point of this.points) {
            point.add(by);
        }
    }
    apply(cb) {
        for (let i = 0; i < 3; i++) {
            this.points[i] = cb(this.points[i].clone);
        }
    }
    get clone() {
        // @ts-ignore
        return new TriangleV3(...this.points.map(p => p.clone));
    }
    get triangleV2() {
        return new TriangleV2([
            this.points[0].v2,
            this.points[1].v2,
            this.points[2].v2
        ]);
    }
    get json() {
        let points = [];
        for (const p of this.points) {
            points.push(p.array);
        }
        return points;
    }
}
