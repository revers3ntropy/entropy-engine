import { project3D, rotation } from "./projectTri.js";
import * as draw from "../basicShapes.js";
export var renderMode;
(function (renderMode) {
    renderMode[renderMode["WIREFRAME"] = 0] = "WIREFRAME";
    renderMode[renderMode["TEXTURE"] = 1] = "TEXTURE";
})(renderMode || (renderMode = {}));
let elapsedTime = 0;
export function drawMesh(mesh_, mode, ctx, camera, transform) {
    const rotationMatrix = rotation(transform.rotation.x + camera.transform.rotation.x + elapsedTime, transform.rotation.y + camera.transform.rotation.y + elapsedTime, transform.rotation.z + camera.transform.rotation.z);
    elapsedTime += 0.001;
    const mesh = mesh_.clone;
    //mesh.move(camera.transform.position);
    mesh.move(transform.position);
    for (let tri of mesh.triangles) {
        tri = project3D(ctx, camera, tri, rotationMatrix);
        switch (mode) {
            case renderMode.WIREFRAME:
                draw.polygon(ctx, tri.triangleV2.points, 'rgb(0, 0, 0)', false, 0);
                break;
            default:
                console.error(`Unknown render mode: ${mode}`);
                break;
        }
    }
}
