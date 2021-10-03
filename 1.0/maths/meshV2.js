export class MeshV2 {
    constructor(Triangles) {
        this.triangles = Triangles;
    }
    move(by) {
        for (const tri of this.triangles) {
            tri.move(by);
        }
    }
}
