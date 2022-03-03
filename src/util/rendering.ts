import {v2} from '../maths/v2';

export function getCanvasSize (canvas: HTMLCanvasElement): v2 {
    return new v2(canvas.width, canvas.height);
}

export function getZoomScaledPosition (pos: v2, zoom: number, center: v2): v2 {
    // scales the position from the center
    return pos.sub(center).scale(zoom).add(center);
}

export function resetCanvasRot (canvas: HTMLCanvasElement) {
    const ctx = getCTX(canvas);

    // make the Y axis go up rather than down - bit more intuitive
    ctx.transform(1, 0, 0, -1, 0, canvas.height);
    // for easy restoring
    ctx.save();
}

export type canvases = {
    GUI: HTMLCanvasElement,
    input: HTMLCanvasElement,
    render: HTMLCanvasElement,
    background: HTMLCanvasElement
}

export function generateCanvas (divID: string): canvases {
    let div = document.getElementById(divID);
    if (!div) {
        div = document.appendChild(document.createElement('div'));
    }

    const GUI = div.appendChild(document.createElement('canvas'));
    const render = div.appendChild(document.createElement('canvas'));
    const input = div.appendChild(document.createElement('canvas'));
    const background = div.appendChild(document.createElement('canvas'));

    return { GUI, input, render, background };
}

export function getCTX (canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const res = canvas.getContext('2d');
    if (!res) {
        throw 'no ctx on canvas';
    }
    return res;
}