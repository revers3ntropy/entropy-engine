import {v2, v3} from "../maths/maths";
import {canvases} from './rendering';

/**
 * Resolves promise after an amount of time
 * @param {number} ms
 * @returns {Promise<unknown>}
 */
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

export const scriptFetchHeaders = new Headers();
scriptFetchHeaders.append('pragma', 'no-cache');
scriptFetchHeaders.append('cache-control', 'no-cache');

export const scriptFetchInit = {
    method: 'GET',
    headers: scriptFetchHeaders,
};