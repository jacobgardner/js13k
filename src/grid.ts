import { random, shuffle, randomPop } from './random';
import { SIZE_X, SIZE_Y, TRANSITION } from './config';
import { Entity } from './entity';
import Game from './game';
import { setMatrix } from './lib';

const LEFT = 1;
const RIGHT = 2;
const UP = 4;
const DOWN = 8;

export class Node {
    untouched: Node[] = [];
    children: Node[] = [];
    touched: boolean = false;
    position: number[];
    distance: number = 0;
    time?: number = 0;

    constructor(x: number, y: number) {
        this.position = [x, y];
    }

    // We could save this value instead of computing every time....
    //  but the bytes!!!
    classify() {
        let number = 0;
        for (const kid of this.children) {
            const x = this.position[0] - kid.position[0];
            const y = this.position[1] - kid.position[1];
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

    draw(game: Game) {
        const [x, y] = this.position;
        const renderer = game.renderer;
        const gl = renderer.gl;
        renderer.modelMat = setMatrix(x, y);
        renderer.setMatrices();

        const classified = this.classify();
        gl.uniform1i(
            game.mazeShaders.squareState,
            this === game.start
                ? 0
                : this === game.end ? 1 : this.touched ? 2 : 3
        );

        let t = !this.time ? 0 : (Date.now() - this.time) / TRANSITION;
        if (t > 1) {
            t = 1;
        }

        gl.uniform1f(game.mazeShaders.t, t);
        gl.uniform4iv(game.mazeShaders.squareType, [
            LEFT & classified,
            UP & classified,
            RIGHT & classified,
            DOWN & classified
        ]);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

export class Grid {
    get(x: number, y: number): Node | null {
        const coord = [x, y].toString();

        if (x >= SIZE_X || y >= SIZE_Y || x < 0 || y < 0) {
            return null;
        }

        let node: Node = this[coord] as Node;
        if (!node) {
            node = this[coord] = new Node(x, y);
        }

        return node;
    }

    draw(game: Game) {
        game.mazeShaders.use();
        for (const key in this) {
            const node = this[key] as Node;
            node.draw(game);
        }
    }

    [key: string]: Node | Function;
}

export default function(): [Grid, Node, Node] {
    const grid: Grid = new Grid();

    const adjacent = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (let x = 0; x < SIZE_X; x++) {
        for (let y = 0; y < SIZE_Y; y++) {
            const node = grid.get(x, y) as Node;

            for (const offset of adjacent) {
                const sibling = grid.get(x + offset[0], y + offset[1]);
                if (sibling) {
                    node.untouched.push(sibling);
                }
            }
        }
    }

    const start = grid.get(random(0, SIZE_X), random(0, SIZE_Y)) as Node;
    const open: Node[] = [start];

    let end = start;

    while (open.length) {
        const node = open[0];
        node.touched = true;
        if (!node.untouched.length) {
            open.shift();
            continue;
        }

        const sibling = randomPop(node.untouched);
        if (sibling.touched) {
            continue;
        }
        sibling.untouched.splice(sibling.untouched.indexOf(node), 1);
        sibling.children.push(node);
        sibling.distance = node.distance + 1;
        if (sibling.distance > end.distance) {
            end = sibling;
        }
        node.children.push(sibling);
        sibling.touched = true;
        open.splice(0, 0, sibling);
    }

    return [grid, start, end];
}
