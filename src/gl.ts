import {win, doc} from './globals';
import {buildShader} from './shader'

import * as characterShader from './shaders/character';

interface ObjectShader {
    fragment?: string;
    vertex?: string;
}

// OPTIMIZE: Remove = null on final build
export let gl: WebGLRenderingContext;// = (null as any) as WebGLRenderingContext;

export function initGL() {
    const canvas = doc.querySelector('canvas') as HTMLCanvasElement;

    // Screw errors (also missing the point of typescript, I think)
    gl = canvas.getContext('webgl') as WebGLRenderingContext;

    // OPTIMIZE: resize is a luxury.  Only a couple of bytes really since
    //  we have to do this anyway, but possibly will need to remove;
    function resize() {
        const width = win.innerWidth;
        const height = win.innerHeight
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
    }

    // this smaller
    win.onresize = resize;
    // win.addEventListener('resize', resize);
    resize();

    // Setup Buffers etc.
    gl.clearColor(0, 0, 0, 1);

    for (const shader  of [characterShader] as ObjectShader[]) {
        if (shader.vertex) {
            const s = buildShader(0, shader.vertex);
            shader.vertex = s as any;
        }

        if (shader.fragment) {
            const s = buildShader(0, shader.fragment);
            shader.fragment = s as any;
        }
    }
    characterShader.vertex


    return gl;
}

// We don't actually want to destroy cleanly because of the bytes!
// export function destroyGL() {

// }
