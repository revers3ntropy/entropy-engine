import {v2, v3} from "../maths/maths";

/**
 * Resolves promise after an amount of time
 * @param {number} ms
 * @returns {Promise<unknown>}
 */
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getCanvasSize (canvas: HTMLCanvasElement): v2 {
    return new v2(canvas.width, canvas.height);
}

export function getZoomScaledPosition (pos: v2, zoom: number, center: v2): v2 {
    // scales the position from the center
    return pos.sub(center).scale(zoom).add(center);
}

export function getCanvasStuff (id: string): {
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
} {
    const canvas = document.getElementById(id);
    if (!(canvas instanceof HTMLCanvasElement)) {
        throw 'Canvas element is not instance of HTMLCanvasElement';
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw `Canvas doesn't have 2d context`;
    }
    return { canvas, ctx };
}

export function setCanvasSize (canvas: HTMLCanvasElement) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

export function JSONifyComponent (component: any, type? : string) {
    let json: any = {};

    for (const property in component) {
        // public as they are set with getters and setters on the individual components
        // type stuff as that is dealt with separately
        if (['type', 'subtype', 'hasSubType', 'public'].indexOf(property) !== -1) continue;

        let value = component[property];

        if (value instanceof v2 || value instanceof v3)
            value = value.array;
        else if (value.isColour) {
            value = value.json;
        }

        json[property] = value;
    }


    json.type = type || component.subtype;
    return json;
}

export function scaleMeshV2 (mesh: v2[], factor: v2) {
    const points = mesh.map(point => point.clone);

    let avPoint = v2.avPoint(points);

    // scaleBy around that point
    for (let point of points) {
        const pointToCenter = point.clone.sub(avPoint);
        // scaleBy by the factor
        pointToCenter.mul(factor);
        // get the points new location based off the scales vector from the center
        const finalLocation = avPoint.clone.add(pointToCenter);
        point.set(finalLocation);
    }
    return points;
}

export function cullString (str: string, cutoff: number) {
    if (cutoff >= str.length) {
        return str;
    }

    let newStr = '';
    for (let i = 0; i < cutoff; i++) {
        newStr += str[i] || '';
    }

    if (newStr.length < str.length) {
        newStr += '...';
    }

    return newStr;
}

export function nameFromScriptURL (path: string): string {
    // ../projects/12345/assets/folder/script.es for example
    let file = path.substring(path.lastIndexOf('/') + 1);
    return file.substring(0, file.length-3);
}

export function genCacheBust (): number {
    return Math.ceil(Math.random() * 10000);
}