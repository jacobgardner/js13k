import Renderer, { Program } from './renderer';
import Game from './game';
import { vertex, playerFrag } from './shaders/shaders';
import { setMatrix } from './lib';
import { INITIAL_PLAYER_SPEED } from './config';
import { state } from './globals';

const PLAYER_SCALE = 0.4;

export default class Player {
    hp: number = 1;
    speed: number = INITIAL_PLAYER_SPEED / PLAYER_SCALE;
    x: number;
    y: number;
    program: Program;
    actualHP: number = 1;

    constructor(public renderer: Renderer, public maze: Game) {
        [this.x, this.y] = [
            maze.start.position[0] + 0.501,
            maze.start.position[1] + 0.501
        ];

        this.program = new Program(renderer, vertex, playerFrag);
    }

    attack(damage: number) {
        this.actualHP -= damage;
        if (this.actualHP < 0) {
            this.actualHP = 0;
        }
    }

    simulate() {

        this.hp += (this.actualHP - this.hp) * state.delta * 0.9;
        // this.hp = (this.hp * 0.8 + this.actualHP * 1.2) / 2;

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
