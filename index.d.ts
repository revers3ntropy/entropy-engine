declare module 'entropy-engine' {

    import * as Matter from "matter-js";
    import { ESNamespace, Primitive } from "entropy-script";

    type ESReturns = {
        run: () => Promise<void>
    };

    function EntropyEngine (props?: {
        canvasID?: string,
        performanceDebug?: number
    }): ESReturns;

    function runFromJSON (path: string, config?: any): ESReturns;

    type PointArr = [number, number, number, number?];
    type TriangleArr = [PointArr, PointArr, PointArr]
    type MeshArr = TriangleArr[];

    class v3 {
        x: number;
        y: number;
        z: number;
        w: number;

        constructor (x: number, y?: number, z?: number, w?: number);

        add: (v: v3) => v3;
        sub: (v: v3) => v3;
        mul: (v: v3) => v3;
        scale: (factor: number) => v3;
        div: (v: v3) => v3;
        distTo: (v: v3) => number;
        diff: (v: v3) => v3;

        get magnitude (): number;

        normalise: () => v3;

        get clone (): v3;

        get str (): string;

        equals: (v: v3) => boolean;

        /**
         * Checks to see if the point is inside the top, right and front face of the cuboid,
         * and if it is in all three then it is inside the cuboid
         * */
        isInCuboid: (rectPos: v3, rectDimensions: v3) => boolean;
        set: (to: v3) => v3;
        apply: (m: (v: number) => number) => void;
        dot: (v: v3) => number;
        cross: (v: v3) => number;

        get negative (): v3;

        toInt: () => v3;

        get v2 (): v2;

        get array (): number[];

        static get up (): v3;

        static get down (): v3;

        static get right (): v3;

        static get left (): v3;

        static get forward (): v3;

        static get back (): v3;

        static get zero (): v3;

        static avPoint (points: v3[]): v3;

        static fromArray (arr: any): v3;
    }

    class v2 {
        x: number;
        y: number;

        constructor (x: number, y?: number);

        /**
         * Adds a vector to this vector. Does not affect the passed vector.
         * @returns self
         */
        add (v: v2): v2;

        /**
         * Subtracts a vector from this vector. Does not effect the passed vector.
         * @returns self
         */
        sub (v: v2): v2;

        /**
         * Multiplies each component of passed vector by component of this vector. Does not effect the passed vector.
         * @returns self
         */
        mul (v: v2): v2;

        /**
         * Multiplies x and y of this vector by a number
         * @returns self
         */
        scale (factor: number): v2;

        /**
         * Divides this vector by the passed vector.
         * @param v vector to divide by
         * @returns self;
         */
        div (v: v2): v2;

        /**
         * @returns the distance between two vectors as if they were points on a plain.
         */
        distTo (v: v2): number;

        /**
         * Generates a new vector which is the absolute difference between this vector and the passed one.
         */
        diff (v: v2): v2;

        /**
         * @returns the magnitude of this vector, calculated using Pythagoras' Theorem
         */
        get magnitude (): number;

        /**
         * Normalises this vector so that it has a magnitude of 1, but points in the same direction
         * @returns {v2} self
         */
        normalise (): v2;

        /**
         * Clone of this vector
         */
        get clone (): v2;

        /**
         * The angle that this vector is pointing in
         * @returns -Math.atan2(-this.y, this.x)
         */
        get angle (): number;

        get str (): string;

        /**
         * @param v vector to compare against
         * @returns if the components of this vector and another vector are the same (uses ===)
         */
        equals (v: v2): boolean;

        /**
         * @param {v2} rectPos the position of the upper right corner of the rectangle
         * @param {v2} rectDimensions the size of the rectangle
         * @returns true if this vector is inside a rectangle if it were a point on a plain
         */
        isInRect (rectPos: v2, rectDimensions: v2): boolean;

        /**
         * Sets the x and y components of this vector to the same as a different vector
         * @returns self
         */
        set (to: v2): v2;

        /**
         * Applies a function to the x and y parts of this vector
         * Function in form (v: number) => number
         */
        apply (m: (v: number) => number): void;

        /**
         * @param v
         * @returns {number}dot product of this vector and v
         */
        dot (v: v2): number;

        /**
         * @retuns Gets the cross product of this vector and another
         */
        cross (v: v2): number;

        /**
         * @returns clone of this vector scaled by -1
         */
        get negative (): v2;

        /**
         * Applies Math.round to this vector
         * @returns self
         */
        toInt (): v2;

        /**
         * @returns this vector as a vector 3, where z=0
         */
        get v3 (): v3;

        /**
         * @returns this vector as an array where index 0 is the x component and index 1 is the y
         */
        get array (): number[];

        /**
         * Gets a vector from the angle and magnitude.
         * @param theta Angle of the vector in radians. Gets clamped to between 0 and 360.
         * @param m The length of the vector
         */
        static fromAngleMagnitude (theta: number, m: number): v2;

        /**
         * Converts an array into a vector
         */
        static fromArray (arr: number[]): v2;

        /**
         *  A vector pointing 'up' (x = 0, y = 1)
         */
        static get up (): v2;

        /**
         * A vector pointing 'down' (x = 0, y = -1)
         */
        static get down (): v2;

        /**
         * A vector pointing 'right' (x = 1, y = 0)
         */
        static get right (): v3;

        /**
         * A vector pointing 'left' (x = -1, y = 0)
         */
        static get left (): v2;

        /**
         * A zeroed vector
         */
        static get zero (): v2

        /**
         * Averages an array of vectors
         */
        static avPoint (points: v2[]): v2;
    }

    class TriangleV2 {
        points: [v2, v2, v2];

        constructor (points: [v2, v2, v2]);

        move (by: v2): void;
    }

    class MeshV2 {
        triangles: TriangleV2[];

        constructor (Triangles: TriangleV2[]);

        move (by: v2): void;
    }

    class TriangleV3 {
        points: [v3, v3, v3];

        constructor (p1: v3, p2: v3, p3: v3);

        move (by: v3): void;

        apply (cb: (point: v3) => v3): void;

        get clone (): TriangleV3;

        get triangleV2 (): TriangleV2;

        get json (): any;
    }

    class MeshV3 {
        triangles: TriangleV3[];

        constructor (Triangles: TriangleV3[]);

        move (by: v3): void;

        get json (): any;

        get clone (): MeshV3;

        static fromArray (arr: MeshArr): MeshV3;

        static get cube (): MeshV3;
    }

    class colour {
        red: number;
        green: number;
        blue: number;
        alpha: number;
        isColour: true;

        constructor (red?: number, green?: number, blue?: number, alpha?: number);

        get hex (): string;

        get rgb (): string;

        get rgba (): string;

        get clone (): colour;

        get json (): any;

        static parse (val: string): colour;
    }

    const rgb:
        ((r?: number, g?: number, b?: number) => colour) &
        { parse: typeof colour.parse };

    function rgba (r?: number, g?: number, b?: number, a?: number): colour;

    function rgbValToHex (val: number | string): string;

    function getMousePos (canvas: HTMLCanvasElement, event: MouseEvent): v2;

    const input: {
        listen: (type: string, handler: EventListenerOrEventListenerObject) => void,
        mouseDown: boolean,
        cursorPosition: v2,
        cursorPosWorldSpace: v2,
        [k: string]: any
    };

    interface publicFieldConfig<T> {
        name: string,

        value?: T,

        type?: publicFieldType,
        array?: boolean,
        assetType?: publicFieldAssetTypes,

        description?: string,
        default?: T,

        overrideGet?: () => T,
        overrideSet?: (val: T) => void
    }

    type publicFieldType = 'string' | 'number' | 'Asset' | 'Transform' | 'boolean' | 'json' | 'rgb' | 'v2' | 'v3';
    type publicFieldAssetTypes = 'any' | 'image' | 'text' | 'json' | 'entity';

    class publicField<T> {
        type: publicFieldType;
        assetType: publicFieldAssetTypes | undefined;
        value: any;
        name: string;
        description: string;
        array: boolean;
        default: any;

        constructor (config: publicFieldConfig<T>);
    }

    type entityConfig = {
        name?: string
        components?: Component[]
        tag?: string | undefined
        transform?: Transform
        Static?: boolean
    };

    /**
     * @class
     * subtype so you can have three-level inheritance for components, e.g. Component ==> Renderer ==> RectRenderer
     * subtype is RectRenderer, type is Renderer.
     * As entities can only have a single of each type, can use 'getComponent(type)'
     * without worrying about what type of that it is
     * e.g. entity.getComponent('Renderer').draw()
     * instead of dealing with every possible renderer
     *
     * public is an array of publicField instances. These are the variables exposed to the user in the editor
     */
    abstract class Component {
        type: string;
        subtype: string;

        private public: publicField<any>[];

        protected constructor (type: string, subtype?: string);

        json (): any;

        addPublic<T> (config: publicFieldConfig<T>): publicField<T> | void;

        getPublic<T> (name: string): T | undefined;

        getPublicField<T> (name: string): publicField<T> | undefined;

        hasPublic (name: string): boolean;

        setPublic (name: string, value: any): void;

        setPublicTypeCheck (name: string, value: any): void;
    }

    type nativeScript = {
        [k: string]: any,
    };

    class Script extends Component {
        script: ESNamespace | nativeScript | undefined;
        name: string;
        path: string;

        constructor ({ path, script, name }: {
            path?: string,
            name?: string,
            script?: ESNamespace | nativeScript
        });

        public jsonPublic (): object[];

        json (): any;

        runMethod: (functionName: string, entity?: Entity, args?: Primitive[]) => void;

        Update (): void;
    }



    class Entity {
        name: string;
        components: Component[];
        id: number;
        tag: string;
        transform: Transform;
        Static: boolean;

        constructor (config: entityConfig);

        getComponent: <T extends Component> (type: string, subType?: string) => T;
        getSceneID: () => number;
        getClone: () => Promise<Entity>;
        addComponent: (toAdd: Component) => boolean;
        add: (toAdd: Component) => boolean;
        hasComponent: (type: string, subType?: string) => boolean;
        getComponents: <T extends Component> (type: string, subType?: string) => T[];

        get sceneID (): number;

        generateID: () => number;
        delete: () => void;
        json: () => any;

        static entities: Entity[];

        static newEntity (setup: entityConfig): Entity;

        static new (setup: entityConfig): Entity;

        static add (entity: Entity): void;

        static find (name?: string): Entity | undefined;

        static findWithTag (tag: string): Entity[];

        static loop (handler: (entity: Entity) => void): void;
    }

    class Transform extends Component {
        position: v3;
        scale: v3;
        rotation: v3;

        parent: Transform | number;

        constructor (props: {
            position?: v3,
            scale?: v3,
            rotation?: v3,
            parent?: Transform | number
        });

        setParentDirty (val: Transform | number): void;

        json (): any;

        Update (): void;

        get localRotation (): v3;
        set localRotation (v: v3);

        get localPosition (): v3;
        set localPosition (v: v3);

        get localScale (): v3;
        set localScale (v: v3);

        detachFromParent (): void;

        get children (): Entity[];

        get recursiveChildren (): Entity[];

        get childCount (): number;

        makeChildOf (t: Transform | number): void;

        makeParentOf (transforms: Transform[]): void;

        isRoot (): boolean;

        isChild (): boolean;

        get sprite (): Entity;

        get root (): Transform;

        get scene (): Scene;

        get forwards (): v3;

        get right (): v2;

        getChild (name: string): Entity | undefined;
    }

    interface sceneSettings {
        license: string;
        version: string;
        gameName: string;
        maxFrameRate: number;
        timeScale: number;
        backgroundTint: colour,
        backgroundImage?: string,
        globalGravity: v3,
        collisionIterations: number;
        globalVolume: number;
    }

    class Scene {
        id: number;
        name: string;
        settings: sceneSettings;

        constructor (name: string, settings: sceneSettings);

        json (): any;

        get entities (): Entity[];

        findMainCamera (): void;

        loopThroughScripts (handler: (script: Script, entity: Entity) => void): void;

        broadcast (funcName: string, params?: any[]): void;

        static loopThroughAllScripts (handler: (script: Script, entity: Entity) => void): void;

        static scenes: Scene[];
        static active_: number;

        // @ts-ignore
        static set active (val: number | Scene);
        // @ts-ignore
        static get active (): number;

        static get activeScene (): Scene;
        static set activeScene (to: Scene);

        static sceneByName (name: string): Scene;

        static sceneExistsWithID (id: number): boolean;

        static sceneByID (id: number): Scene;

        static create (config: {
            name?: string,
            settings?: sceneSettings
        }): Scene;

        static next (persists: Entity[]): void;

        static previous (persists: Entity[]): void;

        static get sceneCount (): number;
    }

    function entitiesFromJSON (JSON: any): void;

    abstract class Collider extends Component {
        offset: v2;
        solid: boolean;
        MatterBody: Matter.Body;

        protected constructor (subtype: string, solid: boolean, offset: v2, matterBody: Matter.Body);

        overlapsPoint (transform: Transform, point: v2): boolean;
    }

    class CircleCollider extends Collider {
        radius: number;

        constructor (props?: {
            radius?: number,
            solid?: boolean,
            offset?: v2,
        });
    }

    class RectCollider extends Collider {
        width: number;
        height: number;

        constructor (props?: {
            width?: number,
            height?: number,
            solid?: boolean,
            offset?: v2
        });
    }


    class Body extends Component {

        velocity: v3;
        mass: number;
        friction: number;
        airResistance: number;
        bounciness: number;

        constructor (props?: {
            velocity: v3,
            mass: number,
            friction: number,
            airResistance: number,
            bounciness: number,
        });

        applyForce (force: v3): v3;
    }

    abstract class Renderer extends Component {
        abstract draw (...args: any[]): any;

        protected constructor (type: string);
    }

    type drawArgs = {
        position: v2,
        transform: Transform,
        ctx: CanvasRenderingContext2D,
        zoom: number,
        center: v2
    };

    abstract class Renderer2D extends Renderer {
        abstract draw (arg: drawArgs): void;

        offset: v2;

        protected constructor (type: string, offset: v2);
    }

    class CircleRenderer extends Renderer2D {
        radius: number;
        colour: colour;

        constructor (props: {
            radius?: number,
            offset?: v2,
            colour?: colour
        });

        draw (args: drawArgs): void;
    }

    class RectRenderer extends Renderer2D {
        height: number;
        width: number;
        colour: colour;

        constructor (props?: {
            height?: number,
            offset?: v2,
            width?: number,
            colour?: colour,
        });

        draw (arg: drawArgs): void;
    }

    class ImageRenderer2D extends Renderer2D {

        height: number;
        width: number;
        url: string;

        constructor (props?: {
            height?: number,
            offset?: v2,
            width?: number,
            url?: string,
        });

        draw (arg: drawArgs): void;
    }

    class Camera extends Component {
        zoom: number;
        far: number;
        near: number;
        fov: number;

        constructor (props?: {
            zoom?: number,
            far?: number,
            near?: number,
            fov?: number
        });

        screenSpaceToWorldSpace (point: v2, canvas: HTMLCanvasElement, cameraPos: v3): v2;

        worldSpaceToScreenSpace (point: v2, canvas: HTMLCanvasElement, cameraPos: v3): v2;

        static main: Entity;
    }

    abstract class GUIElement extends Component {

        hovered: boolean;
        zLayer: number;

        protected constructor (subtype: string, zLayer: number);

        draw (ctx: CanvasRenderingContext2D, transform: Transform): void;

        touchingPoint (point: v2, ctx: CanvasRenderingContext2D, transform: Transform): boolean;
    }

    class GUIBox extends GUIElement {
        height: number;
        width: number;
        radius: number;
        innerColour: colour;
        outerColour: colour;
        borderThickness: number;

        constructor (props: {
            height?: number,
            width?: number,
            radius?: number,
            innerColour?: colour,
            outerColour?: colour,
            borderThickness?: number,
            zLayer?: number,
        });
    }

    class GUIText extends GUIElement {
        text: string;
        fontSize: number;
        font: string;
        colour: colour;
        alignment: string;
        fill: boolean;

        constructor (props: {
            text?: string,
            fontSize?: number,
            font: string,
            colour?: colour,
            alignment: string,
            fill?: boolean,
            zLayer?: number,
        });
    }

    class GUITextBox extends GUIElement {
        text: GUIText;
        selected: boolean;
        limiter: (val: string) => string;
        maxLength: number;

        constructor (props: {
            zLayer?: number,
            initialText?: string,
            fontSize?: number,
            font?: string,
            textColour?: colour,
            textAlignment?: string,
            fillText?: boolean,
            limiter: (val: string) => string,
            maxLength?: number
        });
    }

    class GUIRect extends GUIElement {
        width: number;
        height: number;
        colour: colour;
        radius: number;

        constructor (props: {
            zLayer?: number,
            width?: number,
            height?: number,
            colour?: colour,
            radius?: number
        });
    }

    class GUICircle extends GUIElement {
        colour: colour;
        radius: number;

        constructor (props: {
            zLayer?: number,
            colour?: colour,
            radius?: number
        });
    }

    class GUIPolygon extends GUIElement {
        colour: colour;
        points: v2[];

        constructor (props: {
            zLayer?: number,
            colour?: colour,
            points?: v2[]
        });
    }

    class GUIImage extends GUIElement {
        width: number;
        height: number;
        url: string;

        constructor (props: {
            zLayer?: string,
            width?: string,
            height?: string,
            url?: string,
        });
    }

    interface System {
        Start: (scene: Scene) => void;
        Update: (scene: Scene) => void;
        name: string;
        order: number;

        [k: string]: any;
    }

    const Systems: {
        systems: System[],

        sortByOrder (): void,

        getByName (name: string): System | void;

        Start (scene: Scene): void;

        Update (scene: Scene): void;
    }

    function initialiseEntropyScript (): Promise<void>;

    function sleep (ms: number): Promise<void>;

    function cullString (str: string, cutoff: number): string;

    function genCacheBust (): number;

    function scaleMeshV2 (mesh: v2[], factor: v2): v2[];

    function defaultSceneSettings (): sceneSettings;

    function getCanvasSize (canvas: HTMLCanvasElement): v2;

    function getZoomScaledPosition (pos: v2, zoom: number, center: v2): v2;

    function JSONifyComponent (component: any, type?: string): any;

    function initialiseScenes (JSON: any): void;

    function entitiesFromJSON (JSON: any): void;

    function rotateAroundPointWrapper (ctx: CanvasRenderingContext2D, p: v2, theta: number, cb: () => void): void;

    function roundedRect (ctx: CanvasRenderingContext2D,
                          width: number, height: number, pos: v2, colour: string, radius: number): void;

    function circle (ctx: CanvasRenderingContext2D, position: v2, radius: number, colour: string): void;

    function rect (ctx: CanvasRenderingContext2D,
                   position: v2, width: number, height: number, colour: string, rotDeg?: number): void;

    function polygon (ctx: CanvasRenderingContext2D,
                      points: v2[], fillColour: string, fill?: boolean, rotDeg?: number): void;

    function text (ctx: CanvasRenderingContext2D,
                   text: string, fontSize: number, font: string, colour: string, position: v2,
                   alignment?: string, rotDeg?: number): void;

    function image (ctx: CanvasRenderingContext2D, position: v2, size: v2, src: string, rotDeg?: number): void;

    function drawCameras (ctx: CanvasRenderingContext2D,
                          canvas: HTMLCanvasElement, camera: Entity, sprites: Entity[]): void;

    function drawCameraViewArea (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, camera: Entity,
                                 cameraToDraw: Entity, colour: string): void;

    function renderDebug (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, camera: Entity,
                          entities: Entity[]): void;

    function renderSelectedOutline (canvas: HTMLCanvasElement,
                                    ctx: CanvasRenderingContext2D, camera: Entity, selected: Entity): void;


    function renderBackground (ctx: CanvasRenderingContext2D,
                               canvasSize: v2, backgroundTint: colour, backgroundImage: string | undefined): void;

    function renderAll (entities: Entity[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D,
                        backgroundTint: colour, backgroundImage?: string, cameraEntity?: Entity): void;

    function startAnimation(canvasID: string): Promise<void>;
}

