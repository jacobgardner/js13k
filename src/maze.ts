import buildGrid, { Grid, Node } from './grid';
import { SIZE_X, SIZE_Y } from './config';
import Renderer from './renderer';
// @if DEBUG
import { nodeToChar } from './debug';
// @endif

export default class Maze {
    grid: Grid = {};
    start: Node;
    end: Node;

    squareBuffer: WebGLBuffer;

    constructor(public renderer: Renderer) {
        [this.grid, this.start, this.end] = buildGrid();

        const gl = renderer.gl;

        this.squareBuffer = gl.createBuffer() as WebGLBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.squareBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
            gl.STATIC_DRAW
        );
    }

    setMatricies() {
        const gl = this.renderer.gl;
        gl.uniform4fv();
    }

    draw() {}

    // @if DEBUG
    toString() {
        const lines = [];
        for (let y = 0; y < SIZE_Y; y++) {
            const line = [];
            for (let x = 0; x < SIZE_X; x++) {
                line.push(this.grid[[x, y].toString()]);
            }

            lines.push(
                line
                    .map(
                        n =>
                            n === this.start
                                ? '%cS%c'
                                : n === this.end ? '%cE%c' : nodeToChar(n)
                    )
                    .join('')
            );
        }

        return lines.join('\n');
    }
    // @endif
}
