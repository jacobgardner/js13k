import Renderer, { Program } from './renderer';
import Maze from './maze';
import { vertex, playerFrag } from './shaders/shaders';
import { setMatrix } from './lib';

export default class Player {
    x: number;
    y: number;
    program: Program;

    constructor(public renderer: Renderer, public maze: Maze) {
        [this.x, this.y] = [
            maze.start.position[0] + 0.25,
            maze.start.position[1] + 0.25
        ];

        this.program = new Program(renderer, vertex, playerFrag);

    }

    draw() {
        this.program.use();
        const gl = this.renderer.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.renderer.squareBuffer);
        gl.vertexAttribPointer(this.program.vertPos, 2, gl.FLOAT, false, 0, 0);

        this.renderer.modelMat = setMatrix(this.x, this.y, 0.5);
        this.renderer.setMatrices();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    }
}
