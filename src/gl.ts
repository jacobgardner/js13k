import {win, doc} from './globals';
import vertexShader from './shaders/vertexShader';

// OPTIMIZE: Remove = null on final build
let gl: WebGLRenderingContext = (null as any) as WebGLRenderingContext;

export function initGL() {
    const canvas = doc.getElementById('canvas') as HTMLCanvasElement;

    // Screw errors (also missing the point of typescript, I think)
    gl = canvas.getContext('webgl') as WebGLRenderingContext;
    function resize() {
        const width = win.innerWidth;
        const height = win.innerHeight
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        console.log(vertexShader);
    }

    // this smaller
    win.onresize = resize;
    // win.addEventListener('resize', resize);
    resize();

    // Setup Buffers etc.
    gl.clearColor(0, 0, 0, 1);



    return gl;
}

// We don't actually want to destroy cleanly because of the bytes!
// export function destroyGL() {

// }