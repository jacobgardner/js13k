import Renderer, { Program } from './renderer';
import Game from './game';
import { vertex, playerFrag } from './shaders/shaders';
import { setMatrix } from './lib';
import { INITIAL_PLAYER_SPEED } from './config';
import { state } from './globals';

const PLAYER_SCALE = 0.4;

export default class Player {
    hp: number = 0;
    speed: number = INITIAL_PLAYER_SPEED / PLAYER_SCALE;
    x: number;
    y: number;
    program: Program;
    actualHP: number = 1;

    constructor(public renderer: Renderer) {
        this.program = new Program(renderer, vertex, playerFrag);
    }

    start(x: number, y: number) {
        [this.x, this.y] = [x + 0.5, y + 0.5];
    }

    attack(damage: number) {
        this.actualHP -= damage;
        if (this.actualHP < 0) {
            this.actualHP = 0;
        }
    }

    simulate() {
        this.hp += (this.actualHP - this.hp) * state.delta * 0.9;

        if (this.hp < 0.15 && this.actualHP < 0.15) {
            this.actualHP = 0;
        }
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
        gl.uniform1f(this.program.hp, this.hp);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}
