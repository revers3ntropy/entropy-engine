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

function setCanvasStyle (c: HTMLCanvasElement, z: string, div: HTMLElement, size: v2) {
    c.style.position = 'absolute';
    c.style.left = '0';
    c.style.top = '0';
    c.style.zIndex = z;
    c.style.height = `${size.y}px`;
    c.style.width = `${size.x}px`;
    c.width  = size.x;
    c.height = size.y;
}

export function setCanvasesSizes (canvases: canvases) {
    const div = canvases.background.parentElement;
    if (!div) throw 'no parent element of canvases';

    const size = new v2(div.parentElement?.clientWidth || 0, div.parentElement?.clientHeight);

    // input on top as it must be 'touching' the cursor
    setCanvasStyle(canvases.input, '4', div, size);
    // GUI is top layer of rendering
    setCanvasStyle(canvases.GUI, '3', div, size);
    // render is above the background
    setCanvasStyle(canvases.render, '2', div, size);
    setCanvasStyle(canvases.background, '1', div, size);

    resetCanvasRot(canvases.input);
    resetCanvasRot(canvases.GUI);
    resetCanvasRot(canvases.render);
    resetCanvasRot(canvases.background);
}

export function generateCanvas (divID: string): canvases {
    let div = document.getElementById(divID);
    if (!div) {
        div = document.body.appendChild(document.createElement('div'));
    }

    const size = new v2(div.parentElement?.clientWidth || 0, div.parentElement?.clientHeight);

    div.innerHTML = ' ';

    div.style.width = '100%';
    div.style.height = '100%';

    const GUI = div.appendChild(document.createElement('canvas'));
    const render = div.appendChild(document.createElement('canvas'));
    const input = div.appendChild(document.createElement('canvas'));
    const background = div.appendChild(document.createElement('canvas'));

    GUI.id = 'EntropyEngine-GUI-Layer';
    render.id = 'EntropyEngine-render-Layer';
    background.id = 'EntropyEngine-background-Layer';
    input.id = 'EntropyEngine-input-Layer';

    const canvases = { GUI, input, render, background };
    setCanvasesSizes(canvases);

    return canvases;
}

export function getCTX (canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const res = canvas.getContext('2d');
    if (!res) throw 'no ctx on canvas';
    return res;
}