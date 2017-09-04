import { initGL } from './gl';
import { buildShader } from './shader';
import { range, setMatrix } from './lib';

import { UniformRenaming, AttributeRenaming } from './shaders/shaders';

interface Map<T> {
    [key: string]: T;
}

let gl: WebGLRenderingContext;

export class Program {
    shaderProgram: WebGLProgram;

    constructor(
        renderer: Renderer,
        vertexShader: string,
        fragmentShader: string
    );
    constructor(private renderer: Renderer, ...shaders: string[]) {
        const prog = (this.shaderProgram = gl.createProgram() as WebGLProgram);
        for (let i = 0; i < 2; i += 1) {
            gl.attachShader(prog, buildShader(i, shaders[i]));
        }
        gl.linkProgram(prog);

        // @if DEBUG
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error('Could not link shaders....');
        }
        // @endif

        this.use();

        for (const key in UniformRenaming) {
            // This can be undefined, but as long as we use our program right, we shouldn't access it.
            //  Checking for it's existence is a waste of bytes...
            this[key] = gl.getUniformLocation(
                prog,
                (UniformRenaming as Map<string>)[key]
            ) as WebGLUniformLocation;
        }

        for (const key in AttributeRenaming) {
            // This is -1 when the attrib doesn't exist, but once again, it's a waste of bytes to actually
            //  check for it.
            this[key] = gl.getAttribLocation(
                prog,
                (AttributeRenaming as Map<string>)[key]
            );
            gl.enableVertexAttribArray(this[key] as number);
        }
    }

    use() {
        this.renderer.use(this);
    }

    [key: string]: WebGLUniformLocation | number | any;
}

export default class Renderer {
    currentProgram: Program;
    gl: WebGLRenderingContext;
    modelMat: Float32Array;
    camera: Float32Array = setMatrix(-8, -8, 0.85, 0);
    squareBuffer: WebGLBuffer;

    constructor() {
        this.gl = gl = initGL();

        this.squareBuffer = gl.createBuffer() as WebGLBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.squareBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            // prettier-ignore
            new Float32Array([
                0, 0,
                0, 1,
                1, 0,
                1, 1
            ]),
            gl.STATIC_DRAW
        );
    }

    use(program: Program) {
        if (this.currentProgram !== program) {
            this.currentProgram = program;
            gl.useProgram(program.shaderProgram);
        }
    }

    setMatrices() {
        const left = -10;
        const right = 10;
        const bottom = 10;
        const top = -10;

        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (-80 - 80);

        // TODO: We can probably (definitely) use 2/3d matrices for this
        gl.uniformMatrix4fv(this.currentProgram.viewMat, false, this.camera);

        gl.uniformMatrix4fv(this.currentProgram.modelMat, false, this.modelMat);
        gl.uniformMatrix4fv(
            this.currentProgram.projMat,
            false,
            // prettier-ignore
            new Float32Array([
                -2 * lr, 0, 0, 0,
                0, -2 * bt, 0, 0,
                0, 0, 2 * nf, 0,
                (left + right) * lr, (top + bottom) * bt, 0, 1
            ])
        );
    }
}
