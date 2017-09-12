import Game from './game';
import config from './config';
import { setMatrix } from './lib';
import { Vec2 } from './math';

const LEFT = 1;
const RIGHT = 2;
const UP = 4;
const DOWN = 8;

export default class Node {
    untouched: Node[] = [];
    children: Node[] = [];
    touched: boolean = false;
    position: Vec2;
    // position: number[];
    distance: number = 0;
    time?: number = 0;

    constructor(x: number, y: number) {
        this.position = new Vec2(x, y);
    }

    passable(x: number, y: number, radius: number = 0): boolean {
        if (x < 0.5) {
            x -= radius;
        } else {
            x += radius;
        }

        if (y < 0.5) {
            y -= radius;
        } else {
            y += radius;
        }

        x = Math.floor(x);
        y = Math.floor(y);
        if (this.position.x === x && this.position.y === y) {
            return true;
        }

        for (const child of this.children) {
            if (
                child.position.x === Math.floor(x) &&
                child.position.y === Math.floor(y)
            ) {
                return true;
            }
        }

        return false;
    }

    draw(game: Game) {
        const { x, y } = this.position;
        const renderer = game.renderer;
        const gl = renderer.gl;
        renderer.modelMat = setMatrix(x, y);
        renderer.setMatrices();

        const isPlayerSpace =
            Math.floor(game.player.position.x) === x &&
            Math.floor(game.player.position.y) === y;

        gl.uniform1i(game.mazeShaders.playerSpace, isPlayerSpace ? 1 : 0);

        gl.uniform1i(
            game.mazeShaders.squareState,
            this === game.start
                ? 0
                : this === game.end ? 1 : this.touched ? 2 : 3
        );

        let t = !this.time ? 0 : (Date.now() - this.time) / config.TRANSITION;
        if (t > 1) {
            t = 1;
        }

        gl.uniform1f(game.mazeShaders.t, t);
        const pulse = Date.now() / 1000 % 1;
        gl.uniform1f(game.mazeShaders.pulse, pulse);
        // if (isPlayerSpace) {
        //     console.log(pulse < 0.5 ? pulse / 0.5 : 1.0 - ((pulse - 0.5) / 0.5));
        // }
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}
