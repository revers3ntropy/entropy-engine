import { TriangleV3 } from "./triangleV3.js";
import { v3 } from "./v3.js";
export class MeshV3 {
    constructor(Triangles) {
        this.triangles = Triangles;
    }
    move(by) {
        for (const tri of this.triangles) {
            tri.move(by);
        }
    }
    get json() {
        let tris = [];
        for (const tri of this.triangles) {
            tris.push(tri.json);
        }
        return tris;
    }
    get clone() {
        return new MeshV3(this.triangles.map(t => t.clone));
    }
    //      STATIC
    static fromArray(arr) {
        let mesh = new MeshV3([]);
        // parse array of triangles into mesh
        for (let tri of arr) {
            const points = [];
            for (let point of tri) {
                points.push(v3.fromArray(point));
            }
            // @ts-ignore - wrong number of arguments for TriangleV3 constructor - assumed to be safe
            mesh.triangles.push(new TriangleV3(...points));
        }
        return mesh;
    }
    // basic shapes
    static get cube() {
        return new MeshV3([
            // SOUTH
            new TriangleV3(new v3(0, 0, 0, 1), new v3(0, 1, 0, 1), new v3(1, 1, 0, 1)),
            new TriangleV3(new v3(0, 0, 0, 1), new v3(1, 1, 0, 1), new v3(1, 0, 0, 1)),
            // EAST
            new TriangleV3(new v3(1, 0, 0, 1), new v3(1, 1, 0, 1), new v3(1, 1, 1, 1)),
            new TriangleV3(new v3(1, 0, 0, 1), new v3(1, 1, 1, 1), new v3(1, 0, 1, 1)),
            // NORTH
            new TriangleV3(new v3(1, 0, 1, 1), new v3(1, 1, 1, 1), new v3(0, 1, 1, 1)),
            new TriangleV3(new v3(1, 0, 1, 1), new v3(0, 1, 1, 1), new v3(0, 0, 1, 1)),
            // WEST
            new TriangleV3(new v3(0, 0, 1, 1), new v3(0, 1, 1, 1), new v3(0, 1, 0, 1)),
            new TriangleV3(new v3(0, 0, 1, 1), new v3(0, 1, 0, 1), new v3(0, 0, 0, 1)),
            // TOP
            new TriangleV3(new v3(0, 1, 0, 1), new v3(0, 1, 1, 1), new v3(1, 1, 1, 1)),
            new TriangleV3(new v3(0, 1, 0, 1), new v3(1, 1, 1, 1), new v3(1, 1, 0, 1)),
            // BOTTOM
            new TriangleV3(new v3(1, 0, 1, 1), new v3(0, 0, 1, 1), new v3(0, 0, 0, 1)),
            new TriangleV3(new v3(1, 0, 1, 1), new v3(0, 0, 0, 1), new v3(1, 0, 0, 1)),
        ]);
    }
}
