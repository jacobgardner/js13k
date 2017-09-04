import buildGrid, { Grid, Node } from './grid';
import { SIZE_X, SIZE_Y } from './config';
import Renderer, { Program } from './renderer';
import { vertex, hallFrag } from './shaders/shaders';
import { setMatrix } from './lib';
// @if DEBUG
import { nodeToChar, drawMatrix } from './debug';
// @endif

const LEFT = 1;
const RIGHT = 2;
const UP = 4;
const DOWN = 8;

function classifyNode(node: Node): number {
    let number = 0;
    for (const kid of node.children) {
        const x = node.position[0] - kid.position[0];
        const y = node.position[1] - kid.position[1];
        if (x === 1) {
            number += LEFT;
        } else if (x === -1) {
            number += RIGHT;
        } else if (y === 1) {
            number += UP;
        } else {
            number += DOWN;
        }
    }

    return number;
}

export default class Maze {
    grid: Grid;
    start: Node;
    end: Node;
    program: Program;

    constructor(public renderer: Renderer) {
        [this.grid, this.start, this.end] = buildGrid();
        this.program = new Program(renderer, vertex, hallFrag);

        // const gl = renderer.gl;
    }

    draw() {
        this.program.use();
        const gl = this.renderer.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.renderer.squareBuffer);
        gl.vertexAttribPointer(this.program.vertPos, 2, gl.FLOAT, false, 0, 0);

        for (let x = 0; x < SIZE_X; x += 1) {
            for (let y = 0; y < SIZE_Y; y += 1) {
                this.renderer.modelMat = setMatrix(x, y);
                // drawMatrix(this.renderer.modelMat);
                // drawMatrix(this.renderer.camera);
                this.renderer.setMatrices();

                const node = this.grid.get(x, y) as Node;
                const classified = classifyNode(node);
                gl.uniform1i(
                    this.program.squareState,
                    node === this.start ? 0 : node === this.end ? 1 : node.touched ? 2 : 3
                );
                gl.uniform4iv(this.program.squareType, [
                    LEFT & classified,
                    UP & classified,
                    RIGHT & classified,
                    DOWN & classified
                ]);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }
        }
    }

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
                                : n === this.end
                                  ? '%cE%c'
                                  : nodeToChar(n as Node)
                    )
                    .join('')
            );
        }

        return lines.join('\n');
    }
    // @endif
}
