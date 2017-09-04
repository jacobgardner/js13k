import Renderer, { Program } from './renderer';
import Game from './game';
import { vertex, playerFrag } from './shaders/shaders';
import { setMatrix } from './lib';

const PLAYER_SCALE = 0.4;

export default class Player {
    hp: number = 1;
    x: number;
    y: number;
    program: Program;

    constructor(public renderer: Renderer, public maze: Game) {
        [this.x, this.y] = [
            maze.start.position[0] + 0.5,
            maze.start.position[1] + 0.5
        ];

        this.program = new Program(renderer, vertex, playerFrag);
    }

    draw() {
        this.program.use();
        const gl = this.renderer.gl;

        // this.hp = Date.now() % 500 / 500;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.renderer.squareBuffer);
        gl.vertexAttribPointer(this.program.vertPos, 2, gl.FLOAT, false, 0, 0);

        this.renderer.modelMat = setMatrix(
            this.x - PLAYER_SCALE / 2,
            this.y - PLAYER_SCALE / 2,
            PLAYER_SCALE
        );
        this.renderer.setMatrices();
        gl.uniform1f(this.program.t, this.hp);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}
