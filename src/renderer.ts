import { initGL } from './gl';

export default class Renderer {
    gl: WebGLRenderingContext;

    constructor() {
        this.gl = initGL();
    }
}
