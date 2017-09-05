import { win, doc } from './globals';
import Renderer from './renderer';

import Game from './game';

import { channels } from './music/dan1';
console.log(channels);

// Intentionally mispelled for the extra byte!
doc.title = 'Lst';
const renderer = new Renderer();
// const gl = initGL();

const game = new Game(renderer);

// @if DEBUG
console.log(
    '%c' + game.toString(),
    'font-size: 14px;',
    'font-size: 14px;color: #009900; font-weight: bolder;',
    'font-size: 14px;color: #000000; font-weight: normal;',
    'font-size: 14px;color: #990000; font-weight: bolder;',
    'font-size: 14px;color: #000000; font-weight: normal'
);
// @endif

function render() {
    const gl = renderer.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);

    game.draw();

    win.requestAnimationFrame(render);
}

render();
// win.requestAnimationFrame(render);
