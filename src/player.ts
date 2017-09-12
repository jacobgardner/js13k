import Renderer, { Program } from './renderer';
import { vertex, playerFrag, playerShieldFrag } from './shaders/shaders';
import { setMatrix } from './lib';
import config from './config';
import { state } from './globals';
import Game from './game';

const PLAYER_SCALE = 0.04;

export default class Player {
    hp: number = 0;
    speed: number = config.INITIAL_PLAYER_SPEED;
    x: number;
    y: number;
    program: Program;
    shieldProgram: Program;
    actualHP: number = 1;
    playerScale = PLAYER_SCALE;
    shield: number = 0;

    constructor(public game: Game) {
        const renderer = game.renderer;
        this.program = new Program(renderer, vertex, playerFrag);
        this.shieldProgram = new Program(renderer, vertex, playerShieldFrag);
    }

    start(x: number, y: number) {
        [this.x, this.y] = [x + 0.5, y + 0.5];
    }

    attack(damage: number) {
        if (
            (Date.now() - this.shield) * config.TIME_DILATION <
            config.SHIELD_DURATION
        ) {
            return;
        }

        if (
            this.game.grid.get(Math.floor(this.x), Math.floor(this.y)) ===
            this.game.start
        ) {
            return;
        }

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
        const renderer = this.game.renderer;
        const gl = renderer.gl;

        const delta = (Date.now() - this.shield) * config.TIME_DILATION;
        if (delta < config.SHIELD_DURATION) {
            this.shieldProgram.use();
            const FADE_TIME = 400;
            const scalar =
                delta < FADE_TIME
                    ? delta / FADE_TIME
                    : config.SHIELD_DURATION - delta < FADE_TIME
                      ? (config.SHIELD_DURATION - delta) / FADE_TIME
                      : 1;
            const scale = PLAYER_SCALE * 2 * scalar;
            renderer.modelMat = setMatrix(
                this.x - scale / 2,
                this.y - scale / 2,
                scale
            );
            renderer.setMatrices();

            // gl.uniform1f(this.shieldProgram.fade, delta < 300 ? delta / 300 : config.SHIELD_DURATION - delta < 300 ? (config.SHIELD_DURATION - delta) / 300 : 1)
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        this.program.use();

        gl.bindBuffer(gl.ARRAY_BUFFER, renderer.squareBuffer);
        gl.vertexAttribPointer(this.program.vertPos, 2, gl.FLOAT, false, 0, 0);

        renderer.modelMat = setMatrix(
            this.x - PLAYER_SCALE / 2,
            this.y - PLAYER_SCALE / 2,
            PLAYER_SCALE
        );
        renderer.setMatrices();
        gl.uniform1f(this.program.hp, this.hp);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}
