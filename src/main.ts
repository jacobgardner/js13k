import { win, doc } from './globals';
import { initGL } from './gl';
import Renderer from './renderer';

import Maze from './maze';
import {Node} from './grid';
import { SIZE_X, SIZE_Y, PLAYER_SPEED } from './config';
import Player from './player';

// Intentionally mispelled for the extra byte!
doc.title = 'Lst';
const renderer = new Renderer();
// const gl = initGL();

const maze = new Maze(renderer);
const player = new Player(renderer, maze);

// @if DEBUG
console.log(
    '%c' + maze.toString(),
    'font-size: 14px;',
    'font-size: 14px;color: #009900; font-weight: bolder;',
    'font-size: 14px;color: #000000; font-weight: normal;',
    'font-size: 14px;color: #990000; font-weight: bolder;',
    'font-size: 14px;color: #000000; font-weight: normal'
);
// @endif

// This doesn't work because imports are hoisted....
//  probably should build these files as a separate step from glslx (via gulp-shadify)
//  and then iterate through them.

interface Map<T> {
    [key: string]: T;
}

const downMap: Map<number> =  {}

function processInput() {
    let [x, y] = [player.x, player.y];
    if (downMap.w) {
        y -= PLAYER_SPEED;
    }

    if (downMap.s) {
        y += PLAYER_SPEED;
    }

    if (downMap.a) {
        x -= PLAYER_SPEED;
    }

    if (downMap.d) {
        x += PLAYER_SPEED;
    }

    const px = player.x;
    const py = player.y;
    const current = maze.grid.get(Math.floor(px), Math.floor(py)) as Node;
    const buffer = 0.3;
    if (Math.floor(x) !== Math.floor(px)) {
        const node = maze.grid.get(Math.floor(x), Math.floor(py)) as Node;
        if (current.children.indexOf(node) !== -1) {
            player.x = x;
        }
    // } else if (Math.floor(x + buffer) > Math.floor(px)) {
    //     const node = maze.grid.get(Math.floor(x + buffer), Math.floor(py)) as Node;
    //     if (current.children.indexOf(node) !== -1) {
    //         player.x = x;
    //     }
    } else {
        player.x = x;
    }

    if (Math.floor(y) !== Math.floor(py)) {
        const node = maze.grid.get(Math.floor(px), Math.floor(y)) as Node;
        if (current.children.indexOf(node) !== -1) {
            player.y = y;
        }
    } else {
        player.y = y;
    }
}

onkeydown = (evt) => {
    downMap[evt.key.toLowerCase()] = 1;
}

onkeyup = (evt) => {
    downMap[evt.key.toLowerCase()] = 0;
}

function render() {
    const gl = renderer.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);

    processInput();

    maze.draw();
    player.draw();

    win.requestAnimationFrame(render);
}

render();
// win.requestAnimationFrame(render);
