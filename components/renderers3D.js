import { Renderer } from "./renderComponents.js";
import { MeshV3 } from '../maths/maths.js';
import { drawMesh, renderMode } from "../systems/rendering/3d/renderMesh.js";
export class Renderer3D extends Renderer {
    constructor(type) {
        super(type, false);
    }
    Update() { }
}
export class MeshRenderer extends Renderer3D {
    constructor({ mesh = new MeshV3([]), }) {
        super("MeshRenderer");
        this._mesh = mesh;
    }
    // @ts-ignore - get and set have different types
    get mesh() {
        return this._mesh;
    }
    // @ts-ignore - get and set have different types
    set mesh(val) {
        if (val instanceof MeshV3) {
            this._mesh = val;
            return;
        }
        /*
        Array structure:
        [ mesh
          [ triangle
            [n, n, n],
            [n, n, n],
            [n, n, n],
          ],
        ]
         */
        this._mesh = MeshV3.fromArray(val);
    }
    draw(arg) {
        drawMesh(this.mesh, renderMode.WIREFRAME, arg.ctx, arg.cameraSprite, arg.transform);
    }
    json() {
        return {
            type: 'MeshRenderer',
            mesh: this.mesh.json
        };
    }
}