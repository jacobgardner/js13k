import { win, doc } from './globals';
import { initGL } from './gl';
import Renderer from './renderer';

import Maze from './maze';
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
    if (downMap.w) {
        player.y -= PLAYER_SPEED;
    }

    if (downMap.s) {
        player.y += PLAYER_SPEED;
    }

    if (downMap.a) {
        player.x -= PLAYER_SPEED;
    }

    if (downMap.d) {
        player.x += PLAYER_SPEED;
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
